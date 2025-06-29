import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.ENCRYPTION_KEY ? process.env.ENCRYPTION_KEY : "DefaultSecretKey";

export const encryptField = (text: string|undefined): string => {
  if (!text) return "";
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptField = (ciphertext: string): string => {
  if (!ciphertext) return "";
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
