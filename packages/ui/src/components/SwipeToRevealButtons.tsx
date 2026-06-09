"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo, AnimatePresence } from 'framer-motion';
import { Pin, VolumeX, Trash2 } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeToRevealButtonsProps {
  id?: string;
  title?: string;
  sender?: string;
  time?: string;
  onAction?: (action: 'pin' | 'mute' | 'delete') => void;
  className?: string;
}

export const SwipeToRevealButtons: React.FC<SwipeToRevealButtonsProps> = ({
  id: _id = "swipe-reveal-id",
  title = "Important system update",
  sender = "Lerpa UI Core",
  time = "10m ago",
  onAction,
  className,
}) => {
  const [isRemoved, setIsRemoved] = useState(false);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const triggerWidth = 140;

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentX = x.get();
    if (currentX < -60) {
      x.set(-triggerWidth);
    } else {
      x.set(0);
    }
  };

  const handleBtnClick = (action: 'pin' | 'mute' | 'delete') => {
    if (action === 'delete') {
      setIsRemoved(true);
    } else {
      x.set(0);
    }
    onAction?.(action);
  };

  return (
    <AnimatePresence>
      {!isRemoved && (
        <motion.div 
          initial={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
          className={cn('relative overflow-hidden w-full select-none touch-pan-y rounded-xl border border-border bg-card shadow-sm', className)}
        >
          {/* Underlay reveal buttons */}
          <div className="absolute inset-y-0 right-0 flex pointer-events-auto z-10 w-[140px]">
            <button 
              aria-label="Pin"
              onClick={() => handleBtnClick('pin')}
              className="flex-1 bg-blue-500 text-white flex items-center justify-center transition-all hover:bg-blue-600 active:brightness-95"
            >
              <Pin className="w-4 h-4 fill-white/10" />
            </button>
            <button 
              aria-label="Mute"
              onClick={() => handleBtnClick('mute')}
              className="flex-1 bg-amber-500 text-white flex items-center justify-center transition-all hover:bg-amber-600 active:brightness-95"
            >
              <VolumeX className="w-4 h-4" />
            </button>
            <button 
              aria-label="Delete"
              onClick={() => handleBtnClick('delete')}
              className="flex-1 bg-rose-500 text-white flex items-center justify-center transition-all hover:bg-rose-600 active:brightness-95 rounded-r-xl"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Draggable Row Foreground */}
          <motion.div
            drag="x"
            dragConstraints={{ left: -triggerWidth - 10, right: 0 }}
            dragElastic={0.15}
            style={{ x: springX }}
            onDragEnd={handleDragEnd}
            className="relative z-20 w-full bg-card py-3 px-4 flex items-center justify-between cursor-grab active:cursor-grabbing border-b border-border/40"
          >
            <div className="flex flex-col gap-0.5 truncate">
              <span className="text-[10px] text-primary font-black uppercase tracking-wider">{sender}</span>
              <h4 className="text-xs font-bold text-foreground truncate">{title}</h4>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0 pl-2">
              <span className="text-[9px] text-muted-foreground/60 font-semibold">{time}</span>
              <div className="flex flex-col gap-0.5 opacity-20 pointer-events-none">
                <span className="w-1 h-1 bg-foreground rounded-full" />
                <span className="w-1 h-1 bg-foreground rounded-full" />
                <span className="w-1 h-1 bg-foreground rounded-full" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
