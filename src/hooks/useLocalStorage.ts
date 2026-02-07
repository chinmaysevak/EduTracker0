// ============================================
// Custom Hook for LocalStorage Persistence
// ============================================

import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to persist state in localStorage
 * @param key - localStorage key
 * @param initialValue - Default value if no data exists
 * @returns [storedValue, setValue] tuple
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // Get initial value from localStorage or use default
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save to state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Hook to clear all Edu Tracker data from localStorage
 */
export function useClearAllData() {
  const clearAllData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const keysToRemove = [
      'edu-tracker-subjects',
      'edu-tracker-attendance',
      'edu-tracker-timetable',
      'edu-tracker-materials',
      'edu-tracker-playlists',
      'edu-tracker-tasks',
      'edu-tracker-progress'
    ];
    
    keysToRemove.forEach(key => {
      window.localStorage.removeItem(key);
    });
    
    window.location.reload();
  }, []);

  return clearAllData;
}
