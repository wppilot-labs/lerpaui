'use client';

import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Gauge, Activity } from 'lucide-react';
import { cn } from '../lib/cn';

export interface RadialProgressDraggableProps {
  onProgressChange?: (percent: number) => void;
  className?: string;
  /** Initial progress, clamped to 0–100. */
  defaultProgress?: number;
  /** Keyboard increment. */
  step?: number;
  /** Accessible name for the slider. */
  ariaLabel?: string;
}

export const RadialProgressDraggable: React.FC<RadialProgressDraggableProps> = ({
  onProgressChange,
  className,
  defaultProgress = 65,
  step = 1,
  ariaLabel = 'Progress',
}) => {
  const clamp = (value: number) =>
    Number.isFinite(value) ? Math.max(0, Math.min(100, Math.round(value))) : 0;
  const [percent, setPercent] = useState(() => clamp(defaultProgress));
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const updateProgress = (value: number) => {
    const next = clamp(value);
    setPercent(next);
    onProgressChange?.(next);
  };

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

    updateProgress((angleDeg / 360) * 100);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    calculateProgress(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.buttons === 1 || e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      calculateProgress(e.clientX, e.clientY);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let next: number | null = null;
    const safeStep = Math.max(1, clamp(step));
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') next = percent + safeStep;
    if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') next = percent - safeStep;
    if (e.key === 'PageUp') next = percent + safeStep * 10;
    if (e.key === 'PageDown') next = percent - safeStep * 10;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = 100;
    if (next !== null) {
      e.preventDefault();
      updateProgress(next);
    }
  };

  const circumference = 2 * Math.PI * 52;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-5 bg-card border border-border rounded-2xl shadow-lg select-none w-full max-w-[280px]',
        className
      )}
    >
      <div className="flex items-center gap-1.5 text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-0.5 text-xs font-bold mb-3 animate-pulse motion-reduce:animate-none">
        <Gauge className="w-3.5 h-3.5" />
        <span>Drag Circle Ring</span>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="w-40 h-40 relative flex items-center justify-center cursor-pointer select-none touch-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
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
            initial={prefersReducedMotion ? false : { strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { type: 'spring', stiffness: 200, damping: 25 }
            }
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
