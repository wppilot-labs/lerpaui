import { usePrefersReducedMotion } from '../animation/hooks';

export function useReducedMotionSafe<T extends Record<string, unknown>>(
  standardVariants: T,
  reducedMotionOverrides?: Partial<T>
): T {
  const prefersReduced = usePrefersReducedMotion();

  if (!prefersReduced) {
    return standardVariants;
  }

  // Create a copy of the variants and zero out transition motion (x, y, scale, etc.)
  const result = { ...standardVariants };
  for (const key in result) {
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const variant = result[key];
      if (typeof variant === 'object' && variant !== null) {
        // Create an overridden version of this variant
        const override = reducedMotionOverrides?.[key] || {};
        result[key] = {
          ...variant,
          // Zero-out typical motion values if no specific override is supplied
          x: 0,
          y: 0,
          scale: 1,
          rotate: 0,
          skewX: 0,
          skewY: 0,
          ...override,
          transition: { duration: 0.01 }, // extremely fast transition
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
      }
    }
  }

  return result;
}
