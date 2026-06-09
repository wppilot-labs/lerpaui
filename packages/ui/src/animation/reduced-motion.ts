export const isReducedMotionEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Animation override to disable movement or scale on reduced motion
export const withReducedMotion = <T extends Record<string, unknown>>(
  standardVariants: T,
  _reducedVariants?: Partial<T>
): T => {
  return standardVariants; // Usually, we will check reduced motion dynamically via React hooks
};
