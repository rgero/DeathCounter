export const CIPHERTEXT_PREFIX = 'dc:v1:';
export const PBKDF2_ITERATIONS = 600_000;
const MAX_BYTES = 1_048_576;
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

function webCrypto() {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Web Crypto requires HTTPS or localhost and a supported browser.');
  }
  return globalThis.crypto;
}

function encodeBase64(bytes) {
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 8192) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
  }
  return btoa(binary);
}

function decodeEnvelope(value) {
  if (typeof value !== 'string' || !value.startsWith(CIPHERTEXT_PREFIX)) {
    throw new Error('Unsupported ciphertext format. Convert legacy database values before deployment.');
  }
  const encoded = value.slice(CIPHERTEXT_PREFIX.length);
  if (encoded.length > Math.ceil((MAX_BYTES + 44) / 3) * 4 ||
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
    throw new Error('Invalid ciphertext encoding.');
  }
  const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
  if (bytes.length < 44 || bytes.length > MAX_BYTES + 44 || encodeBase64(bytes) !== encoded) {
    throw new Error('Invalid ciphertext length or encoding.');
  }
  return bytes;
}

export function createCipher(password, purpose) {
  if (typeof password !== 'string' || !password) throw new Error('Encryption key is not configured.');
  if (purpose !== 'database' && purpose !== 'socket') throw new Error('Invalid encryption purpose.');
  const additionalData = encoder.encode(`${CIPHERTEXT_PREFIX}${purpose}`);

  async function deriveKey(salt) {
    const material = await webCrypto().subtle.importKey(
      'raw', encoder.encode(password), 'PBKDF2', false, ['deriveKey'],
    );
    const domainSalt = new Uint8Array(salt.length + additionalData.length);
    domainSalt.set(salt);
    domainSalt.set(additionalData, salt.length);
    return webCrypto().subtle.deriveKey(
      { name: 'PBKDF2', salt: domainSalt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
      material, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt'],
    );
  }

  return {
    async encryptFields(values) {
      const salt = webCrypto().getRandomValues(new Uint8Array(16));
      const key = values.some(value => value !== '') ? await deriveKey(salt) : undefined;
      return Promise.all(values.map(async value => {
        if (typeof value !== 'string') throw new Error('Encrypted fields must be strings.');
        if (value === '') return '';
        const plaintext = encoder.encode(value);
        if (plaintext.length > MAX_BYTES) throw new Error('Encrypted field is too large.');
        const iv = webCrypto().getRandomValues(new Uint8Array(12));
        const encrypted = new Uint8Array(await webCrypto().subtle.encrypt(
          { name: 'AES-GCM', iv, additionalData, tagLength: 128 }, key, plaintext,
        ));
        const envelope = new Uint8Array(28 + encrypted.length);
        envelope.set(salt);
        envelope.set(iv, 16);
        envelope.set(encrypted, 28);
        return CIPHERTEXT_PREFIX + encodeBase64(envelope);
      }));
    },
    async decryptFields(values) {
      const keys = new Map();
      return Promise.all(values.map(async value => {
        if (value === '') return '';
        const envelope = decodeEnvelope(value);
        const salt = envelope.slice(0, 16);
        const saltId = encodeBase64(salt);
        if (!keys.has(saltId)) keys.set(saltId, deriveKey(salt));
        const plaintext = await webCrypto().subtle.decrypt(
          { name: 'AES-GCM', iv: envelope.slice(16, 28), additionalData, tagLength: 128 },
          await keys.get(saltId), envelope.slice(28),
        );
        return decoder.decode(plaintext);
      }));
    },
  };
}