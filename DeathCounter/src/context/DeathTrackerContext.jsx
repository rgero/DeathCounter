/* eslint-disable react/prop-types */

import { createContext, useContext, useState } from "react";

import { useLocalStorageState } from "../hooks/useLocalStorage";

const DeathTrackerContext = createContext();

const DeathTrackerProvider = ({ children }) => {

  const [deathList, setDeathList] = useLocalStorageState([], "deathList")
  const [gameName, setGameName] = useLocalStorageState("", "gameName");
  const [currentlySelected, setCurrentlySelected] = useState(null);


  const addToList = (newItem) => {
    if (newItem.id)
    {
      let index = deathList.findIndex(boss => boss.id === newItem.id);
      let newDeathList = deathList;
      newDeathList[index] = newItem;
      setDeathList( [...newDeathList]);
    } else {

      newItem.id = 1;
      if (deathList.length > 0)
      {
        const highestIDObject = deathList.reduce((max, obj) => (obj.id > max.id ? obj : max));
        newItem.id = highestIDObject.id + 1;
      }
      setDeathList( (prev) => [...prev, newItem]);
    }
  }
  
  const clearItems = () => {
    setDeathList([])
    setGameName("")
  }

  const deleteItem = (id) => {
    setDeathList( (prev) => prev.filter(item => item.id !== id) );
    setCurrentlySelected(null);
  }

  const setItems = (newData) => {
    // I definitely should be verifying the data here.
    setDeathList([...newData])
  }

  const filterList = (term) => {
    if (!term) { return deathList; }
    return deathList.filter( item => item.name.toUpperCase().includes(term.toUpperCase()) );
  }

  const incrementGenericDeath = () => {
    let newDeathList = deathList.map(item => {
      if (item.name === "General Deaths") {
        return { ...item, deaths: item.deaths + 1 };
      }
      return item;
    });

    // If the item does not exist, add it to the list
    if (!newDeathList.some(item => item.name === "General Deaths")) {
      newDeathList.push({ name: "General Deaths", deaths: 1 });
    }

    setDeathList(newDeathList);
  }

  return (
    <DeathTrackerContext.Provider value={{ gameName, setGameName, incrementGenericDeath, deathList, currentlySelected, addToList, clearItems, deleteItem, filterList, setItems, setCurrentlySelected }}>
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
