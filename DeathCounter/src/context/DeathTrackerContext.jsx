/* eslint-disable react/prop-types */

import { createContext, useContext } from "react";

import { useLocalStorageState } from "../hooks/useLocalStorage";

const DeathTrackerContext = createContext();

const DeathTrackerProvider = ({ children }) => {
  const [deathList, setDeathList] = useLocalStorageState([])

  const addToList = (newItem) => {
    if (newItem.id)
    {
      let index = deathList.findIndex(boss => boss.id === newItem.id);
      let newDeathList = deathList;
      newDeathList[index] = newItem;
      setDeathList( [...newDeathList]);
    } else {
      newItem.id = deathList.length + 1;
      setDeathList( (prev) => [...prev, newItem]);
    }
  }
  
  const clearItems = () => {
    setDeathList([])
  }

  const deleteItem = (id) => {
    setDeathList( (prev) => prev.filter(item => item.id !== id) );
  }

  const setItems = (newData) => {
    // I definitely should be verifying the data here.
    setDeathList([...newData])
  }

  return (
    <DeathTrackerContext.Provider value={{ deathList, addToList, clearItems, deleteItem, setItems }}>
      {children}
    </DeathTrackerContext.Provider>
  );
}

const useDeathTracker = () => {
  const context = useContext(DeathTrackerContext);
  if (context === undefined) throw new Error("Death Tracker Context was used outside of Death Tracker Provider");
  return context;
}

export { DeathTrackerProvider, useDeathTracker };
