import React, { useMemo } from "react";
import { Stats, StatsContext } from "./StatsContext";

import { useDeathLists } from "../deathCounter/DeathCounterContext";

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { deathLists } = useDeathLists();

  const stats = useMemo<Stats>(() => {
    if (!deathLists || deathLists.length === 0) {
      return { totalEntities: 0, totalDeaths: 0, averageDeaths: 0 };
    }

    let totalEntities = 0;
    let totalDeaths = 0;
    let topEntity: { name: string; deaths: number; listName: string } | undefined;

    for (const list of deathLists) {
      for (const e of list.entityList) {
        totalEntities += 1;
        totalDeaths += e.deaths ?? 0;

        if (!topEntity || e.deaths > topEntity.deaths) {
          topEntity = { name: e.name, deaths: e.deaths, listName: list.name };
        }
      }
    }

    const averageDeaths = totalEntities > 0 ? totalDeaths / totalEntities : 0;

    return { totalEntities, totalDeaths, averageDeaths, topEntity };
  }, [deathLists]);

  return <StatsContext.Provider value={stats}>{children}</StatsContext.Provider>;
};
