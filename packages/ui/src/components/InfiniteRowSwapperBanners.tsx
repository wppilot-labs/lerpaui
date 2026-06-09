'use client';

import React from 'react';
import { motion} from "framer-motion";
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface InfiniteRowSwapperBannersProps {
  className?: string;
}

export const InfiniteRowSwapperBanners: React.FC<InfiniteRowSwapperBannersProps> = ({ className }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const row1 = ["Vercel", "Next.js", "Docker", "SaaS Hub", "Docker"];
  const row2 = ["Framer", "React", "Node", "Pnpm", "Node"];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[220px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Dual Opposing Loops</span>

      <div className="w-full flex flex-col gap-3 overflow-hidden py-1">
        {/* Row 1: Sliding Left */}
        <div className="w-full overflow-hidden flex gap-2">
          <motion.div
            animate={prefersReducedMotion ? { x: 0 } : { x: [0, -180] }}
            transition={prefersReducedMotion ? { duration: 0 } : { repeat: Infinity, duration: 8, ease: "linear" }}
            className="flex gap-2 shrink-0"
          >
            {[...row1, ...row1].map((tag, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg border border-border/60 bg-card text-[9px] font-black text-foreground uppercase tracking-wide shrink-0 shadow-sm"
              >
                {tag}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Row 2: Sliding Right */}
        <div className="w-full overflow-hidden flex gap-2">
          <motion.div
            animate={prefersReducedMotion ? { x: 0 } : { x: [-180, 0] }}
            transition={prefersReducedMotion ? { duration: 0 } : { repeat: Infinity, duration: 8, ease: "linear" }}
            className="flex gap-2 shrink-0"
          >
            {[...row2, ...row2].map((tag, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-lg border border-border/60 bg-card text-[9px] font-black text-foreground uppercase tracking-wide shrink-0 shadow-sm"
              >
                {tag}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Seamless dual loops run continuously in 3D</span>
    </div>
  );
};
