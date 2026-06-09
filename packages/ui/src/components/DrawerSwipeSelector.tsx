"use client";

import React, { useState } from 'react';
import { motion, PanInfo, useMotionValue, useSpring } from 'framer-motion';
import { ChevronUp, Check } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DrawerSwipeSelectorProps {
  options?: string[];
  onSelect?: (option: string) => void;
  className?: string;
}

export const DrawerSwipeSelector: React.FC<DrawerSwipeSelectorProps> = ({
  options = ['Option A', 'Option B', 'Option C', 'Option D', 'Option E'],
  onSelect,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  
  const y = useMotionValue(0);
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const carouselX = useMotionValue(0);
  const springX = useSpring(carouselX, { stiffness: 400, damping: 30 });

  const handleDragEnd = (_event: unknown, info: PanInfo) => {
    if (info.velocity.y > 100 || info.offset.y > 80) {
      setIsOpen(false);
    } else if (info.velocity.y < -100 || info.offset.y < -80) {
      setIsOpen(true);
    }
  };

  const handleCarouselDragEnd = (_event: unknown, _info: PanInfo) => {
    const itemWidth = 110;
    const currentX = carouselX.get();
    const targetIdx = Math.max(0, Math.min(options.length - 1, Math.round(-currentX / itemWidth)));
    setActiveIdx(targetIdx);
    carouselX.set(-targetIdx * itemWidth);
    onSelect?.(options[targetIdx]);
  };

  return (
    <div className={cn('relative w-full h-[220px] bg-secondary/5 rounded-2xl border border-border overflow-hidden flex flex-col justify-end select-none', className)}>
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-1">Active Choice</span>
        <h3 className="text-xl font-black text-primary">{options[activeIdx]}</h3>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="mt-3 px-4 py-1.5 rounded-full bg-card border border-border shadow-sm flex items-center gap-1.5 text-xs font-bold text-foreground hover:bg-secondary/40 active:scale-95 transition-all"
        >
          <ChevronUp className={cn('w-4 h-4 transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} />
          <span>Swipe Selector</span>
        </button>
      </div>

      {isOpen && (
        <div
          role="button"
          aria-label="Close selector"
          tabIndex={0}
          className="absolute inset-0 bg-black/40 z-30"
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsOpen(false); } }}
        />
      )}

      <motion.div
        drag="y"
        dragConstraints={{ top: -140, bottom: 0 }}
        dragElastic={0.1}
        style={{ y: springY }}
        onDragEnd={handleDragEnd}
        animate={{ y: isOpen ? -140 : 0 }}
        className="absolute left-0 right-0 bottom-[-140px] h-[180px] bg-card border-t border-border shadow-2xl rounded-t-2xl z-40 cursor-grab active:cursor-grabbing p-4"
      >
        <div className="w-12 h-1 bg-muted rounded-full mx-auto mb-3" />
        <h4 className="text-center text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Slide Left/Right to Choose</h4>

        <div className="relative w-full overflow-hidden flex justify-center py-2">
          {/* Centered target indicator */}
          <div className="absolute top-0 bottom-0 w-[110px] border-2 border-primary/20 bg-primary/5 rounded-xl pointer-events-none z-10 flex items-end justify-center pb-1">
            <Check className="w-4 h-4 text-primary animate-pulse" />
          </div>

          <motion.div
            drag="x"
            dragConstraints={{ left: -((options.length - 1) * 110), right: 0 }}
            style={{ x: springX }}
            onDragEnd={handleCarouselDragEnd}
            className="flex gap-2 cursor-grab active:cursor-grabbing w-fit px-[110px]"
          >
            {options.map((opt, idx) => (
              <div
                key={opt}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveIdx(idx);
                  carouselX.set(-idx * 110);
                  onSelect?.(opt);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIdx(idx); carouselX.set(-idx * 110); onSelect?.(opt); } }}
                className={cn('w-[100px] h-[60px] rounded-xl flex items-center justify-center border font-bold text-xs p-2 text-center transition-colors',
                  idx === activeIdx 
                    ? 'border-primary bg-primary/10 text-primary' 
                    : 'border-border bg-secondary/10 text-muted-foreground'
                )}
              >
                {opt}
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
