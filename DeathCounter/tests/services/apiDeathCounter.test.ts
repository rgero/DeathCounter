import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDeathLists, updateDeathList } from '@services/apiDeathCounter';
import { decryptData, encryptData } from '@utils/crypt';

const database = vi.hoisted(() => ({ from: vi.fn(), select: vi.fn(), update: vi.fn(), eq: vi.fn() }));
vi.mock('@services/supabase', () => ({ default: database }));
vi.mock('@utils/crypt', () => ({ encryptData: vi.fn(), decryptData: vi.fn() }));

const list = { id: 1, name: 'Game', currentlyActive: true, entityList: [] };

describe('async encryption persistence boundary', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    database.from.mockReturnValue(database);
    database.update.mockReturnValue(database);
    database.eq.mockResolvedValue({ error: null });
  });

  it('does not send an unresolved encryption promise to Supabase', async () => {
    let resolveEncryption!: (value: typeof list) => void;
    vi.mocked(encryptData).mockReturnValue(new Promise(resolve => { resolveEncryption = resolve; }));
    const pending = updateDeathList(list);
    expect(database.update).not.toHaveBeenCalled();
    const encrypted = { ...list, name: 'dc:v1:encrypted' };
    resolveEncryption(encrypted);
    await pending;
    expect(database.update).toHaveBeenCalledWith(encrypted);
  });

  it('resolves every list before returning a collection', async () => {
    database.select.mockResolvedValue({ data: [list, { ...list, id: 2 }], error: null });
    vi.mocked(decryptData).mockImplementation(async value => ({ ...value, name: 'decrypted' }));
    const result = await getDeathLists();
    expect(result).toHaveLength(2);
    expect(result.map(value => value.name)).toEqual(['decrypted', 'decrypted']);
    expect(result.some(value => value instanceof Promise)).toBe(false);
  });
});