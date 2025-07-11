import CryptoJS from "crypto-js";
import { DeathList } from "../interfaces/DeathList";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const encryptField = (text: string | undefined): string => {
  if (!text) return "";
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decryptField = (ciphertext: string): string => {
  if (!ciphertext) return "";
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const decryptData = (data: DeathList): DeathList => {
  return {
    ...data,
    name: decryptField(data.name),
    description: data.description ? decryptField(data.description) : "",
    entityList: data.entityList.map((entity) => ({
      ...entity,
      name: decryptField(entity.name),
    })),
  };
};

export const encryptData = (data: DeathList): DeathList => {
  return {
    ...data,
    name: encryptField(data.name),
    description: data.description ? encryptField(data.description) : "",
    entityList: data.entityList.map((entity) => ({
      ...entity,
      name: encryptField(entity.name),
    })),
  };
};
