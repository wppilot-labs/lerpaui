import { useState, useEffect, useRef, useCallback } from 'react';

export interface Dimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  bottom: number;
  right: number;
  x: number;
  y: number;
}

const defaultDimensions: Dimensions = {
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
};

export function useMeasure<T extends HTMLElement = HTMLElement>() {
  const [dimensions, setDimensions] = useState<Dimensions>(defaultDimensions);
  const elementRef = useRef<T | null>(null);

  const ref = useCallback((node: T | null) => {
    elementRef.current = node;
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const rect = entry.target.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          x: rect.x || rect.left,
          y: rect.y || rect.top,
        });
      }
    });

    observer.observe(element);
    return () => {
      observer.unobserve(element);
    };
  }, [ref]);

  return [ref, dimensions] as const;
}
