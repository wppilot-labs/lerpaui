"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion';
import { RefreshCw, Share2, HelpCircle, ArrowDown } from 'lucide-react';
import { cn } from '../lib/cn';

export interface HapticPullToActionProps {
  onAction?: (action: 'refresh' | 'share' | 'help') => void;
  className?: string;
}

export const HapticPullToAction: React.FC<HapticPullToActionProps> = ({
  onAction,
  className,
}) => {
  const [activeAction, setActiveAction] = useState<'refresh' | 'share' | 'help' | null>(null);
  const [loading, setLoading] = useState(false);
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 25 });

  const threshold = 80;
  const selectThreshold = 40;

  const arrowRotate = useTransform(y, [0, threshold], [0, 180]);
  const opacity = useTransform(y, [20, threshold], [0, 1]);

  const handleDrag = (_event: unknown, info: PanInfo) => {
    const currentY = y.get();
    if (currentY > threshold) {
      const currentX = info.offset.x;
      if (currentX < -selectThreshold) {
        setActiveAction('share');
      } else if (currentX > selectThreshold) {
        setActiveAction('help');
      } else {
        setActiveAction('refresh');
      }
    } else {
      setActiveAction(null);
    }
  };

  const handleDragEnd = async (_event: unknown, _info: PanInfo) => {
    const currentY = y.get();
    if (currentY > threshold && activeAction) {
      setLoading(true);
      y.set(0);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      
      try {
        await onAction?.(activeAction);
      } finally {
        setTimeout(() => {
          setLoading(false);
          setActiveAction(null);
        }, 1200);
      }
    } else {
      y.set(0);
      setActiveAction(null);
    }
  };

  return (
    <div className={cn('relative w-full overflow-hidden select-none border border-border rounded-2xl bg-secondary/5', className)}>
      {/* Pull indicators overlay */}
      <div className="absolute inset-x-0 top-0 h-[80px] pointer-events-none overflow-hidden z-20 flex items-center justify-center">
        {loading ? (
          <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-primary tracking-widest animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Executing...</span>
          </div>
        ) : (
          <motion.div 
            style={{ opacity }} 
            className="flex items-center gap-4 py-2 px-4 bg-card/90 border border-border/40 rounded-full shadow-lg pointer-events-auto"
          >
            <div className={cn('p-1.5 rounded-full transition-all', activeAction === 'share' ? 'bg-primary text-primary-foreground scale-115' : 'text-muted-foreground')}>
              <Share2 className="w-4 h-4" />
            </div>

            <div className={cn('p-1.5 rounded-full transition-all flex flex-col items-center gap-1', activeAction === 'refresh' ? 'bg-primary text-primary-foreground scale-115' : 'text-muted-foreground')}>
              <motion.div style={{ rotate: arrowRotate }}>
                <ArrowDown className="w-4 h-4" />
              </motion.div>
            </div>

            <div className={cn('p-1.5 rounded-full transition-all', activeAction === 'help' ? 'bg-primary text-primary-foreground scale-115' : 'text-muted-foreground')}>
              <HelpCircle className="w-4 h-4" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Draggable body */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 120 }}
        dragElastic={0.15}
        style={{ y: springY }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        className="w-full bg-card min-h-[200px] p-6 relative z-10 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center border-t border-border/30 shadow-inner"
      >
        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-wider mb-1">Drag Down Gestures</span>
        <h4 className="text-sm font-black text-foreground">Haptic Pull Container</h4>
        <span className="text-[8px] text-muted-foreground/60 font-semibold uppercase mt-3">Pull and slide left/right</span>
      </motion.div>
    </div>
  );
};
