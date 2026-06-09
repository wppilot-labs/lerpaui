import { useState, useCallback, useRef, useEffect } from 'react';

export interface UseControllableStateProps<T> {
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
}

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateProps<T>): [T, (val: T | ((prev: T) => T)) => void] {
  const isControlled = value !== undefined;
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const [uncontrolledValue, setUncontrolledValue] = useState<T>(
    defaultValue as T
  );

  const activeValue = isControlled ? (value as T) : uncontrolledValue;

  const setValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      const nextValue = next instanceof Function ? next(activeValue) : next;

      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }

      if (onChangeRef.current && nextValue !== activeValue) {
        onChangeRef.current(nextValue);
      }
    },
    [isControlled, activeValue]
  );

  return [activeValue, setValue];
}
