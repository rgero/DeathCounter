import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.KEY_QUERY_PASSKEY ? process.env.KEY_QUERY_PASSKEY : "DefaultSecretKey";

export const encryptField = (text: string|undefined): string => {
  if (!text) return "";
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decryptField = (ciphertext: string): string => {
  const SECRET_KEY = process.env.KEY_QUERY_PASSKEY ? process.env.KEY_QUERY_PASSKEY : "DefaultSecretKey";
  if (!ciphertext) return "";
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
