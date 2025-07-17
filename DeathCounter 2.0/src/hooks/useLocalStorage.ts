import { useEffect, useState } from "react";

export const useLocalStorage = (initialState: object|undefined, key: string) => {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    if (!storedValue || storedValue.trim() === '') {
      return initialState;
    }
    
    try {
      const parsedValue = JSON.parse(storedValue);
      return parsedValue;
    } catch (error) {
      console.warn(`Failed to parse localStorage value for key "${key}":`, error);
      return initialState;
    }
  });

  useEffect(
    () => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );

  return [value, setValue];
}
