import { createDecipheriv, createHash } from 'node:crypto';
import { open } from 'node:fs/promises';
import { parseArgs } from 'node:util';
import { pathToFileURL } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { CIPHERTEXT_PREFIX, createCipher } from '../src/utils/cryptoCodec.mjs';

const utf8 = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

export function decryptLegacy(value, password) {
  if (!password) throw new Error('LEGACY_SECRET_KEY is required for legacy fields.');
  if (typeof value !== 'string' || value.length > 1_500_000 ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(value)) {
    throw new Error('Invalid legacy encoding.');
  }
  const envelope = Buffer.from(value, 'base64');
  if (envelope.toString('base64') !== value || envelope.length < 32 ||
      envelope.subarray(0, 8).toString('ascii') !== 'Salted__' || (envelope.length - 16) % 16 !== 0) {
    throw new Error('Unrecognized legacy ciphertext.');
  }
  const salt = envelope.subarray(8, 16);
  const passphrase = Buffer.from(password, 'utf8');
  let material = Buffer.alloc(0);
  let previous = Buffer.alloc(0);
  while (material.length < 48) {
    previous = createHash('md5').update(Buffer.concat([previous, passphrase, salt])).digest();
    material = Buffer.concat([material, previous]);
  }
  const decipher = createDecipheriv('aes-256-cbc', material.subarray(0, 32), material.subarray(32, 48));
  return utf8.decode(Buffer.concat([decipher.update(envelope.subarray(16)), decipher.final()]));
}

function fieldsOf(row) {
  if (typeof row.name !== 'string' || !Array.isArray(row.entityList)) throw new Error('Invalid list structure.');
  const fields = [{ path: 'name', value: row.name }];
  if (row.description != null) {
    if (typeof row.description !== 'string') throw new Error('Invalid description.');
    fields.push({ path: 'description', value: row.description });
  }
  row.entityList.forEach((entity, index) => {
    if (!entity || typeof entity.name !== 'string') throw new Error(`Invalid entityList[${index}].name.`);
    fields.push({ path: `entityList[${index}].name`, value: entity.name });
  });
  return fields;
}

function encryptedColumns(row) {
  return {
    name: row.name,
    ...(Object.hasOwn(row, 'description') ? { description: row.description } : {}),
    entityList: row.entityList,
  };
}

export async function convertRow(row, legacyKey, targetKey, verifyOnly = false) {
  const fields = fieldsOf(row);
  const cipher = createCipher(targetKey, 'database');
  const current = fields.filter(field => field.value.startsWith(CIPHERTEXT_PREFIX));
  const legacy = fields.filter(field => field.value !== '' && !field.value.startsWith(CIPHERTEXT_PREFIX));
  if (verifyOnly && legacy.length) throw new Error('Legacy fields remain.');
  const currentPlaintext = await cipher.decryptFields(current.map(field => field.value));
  const plaintext = new Map(current.map((field, index) => [field.path, currentPlaintext[index]]));
  for (const field of legacy) {
    try {
      plaintext.set(field.path, decryptLegacy(field.value, legacyKey));
    } catch {
      throw new Error(`Cannot decrypt ${field.path}; check the legacy key or restore damaged data.`);
    }
  }
  const converted = await cipher.encryptFields(legacy.map(field => plaintext.get(field.path)));
  const roundtrip = await cipher.decryptFields(converted);
  if (roundtrip.some((value, index) => value !== plaintext.get(legacy[index].path))) {
    throw new Error('Conversion round-trip verification failed.');
  }
  const replacements = new Map(legacy.map((field, index) => [field.path, converted[index]]));
  const result = {
    ...row,
    name: replacements.get('name') ?? row.name,
    entityList: row.entityList.map((entity, index) => ({
      ...entity, name: replacements.get(`entityList[${index}].name`) ?? entity.name,
    })),
  };
  if (replacements.has('description')) result.description = replacements.get('description');
  return { row: result, changed: legacy.length > 0, legacyFields: legacy.length };
}

export async function* scanRows(client) {
  let lastId;
  while (true) {
    let query = client.from('death_counters').select('*').order('id', { ascending: true }).limit(200);
    if (lastId !== undefined) query = query.gt('id', lastId);
    const { data, error } = await query;
    if (error || !Array.isArray(data)) throw new Error('Cannot read death_counters. Check access and connectivity.');
    if (data.length === 0) return;
    for (const row of data) {
      if (row.id == null || row.id === lastId) throw new Error('Invalid or non-advancing row ID.');
      yield row;
      lastId = row.id;
    }
  }
}

export async function migrate(client, { legacyKey, targetKey, apply = false, verifyOnly = false, journal, log = console.log }) {
  if (apply && (!journal || verifyOnly)) throw new Error('Apply requires a journal and cannot be combined with verify-only.');
  let scanned = 0;
  let candidates = 0;
  let converted = 0;
  let verified = 0;
  for await (const row of scanRows(client)) {
    try {
      const result = await convertRow(row, legacyKey, targetKey, verifyOnly);
      scanned++;
      if (result.changed) candidates++;
    } catch (error) {
      throw new Error(`Row ${row.id}: ${error.message}`);
    }
  }
  log(`Preflight: ${scanned} rows scanned, ${candidates} need conversion, ${scanned - candidates} already current or empty.`);
  if (!apply) return { scanned, candidates, converted, verified: verifyOnly ? scanned : 0 };
  for await (const row of scanRows(client)) {
    try {
      const result = await convertRow(row, legacyKey, targetKey);
      if (!result.changed) continue;
      const { data: fresh, error: readError } = await client.from('death_counters').select('*').eq('id', row.id).single();
      if (readError || !fresh || JSON.stringify(encryptedColumns(fresh)) !== JSON.stringify(encryptedColumns(row))) {
        throw new Error('Row changed during migration; keep writers stopped and retry.');
      }
      await journal({ id: row.id, before: encryptedColumns(row), after: encryptedColumns(result.row) });
      const { data: updated, error: updateError } = await client.from('death_counters')
        .update(encryptedColumns(result.row)).eq('id', row.id).select('id').single();
      if (updateError || !updated) throw new Error('Database update failed.');
      converted++;
      const { data: saved, error: verifyError } = await client.from('death_counters').select('*').eq('id', row.id).single();
      if (verifyError || !saved || JSON.stringify(encryptedColumns(saved)) !== JSON.stringify(encryptedColumns(result.row))) {
        throw new Error('Persisted ciphertext verification failed.');
      }
      await convertRow(saved, legacyKey, targetKey, true);
    } catch (error) {
      throw new Error(`Row ${row.id}, after ${converted} updates: ${error.message} Keep maintenance mode enabled; journal contains preimages.`);
    }
  }
  for await (const row of scanRows(client)) {
    try {
      await convertRow(row, legacyKey, targetKey, true);
      verified++;
    } catch {
      throw new Error(`Final verification failed at row ${row.id}; keep maintenance mode enabled.`);
    }
  }
  if (verified !== scanned) throw new Error('Table row count changed during conversion; keep maintenance mode enabled.');
  log(`Complete: ${converted} rows converted; all ${verified} rows verified in the new format.`);
  return { scanned, candidates, converted, verified };
}

async function main() {
  const { values } = parseArgs({ options: {
    apply: { type: 'boolean', default: false },
    'verify-only': { type: 'boolean', default: false },
    'confirm-backup': { type: 'boolean', default: false },
    'writers-stopped': { type: 'boolean', default: false },
    journal: { type: 'string' },
  } });
  if (values.apply && (!values['confirm-backup'] || !values['writers-stopped'] || !values.journal)) {
    throw new Error('--apply requires --confirm-backup --writers-stopped --journal <new-file.jsonl>.');
  }
  if (values.apply && values['verify-only']) throw new Error('Choose apply or verify-only, not both.');
  for (const name of ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'TARGET_SECRET_KEY']) {
    if (!process.env[name]) throw new Error(`${name} is required.`);
  }
  const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const file = values.apply ? await open(values.journal, 'wx', 0o600) : undefined;
  try {
    await migrate(client, {
      legacyKey: process.env.LEGACY_SECRET_KEY,
      targetKey: process.env.TARGET_SECRET_KEY,
      apply: values.apply,
      verifyOnly: values['verify-only'],
      journal: file ? async entry => {
        await file.writeFile(JSON.stringify(entry) + '\n');
        await file.sync();
      } : undefined,
    });
  } finally {
    await file?.close();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => {
    console.error(`Migration stopped: ${error.message}`);
    process.exitCode = 1;
  });
}