import { decryptField, encryptField } from "../utils/crypt";

import supabase from "./supabase";

export const getGameToken = async (authToken: string, userId: string, gameName: string) => {
  const encryptedGameName = encryptField(gameName);

  const {data, error} = await supabase.from("death_counters").select("*").eq("owner_id", userId).eq("game->name", encryptedGameName).single();

  if (error) {
    console.error("Error fetching game token:", error);
    throw new Error("Failed to fetch game token");
  }

  return decryptField(data.token);
}