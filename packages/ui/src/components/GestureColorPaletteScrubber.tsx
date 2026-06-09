"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring} from "framer-motion";
import { cn } from '../lib/cn';

export interface GestureColorPaletteScrubberProps {
  onSelect?: (hex: string) => void;
  className?: string;
}

export const GestureColorPaletteScrubber: React.FC<GestureColorPaletteScrubberProps> = ({
  onSelect,
  className,
}) => {
  const [activeHex, setActiveHex] = useState('#EC4899');
  const bandX = useMotionValue(0);
  const springX = useSpring(bandX, { stiffness: 350, damping: 25 });

  const colors = [
    '#EF4444', '#F97316', '#F59E0B', '#10B981', '#06B6D4',
    '#3B82F6', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'
  ];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const percent = x / rect.width;
    const targetIdx = Math.max(0, Math.min(colors.length - 1, Math.floor(percent * colors.length)));
    
    setActiveHex(colors[targetIdx]);
    onSelect?.(colors[targetIdx]);
    bandX.set(x - 16);
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[220px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-between p-4 select-none overflow-hidden', className)}>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Color Scrubber</span>

      <div className="flex flex-col items-center gap-1.5">
        <div 
          className="w-14 h-14 rounded-full border-4 border-card shadow-lg transition-colors duration-300"
          style={{ backgroundColor: activeHex }}
        />
        <span className="text-xs font-black text-foreground uppercase tracking-widest tabular-nums">{activeHex}</span>
      </div>

      <div 
        onPointerMove={handlePointerMove}
        className="relative w-full h-8 rounded-xl border border-border/80 bg-card overflow-hidden cursor-crosshair flex items-center p-1 touch-x"
      >
        {/* Colorful gradient blocks */}
        <div className="absolute inset-1 rounded-lg flex overflow-hidden">
          {colors.map((c, i) => (
            <div key={i} className="flex-1 h-full" style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Centered tracking ring bar */}
        <motion.div
          style={{ x: springX }}
          className="absolute w-8 h-8 rounded-full border-4 border-card bg-transparent shadow-lg pointer-events-none z-10"
        />
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide">Drag along chromatic band</span>
    </div>
  );
};
