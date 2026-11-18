import { webcrypto } from 'node:crypto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { decryptData, encryptAuthToken, encryptData } from '@utils/crypt';

describe('native death-list encryption', () => {
  beforeEach(() => {
    vi.stubGlobal('crypto', webcrypto);
    vi.stubEnv('VITE_SECRET_KEY', 'database-test-key');
    vi.stubEnv('VITE_WS_AUTH_TOKEN', 'socket-test-key');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('encrypts all private fields while retaining metadata and input', async () => {
    const original = { id: 1, name: 'Game', description: 'Notes', token: 'uuid', currentlyActive: true,
      entityList: [{ id: 7, name: 'Boss', deaths: 5 }] };
    const encrypted = await encryptData(original);
    expect(encrypted.name).toMatch(/^dc:v1:/);
    expect(encrypted.description).toMatch(/^dc:v1:/);
    expect(encrypted.entityList[0].name).toMatch(/^dc:v1:/);
    expect(encrypted.token).toBe('uuid');
    expect(encrypted.entityList[0].deaths).toBe(5);
    expect(await decryptData(encrypted)).toEqual(original);
    expect(original.name).toBe('Game');
  });

  it('preserves empty values and rejects legacy data or missing keys', async () => {
    const empty = { name: '', currentlyActive: false, entityList: [] };
    expect(await decryptData(await encryptData(empty))).toEqual({ ...empty, description: '' });
    await expect(decryptData({ ...empty, name: 'U2FsdGVkX18=' })).rejects.toThrow(/Unsupported/);
    vi.stubEnv('VITE_SECRET_KEY', '');
    await expect(encryptData(empty)).rejects.toThrow(/not configured/);
  });

  it('shares pending token encryption and changes it when the list token changes', async () => {
    const first = encryptAuthToken('list-a');
    expect(encryptAuthToken('list-a')).toBe(first);
    expect(await first).toMatch(/^dc:v1:/);
    expect(await encryptAuthToken('list-b')).not.toBe(await first);
    expect(await encryptAuthToken(undefined)).toBe('');
  });
});