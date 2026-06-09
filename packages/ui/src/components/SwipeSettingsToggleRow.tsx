"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { Settings, Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeSettingsToggleRowProps {
  id: string;
  label: string;
  initialValue?: boolean;
  onToggle?: (id: string, value: boolean) => void;
  className?: string;
}

export const SwipeSettingsToggleRow: React.FC<SwipeSettingsToggleRowProps> = ({
  id,
  label,
  initialValue = false,
  onToggle,
  className,
}) => {
  const [active, setActive] = useState(initialValue);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const triggerWidth = 70;

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentX = x.get();
    if (currentX < -40) {
      // Toggle
      const next = !active;
      setActive(next);
      onToggle?.(id, next);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
      x.set(0);
    } else {
      x.set(0);
    }
  };

  return (
    <div className={cn('relative overflow-hidden w-full rounded-xl border border-border bg-card shadow-sm select-none', className)}>
      {/* Background toggle trigger */}
      <div className="absolute inset-0 flex justify-end">
        <div 
          className={cn('flex items-center justify-center text-white px-6 rounded-r-xl transition-colors duration-300 w-24 ml-auto', 
            active ? 'bg-primary' : 'bg-zinc-600'
          )}
        >
          {active ? <Eye className="w-5 h-5 animate-pulse" /> : <EyeOff className="w-5 h-5" />}
        </div>
      </div>

      {/* Main Draggable Foreground */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -triggerWidth - 10, right: 0 }}
        dragElastic={0.1}
        style={{ x: springX }}
        onDragEnd={handleDragEnd}
        className="relative z-10 w-full bg-card p-4 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-border/40"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground">
            <Settings className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold text-foreground">{label}</span>
        </div>
        <div className="flex items-center gap-3 pointer-events-none">
          <div className={cn('w-9 h-5 rounded-full p-0.5 transition-colors duration-250', active ? 'bg-primary' : 'bg-muted')}>
            <div className={cn('w-4 h-4 bg-white rounded-full transition-transform duration-250 shadow-sm', active ? 'translate-x-4' : 'translate-x-0')} />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
