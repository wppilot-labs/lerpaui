"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { Edit2, Share2, Trash2, Sliders } from 'lucide-react';
import { cn } from '../lib/cn';

export interface HapticSwipeMenuRosterProps {
  id: string;
  title: string;
  onEdit?: (id: string) => void;
  onShare?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const HapticSwipeMenuRoster: React.FC<HapticSwipeMenuRosterProps> = ({
  id,
  title,
  onEdit,
  onShare,
  onDelete,
  className,
}) => {
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const [_menuOpen, setMenuOpen] = useState(false);
  const triggerWidth = 140;

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentX = x.get();
    if (currentX < -60) {
      x.set(-triggerWidth);
      setMenuOpen(true);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
    } else {
      x.set(0);
      setMenuOpen(false);
    }
  };

  return (
    <div className={cn('relative overflow-hidden w-full rounded-xl border border-border bg-card shadow-sm select-none', className)}>
      {/* Background custom actions trays */}
      <div className="absolute inset-y-0 right-0 flex items-center bg-secondary/30 rounded-r-xl overflow-hidden" style={{ width: triggerWidth }}>
        <button 
          aria-label="Edit"
          onClick={() => { onEdit?.(id); x.set(0); }}
          className="flex-1 h-full bg-blue-600 text-white flex items-center justify-center transition-all active:brightness-90 cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button 
          aria-label="Share"
          onClick={() => { onShare?.(id); x.set(0); }}
          className="flex-1 h-full bg-emerald-600 text-white flex items-center justify-center transition-all active:brightness-90 cursor-pointer"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button 
          aria-label="Delete"
          onClick={() => { onDelete?.(id); x.set(0); }}
          className="flex-1 h-full bg-rose-600 text-white flex items-center justify-center transition-all active:brightness-90 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Draggable Foreground */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -triggerWidth - 10, right: 0 }}
        dragElastic={0.1}
        style={{ x: springX }}
        onDragEnd={handleDragEnd}
        className="relative z-10 w-full bg-card p-4 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-border/40"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-foreground">{title}</span>
        </div>
        <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Swipe left</span>
      </motion.div>
    </div>
  );
};
