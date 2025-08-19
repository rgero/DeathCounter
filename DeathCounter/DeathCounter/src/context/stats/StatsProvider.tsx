import { StatsContext, StatsContextProps } from "./StatsContext";
import { useEffect, useState } from "react";

import { DeathList } from "../../interfaces/DeathList";
import { useDeathLists } from "../deathCounter/DeathCounterContext";

export const StatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deathCount, setDeathCount] = useState(0);
  const [bossCount, setBossCount] = useState(0);
  const [gameCount, setGameCount] = useState(0);

  const { deathLists } = useDeathLists();

  useEffect(() => {
    const calculateStats = () => {
      deathLists.forEach((list: DeathList) => {
        setBossCount( (prev) => prev + list.entityList.length);
        let deathCountForList = 0;
        list.entityList.forEach((entity) => {
          deathCountForList += entity.deaths;
        });
        setDeathCount((prev) => prev + deathCountForList);
      });
    };

    setGameCount(deathLists.length);
    calculateStats();
  }, [deathLists]);

  const value: StatsContextProps = {
    deathCount,
    bossCount,
    gameCount,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};
