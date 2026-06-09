'use client';

import React, { useRef } from 'react';
import {motion, useMotionValue, useSpring, type PanInfo } from "framer-motion";
import { cn } from '../lib/cn';

export interface InfiniteCardRibbonLoopProps {
  className?: string;
}

export const InfiniteCardRibbonLoop: React.FC<InfiniteCardRibbonLoopProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 18 });

  const tags = ["AI Models", "Mesh net", "Gateway", "Data Vault", "Block Sync", "API Hub", "Docker", "Cron Node"];

  const handleDrag = (_e: unknown, info: PanInfo) => {
    let newX = x.get() + info.delta.x;
    // Circular infinite loop wrapping
    if (newX > 0) newX = -120;
    else if (newX < -240) newX = 0;
    x.set(newX);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[220px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Continuous Ribbon Loop</span>

      <div 
        ref={containerRef} 
        className="w-full overflow-hidden py-4 flex items-center justify-center"
      >
        <motion.div
          drag="x"
          style={{ x: springX }}
          onDrag={handleDrag}
          className="flex gap-2.5 cursor-grab active:cursor-grabbing touch-none shrink-0"
        >
          {/* Double content array to allow seamless loops */}
          {[...tags, ...tags].map((tag, idx) => (
            <div
              key={idx}
              className="px-3.5 py-2 rounded-xl border border-border bg-card shadow-sm text-[10px] font-black text-foreground uppercase tracking-wider shrink-0 flex items-center gap-1.5 hover:border-primary/45 transition-colors"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span>{tag}</span>
            </div>
          ))}
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Drag ribbons left/right infinitely</span>
    </div>
  );
};
