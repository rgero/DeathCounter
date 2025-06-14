import React, { useContext } from "react";
import { createDeathList, getDeathLists } from "../services/apiDeathCounter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { DeathList } from "../interfaces/DeathList";
import toast from "react-hot-toast";
import { useAuthenticationContext } from "./AuthenticationContext";

interface DeathListContextType {
  deathLists: DeathList[];
  addDeathList: (deathList: DeathList) => void;
  // removeDeathList: (id: string) => void;
  // updateDeathList: (id: string, updatedDeathList: DeathList) => void;
  // clearDeathLists: () => void;
  // getDeathListById: (id: string) => DeathList | undefined;
  // addMultipleDeathLists: (deathLists: DeathList[]) => void;
  isLoading: boolean;
  error: Error | null;
}

const DeathListContext = React.createContext<DeathListContextType>({
  deathLists: [],
  addDeathList: () => {},
  // removeDeathList: () => {},
  // updateDeathList: () => {},
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

  return (
    <DeathListContext.Provider
      value={{
        deathLists,
        addDeathList: addNewDeathList,
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
