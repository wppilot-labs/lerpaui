"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface GlitchTextProps {
  text: string;
  className?: string;
  speed?: number; // Jitter frequency in seconds
  active?: boolean; // If true, glitches continuously. If false, glitches on hover.
}

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  className,
  speed = 0.4,
  active = false,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Infinite keyframe loops for x, y offsets and clip paths to create the glitch effect
  const redGlitchVariants = {
    glitch: {
      x: [0, -3, 2, -1, 3, -2, 0],
      y: [0, 1, -2, 2, -1, 1, 0],
      clipPath: [
        'inset(40% 0 61% 0)',
        'inset(92% 0 1% 0)',
        'inset(5% 0 85% 0)',
        'inset(57% 0 23% 0)',
        'inset(15% 0 80% 0)',
        'inset(80% 0 5% 0)',
        'inset(0% 0 0% 0)',
      ],
      transition: {
        duration: speed,
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'linear',
      },
    },
    idle: {
      x: 0,
      y: 0,
      clipPath: 'inset(0% 0 0% 0)',
    },
  };

  const blueGlitchVariants = {
    glitch: {
      x: [0, 2, -3, 1, -2, 3, 0],
      y: [0, -2, 1, -1, 2, -2, 0],
      clipPath: [
        'inset(25% 0 58% 0)',
        'inset(78% 0 12% 0)',
        'inset(12% 0 78% 0)',
        'inset(43% 0 32% 0)',
        'inset(85% 0 5% 0)',
        'inset(5% 0 88% 0)',
        'inset(0% 0 0% 0)',
      ],
      transition: {
        duration: speed * 0.9, // Slightly out of sync for organic feel
        repeat: Infinity,
        repeatType: 'reverse' as const,
        ease: 'linear',
      },
    },
    idle: {
      x: 0,
      y: 0,
      clipPath: 'inset(0% 0 0% 0)',
    },
  };

  if (prefersReducedMotion) {
    return (
      <span className={cn(
        'relative inline-block font-black uppercase tracking-wider cursor-default select-none text-foreground',
        className
      )}>
        {text}
      </span>
    );
  }

  return (
    <motion.span
      className={cn(
        'relative inline-block font-black uppercase tracking-wider cursor-default select-none text-foreground',
        className
      )}
      whileHover={!active ? 'glitch' : undefined}
      animate={active ? 'glitch' : 'idle'}
    >
      {/* Base Text */}
      <span className="relative z-10">{text}</span>

      {/* Red/Cyan Offset Layer */}
      <motion.span
        variants={redGlitchVariants}
        className="absolute top-0 left-0 w-full h-full text-[#00ffff] opacity-75 z-0 select-none pointer-events-none mix-blend-screen"
        style={{ textShadow: '-1px 0 #00ffff' }}
      >
        {text}
      </motion.span>

      {/* Blue/Magenta Offset Layer */}
      <motion.span
        variants={blueGlitchVariants}
        className="absolute top-0 left-0 w-full h-full text-[#ff00ff] opacity-75 z-0 select-none pointer-events-none mix-blend-screen"
        style={{ textShadow: '1px 0 #ff00ff' }}
      >
        {text}
      </motion.span>
    </motion.span>
  );
};
