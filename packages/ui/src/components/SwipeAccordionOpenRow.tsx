"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence, PanInfo } from 'framer-motion';
import { ChevronDown, Sparkles, Database } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SwipeAccordionOpenRowProps {
  id: string;
  title: string;
  details: string;
  className?: string;
}

export const SwipeAccordionOpenRow: React.FC<SwipeAccordionOpenRowProps> = ({
  id: _id,
  title,
  details,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 25 });
  const triggerWidth = 70;

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentX = x.get();
    if (currentX < -45) {
      setIsOpen(!isOpen);
      x.set(0);
    } else {
      x.set(0);
    }
  };

  return (
    <div className={cn('w-full border border-border rounded-xl bg-card overflow-hidden shadow-sm select-none', className)}>
      <div className="relative overflow-hidden w-full">
        {/* Background trigger */}
        <div className="absolute inset-0 flex justify-end">
          <div className="flex items-center justify-center bg-primary text-white w-24 h-full rounded-r-xl">
            <ChevronDown className={cn('w-5 h-5 transition-transform duration-300', isOpen ? 'rotate-185' : 'rotate-0')} />
          </div>
        </div>

        {/* Foreground Draggable Panel */}
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
              <Database className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-foreground">{title}</span>
          </div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Swipe for info</span>
        </motion.div>
      </div>

      {/* Accordion content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-secondary/20"
          >
            <div className="p-4 text-xs text-muted-foreground border-t border-border flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="leading-relaxed">{details}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
