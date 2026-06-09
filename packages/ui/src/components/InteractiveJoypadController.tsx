"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring} from "framer-motion";
import { cn } from '../lib/cn';

export interface InteractiveJoypadControllerProps {
  onMove?: (coords: { x: number; y: number }) => void;
  className?: string;
}

export const InteractiveJoypadController: React.FC<InteractiveJoypadControllerProps> = ({
  onMove,
  className,
}) => {
  const joyX = useMotionValue(0);
  const joyY = useMotionValue(0);
  const springX = useSpring(joyX, { stiffness: 350, damping: 25 });
  const springY = useSpring(joyY, { stiffness: 350, damping: 25 });

  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleDrag = () => {
    const currentX = joyX.get();
    const currentY = joyY.get();
    // Normalize coordinates between -1 and 1
    const normalizedX = Number((currentX / 48).toFixed(2));
    const normalizedY = Number((currentY / 48).toFixed(2));
    setCoords({ x: normalizedX, y: normalizedY });
    onMove?.({ x: normalizedX, y: normalizedY });
  };

  const handleDragEnd = () => {
    joyX.set(0);
    joyY.set(0);
    setCoords({ x: 0, y: 0 });
    onMove?.({ x: 0, y: 0 });
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[280px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-center select-none overflow-hidden p-4', className)}>
      <span className="absolute top-3 text-[9px] text-muted-foreground font-black uppercase tracking-widest">Joypad Controller</span>

      <div className="relative w-36 h-36 rounded-full border border-border/60 bg-secondary/25 flex items-center justify-center shadow-inner">
        {/* Dynamic coordinate crosshair lines */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10">
          <div className="w-full h-0.5 bg-foreground" />
          <div className="absolute h-full w-0.5 bg-foreground" />
        </div>

        {/* Thumb stick stick handle */}
        <motion.div
          drag
          dragConstraints={{ left: -48, right: 48, top: -48, bottom: 48 }}
          dragElastic={0.05}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{ x: springX, y: springY }}
          className="w-16 h-16 rounded-full border-4 border-border bg-card flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xl relative z-10 touch-none active:scale-95 transition-transform"
        >
          {/* Internal thumb grip details */}
          <div className="w-8 h-8 rounded-full border border-border/80 bg-secondary/20 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-3 flex gap-4 text-[10px] font-black text-primary uppercase tracking-wider">
        <span>X: {coords.x}</span>
        <span>Y: {coords.y}</span>
      </div>
    </div>
  );
};
