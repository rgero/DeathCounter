export const CIPHERTEXT_PREFIX: string;
export const PBKDF2_ITERATIONS: number;
export function createCipher(password: string, purpose: 'database' | 'socket'): {
  encryptFields(values: string[]): Promise<string[]>;
  decryptFields(values: string[]): Promise<string[]>;
};