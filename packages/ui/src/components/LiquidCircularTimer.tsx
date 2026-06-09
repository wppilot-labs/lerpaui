"use client";

import React, { useState, useEffect } from 'react';
import { motion} from "framer-motion";
import { Play, Pause, RotateCcw, Hourglass } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface LiquidCircularTimerProps {
  initialSeconds?: number;
  className?: string;
}

export const LiquidCircularTimer: React.FC<LiquidCircularTimerProps> = ({
  initialSeconds = 60,
  className,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [seconds, setSeconds] = useState(initialSeconds);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          setActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active]);

  const percentage = (seconds / initialSeconds) * 100;

  return (
    <div className={cn('p-5 rounded-2xl border border-border bg-card shadow-lg select-none max-w-[320px] flex flex-col items-center gap-4 relative overflow-hidden backdrop-blur-md bg-card/75', className)}>
      <div className="flex items-center gap-2 self-start border-b border-border/40 pb-3 w-full">
        <Hourglass className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Timer</span>
      </div>

      <div className="relative w-28 h-28 rounded-full border border-border bg-secondary/20 flex items-center justify-center overflow-hidden">
        {/* SVG Liquid wave inside circle */}
        <div 
          className="absolute inset-x-0 bottom-0 bg-primary/20 transition-all duration-1000 ease-out" 
          style={{ height: percentage + "%" }}
        >
          {/* Animated wave sheen */}
          <motion.div
            animate={prefersReducedMotion ? { x: 0 } : { x: [0, -100] }}
            transition={prefersReducedMotion ? { duration: 0 } : { repeat: Infinity, ease: 'linear', duration: 4 }}
            className="absolute -top-1 w-[200%] h-4 bg-primary/35 opacity-70 blur-[1px] rounded-t-[50%_20%]"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <span className="text-3xl font-black text-foreground font-mono leading-none">{seconds}s</span>
          <span className="text-[8px] text-muted-foreground uppercase font-black tracking-widest mt-0.5">{percentage.toFixed(0)}% Left</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActive(!active)}
          className="px-4 py-2 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 shadow-md flex items-center gap-1 cursor-pointer"
        >
          {active ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          {active ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          aria-label="Reset timer"
          onClick={() => { setActive(false); setSeconds(initialSeconds); }}
          className="p-2 border border-border bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground rounded-xl active:scale-95 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
