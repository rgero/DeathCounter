import React, { useContext, useEffect } from "react";
import { createDeathList, getDeathLists, removeDeathList as removeDeathListAPI, updateActiveDeathList, updateDeathList as updateDeathListAPI, updateDeathListToken, uploadDeathList as uploadDeathListAPI } from "../services/apiDeathCounter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeathList } from "../interfaces/DeathList";
import { Entity } from "../interfaces/Entity";
import toast from "react-hot-toast";
import { useAuthenticationContext } from "./AuthenticationContext";
import { v4 as uuidv4 } from 'uuid';

interface DeathListContextType {
  deathLists: DeathList[];
  activeDeathList: DeathList | undefined;
  setActiveDeathList: (deathList: DeathList) => void;
  currentlySelectedEntity: Entity | null;
  addDeathList: (deathList: DeathList) => void;
  addToList: (entity: Entity) => void;
  updateActiveStatus: (id: number) => void;
  getCurrentlyActiveDeathList: () => DeathList | undefined;
  regenerateToken: () => void;
  setCurrentlySelectedEntity: (entity: Entity | null) => void;
  uploadDeathList: (deathList: DeathList) => void;
  updateDeathList: (deathList: DeathList) => void;
  removeDeathList: (id: number) => void;
  removeEntityFromList: (id: number) => void;
  isFetching: boolean;
  isLoading: boolean;
  error: Error | null;
}

const DeathListContext = React.createContext<DeathListContextType>({
  deathLists: [],
  currentlySelectedEntity: null,
  activeDeathList: undefined,
  setActiveDeathList: () => {},
  addDeathList: () => {},
  addToList: () => {},
  updateActiveStatus: () => {},
  getCurrentlyActiveDeathList: () => undefined,
  regenerateToken: () => {},
  removeDeathList: () => {},
  removeEntityFromList: () => {},
  setCurrentlySelectedEntity: () => {},
  uploadDeathList: () => {},
  updateDeathList: () => {},
  isFetching: false,
  isLoading: false,
  error: null,
});

export const DeathListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const {user} = useAuthenticationContext();
  const [currentlySelectedEntity, setCurrentlySelectedEntity] = React.useState<Entity | null>(null);
  const [activeDeathList, setActiveDeathList] = React.useState<DeathList | undefined>(undefined);

  const { data: deathLists = [], error, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["death_counters"],
    queryFn: () => getDeathLists(),
  });

  useEffect(() => {    
    if (deathLists.length > 0) {
      const activeList = deathLists.find(list => list.currentlyActive);
      setActiveDeathList(activeList);
    } else {
      console.log("No death lists found, clearing active death list");
      setActiveDeathList(undefined);
    }
  }, [deathLists]);

  // Shared success handler
  const handleMutationSuccess = (message: string) => {
    toast.success(message);
    queryClient.invalidateQueries({ queryKey: ["death_counters"] });
    refetch();
  };

  const { mutateAsync: addNewDeathList } = useMutation({
    mutationFn: async (deathList: DeathList) => {
      if (!user) { throw new Error("User not authenticated"); }
      deathList = { ...deathList, owner_id: user.id };
      if (!deathList.id) delete deathList.id;
      await createDeathList(deathList);
    },
    onSuccess: () => handleMutationSuccess("Death List added successfully!"),
  });

  const { mutateAsync: updateDeathList } = useMutation({
    mutationFn: async (deathList: DeathList) => {
      await updateDeathListAPI(deathList);
    },
    onSuccess: () => handleMutationSuccess("Death List updated successfully!"),
  });

  const {mutateAsync: addToList} = useMutation({
    mutationFn: async (entity: Entity) => {
      if (!activeDeathList) {
        throw new Error("No active death list found");
      }
      const existingEntity = activeDeathList.entityList.find(e => e.id === entity.id);
      if (existingEntity) {
        existingEntity.deaths = entity.deaths;
        existingEntity.name = entity.name;
        await updateDeathListAPI(activeDeathList);
        return;
      }

      activeDeathList.entityList.push(entity);
      await updateDeathListAPI(activeDeathList);
    },
    onSuccess: () => handleMutationSuccess("Entity updated successfully!"),
  })

  const {mutateAsync: removeEntityFromList} = useMutation({
    mutationFn: async (id: number) => {
      if (!activeDeathList) {
        throw new Error("No active death list found");
      }

      const updatedList = activeDeathList.entityList.filter(e => e.id !== id);
      activeDeathList.entityList = updatedList;
      await updateDeathListAPI(activeDeathList);
    },
    onSuccess: () => handleMutationSuccess("Entity removed successfully!"),
  })

  const {mutateAsync: removeDeathList} = useMutation({
    mutationFn: async (id: number) => {
      await removeDeathListAPI(id);
    },
    onSuccess: () => handleMutationSuccess("Death List removed successfully!"),
  });

  const {mutateAsync: uploadDeathList} = useMutation({
    mutationFn: async (deathList: DeathList) => {
      await uploadDeathListAPI(deathList);
    },
    onSuccess: () => handleMutationSuccess("Death List uploaded successfully!"),
  });

  const getCurrentlyActiveDeathList = () => {
    return deathLists.find((deathList) => deathList.currentlyActive);
  }
  
  const { mutateAsync: updateActiveStatus } = useMutation({
    mutationFn: async (id: number) => {
      if (activeDeathList) {
        if (activeDeathList.id)
        {
          await updateActiveDeathList(activeDeathList.id, false);
        }
      }
      await updateActiveDeathList(id, true);
    },
    onSuccess: () => handleMutationSuccess("Active status updated successfully!"),
  })

  const { mutateAsync: regenerateToken } = useMutation({
    mutationFn: async () => {
      if (!activeDeathList || !activeDeathList.id) {
        throw new Error("No active death list found to regenerate token");
      }

      const newToken = uuidv4();
      await updateDeathListToken(activeDeathList.id, newToken);
    },
    onSuccess: () => handleMutationSuccess("Token regenerated successfully!"),
  });

  return (
    <DeathListContext.Provider
      value={{
        deathLists,
        activeDeathList,
        setActiveDeathList,
        currentlySelectedEntity,
        addToList,
        addDeathList: addNewDeathList,
        getCurrentlyActiveDeathList,
        regenerateToken,
        removeDeathList,
        removeEntityFromList,
        setCurrentlySelectedEntity,
        updateActiveStatus,
        uploadDeathList,
        updateDeathList,
        isFetching,
        isLoading,
        error
      }}
    >
      {children}
    </DeathListContext.Provider>
  )
}

export const useDeathLists = () => {
  const context = useContext(DeathListContext);
  if (!context) throw new Error("useDeathLists must be used within a DeathListProvider");
  return context;
};
