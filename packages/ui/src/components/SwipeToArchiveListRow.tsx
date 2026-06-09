"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo, AnimatePresence } from 'framer-motion';
import { Archive, Trash } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeToArchiveListRowProps {
  id: string;
  title: string;
  description?: string;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export const SwipeToArchiveListRow: React.FC<SwipeToArchiveListRowProps> = ({
  id,
  title,
  description,
  onArchive,
  onDelete,
  className,
}) => {
  const [status, setStatus] = useState<'active' | 'archived' | 'deleted'>('active');
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 25 });
  const threshold = 120;

  const archiveOpacity = useTransform(x, [0, threshold], [0.3, 1]);
  const deleteOpacity = useTransform(x, [-threshold, 0], [1, 0.3]);
  const archiveScale = useTransform(x, [0, threshold], [0.8, 1.2]);
  const deleteScale = useTransform(x, [-threshold, 0], [1.2, 0.8]);

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentX = x.get();
    if (currentX > threshold) {
      // Trigger Archive
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      setStatus('archived');
      setTimeout(() => onArchive?.(id), 400);
    } else if (currentX < -threshold) {
      // Trigger Delete
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      setStatus('deleted');
      setTimeout(() => onDelete?.(id), 400);
    } else {
      x.set(0);
    }
  };

  return (
    <AnimatePresence>
      {status === 'active' && (
        <motion.div
          className={cn('relative overflow-hidden w-full select-none touch-pan-y rounded-xl border border-border bg-card shadow-sm', className)}
          initial={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0, transition: { duration: 0.3 } }}
        >
          {/* Underlay Trays */}
          <div className="absolute inset-0 flex justify-between select-none pointer-events-none">
            {/* Left Tray: Green Archive */}
            <motion.div 
              style={{ opacity: archiveOpacity }}
              className="flex items-center justify-start bg-emerald-500 text-white px-6 w-1/2 h-full rounded-l-xl"
            >
              <motion.div style={{ scale: archiveScale }} className="flex items-center gap-2">
                <Archive className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Archive</span>
              </motion.div>
            </motion.div>

            {/* Right Tray: Red Delete */}
            <motion.div 
              style={{ opacity: deleteOpacity }}
              className="flex items-center justify-end bg-rose-500 text-white px-6 w-1/2 ml-auto h-full rounded-r-xl"
            >
              <motion.div style={{ scale: deleteScale }} className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider">Delete</span>
                <Trash className="w-5 h-5" />
              </motion.div>
            </motion.div>
          </div>

          {/* Foreground Draggable Row */}
          <motion.div
            drag="x"
            dragConstraints={{ left: -180, right: 180 }}
            dragElastic={0.2}
            style={{ x: springX }}
            onDragEnd={handleDragEnd}
            className="relative z-10 w-full bg-card py-4 px-5 cursor-grab active:cursor-grabbing border-b border-border/40"
          >
            <div className="flex flex-col gap-0.5">
              {title && <h4 className="text-sm font-bold text-foreground">{title}</h4>}
              {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </div>
            {/* Swipe hints */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-20 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
              <span className="w-1.5 h-1.5 rounded-full bg-foreground" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
