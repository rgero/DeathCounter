import { decryptData, encryptData } from "../utils/crypt";

import { DeathList } from "../interfaces/DeathList";
import supabase from "./supabase";

export const getDeathLists = async () => {
  const { data, error } = await supabase
    .from("death_counters")
    .select("*", { count: "exact" });

  if (error) {
    console.error(error);
    throw new Error("Game Lists not found");
  }

  return data.map((item: DeathList) => {
    return decryptData(item);
  });
};

export const getDeathListById = async (id: number) => {
  const { data, error } = await supabase
    .from("death_counters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Game List not found");
  }

  return decryptData(data as DeathList);
};

export const createDeathList = async (deathList: DeathList) => {
  deathList = encryptData(deathList);
  const { data, error } = await supabase
    .from("death_counters")
    .insert([deathList])
    .select("*")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create Death List");
  }

  return decryptData(data as DeathList);
};

export const updateActiveDeathList = async (id: number, currentlyActive: boolean) => {
  const { error } = await supabase
    .from("death_counters")
    .update({ currentlyActive })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update Death List status");
  }
}

export const updateDeathListToken = async (id: number, token: string) => {
  const { error } = await supabase
    .from("death_counters")
    .update({ token })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to update Death List token");
  }
}