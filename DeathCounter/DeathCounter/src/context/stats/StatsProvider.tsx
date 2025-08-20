import { StatsContext, StatsContextProps } from "./StatsContext";

import { DeathList } from "../../interfaces/DeathList";
import { useDeathLists } from "../deathCounter/DeathCounterContext";
import {useMemo} from "react";

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {deathLists} = useDeathLists();

  const stats = useMemo<StatsContextProps>(() => {
    let deathCount = 0;
    let bossCount = 0;
    deathLists.forEach((list: DeathList) => {
      bossCount += list.entityList.length;
      list.entityList.forEach((entity) => {
        deathCount += entity.deaths;
      });
    });
    return {
      deathCount,
      bossCount,
      gameCount: deathLists.length,
    };
  }, [deathLists]);

  return <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>;
};
