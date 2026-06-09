"use client";

import React from 'react';
import { motion} from "framer-motion";
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface OrbitsMobileLoaderProps {
  className?: string;
  glow?: boolean;
}

export const OrbitsMobileLoader: React.FC<OrbitsMobileLoaderProps> = ({
  className,
  glow = true,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div className={cn('relative flex items-center justify-center w-24 h-24 select-none', className)}>
      {/* Center glowing core */}
      <div className={cn('w-4 h-4 rounded-full bg-primary', glow && 'animate-pulse')} style={glow ? { boxShadow: '0 0 15px rgba(var(--primary-rgb), 0.5)' } : undefined} />

      {/* Orbit ring 1 */}
      <motion.div
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={prefersReducedMotion ? { duration: 0 } : { repeat: Infinity, duration: 2, ease: 'linear' }}
        className="absolute w-12 h-12 rounded-full border border-dashed border-primary/40 flex items-start justify-center"
      >
        <span className="w-1.5 h-1.5 bg-primary rounded-full -mt-[3px]" />
      </motion.div>

      {/* Orbit ring 2 */}
      <motion.div
        animate={prefersReducedMotion ? {} : { rotate: -360 }}
        transition={prefersReducedMotion ? { duration: 0 } : { repeat: Infinity, duration: 3.5, ease: 'linear' }}
        className="absolute w-18 h-18 rounded-full border border-dotted border-purple-500/30 flex items-end justify-center"
      >
        <span className="w-2 h-2 bg-purple-500 rounded-full -mb-[4px] shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
      </motion.div>

      {/* Orbit ring 3 */}
      <motion.div
        animate={prefersReducedMotion ? {} : { rotate: 360 }}
        transition={prefersReducedMotion ? { duration: 0 } : { repeat: Infinity, duration: 5, ease: 'linear' }}
        className="absolute w-24 h-24 rounded-full border border-dashed border-emerald-500/25 flex items-center justify-start"
      >
        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full -ml-[3px]" />
      </motion.div>
    </div>
  );
};
