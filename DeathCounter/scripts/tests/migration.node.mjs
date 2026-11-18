import assert from 'node:assert/strict';
import { test } from 'node:test';
import { convertRow, decryptLegacy, migrate, scanRows } from '../migrate-encryption.mjs';
import { createCipher } from '../../src/utils/cryptoCodec.mjs';

const legacyKey = 'migration-fixture-key';
const targetKey = 'new-fixture-key';
const fixture = 'U2FsdGVkX18AAQIDBAUGBzeNvNkeTWUyPRFZtcO1CB5K65fbFoeMkdz+8QOfPSCjsQy+09VJ83FvP8ivTZES66lqfFkwCTfBFUQcBu9xIi8Wo1vw0A4jdxlNPnTv97sc';

function fakeDatabase(rows, failId) {
  const state = { rows: structuredClone(rows), updates: [] };
  return {
    state,
    from() {
      let id;
      let after;
      let patch;
      const query = {
        select() { return query; },
        order() { return query; },
        limit() { return query; },
        gt(_column, value) { after = value; return query; },
        eq(_column, value) { id = value; return query; },
        update(value) { patch = value; return query; },
        async single() {
          const row = state.rows.find(value => value.id === id);
          if (patch) {
            if (id === failId) return { error: new Error('simulated outage') };
            Object.assign(row, structuredClone(patch));
            state.updates.push(id);
          }
          return { data: structuredClone(row) };
        },
        then(resolve, reject) {
          return Promise.resolve({ data: state.rows.filter(row => after === undefined || row.id > after).slice(0, 137) }).then(resolve, reject);
        },
      };
      return query;
    },
  };
}

test('legacy fixture and mixed-format conversion preserve metadata and optional fields', async () => {
  assert.equal(decryptLegacy(fixture, legacyKey), 'Legacy \u65e5\u672c\u8a9e '.repeat(4));
  const [current] = await createCipher(targetKey, 'database').encryptFields(['current']);
  const original = { id: 8, name: fixture, description: null, token: 'unchanged', owner_id: 'owner', currentlyActive: true,
    entityList: [{ id: 1, name: current, deaths: 4, extra: true }, { id: 2, name: '', deaths: 0 }] };
  const result = await convertRow(original, legacyKey, targetKey);
  assert.equal(result.changed, true);
  assert.deepEqual({ ...result.row, name: fixture }, original);
  assert.equal((await convertRow(result.row, legacyKey, targetKey)).changed, false);
  assert.equal((await createCipher(targetKey, 'database').decryptFields([result.row.name]))[0], 'Legacy \u65e5\u672c\u8a9e '.repeat(4));
  await assert.rejects(convertRow(original, 'wrong', targetKey));
  await assert.rejects(convertRow({ ...original, name: 'plaintext' }, legacyKey, targetKey));
  await assert.rejects(convertRow(original, legacyKey, targetKey, true));
});

test('scanner reads past 1000 rows and across non-contiguous IDs', async () => {
  const client = fakeDatabase(Array.from({ length: 1107 }, (_, index) => ({ id: index * 3 + 1 })));
  const ids = [];
  for await (const row of scanRows(client)) ids.push(row.id);
  assert.equal(ids.length, 1107);
  assert.equal(ids.at(-1), 3319);
});

test('dry-run never writes; apply journals first, verifies, and reruns safely', async () => {
  const original = { id: 7, name: fixture, entityList: [], currentlyActive: true, owner_id: 'owner' };
  const client = fakeDatabase([original]);
  const journal = [];
  const options = { legacyKey, targetKey, log() {} };
  await migrate(client, options);
  assert.equal(client.state.updates.length, 0);
  const result = await migrate(client, { ...options, apply: true, journal: async entry => {
    assert.equal(client.state.updates.length, 0);
    journal.push(entry);
  } });
  assert.equal(result.verified, 1);
  assert.equal(result.converted, 1);
  assert.deepEqual(journal[0].before, { name: original.name, entityList: [] });
  assert.equal((await migrate(client, { ...options, apply: true, journal: async () => {} })).converted, 0);
  await migrate(client, { ...options, verifyOnly: true });
});

test('preflight prevents writes for damaged rows and apply failures are resumable', async () => {
  const rows = [{ id: 1, name: fixture, entityList: [] }, { id: 4, name: 'broken', entityList: [] }];
  const broken = fakeDatabase(rows);
  const options = { legacyKey, targetKey, apply: true, journal: async () => {}, log() {} };
  await assert.rejects(migrate(broken, options), /Row 4/);
  assert.deepEqual(broken.state.updates, []);
  rows[1].name = fixture;
  const failing = fakeDatabase(rows, 4);
  await assert.rejects(migrate(failing, options), /after 1 updates/);
  const resumed = fakeDatabase(failing.state.rows);
  assert.equal((await migrate(resumed, options)).converted, 1);
  assert.deepEqual(resumed.state.updates, [4]);
});