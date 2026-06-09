export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  },
  gentleSpring: {
    type: 'spring',
    stiffness: 150,
    damping: 25,
  },
  bouncySpring: {
    type: 'spring',
    stiffness: 400,
    damping: 15,
  },
  smooth: {
    type: 'tween',
    ease: [0.4, 0, 0.2, 1],
    duration: 0.3,
  },
  fast: {
    type: 'tween',
    ease: [0.4, 0, 0.2, 1],
    duration: 0.15,
  },
  slow: {
    type: 'tween',
    ease: [0.4, 0, 0.2, 1],
    duration: 0.5,
  },
} as const;

export const motionConfig = {
  transitions,
} as const;
