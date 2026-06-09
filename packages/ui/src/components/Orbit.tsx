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

interface OrbitProps {
  className?: string;
  duration?: number;
  direction?: 'clockwise' | 'counter-clockwise';
  radius?: number;
  showTrack?: boolean;
  delay?: number;
  children: React.ReactNode;
}

export const Orbit: React.FC<OrbitProps> = ({
  className,
  duration = 20,
  direction = 'clockwise',
  radius = 80,
  showTrack = true,
  delay = 0,
  children,
}) => {
  const rotationAngle = direction === 'clockwise' ? 360 : -360;
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Circle Track */}
      {showTrack && (
        <div
          style={{ width: radius * 2, height: radius * 2 }}
          className="absolute rounded-full border border-dashed border-border/40 bg-transparent"
        />
      )}

      {/* Rotating Wrapper */}
      <motion.div
        style={
          {
            width: radius * 2,
            height: radius * 2,
            '--radius': `${radius}px`,
          } as React.CSSProperties
        }
        className={cn('absolute flex items-center justify-center', className)}
        initial={{ rotate: 0 }}
        animate={prefersReducedMotion ? undefined : { rotate: rotationAngle }}
        transition={prefersReducedMotion ? undefined : {
          repeat: Infinity,
          duration: duration,
          ease: 'linear',
          delay: delay,
        }}
      >
        {/* Position child precisely on the track edge (at top) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
          {/* Counter-rotate nested child so it stays upright */}
          <motion.div
            initial={{ rotate: 0 }}
            animate={prefersReducedMotion ? undefined : { rotate: -rotationAngle }}
            transition={prefersReducedMotion ? undefined : {
              repeat: Infinity,
              duration: duration,
              ease: 'linear',
              delay: delay,
            }}
          >
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
