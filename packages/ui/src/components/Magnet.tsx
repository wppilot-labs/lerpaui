"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React, { useRef, useState } from 'react';
import { motion, useSpring} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface MagnetProps {
  children: React.ReactNode;
  className?: string;
  range?: number; // Active hover distance in pixels
  strength?: number; // Pull strength multiplier (e.g. 0.1 to 1)
  active?: boolean;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  className,
  range = 80,
  strength = 0.35,
  active = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [_isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Springs for smooth horizontal and vertical displacements
  const springConfig = { damping: 15, stiffness: 150, mass: 0.6 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active || prefersReducedMotion) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < range) {
      setIsHovered(true);
      // Snap closer to mouse based on distance and strength
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    } else {
      handleMouseLeave();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('inline-block relative', className)}
    >
      <motion.div
        style={prefersReducedMotion ? undefined : { x, y }}
        className="h-full w-full select-none"
      >
        {children}
      </motion.div>
    </div>
  );
};
