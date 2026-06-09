"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, Trash2, Bookmark, Clock } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeCardDismissibleProps {
  onDismiss?: (dir: 'up' | 'down' | 'left' | 'right') => void;
  className?: string;
}

export const SwipeCardDismissible: React.FC<SwipeCardDismissibleProps> = ({
  onDismiss,
  className,
}) => {
  const [status, setStatus] = useState<'idle' | 'Save' | 'Delete' | 'Favorite' | 'Snooze'>('idle');
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const opacityUp = useTransform(y, [-100, 0], [1, 0]);
  const opacityDown = useTransform(y, [0, 100], [0, 1]);
  const opacityLeft = useTransform(x, [-100, 0], [1, 0]);
  const opacityRight = useTransform(x, [0, 100], [0, 1]);

  const handleDrag = (_e: unknown, info: PanInfo) => {
    const absX = Math.abs(info.offset.x);
    const absY = Math.abs(info.offset.y);

    if (absX > absY) {
      if (info.offset.x > 30) setStatus('Favorite');
      else if (info.offset.x < -30) setStatus('Delete');
      else setStatus('idle');
    } else {
      if (info.offset.y > 30) setStatus('Snooze');
      else if (info.offset.y < -30) setStatus('Save');
      else setStatus('idle');
    }
  };

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      onDismiss?.('right');
    } else if (info.offset.x < -threshold) {
      onDismiss?.('left');
    } else if (info.offset.y > threshold) {
      onDismiss?.('down');
    } else if (info.offset.y < -threshold) {
      onDismiss?.('up');
    }
    x.set(0);
    y.set(0);
    setStatus('idle');
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[280px] bg-secondary/5 rounded-2xl border border-border flex items-center justify-center select-none overflow-hidden p-4', className)}>
      <span className="absolute top-3 text-[9px] text-muted-foreground font-black uppercase tracking-widest">4-Way Swipe Card</span>

      {/* Floating Badges indicator in corners */}
      <motion.div style={{ opacity: opacityUp }} className="absolute top-8 w-full flex justify-center text-[10px] font-black text-emerald-500 gap-1 uppercase tracking-wider z-20">
        <Bookmark className="w-3.5 h-3.5" /> Save
      </motion.div>
      <motion.div style={{ opacity: opacityDown }} className="absolute bottom-8 w-full flex justify-center text-[10px] font-black text-amber-500 gap-1 uppercase tracking-wider z-20">
        <Clock className="w-3.5 h-3.5" /> Snooze
      </motion.div>
      <motion.div style={{ opacity: opacityLeft }} className="absolute left-8 h-full flex flex-col justify-center text-[10px] font-black text-rose-500 gap-1 uppercase tracking-wider z-20">
        <Trash2 className="w-3.5 h-3.5" /> Trash
      </motion.div>
      <motion.div style={{ opacity: opacityRight }} className="absolute right-8 h-full flex flex-col justify-center text-[10px] font-black text-purple-500 gap-1 uppercase tracking-wider z-20">
        <Heart className="w-3.5 h-3.5" /> Favorite
      </motion.div>

      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.4}
        style={{ x, y }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="w-48 h-48 rounded-xl border border-border/80 bg-card cursor-grab active:cursor-grabbing shadow-lg p-4 flex flex-col justify-between z-10 touch-none"
      >
        <div>
          <h4 className="text-xs font-black text-foreground">Lerpa UI Core Vault</h4>
          <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">Swipe up to save, down to snooze, left to delete, or right to favorite.</p>
        </div>

        <div className="w-full flex items-center justify-between">
          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest">Active: {status}</span>
          <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
        </div>
      </motion.div>
    </div>
  );
};
