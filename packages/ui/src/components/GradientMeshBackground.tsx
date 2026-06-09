"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Animated WebGL-style gradient mesh background built from radial-gradient blobs. */
export interface GradientMeshBackgroundProps {
  className?: string;
  colors?: string[];
  blobCount?: number;
  duration?: number;
  blur?: number;
}

const defaultColors = [
  'rgba(168, 85, 247, 0.55)',
  'rgba(59, 130, 246, 0.55)',
  'rgba(236, 72, 153, 0.5)',
  'rgba(16, 185, 129, 0.45)',
  'rgba(251, 191, 36, 0.5)',
];

export const GradientMeshBackground: React.FC<GradientMeshBackgroundProps> = ({
  className,
  colors = defaultColors,
  blobCount = 5,
  duration = 16,
  blur = 70,
}) => {
  const reduced = usePrefersReducedMotion();
  const blobs = Array.from({ length: blobCount }, (_, i) => ({
    color: colors[i % colors.length] ?? 'rgba(168,85,247,0.5)',
    size: 50 + (i * 13) % 35,
    seed: i,
  }));

  return (
    <div
      aria-hidden
      className={cn('absolute inset-0 overflow-hidden', className)}
      style={{ filter: `blur(${blur}px)` }}
    >
      {blobs.map((b, i) => {
        const baseX = (i * 23) % 100;
        const baseY = (i * 37) % 100;
        return (
          <motion.div
            key={i}
            initial={{ x: `${baseX}%`, y: `${baseY}%` }}
            animate={
              reduced
                ? undefined
                : {
                    x: [`${baseX}%`, `${(baseX + 35) % 100}%`, `${(baseX + 70) % 100}%`, `${baseX}%`],
                    y: [`${baseY}%`, `${(baseY + 50) % 100}%`, `${(baseY + 20) % 100}%`, `${baseY}%`],
                    scale: [1, 1.25, 0.9, 1],
                  }
            }
            transition={{
              duration: duration + (i % 4),
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'loop',
            }}
            className="absolute rounded-full"
            style={{
              width: `${b.size}%`,
              height: `${b.size}%`,
              left: 0,
              top: 0,
              background: `radial-gradient(circle, ${b.color} 0%, transparent 65%)`,
              mixBlendMode: 'screen',
            }}
          />
        );
      })}
    </div>
  );
};
