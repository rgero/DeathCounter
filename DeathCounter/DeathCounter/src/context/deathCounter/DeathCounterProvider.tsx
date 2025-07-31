import React, { useEffect } from "react";
import {createDeathList, getDeathLists, removeDeathList as removeDeathListAPI, updateActiveDeathList, updateDeathList as updateDeathListAPI, updateDeathListToken, uploadDeathList as uploadDeathListAPI} from "../../services/apiDeathCounter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeathList } from "../../interfaces/DeathList";
import { DeathListContext } from "./DeathCounterContext";
import { Entity } from "../../interfaces/Entity";
import toast from "react-hot-toast";
import { useAuthenticationContext } from "../authentication/AuthenticationContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";

export const DeathListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeDeathList, setActiveDeathList] = useLocalStorage(undefined, "activeDeathList");
  const [entityInEdit, setEntityInEdit] = useLocalStorage(undefined, "entityInEdit");
  const queryClient = useQueryClient();
  const { user } = useAuthenticationContext();

  const { data: deathLists = [], error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["death_counters"],
    queryFn: () => getDeathLists(),
  });

  useEffect(() => {
    if (isLoading || isFetching) return;
    if (deathLists.length > 0) {
      const activeList = deathLists.find((list) => list.currentlyActive);
      if (activeList) setActiveDeathList(activeList);
      else console.log("No active list found in API data");
    } else {
      console.log("No death lists available from API");
    }
  }, [deathLists, isLoading, isFetching, setActiveDeathList]);

  const handleMutationSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["death_counters"] });
    refetch();
  };

  const { mutateAsync: addNewDeathList } = useMutation({
    mutationFn: async (deathList: DeathList) => {
      if (!user) throw new Error("User not authenticated");
      deathList = { ...deathList, owner_id: user.id };
      if (!deathList.id) delete deathList.id;
      await createDeathList(deathList);
    },
    onSuccess: () => handleMutationSuccess("Death List added successfully!"),
  });

  const { mutateAsync: updateDeathList } = useMutation({
    mutationFn: (deathList: DeathList) => updateDeathListAPI(deathList),
    onSuccess: () => handleMutationSuccess("Death List updated successfully!"),
  });

  const { mutateAsync: addToList } = useMutation({
    mutationFn: async (entity: Entity) => {
      if (!activeDeathList) throw new Error("No active death list found");

      const existingEntity = activeDeathList.entityList.find((e: Entity) => e.id === entity.id);
      if (existingEntity) {
        existingEntity.deaths = entity.deaths;
        existingEntity.name = entity.name;
        await updateDeathListAPI(activeDeathList);
        return;
      }

      entity.id = activeDeathList.entityList.length > 0 ? Math.max(...activeDeathList.entityList.map((e: Entity) => e.id)) + 1 : 1;

      activeDeathList.entityList.push(entity);
      await updateDeathListAPI(activeDeathList);
    },
    onSuccess: () => handleMutationSuccess("Entity updated successfully!"),
  });

  const { mutateAsync: removeEntityFromList } = useMutation({
    mutationFn: async (id: number) => {
      if (!activeDeathList) throw new Error("No active death list found");
      activeDeathList.entityList = activeDeathList.entityList.filter((e: Entity) => e.id !== id);
      await updateDeathListAPI(activeDeathList);
    },
    onSuccess: () => handleMutationSuccess("Entity removed successfully!"),
  });

  const { mutateAsync: removeDeathList } = useMutation({
    mutationFn: (id: number) => removeDeathListAPI(id),
    onSuccess: () => handleMutationSuccess("Death List removed successfully!"),
  });

  const { mutateAsync: uploadDeathList } = useMutation({
    mutationFn: (deathList: DeathList) => uploadDeathListAPI(deathList),
    onSuccess: () => handleMutationSuccess("Death List uploaded successfully!"),
  });

  const getCurrentlyActiveDeathList = () => deathLists.find((d) => d.currentlyActive);

  const { mutateAsync: updateActiveStatus } = useMutation({
    mutationFn: async (id: number) => {
      if (activeDeathList?.id) {
        await updateActiveDeathList(activeDeathList.id, false);
      }
      await updateActiveDeathList(id, true);
    },
    onSuccess: () => handleMutationSuccess("Active status updated successfully!"),
  });

  const { mutateAsync: regenerateToken } = useMutation({
    mutationFn: async () => {
      if (!activeDeathList?.id) throw new Error("No active death list found to regenerate token");
      const newToken = uuidv4();
      await updateDeathListToken(activeDeathList.id, newToken);
      return newToken;
    },
    onSuccess: (newToken) => {
      if (activeDeathList) setActiveDeathList({ ...activeDeathList, token: newToken });
      handleMutationSuccess("Token regenerated successfully!");
    },
  });

  return (
    <DeathListContext.Provider
      value={{
        activeDeathList,
        addDeathList: addNewDeathList,
        addToList,
        deathLists,
        error,
        getCurrentlyActiveDeathList,
        isFetching,
        isLoading,
        entityInEdit,
        regenerateToken,
        removeDeathList,
        removeEntityFromList,
        setActiveDeathList,
        updateActiveStatus,
        updateDeathList,
        setEntityInEdit,
        uploadDeathList,
      }}
    >
      {children}
    </DeathListContext.Provider>
  );
};
