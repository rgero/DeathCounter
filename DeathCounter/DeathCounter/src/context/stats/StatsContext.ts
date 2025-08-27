import { createContext, useContext } from "react";

export interface Stats {
  totalEntities: number;
  totalDeaths: number;
  averageDeaths: number;
  topEntity?: { name: string; deaths: number; listName: string };
}

export const StatsContext = createContext<Stats | undefined>(undefined);

export const useStatsProvider = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStatsProvider must be used within a StatsProvider");
  }
  return context;
};
