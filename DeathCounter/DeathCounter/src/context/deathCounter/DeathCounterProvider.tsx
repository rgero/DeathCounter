import {createDeathList, getDeathLists, removeDeathList as removeDeathListAPI, updateActiveDeathList, updateDeathList as updateDeathListAPI, updateDeathListToken, uploadDeathList as uploadDeathListAPI} from "../../services/apiDeathCounter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeathList } from "../../interfaces/DeathList";
import { DeathListContext } from "./DeathCounterContext";
import { Entity } from "../../interfaces/Entity";
import React from "react";
import toast from "react-hot-toast";
import { useAuthenticationContext } from "../authentication/AuthenticationContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { v4 as uuidv4 } from "uuid";

export const DeathListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entityInEdit, setEntityInEdit] = useLocalStorage(undefined, "entityInEdit");
  const queryClient = useQueryClient();
  const { user } = useAuthenticationContext();

  const {
    data: deathLists = [],
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["death_counters"],
    queryFn: () => getDeathLists(),
  });

  const activeDeathList = deathLists.find((list) => list.currentlyActive);

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

      let updatedList: DeathList;

      const existingEntity = activeDeathList.entityList.find((e) => e.id === entity.id);
      if (existingEntity) {
        // Replace entity immutably
        const updatedEntities = activeDeathList.entityList.map((e) =>
          e.id === entity.id ? { ...e, name: entity.name, deaths: entity.deaths } : e
        );
        updatedList = { ...activeDeathList, entityList: updatedEntities };
      } else {
        // Add new entity immutably
        const newId = activeDeathList.entityList.length > 0
          ? Math.max(...activeDeathList.entityList.map((e) => e.id ?? 0)) + 1
          : 1;
        const newEntity = { ...entity, id: newId };
        updatedList = {
          ...activeDeathList,
          entityList: [...activeDeathList.entityList, newEntity],
        };
      }

      await updateDeathListAPI(updatedList);
    },
    onSuccess: () => handleMutationSuccess("Entity updated successfully!"),
  });

  const { mutateAsync: removeEntityFromList } = useMutation({
    mutationFn: async (id: number) => {
      if (!activeDeathList) throw new Error("No active death list found");

      const updatedEntities = activeDeathList.entityList.filter((e) => e.id !== id);
      const updatedList = { ...activeDeathList, entityList: updatedEntities };

      await updateDeathListAPI(updatedList);
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

  const getCurrentlyActiveDeathList = () => activeDeathList;

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
    onSuccess: () => handleMutationSuccess("Token regenerated successfully!"),
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
