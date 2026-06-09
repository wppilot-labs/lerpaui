"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { cn } from '../lib/cn';

export interface ScrollProgressPathTracerProps {
  className?: string;
}

export const ScrollProgressPathTracer: React.FC<ScrollProgressPathTracerProps> = ({
  className,
}) => {
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 120, damping: 20 });
  const [percent, setPercent] = useState(0);

  const handleDrag = (_e: unknown, _info: PanInfo) => {
    // Map vertical dragging to vertical progress scroll bar height
    const containerHeight = 120;
    const currentY = y.get();
    const pct = Math.max(0, Math.min(1, currentY / containerHeight));
    setPercent(Math.round(pct * 100));
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[340px] bg-secondary/5 rounded-2xl border border-border flex flex-col justify-between p-4 select-none overflow-hidden', className)}>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest text-center">Path Scroll Tracer</span>

      <div className="flex-1 flex gap-4 items-center justify-center mt-2">
        {/* Scroll path tracks container */}
        <div className="relative w-10 h-36 border border-border/60 rounded-full flex justify-center p-1 bg-card/65">
          <svg className="absolute inset-0 w-full h-full">
            <line
              x1="20"
              y1="10"
              x2="20"
              y2="134"
              stroke="currentColor"
              className="text-border/40"
              strokeWidth="2"
            />
            <motion.line
              x1="20"
              y1="10"
              x2="20"
              y2={10 + (percent / 100) * 124}
              stroke="currentColor"
              className="text-primary drop-shadow-[0_0_6px_rgba(59,130,246,0.65)]"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Graggable thumb node */}
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 120 }}
            style={{ y: springY }}
            onDrag={handleDrag}
            className="w-6 h-6 rounded-full border-2 border-primary bg-card cursor-grab active:cursor-grabbing shadow-md z-15 flex items-center justify-center touch-y"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          </motion.div>
        </div>

        <div className="flex flex-col">
          <span className="text-xl font-black text-primary leading-none tabular-nums">{percent}%</span>
          <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-widest mt-1">Scroll Sync</span>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Drag vertical slider to trace</span>
    </div>
  );
};
