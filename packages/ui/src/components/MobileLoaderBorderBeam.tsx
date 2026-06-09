"use client";

import React from 'react';
import { motion} from "framer-motion";
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface MobileLoaderBorderBeamProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const MobileLoaderBorderBeam: React.FC<MobileLoaderBorderBeamProps> = ({
  className,
  size = 64,
  strokeWidth = 3,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  return (
    <div className={cn('relative flex items-center justify-center select-none', className)} style={{ width: size, height: size }}>
      <svg className="w-full h-full transform -rotate-90">
        {/* Track border */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-muted/20"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Glowing sweep laser */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-primary"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          fill="none"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 4px oklch(var(--p)))',
          }}
          animate={prefersReducedMotion ? {} : {
            strokeDashoffset: [circumference, 0],
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
        />
      </svg>
      
      {/* Visual pulse inner */}
      <span className="absolute w-2 h-2 rounded-full bg-primary animate-ping" />
    </div>
  );
};
