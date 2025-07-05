import CryptoJS from "crypto-js";
import { DeathList } from "../interfaces/DeathList";

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

const encryptField = (text: string|undefined): string => {
  if (!text) return "";
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

const decryptField = (ciphertext: string): string => {
  if (!ciphertext) return "";
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const decryptData = (data: DeathList): DeathList => {
  data.name = decryptField(data.name)
  data.description = data.description ? decryptField(data.description) : "";

  data.entityList = data.entityList.map((entity) => ({
    ...entity,
    name: decryptField(entity.name),
  }));

  return data;
}

export const encryptData = (data: DeathList): DeathList => {
  data.name = encryptField(data.name);
  data.description = data.description ? encryptField(data.description) : "";

  data.entityList = data.entityList.map((entity) => ({
    ...entity,
    name: encryptField(entity.name),
  }));

  return data;
}
