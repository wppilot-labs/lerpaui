"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { Sparkles, HelpCircle, X, LifeBuoy } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PullToRefreshHelpBeaconProps {
  tips: string[];
  className?: string;
}

export const PullToRefreshHelpBeacon: React.FC<PullToRefreshHelpBeaconProps> = ({
  tips,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const threshold = 100;

  const beaconOpacity = useTransform(y, [0, threshold], [0.4, 1]);
  const beaconScale = useTransform(y, [0, threshold], [0.8, 1.25]);

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentY = y.get();
    if (currentY > threshold) {
      setOpen(true);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(12);
      y.set(0);
    } else {
      y.set(0);
    }
  };

  return (
    <div className={cn('relative w-full border border-border rounded-2xl bg-secondary/10 overflow-hidden min-h-[220px]', className)}>
      <AnimatePresence>
        {!open ? (
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 150 }}
            dragElastic={0.1}
            style={{ y: springY }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing p-6"
          >
            <motion.div style={{ opacity: beaconOpacity, scale: beaconScale }} className="flex flex-col items-center gap-2">
              <LifeBuoy className="w-6 h-6 text-primary animate-spin-slow" />
              <span className="text-[10px] font-black uppercase text-primary tracking-widest text-center">Pull for Helper Beacon</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute inset-0 bg-card z-20 p-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-1.5 text-primary">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Help Beacon Tips</h4>
                </div>
                <button type="button" aria-label="Close beacon" onClick={() => setOpen(false)} className="p-1 hover:bg-secondary rounded-lg text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-[120px] overflow-y-auto pr-1">
                {tips.map((tip, idx) => (
                  <div key={idx} className="flex gap-2 text-xs text-muted-foreground leading-relaxed bg-secondary/30 p-2 rounded-lg border border-border/30">
                    <HelpCircle className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[8px] text-muted-foreground/60 text-center">Pull help sheets down anytime</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
