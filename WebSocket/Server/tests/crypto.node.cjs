const assert = require('node:assert/strict');
const { test } = require('node:test');
const { decryptField } = require('../dist/utils/crypt');
const { SocketHandler } = require('../dist/server/SocketHandler');

test('server decrypts browser-native tokens and rejects invalid authentication', async () => {
  const { createCipher } = await import('../../../DeathCounter/src/utils/cryptoCodec.mjs');
  process.env.KEY_QUERY_PASSKEY = 'socket-test-password';
  const [token] = await createCipher('socket-test-password', 'socket').encryptFields(['list-uuid']);
  assert.deepEqual(await Promise.all(Array.from({ length: 12 }, () => decryptField(token))), Array(12).fill('list-uuid'));
  assert.equal(await decryptField(token), 'list-uuid');
  assert.equal(await decryptField(token), 'list-uuid');
  await assert.rejects(decryptField('U2FsdGVkX18='));
  await assert.rejects(decryptField('dc:v1:!'));
  const bytes = Buffer.from(token.slice(6), 'base64');
  bytes[bytes.length - 1] ^= 1;
  await assert.rejects(decryptField(`dc:v1:${bytes.toString('base64')}`));
  const [wrongPurpose] = await createCipher('socket-test-password', 'database').encryptFields(['list-uuid']);
  await assert.rejects(decryptField(wrongPurpose));
  process.env.KEY_QUERY_PASSKEY = 'wrong-password';
  await assert.rejects(decryptField(token));
  delete process.env.KEY_QUERY_PASSKEY;
  await assert.rejects(decryptField(token), /required/);
});

test('relay awaits authentication and never broadcasts invalid, mismatched, or disconnected messages', async () => {
  const { createCipher } = await import('../../../DeathCounter/src/utils/cryptoCodec.mjs');
  process.env.KEY_QUERY_PASSKEY = 'relay-test-password';
  const [authToken] = await createCipher('relay-test-password', 'socket').encryptFields(['game-token']);
  const relayed = [];
  const handler = new SocketHandler();
  handler.initialize({
    engine: { on() {} }, on() {}, emit: (...args) => relayed.push(args),
  });
  const socket = { connected: true, emit() {} };
  const message = { event: 'genericDeathIncrement', gameToken: 'game-token', authToken, data: 1 };
  const pending = handler.onSocketMessage(socket, message);
  assert.equal(relayed.length, 0);
  await pending;
  assert.equal(relayed.length, 1);
  await handler.onSocketMessage(socket, { ...message, gameToken: 'wrong-game' });
  await handler.onSocketMessage(socket, { ...message, authToken: 'legacy' });
  socket.connected = false;
  await handler.onSocketMessage(socket, message);
  assert.equal(relayed.length, 1);
});