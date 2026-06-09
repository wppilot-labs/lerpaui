"use client";

import React, { useRef, useState } from 'react';
import { motion} from "framer-motion";
import { Gauge, Activity } from 'lucide-react';
import { cn } from '../lib/cn';

export interface RadialProgressDraggableProps {
  onProgressChange?: (percent: number) => void;
  className?: string;
}

export const RadialProgressDraggable: React.FC<RadialProgressDraggableProps> = ({
  onProgressChange,
  className,
}) => {
  const [percent, setPercent] = useState(65);
  const containerRef = useRef<HTMLDivElement>(null);

  const calculateProgress = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    
    const angleRad = Math.atan2(py - cy, px - cx);
    let angleDeg = (angleRad * 180) / Math.PI + 90; // offset rotating starting point
    if (angleDeg < 0) angleDeg += 360;

    const value = Math.round((angleDeg / 360) * 100);
    setPercent(value);
    onProgressChange?.(value);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    calculateProgress(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1) {
      calculateProgress(e.clientX, e.clientY);
    }
  };

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className={cn('flex flex-col items-center justify-center p-5 bg-card border border-border rounded-2xl shadow-lg select-none w-full max-w-[280px]', className)}>
      <div className="flex items-center gap-1.5 text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-0.5 text-xs font-bold mb-3 animate-pulse">
        <Gauge className="w-3.5 h-3.5" />
        <span>Drag Circle Ring</span>
      </div>

      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="w-40 h-40 relative flex items-center justify-center cursor-pointer select-none touch-none"
      >
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" className="stroke-muted/15" strokeWidth="6" fill="none" />
          <motion.circle 
            cx="60" 
            cy="60" 
            r="52" 
            className="stroke-primary" 
            strokeWidth="7" 
            strokeLinecap="round" 
            fill="none" 
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-foreground">{percent}%</span>
          <Activity className="w-4 h-4 text-primary/30 mt-1" />
        </div>
      </div>
    </div>
  );
};
