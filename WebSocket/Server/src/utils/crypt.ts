import { webcrypto } from 'node:crypto';

const PREFIX = 'dc:v1:';
const PURPOSE = new TextEncoder().encode(`${PREFIX}socket`);
const cache = new Map<string, { key: string; plaintext: string; expires: number }>();
const inFlight = new Map<string, { key: string; value: Promise<string> }>();

export const decryptField = async (ciphertext: string): Promise<string> => {
  const password = process.env.KEY_QUERY_PASSKEY;
  if (!password) throw new Error('KEY_QUERY_PASSKEY is required.');
  if (typeof ciphertext !== 'string' || !ciphertext.startsWith(PREFIX) || ciphertext.length > 4096) {
    throw new Error('Unsupported auth token format. Copy a new auth token from the web app.');
  }
  const encoded = ciphertext.slice(PREFIX.length);
  if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
    throw new Error('Invalid auth token encoding.');
  }
  const envelope = Buffer.from(encoded, 'base64');
  if (envelope.length < 45 || envelope.toString('base64') !== encoded) throw new Error('Invalid auth token.');
  const cached = cache.get(ciphertext);
  if (cached?.key === password && cached.expires > Date.now()) return cached.plaintext;
  const existing = inFlight.get(ciphertext);
  if (existing?.key === password) return existing.value;
  if (inFlight.size >= 4) throw new Error('Auth token validation is busy; retry later.');
  const value = (async () => {
    const material = await webcrypto.subtle.importKey(
      'raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'],
    );
    const salt = Buffer.concat([envelope.subarray(0, 16), PURPOSE]);
    const key = await webcrypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 600_000, hash: 'SHA-256' },
      material, { name: 'AES-GCM', length: 256 }, false, ['decrypt'],
    );
    const bytes = await webcrypto.subtle.decrypt(
      { name: 'AES-GCM', iv: envelope.subarray(16, 28), additionalData: PURPOSE, tagLength: 128 },
      key, envelope.subarray(28),
    );
    const plaintext = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
    if (!plaintext) throw new Error('Auth token must not be empty.');
    if (cache.size >= 256) cache.delete(cache.keys().next().value!);
    cache.set(ciphertext, { key: password, plaintext, expires: Date.now() + 300_000 });
    return plaintext;
  })();
  inFlight.set(ciphertext, { key: password, value });
  try {
    return await value;
  } finally {
    if (inFlight.get(ciphertext)?.value === value) inFlight.delete(ciphertext);
  }
};
