"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeToRevealStatusProps {
  id: string;
  title: string;
  initialStatus?: 'pending' | 'progress' | 'complete';
  onStatusChange?: (id: string, status: 'pending' | 'progress' | 'complete') => void;
  className?: string;
}

export const SwipeToRevealStatus: React.FC<SwipeToRevealStatusProps> = ({
  id,
  title,
  initialStatus = 'pending',
  onStatusChange,
  className,
}) => {
  const [currentStatus, setCurrentStatus] = useState(initialStatus);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const actionWidth = 80;

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentX = x.get();
    if (currentX > 50) {
      x.set(actionWidth);
    } else if (currentX < -50) {
      x.set(-actionWidth);
    } else {
      x.set(0);
    }
  };

  const selectStatus = (newStatus: 'pending' | 'progress' | 'complete') => {
    setCurrentStatus(newStatus);
    onStatusChange?.(id, newStatus);
    x.set(0);
  };

  const getStatusColor = () => {
    switch (currentStatus) {
      case 'complete': return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
      case 'progress': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default: return 'bg-amber-500/10 border-amber-500/30 text-amber-400';
    }
  };

  return (
    <div className={cn('relative overflow-hidden w-full rounded-xl border border-border bg-card shadow-sm select-none', className)}>
      {/* Background status controls */}
      <div className="absolute inset-0 flex justify-between">
        {/* Left: Move to complete */}
        <button
          onClick={() => selectStatus('complete')}
          className="flex items-center gap-1 bg-emerald-600 text-white font-bold text-[10px] uppercase px-4 rounded-l-xl transition-all active:brightness-90"
          style={{ width: actionWidth }}
        >
          <CheckCircle className="w-4 h-4" />
          <span>Done</span>
        </button>

        {/* Right: Move to In Progress */}
        <button
          onClick={() => selectStatus('progress')}
          className="flex items-center justify-end gap-1 bg-blue-600 text-white font-bold text-[10px] uppercase px-4 ml-auto rounded-r-xl transition-all active:brightness-90"
          style={{ width: actionWidth }}
        >
          <span>Work</span>
          <Clock className="w-4 h-4" />
        </button>
      </div>

      {/* Main Draggable Foreground */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -actionWidth - 10, right: actionWidth + 10 }}
        dragElastic={0.1}
        style={{ x: springX }}
        onDragEnd={handleDragEnd}
        className="relative z-10 w-full bg-card p-4 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-border/40"
      >
        <span className="text-sm font-bold text-foreground">{title}</span>
        <span className={cn('px-2.5 py-0.5 rounded-full text-[10px] uppercase font-extrabold tracking-wide border', getStatusColor())}>
          {currentStatus}
        </span>
      </motion.div>
    </div>
  );
};
