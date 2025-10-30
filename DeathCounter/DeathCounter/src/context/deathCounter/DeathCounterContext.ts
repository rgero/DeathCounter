import { createContext, useContext } from "react";

import { DeathList } from '@interfaces/DeathList';
import { Entity } from '@interfaces/Entity';

export interface DeathListContextType {
  deathLists: DeathList[];
  activeDeathList: DeathList | undefined;
  entityInEdit: Entity | undefined;
  showDescription: boolean;
  toggleDescription: () => void;
  setEntityInEdit: (entity: Entity | null) => void;
  addDeathList: (deathList: DeathList) => void;
  addToList: (entity: Entity) => void;
  updateActiveStatus: (id: number) => void;
  getCurrentlyActiveDeathList: () => DeathList | undefined;
  regenerateToken: () => void;
  uploadDeathList: (deathList: DeathList) => void;
  updateDeathList: (deathList: DeathList) => void;
  removeDeathList: (id: number) => void;
  removeEntityFromList: (id: number) => void;
  isFetching: boolean;
  isLoading: boolean;
  error: Error | null;
}

export const DeathListContext = createContext<DeathListContextType | undefined>(undefined);

export const useDeathLists = () => {
  const context = useContext(DeathListContext);
  if (!context) {
    throw new Error("useDeathLists must be used within a DeathListProvider");
  }
  return context;
};
