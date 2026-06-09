"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, PanInfo } from 'framer-motion';
import { ArrowDown, CheckCircle, X } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PullToRefreshMorphDialogProps {
  title: string;
  checklist: string[];
  onComplete?: () => void;
  className?: string;
}

export const PullToRefreshMorphDialog: React.FC<PullToRefreshMorphDialogProps> = ({
  title,
  checklist,
  onComplete,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [completeItems, setCompleteItems] = useState<{ [key: string]: boolean }>({});
  
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const threshold = 110;

  const opacity = useTransform(y, [0, threshold], [0.3, 1]);
  const scale = useTransform(y, [0, threshold], [0.8, 1.1]);

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentY = y.get();
    if (currentY > threshold) {
      setIsOpen(true);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(15);
      y.set(0);
    } else {
      y.set(0);
    }
  };

  const toggleCheck = (item: string) => {
    const updated = { ...completeItems, [item]: !completeItems[item] };
    setCompleteItems(updated);
    if (checklist.every(i => updated[i])) {
      setTimeout(() => {
        onComplete?.();
        setIsOpen(false);
      }, 500);
    }
  };

  return (
    <div className={cn('relative w-full border border-border rounded-2xl bg-secondary/10 overflow-hidden min-h-[220px]', className)}>
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 180 }}
            dragElastic={0.15}
            style={{ y: springY }}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 bg-card z-10 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing p-6"
          >
            <motion.div style={{ opacity, scale }} className="flex flex-col items-center gap-2">
              <ArrowDown className="w-5 h-5 text-primary animate-bounce" />
              <span className="text-[10px] font-black uppercase text-primary tracking-widest text-center">Pull to open checklist</span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-card z-20 p-5 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary">{title}</h4>
                <button type="button" aria-label="Close dialog" onClick={() => setIsOpen(false)} className="p-1 hover:bg-secondary rounded-lg text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                {checklist.map((item, idx) => (
                  <div
                    key={idx}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleCheck(item)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCheck(item); } }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-secondary/20 hover:border-primary/40 cursor-pointer active:scale-98 transition-all"
                  >
                    <span className={cn('text-xs font-semibold text-foreground', completeItems[item] && 'line-through text-muted-foreground')}>{item}</span>
                    <CheckCircle className={cn('w-4 h-4 transition-colors', completeItems[item] ? 'text-emerald-400' : 'text-border')} />
                  </div>
                ))}
              </div>
            </div>
            <span className="text-[8px] text-muted-foreground text-center">Complete all items to save</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
