"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, PanInfo, useReducedMotion } from 'framer-motion';
import { Menu, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ElasticSidebarDrawerProps {
  className?: string;
}

export const ElasticSidebarDrawer: React.FC<ElasticSidebarDrawerProps> = ({
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 28 });
  const prefersReducedMotion = useReducedMotion();

  // Map pulling left/right elastic shape curve
  const borderCurve = useTransform(x, [-100, 0], [
    '0% 100% 100% 0% / 0% 50% 50% 0%',
    '0% 100% 100% 0% / 0% 0% 0% 0%'
  ]);

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.velocity.x < -100 || info.offset.x < -80) {
      setIsOpen(false);
    } else {
      x.set(0);
    }
  };

  return (
    <div className={cn('relative w-full h-[220px] bg-secondary/5 rounded-2xl border border-border overflow-hidden flex items-center justify-center p-6 select-none', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-5 py-2 rounded-xl bg-card border border-border shadow-sm flex items-center gap-2 text-xs font-bold text-foreground hover:bg-secondary/40 active:scale-95 transition-all"
      >
        <Menu className="w-4 h-4 text-primary animate-pulse" />
        <span>Open Side Menu</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="button"
              tabIndex={0}
              aria-label="Close menu"
              onClick={() => setIsOpen(false)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(false); } }}
              className="absolute inset-0 bg-black/40 z-30 cursor-pointer pointer-events-auto"
            />

            {/* Elastic Left Drawer */}
            <motion.div
              drag="x"
              dragConstraints={{ left: -210, right: 0 }}
              dragElastic={0.1}
              style={{ x: springX, borderRadius: borderCurve }}
              onDragEnd={handleDragEnd}
              initial={{ x: -210 }}
              animate={{ x: 0 }}
              exit={{ x: -210 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute top-0 bottom-0 left-0 w-[210px] bg-card border-r border-border shadow-2xl z-40 p-4 select-none cursor-grab active:cursor-grabbing flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-4">
                  <h4 className="text-xs font-black text-primary uppercase tracking-widest">Workspace Menu</h4>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded hover:bg-secondary/30 text-muted-foreground transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>

                <nav className="flex flex-col gap-2">
                  {['Dashboard', 'Projects', 'Task Boards', 'Team Roster', 'Billing Options'].map((link, idx) => (
                    <div 
                      key={link}
                      className={cn('px-3 py-2 rounded-lg text-xs font-bold transition-all border border-transparent cursor-pointer',
                        idx === 0 
                          ? 'bg-primary/10 text-primary border-primary/20' 
                          : 'text-muted-foreground hover:bg-secondary/40'
                      )}
                    >
                      {link}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="text-[9px] text-muted-foreground/50 text-center font-bold uppercase tracking-wider">
                Drag left to close
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
