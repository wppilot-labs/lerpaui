"use client";

import React from 'react';
import { motion} from "framer-motion";
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface MobileLoaderElasticRopeProps {
  className?: string;
  color?: string;
}

export const MobileLoaderElasticRope: React.FC<MobileLoaderElasticRopeProps> = ({
  className,
  color = 'stroke-primary',
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div className={cn('relative flex items-center justify-center w-20 h-20 select-none', className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 60 60">
        {/* Static base circle track */}
        <circle
          cx="30"
          cy="30"
          r="22"
          className="stroke-muted/15"
          strokeWidth="3"
          fill="none"
        />

        {/* Elastic stretching loading rope */}
        <motion.circle
          cx="30"
          cy="30"
          r="22"
          className={cn('fill-none', color)}
          strokeWidth="3.5"
          strokeLinecap="round"
          animate={prefersReducedMotion ? {} : {
            strokeDasharray: ['15, 120', '90, 120', '15, 120'],
            strokeDashoffset: [0, -35, -135],
            rotate: [0, 360],
          }}
          transition={prefersReducedMotion ? { duration: 0 } : {
            repeat: Infinity,
            duration: 2,
            ease: 'easeInOut',
          }}
        />
      </svg>
    </div>
  );
};
