import { decryptData, encryptData } from '@utils/crypt';

import { DeathList } from '@interfaces/DeathList';
import supabase from "./supabase";
import { v4 as uuidv4 } from 'uuid';

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
  const { error } = await supabase
    .from("death_counters")
    .update({ currentlyActive: false })
    .eq("currentlyActive", true);

  if (error) {
    console.error("Failed to mark the old active list as inactive:", error);
    throw new Error("Failed to update currently active Death List");
  }

  const encryptedDeathList = encryptData(deathList);
  encryptedDeathList.token = uuidv4();
  encryptedDeathList.currentlyActive = true;

  const { data: newData, error: insertError } = await supabase
    .from("death_counters")
    .insert([encryptedDeathList])
    .select("*")
    .single();

  if (insertError) {
    console.error("Failed to create new Death List:", insertError);
    throw new Error("Failed to create Death List");
  }

  return decryptData(newData as DeathList);
};

export const updateDeathList = async (deathList: DeathList) => {
  const updatedDeathList = encryptData(deathList);

  const { error } = await supabase
    .from("death_counters")
    .update(updatedDeathList)
    .eq("id", deathList.id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update Death List");
  }
}

export const updateActiveDeathList = async (id: number, currentlyActive: boolean) => {
  const { error } = await supabase
    .from("death_counters")
    .update({ currentlyActive })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update Death List status");
  }
}

export const updateDeathListToken = async (id: number, token: string) => {
  const { error } = await supabase
    .from("death_counters")
    .update({ token })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update Death List token");
  }
}

export const uploadDeathList = async (deathList: DeathList) => {
  const existingList = deathList.id ?  await getDeathListById(deathList.id) : null;
  if (existingList) {
    const { error } = await supabase
      .from("death_counters")
      .update(encryptData(deathList))
      .eq("id", deathList.id);

    if (error) {
      console.error(error);
      throw new Error("Failed to update Death List");
    }
  } else {
    await createDeathList(deathList);
  }
}

export const removeDeathList = async (id: number) => {
  const { error } = await supabase
    .from("death_counters")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Failed to remove Death List");
  }
}