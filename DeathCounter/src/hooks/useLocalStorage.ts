import { useEffect, useState } from "react";

export const useLocalStorage = (initialState: object|undefined, key: string) => {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(key);
    
    if (!storedValue || storedValue.trim() === '') {
      return initialState;
    }
    
    // Handle cases where the stored value might be just whitespace or invalid characters
    if (storedValue.trim() === 'undefined' || storedValue.trim() === 'null') {
      localStorage.removeItem(key); // Clean up invalid entries
      return initialState;
    }
    
    try {
      const parsedValue = JSON.parse(storedValue);
      return parsedValue;
    } catch (error) {
      console.warn(`Failed to parse localStorage value for key "${key}":`, error);
      console.warn(`Stored value was:`, storedValue);
      // Clear the corrupted entry
      localStorage.removeItem(key);
      return initialState;
    }
  });

  useEffect(
    () => {
      try {
        if (value === undefined || value === null) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      } catch (error) {
        console.warn(`Failed to store value in localStorage for key "${key}":`, error);
      }
    },
    [value, key]
  );

  return [value, setValue];
}
