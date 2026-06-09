"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform} from "framer-motion";
import { Volume2 } from 'lucide-react';
import { cn } from '../lib/cn';

export interface TactileKnobRotatorProps {
  label?: string;
  onChange?: (val: number) => void;
  className?: string;
}

export const TactileKnobRotator: React.FC<TactileKnobRotatorProps> = ({
  label = 'Tactile Knob',
  onChange,
  className,
}) => {
  const rot = useMotionValue(0);
  const springRot = useSpring(rot, { stiffness: 150, damping: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startRot, setStartRot] = useState(0);

  // Map rotation from -150 to +150 deg to 0-100 scale
  const value = useTransform(rot, [-150, 150], [0, 100]);
  const [displayVal, setDisplayVal] = useState(50);

  React.useEffect(() => {
    return value.on("change", (v) => {
      const rounded = Math.round(Math.max(0, Math.min(100, v)));
      setDisplayVal(rounded);
      onChange?.(rounded);
    });
  }, [value, onChange]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const angleRad = Math.atan2(y, x);
    const angleDeg = (angleRad * 180) / Math.PI;

    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setStartAngle(angleDeg);
    setStartRot(rot.get());
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = e.clientX - centerX;
    const y = e.clientY - centerY;
    const angleRad = Math.atan2(y, x);
    const angleDeg = (angleRad * 180) / Math.PI;
    
    let targetRot = startRot + (angleDeg - startAngle);
    // Limit range between -150 and +150
    targetRot = Math.max(-150, Math.min(150, targetRot));
    rot.set(targetRot);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) { /* noop */ }
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[280px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-center select-none overflow-hidden p-4', className)}>
      <span className="absolute top-3 text-[9px] text-muted-foreground font-black uppercase tracking-widest">{label}</span>

      <div className="relative w-36 h-36 flex items-center justify-center mt-2">
        {/* Glow arc meter */}
        <svg className="absolute w-full h-full rotate-[-90deg]">
          <circle
            cx="72"
            cy="72"
            r="60"
            stroke="currentColor"
            className="text-border"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray="280"
            strokeDashoffset="70"
          />
          <circle
            cx="72"
            cy="72"
            r="60"
            stroke="currentColor"
            className="text-primary animate-pulse"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray="280"
            strokeDashoffset={280 - (displayVal / 100) * 210}
            strokeLinecap="round"
          />
        </svg>

        {/* Rotatable core knob */}
        <motion.div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ rotate: springRot }}
          className="w-24 h-24 rounded-full border-4 border-border bg-card flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xl relative touch-none"
        >
          {/* Radial indicator dot */}
          <div className="absolute top-2 w-2 h-2 rounded-full bg-primary" />
          <Volume2 className="w-6 h-6 text-muted-foreground/35" />
        </motion.div>
      </div>

      <div className="absolute bottom-3 flex flex-col items-center gap-0.5">
        <span className="text-lg font-black text-primary">{displayVal}%</span>
        <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide">Drag dial circumference to rotate</span>
      </div>
    </div>
  );
};
