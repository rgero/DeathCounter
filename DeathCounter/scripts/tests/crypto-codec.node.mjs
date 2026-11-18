import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createCipher } from '../../src/utils/cryptoCodec.mjs';

test('native codec round-trips UTF-8, empty and multi-block values with random IVs', async () => {
  const cipher = createCipher('test-only-password', 'database');
  const values = ['Elden Ring', '\u65e5\u672c\u8a9e \u{1f480}', '', 'long value '.repeat(50), 'Elden Ring', '\ufeffLeading BOM'];
  const encrypted = await cipher.encryptFields(values);
  assert.deepEqual(await cipher.decryptFields(encrypted), values);
  assert.equal(encrypted[2], '');
  assert.notEqual(encrypted[0], encrypted[4]);
  assert.notEqual(encrypted[0], (await cipher.encryptFields([values[0]]))[0]);
});

test('native reader rejects legacy, malformed, tampered, wrong-key and wrong-purpose values', async () => {
  const cipher = createCipher('test-only-password', 'database');
  const [encrypted] = await cipher.encryptFields(['secret']);
  const bytes = Buffer.from(encrypted.slice(6), 'base64');
  bytes[bytes.length - 1] ^= 1;
  for (const invalid of ['U2FsdGVkX18=', 'plaintext', 'dc:v2:AAAA', 'dc:v1:!', 'dc:v1:AAAA', `dc:v1:${bytes.toString('base64')}`]) {
    await assert.rejects(cipher.decryptFields([invalid]));
  }
  await assert.rejects(createCipher('wrong', 'database').decryptFields([encrypted]));
  await assert.rejects(createCipher('test-only-password', 'socket').decryptFields([encrypted]));
  assert.throws(() => createCipher('', 'database'), /not configured/);
});