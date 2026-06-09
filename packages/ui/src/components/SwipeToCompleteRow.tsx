"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { Check, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeToCompleteRowProps {
  id: string;
  text: string;
  onComplete?: (id: string) => void;
  className?: string;
}

export const SwipeToCompleteRow: React.FC<SwipeToCompleteRowProps> = ({
  id,
  text,
  onComplete,
  className,
}) => {
  const [completed, setCompleted] = useState(false);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const threshold = 130;

  const bgOpacity = useTransform(x, [0, threshold], [0.1, 0.9]);
  const iconScale = useTransform(x, [0, threshold], [0.6, 1.2]);

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentX = x.get();
    if (currentX > threshold) {
      setCompleted(true);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      onComplete?.(id);
    } else {
      x.set(0);
    }
  };

  return (
    <div className={cn('relative overflow-hidden w-full rounded-xl border border-border bg-card shadow-sm select-none', className)}>
      {/* Background complete trigger */}
      <motion.div 
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-emerald-500/90 text-white flex items-center px-6 rounded-l-xl pointer-events-none"
      >
        <motion.div style={{ scale: iconScale }} className="flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Release to complete</span>
        </motion.div>
      </motion.div>

      {/* Foreground Draggable Panel */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 200 }}
        dragElastic={0.15}
        style={{ x: springX }}
        onDragEnd={handleDragEnd}
        className={cn('relative z-10 w-full bg-card p-4 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-border/40 transition-all duration-300',
          completed && 'opacity-50 line-through bg-secondary/20'
        )}
      >
        <span className={cn('text-sm font-semibold text-foreground', completed && 'text-muted-foreground')}>{text}</span>
        {completed ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        ) : (
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-bold">Swipe right</span>
        )}
      </motion.div>
    </div>
  );
};
