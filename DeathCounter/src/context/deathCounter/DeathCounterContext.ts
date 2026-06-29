import { createContext, useContext } from "react";

import { DeathList } from '@interfaces/DeathList';
import { Entity } from '@interfaces/Entity';

export interface DeathListContextType {
  deathLists: DeathList[];
  activeDeathList: DeathList | undefined;
  entityInEdit: Entity | null | undefined;
  showDescription: boolean;
  toggleDescription: () => void;
  setEntityInEdit: (entity: Entity | null) => void;
  addDeathList: (deathList: DeathList) => Promise<void>;
  addToList: (entity: Entity) => Promise<void>;
  updateActiveStatus: (id: number) => Promise<void>;
  getCurrentlyActiveDeathList: () => DeathList | undefined;
  regenerateToken: () => Promise<string>;
  uploadDeathList: (deathList: DeathList) => Promise<void>;
  updateDeathList: (deathList: DeathList) => Promise<void>;
  removeDeathList: (id: number) => Promise<void>;
  removeEntityFromList: (id: number) => Promise<void>;
  refetch: () => Promise<unknown>;
}

export const DeathListContext = createContext<DeathListContextType | undefined>(undefined);

export const useDeathLists = () => {
  const context = useContext(DeathListContext);
  if (!context) {
    throw new Error("useDeathLists must be used within a DeathListProvider");
  }
  return context;
};

export const useOptionalDeathLists = () => useContext(DeathListContext);
