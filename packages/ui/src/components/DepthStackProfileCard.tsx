'use client';

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles, User, Layers } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface DepthStackProfileCardProps {
  className?: string;
}

export const DepthStackProfileCard: React.FC<DepthStackProfileCardProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);
  const springTransition = prefersReducedMotion ? { duration: 0 } : { type: "spring" as const, stiffness: 180, damping: 18 };
  const willChangeTransform = { willChange: prefersReducedMotion ? undefined : 'transform' as const };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Depth Stack Profile Card</span>

      <div
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className="relative w-full h-[180px] my-auto cursor-pointer flex items-center justify-center"
      >
        {/* Layer 3 - Deepest sheet */}
        <motion.div
          animate={prefersReducedMotion ? undefined : (isHovered ? { y: -20, scale: 0.88, rotate: -4, opacity: 0.3 } : { y: 0, scale: 0.94, rotate: 0, opacity: 0 })}
          className="absolute w-[94%] h-full rounded-2xl border border-border/40 bg-card shadow-sm z-0"
          transition={springTransition}
          style={willChangeTransform}
        />

        {/* Layer 2 - Middle sheet */}
        <motion.div
          animate={prefersReducedMotion ? undefined : (isHovered ? { y: -10, scale: 0.94, rotate: 4, opacity: 0.6 } : { y: 0, scale: 0.98, rotate: 0, opacity: 0 })}
          className="absolute w-[98%] h-full rounded-2xl border border-border/40 bg-card/85 shadow-md z-10"
          transition={springTransition}
          style={willChangeTransform}
        />

        {/* Layer 1 - Main frontmost sheet */}
        <motion.div
          animate={prefersReducedMotion ? undefined : (isHovered ? { scale: 1.02, y: 5 } : { scale: 1, y: 0 })}
          className="relative w-full h-full border border-border rounded-2xl bg-card shadow-xl p-4 flex flex-col justify-between z-20 bg-gradient-to-tr from-card to-secondary/10"
          transition={springTransition}
          style={willChangeTransform}
        >
          <div className="flex justify-between items-start w-full">
            <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-secondary">
              <User className="w-4 h-4 text-foreground/80" />
            </div>
            <div className="flex items-center gap-1 bg-white/5 border border-border/40 px-2 py-0.5 rounded">
              <Layers className="w-3 h-3 text-primary" />
              <span className="text-[7px] font-mono uppercase text-foreground/80">3 SHEETS</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">OPERATIONS PRINCIPAL</span>
            <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Clara Oswald</h4>
            <p className="text-[9px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
              Oversees visual block composer architectures and premium theme synchronization.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1">
            <span className="text-[7px] font-mono text-muted-foreground">clara@core.ai</span>
            <Sparkles className="w-3.5 h-3.5 text-primary opacity-80" />
          </div>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover card to slide out stacked backing sheets</span>
    </div>
  );
};
