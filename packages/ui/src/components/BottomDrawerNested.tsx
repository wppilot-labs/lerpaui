"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { Layers, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface BottomDrawerNestedProps {
  className?: string;
}

export const BottomDrawerNested: React.FC<BottomDrawerNestedProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSub, setShowSub] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 350, damping: 30 });

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.velocity.y > 100 || info.offset.y > 80) {
      setIsOpen(false);
      setShowSub(false);
    } else {
      y.set(0);
    }
  };

  return (
    <div className={cn('relative w-full h-[220px] bg-secondary/5 rounded-2xl border border-border overflow-hidden flex flex-col items-center justify-center p-6 select-none', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-5 py-2 rounded-xl bg-card border border-border shadow-sm flex items-center gap-2 text-xs font-black text-foreground hover:bg-secondary/40 active:scale-95 transition-all"
      >
        <Layers className="w-4 h-4 text-primary animate-pulse" />
        <span>Open Multi-Drawer</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsOpen(false); setShowSub(false); }}
              className="absolute inset-0 bg-black/50 z-30 pointer-events-auto"
            />

            {/* Draggable Drawer Panel */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 200 }}
              dragElastic={0.05}
              style={{ y: springY }}
              onDragEnd={handleDragEnd}
              initial={prefersReducedMotion ? false : { y: 220 }}
              animate={{ y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { y: 220 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute left-0 right-0 bottom-0 h-[210px] bg-card border-t border-border shadow-2xl rounded-t-2xl z-40 p-4 select-none cursor-grab active:cursor-grabbing flex flex-col overflow-hidden"
            >
              <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-3" />
              
              <div className="relative flex-1 w-full overflow-hidden flex">
                {/* Layer 1 */}
                <motion.div
                  animate={prefersReducedMotion ? undefined : { x: showSub ? '-100%' : '0%' }}
                  transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
                  className="w-full flex-shrink-0 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-sm font-extrabold text-foreground">Drawer Settings Layer 1</h4>
                    <p className="text-xs text-muted-foreground mt-1">Review aggregated workspace variables.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSub(true)}
                    className="w-full py-2 bg-secondary/50 border border-border hover:bg-secondary/80 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-foreground"
                  >
                    <span>Proceed to Layer 2</span>
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </button>
                </motion.div>

                {/* Layer 2 (Nested Drawer View) */}
                <motion.div
                  animate={prefersReducedMotion ? undefined : { x: showSub ? '-100%' : '0%' }}
                  transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
                  className="w-full flex-shrink-0 flex flex-col justify-between pl-4"
                >
                  <div>
                    <h4 className="text-sm font-extrabold text-primary">Nested Details Layer 2</h4>
                    <p className="text-xs text-muted-foreground mt-1">Multi-nest triggers are safe on client pipelines.</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSub(false)}
                      className="flex-1 py-2 border border-border bg-card text-xs font-bold text-foreground rounded-xl"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => { setIsOpen(false); setShowSub(false); }}
                      className="flex-1 py-2 bg-rose-500 text-white text-xs font-bold rounded-xl shadow hover:brightness-105 active:scale-95 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
