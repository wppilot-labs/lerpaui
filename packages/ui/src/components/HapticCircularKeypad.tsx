"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring} from "framer-motion";
import { Delete, Check, RotateCcw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface HapticCircularKeypadProps {
  onConfirm?: (pin: string) => void;
  className?: string;
}

export const HapticCircularKeypad: React.FC<HapticCircularKeypadProps> = ({
  onConfirm,
  className,
}) => {
  const [pin, setPin] = useState('');
  const rot = useMotionValue(0);
  const springRot = useSpring(rot, { stiffness: 100, damping: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [startAngle, setStartAngle] = useState(0);
  const [startRot, setStartRot] = useState(0);

  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

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
    rot.set(startRot + (angleDeg - startAngle));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch (err) { /* noop */ }
  };

  const handleKeyTap = (key: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + key);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
    }
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[340px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-between p-4 select-none overflow-hidden', className)}>
      <div className="w-full flex flex-col items-center gap-1">
        <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Haptic Pin Dial</span>
        <div className="flex gap-2 h-6 items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn('w-2.5 h-2.5 rounded-full border border-border transition-all duration-200',
                i < pin.length ? 'bg-primary border-primary scale-125 shadow-md shadow-primary/20' : 'bg-transparent'
              )}
            />
          ))}
        </div>
      </div>

      <div className="relative w-44 h-44 flex items-center justify-center rounded-full">
        <motion.div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ rotate: springRot }}
          className="w-full h-full rounded-full border-4 border-border bg-card flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg relative touch-none"
        >
          {keys.map((key, idx) => {
            const angleDeg = idx * 30;
            const angleRad = (angleDeg * Math.PI) / 180;
            const radius = 62;
            const xVal = Math.cos(angleRad) * radius;
            const yVal = Math.sin(angleRad) * radius;

            const leftOffset = parseFloat((xVal - 14).toFixed(4));
            const topOffset = parseFloat((yVal - 14).toFixed(4));
            const leftStyle = leftOffset >= 0 ? `calc(50% + ${leftOffset}px)` : `calc(50% - ${Math.abs(leftOffset)}px)`;
            const topStyle = topOffset >= 0 ? `calc(50% + ${topOffset}px)` : `calc(50% - ${Math.abs(topOffset)}px)`;

            return (
              <motion.button
                key={idx}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  handleKeyTap(key);
                }}
                whileTap={{ scale: 1.3 }}
                className="absolute w-7 h-7 rounded-full border border-border/60 bg-secondary/35 text-[10px] font-black text-foreground flex items-center justify-center hover:border-primary/45 transition-colors shadow-sm"
                style={{
                  left: leftStyle,
                  top: topStyle,
                  transform: `rotate(${-angleDeg}deg)`,
                }}
              >
                {key}
              </motion.button>
            );
          })}
        </motion.div>
      </div>

      <div className="w-full flex justify-between items-center gap-2">
        <button
          type="button"
          aria-label="Clear PIN"
          onClick={() => setPin('')}
          className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:bg-secondary/40 active:scale-90 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={() => onConfirm?.(pin)}
          className="flex-1 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-primary/95 active:scale-95 transition-all shadow-md shadow-primary/10"
        >
          <Check className="w-4 h-4" />
          <span>Confirm PIN</span>
        </button>
        <button
          type="button"
          aria-label="Delete last digit"
          onClick={() => setPin(prev => prev.slice(0, -1))}
          className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:bg-secondary/40 active:scale-90 transition-all"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
