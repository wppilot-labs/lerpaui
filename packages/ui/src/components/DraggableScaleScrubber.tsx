"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { cn } from '../lib/cn';

export interface DraggableScaleScrubberProps {
  min?: number;
  max?: number;
  onChange?: (val: number) => void;
  className?: string;
}

export const DraggableScaleScrubber: React.FC<DraggableScaleScrubberProps> = ({
  min = 10,
  max = 200,
  onChange,
  className,
}) => {
  const [val, setVal] = useState(100);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 20 });

  const handleDrag = (_e: unknown, _info: PanInfo) => {
    // Map drag coordinates to value scale
    const scaleWidth = 800;
    const currentX = x.get();
    const percent = Math.max(0, Math.min(1, -currentX / scaleWidth));
    const targetVal = Math.round(min + percent * (max - min));
    setVal(targetVal);
    onChange?.(targetVal);
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[220px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-between p-4 select-none overflow-hidden', className)}>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Precision Scrubber</span>

      <div className="flex flex-col items-center">
        <h3 className="text-3xl font-black text-primary tabular-nums">{val}</h3>
        <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-widest mt-0.5">Metrics Count</span>
      </div>

      <div className="relative w-full h-12 flex justify-center items-center">
        {/* Selected tick center indicator */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-primary z-20 shadow-md shadow-primary/45" />

        {/* Scrollable Tick Container */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -800, right: 0 }}
          style={{ x: springX }}
          onDrag={handleDrag}
          className="absolute left-1/2 flex items-end gap-1.5 h-10 cursor-grab active:cursor-grabbing touch-x z-10"
        >
          {Array.from({ length: 101 }).map((_, i) => {
            const isMajor = i % 5 === 0;
            return (
              <div
                key={i}
                className={cn('w-0.5 bg-muted-foreground/30 transition-all rounded-full',
                  isMajor ? 'h-6 bg-muted-foreground/50' : 'h-3'
                )}
              />
            );
          })}
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide">Drag metrics scale horizontally</span>
    </div>
  );
};
