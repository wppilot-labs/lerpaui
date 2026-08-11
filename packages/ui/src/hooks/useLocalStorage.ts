import { useState, useEffect, useCallback, useRef } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Read value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      if (
        (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !==
        'production'
      ) {
        // eslint-disable-next-line no-console
        console.warn(`Error reading localStorage key "${key}":`, error);
      }
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);
  const valueRef = useRef(storedValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          typeof value === 'function' ? (value as (current: T) => T)(valueRef.current) : value;
        valueRef.current = valueToStore;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        if (
          (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !==
          'production'
        ) {
          // eslint-disable-next-line no-console
          console.warn(`Error setting localStorage key "${key}":`, error);
        }
      }
    },
    [key]
  );

  useEffect(() => {
    const nextValue = readValue();
    valueRef.current = nextValue;
    setStoredValue(nextValue);
  }, [readValue]);

  return [storedValue, setValue];
}
