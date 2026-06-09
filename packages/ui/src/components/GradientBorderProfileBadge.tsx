'use client';

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { Award } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface GradientBorderProfileBadgeProps {
  className?: string;
}

export const GradientBorderProfileBadge: React.FC<GradientBorderProfileBadgeProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Gradient Sweep Badge</span>

      <div
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className="w-full h-[180px] my-auto cursor-pointer flex flex-col items-center justify-center gap-3"
      >
        <div className="relative w-18 h-18 rounded-full flex items-center justify-center">
          {/* Conic rotating border ring */}
          <motion.div
            className="absolute -inset-1 rounded-full pointer-events-none"
            style={{
              background: "conic-gradient(from 0deg, #ec4899, #8b5cf6, #3b82f6, #10b981, #ec4899)",
              padding: "2.5px",
              willChange: prefersReducedMotion ? undefined : 'transform',
            }}
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={prefersReducedMotion ? undefined : { repeat: Infinity, duration: isHovered ? 2 : 4, ease: "linear" }}
          />
          <div className="absolute inset-0.5 rounded-full bg-card flex items-center justify-center border border-border/40 z-10 overflow-hidden">
            <Award className="w-8 h-8 text-primary" />
          </div>
        </div>

        <div className="flex flex-col items-center text-center">
          <h4 className="text-[11px] font-black uppercase tracking-wider text-foreground">Dr. Evelyn Vane</h4>
          <span className="text-[7.5px] text-muted-foreground font-mono uppercase tracking-widest mt-0.5">CHIEF ARCHITECT</span>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover picture to accelerate border sweeps</span>
    </div>
  );
};
