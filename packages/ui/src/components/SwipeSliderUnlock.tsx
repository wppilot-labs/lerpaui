"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { ChevronRight, Unlock } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeSliderUnlockProps {
  onUnlock?: () => void;
  label?: string;
  successLabel?: string;
  className?: string;
}

export const SwipeSliderUnlock: React.FC<SwipeSliderUnlockProps> = ({
  onUnlock,
  label = "Slide right to unlock",
  successLabel = "Action Unlocked",
  className,
}) => {
  const [unlocked, setUnlocked] = useState(false);
  const x = useMotionValue(0);
  const dragLimit = 200;
  
  const springX = useSpring(x, { stiffness: 400, damping: 30 });
  const opacity = useTransform(x, [0, dragLimit * 0.8], [1, 0]);
  const glowOpacity = useTransform(x, [0, dragLimit], [0, 0.4]);

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    if (x.get() >= dragLimit - 10) {
      setUnlocked(true);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate([20, 10, 20]);
      onUnlock?.();
    } else {
      x.set(0);
    }
  };

  const reset = () => {
    setUnlocked(false);
    x.set(0);
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[58px] bg-secondary/15 rounded-full border border-border shadow-sm p-1 overflow-hidden select-none', className)}>
      <motion.div 
        style={{ opacity: glowOpacity }}
        className="absolute inset-0 bg-primary blur-md pointer-events-none"
      />

      {unlocked ? (
        <div
          role="button"
          tabIndex={0}
          className="w-full h-full flex items-center justify-between px-4 text-primary bg-primary/10 border border-primary/20 rounded-full select-none cursor-pointer"
          onClick={reset}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); reset(); } }}
        >
          <span className="text-xs font-black uppercase tracking-wider">{successLabel}</span>
          <Unlock className="w-4 h-4 animate-bounce" />
        </div>
      ) : (
        <div className="w-full h-full flex items-center relative select-none">
          <motion.div 
            style={{ opacity }}
            className="absolute left-14 right-4 text-center pointer-events-none text-muted-foreground/60 text-xs font-extrabold select-none tracking-wide"
          >
            {label}
          </motion.div>

          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: dragLimit }}
            dragElastic={0.05}
            style={{ x: springX }}
            onDragEnd={handleDragEnd}
            className="w-11 h-11 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow z-10 hover:brightness-110 active:scale-95 transition-all"
          >
            <ChevronRight className="w-5 h-5 animate-pulse" />
          </motion.div>
        </div>
      )}
    </div>
  );
};
