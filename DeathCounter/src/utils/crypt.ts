import { DeathList } from '@interfaces/DeathList';
import { createCipher } from './cryptoCodec.mjs';

const transformData = async (data: DeathList, operation: 'encryptFields' | 'decryptFields'): Promise<DeathList> => {
  const cipher = createCipher(import.meta.env.VITE_SECRET_KEY, 'database');
  const fields = await cipher[operation]([
    data.name, data.description ?? '', ...data.entityList.map(entity => entity.name),
  ]);
  return {
    ...data,
    name: fields[0],
    description: fields[1],
    entityList: data.entityList.map((entity, index) => ({
      ...entity,
      name: fields[index + 2],
    })),
  };
};

export const decryptData = (data: DeathList): Promise<DeathList> => transformData(data, 'decryptFields');
export const encryptData = (data: DeathList): Promise<DeathList> => transformData(data, 'encryptFields');

let cachedAuth: { token: string; key: string; value: Promise<string> } | undefined;

export const encryptAuthToken = (token: string | undefined): Promise<string> => {
  if (!token) return Promise.resolve('');
  const key = import.meta.env.VITE_WS_AUTH_TOKEN;
  if (cachedAuth?.token === token && cachedAuth.key === key) return cachedAuth.value;
  const value = Promise.resolve().then(async () => {
    const [encrypted] = await createCipher(key, 'socket').encryptFields([token]);
    return encrypted;
  });
  cachedAuth = { token, key, value };
  void value.catch(() => {
    if (cachedAuth?.value === value) cachedAuth = undefined;
  });
  return value;
};