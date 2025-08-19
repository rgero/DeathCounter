import { createContext, useContext } from "react";

export interface StatsContextProps {
  deathCount: number;
  bossCount: number;
  gameCount: number;
}

export const StatsContext = createContext<StatsContextProps | undefined>(undefined);

export const useStatsProvider = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error("StatsContext was used outside of StatsProvider");
  }
  return context;
};
