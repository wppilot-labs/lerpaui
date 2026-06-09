"use client";

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface GlowPathDrawingProgressProps {
  className?: string;
}

export const GlowPathDrawingProgress: React.FC<GlowPathDrawingProgressProps> = ({
  className,
}) => {
  const [hoverDist, setHoverDist] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = x / rect.width;
    setHoverDist(percent);
  }, [prefersReducedMotion]);

  const handleLeave = useCallback(() => setHoverDist(0), []);

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handleLeave}
      role="progressbar"
      aria-label="Proximity progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(hoverDist * 100)}
      className={cn('relative w-full max-w-[280px] h-[280px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-between p-4 select-none overflow-hidden cursor-pointer touch-x', className)}
    >
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Proximity Pathway</span>

      <div className="relative w-36 h-36 flex items-center justify-center">
        {/* Draw complex SVG circuit board track path */}
        <svg width="144" height="144" className="overflow-visible">
          {/* Base non-glowing path track */}
          <path
            d="M 12 72 Q 72 12 132 72 Q 72 132 12 72 Z"
            fill="none"
            stroke="currentColor"
            className="text-border/40"
            strokeWidth="3"
          />

          {/* Glowing track showing coordinate progress */}
          <motion.path
            d="M 12 72 Q 72 12 132 72 Q 72 132 12 72 Z"
            fill="none"
            stroke="currentColor"
            className="text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.65)]"
            strokeWidth="4"
            strokeDasharray="400"
            strokeDashoffset={400 - hoverDist * 400}
            strokeLinecap="round"
            style={{ willChange: prefersReducedMotion ? undefined : 'stroke-dashoffset', transition: prefersReducedMotion ? 'none' : undefined }}
          />
        </svg>

        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-black text-primary">{Math.round(hoverDist * 100)}%</span>
          <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-widest">Pathway</span>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide">Hover or drag to light pathway</span>
    </div>
  );
};
