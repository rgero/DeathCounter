import React, { useContext } from "react";
import { createDeathList, getDeathLists, removeDeathList as removeDeathListAPI, updateActiveDeathList, updateDeathList as updateDeathListAPI, updateDeathListToken, uploadDeathList as uploadDeathListAPI } from "../services/apiDeathCounter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeathList } from "../interfaces/DeathList";
import toast from "react-hot-toast";
import { useAuthenticationContext } from "./AuthenticationContext";
import { v4 as uuidv4 } from 'uuid';

interface DeathListContextType {
  deathLists: DeathList[];
  addDeathList: (deathList: DeathList) => void;
  updateActiveStatus: (id: number) => void;
  getCurrentlyActiveDeathList: () => DeathList | undefined;
  regenerateToken: () => void;
  uploadDeathList: (deathList: DeathList) => void;
  updateDeathList: (deathList: DeathList) => void;
  removeDeathList: (id: number) => void;
  // clearDeathLists: () => void;
  // getDeathListById: (id: string) => DeathList | undefined;
  // addMultipleDeathLists: (deathLists: DeathList[]) => void;
  isLoading: boolean;
  error: Error | null;
}

const DeathListContext = React.createContext<DeathListContextType>({
  deathLists: [],
  addDeathList: () => {},
  updateActiveStatus: () => {},
  getCurrentlyActiveDeathList: () => undefined,
  regenerateToken: () => {},
  uploadDeathList: () => {},
  updateDeathList: () => {},
  removeDeathList: () => {},
  // clearDeathLists: () => {},
  // getDeathListById: () => undefined,
  // addMultipleDeathLists: () => {}
  isLoading: false,
  error: null,
});

export const DeathListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const {user} = useAuthenticationContext();

  const { data: deathLists = [], error, isLoading, refetch } = useQuery({
    queryKey: ["death_counters"],
    queryFn: () => getDeathLists(),
  });

  const { mutateAsync: addNewDeathList } = useMutation({
    mutationFn: async (deathList: DeathList) => {
      if (!user) { throw new Error("User not authenticated"); }
      deathList = { ...deathList, owner_id: user.id };
      if (!deathList.id) delete deathList.id;
      await createDeathList(deathList);
    },
    onSuccess: () => {
      toast.success("Death List added successfully!");
      queryClient.invalidateQueries({ queryKey: ["death_counters"] });
      refetch();
    },
  });

  const { mutateAsync: updateDeathList } = useMutation({
    mutationFn: async (deathList: DeathList) => {
      await updateDeathListAPI(deathList);
    },
    onSuccess: () => {
      toast.success("Death List updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["death_counters"] });
      refetch();
    },
  });

  const {mutateAsync: removeDeathList} = useMutation({
    mutationFn: async (id: number) => {
      await removeDeathListAPI(id);
    },
    onSuccess: () => {
      toast.success("Death List removed successfully!");
      queryClient.invalidateQueries({ queryKey: ["death_counters"] });
      refetch();
    }
  });

  const {mutateAsync: uploadDeathList} = useMutation({
    mutationFn: async (deathList: DeathList) => {
      await uploadDeathListAPI(deathList);
    },
    onSuccess: () => {
      toast.success("Death List uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["death_counters"] });
      refetch();
    }
  });

  const getCurrentlyActiveDeathList = () => {
    return deathLists.find((deathList) => deathList.currentlyActive);
  }
  
  const { mutateAsync: updateActiveStatus } = useMutation({
    mutationFn: async (id: number) => {
      const currentlyActiveDeathList = getCurrentlyActiveDeathList();

      if (currentlyActiveDeathList) {
        if (currentlyActiveDeathList.id)
        {
          await updateActiveDeathList(currentlyActiveDeathList.id, false);
        }
      }
      await updateActiveDeathList(id, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["death_counters"] });
      refetch();
    },
  })

  const { mutateAsync: regenerateToken } = useMutation({
    mutationFn: async () => {
      const currentlyActiveDeathList = getCurrentlyActiveDeathList();
      if (!currentlyActiveDeathList || !currentlyActiveDeathList.id) {
        throw new Error("No active death list found to regenerate token");
      }

      const newToken = uuidv4();
      await updateDeathListToken(currentlyActiveDeathList.id, newToken);
    },
    onSuccess: () => {
      toast.success("Token regenerated successfully!");
      queryClient.invalidateQueries({ queryKey: ["death_counters"] });
      refetch();
    },
  });



  return (
    <DeathListContext.Provider
      value={{
        deathLists,
        addDeathList: addNewDeathList,
        getCurrentlyActiveDeathList,
        regenerateToken,
        removeDeathList,
        updateActiveStatus,
        uploadDeathList,
        updateDeathList,
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
