"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ScraggableTimelineProps {
  onYearChange?: (year: number) => void;
  className?: string;
}

export const ScraggableTimeline: React.FC<ScraggableTimelineProps> = ({
  onYearChange,
  className,
}) => {
  const years = [2021, 2022, 2023, 2024, 2025, 2026, 2027];
  const [activeYear, setActiveYear] = useState(2024);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 28 });
  const itemWidth = 72;

  const handleDragEnd = (_event: unknown, _info: PanInfo) => {
    const currentX = x.get();
    const targetIdx = Math.max(0, Math.min(years.length - 1, Math.round(-currentX / itemWidth)));
    setActiveYear(years[targetIdx]);
    x.set(-targetIdx * itemWidth);
    onYearChange?.(years[targetIdx]);
    if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] bg-card border border-border rounded-2xl p-4 flex flex-col justify-between select-none shadow-md overflow-hidden', className)}>
      <div className="flex items-center gap-1.5 text-primary border-b border-border/40 pb-2 mb-4">
        <Calendar className="w-4 h-4 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Scrub Roadmap</span>
      </div>

      <div className="relative w-full overflow-hidden flex justify-center py-4 select-none">
        {/* Active focal marker */}
        <div className="absolute top-0 bottom-0 w-[72px] border-x border-primary/20 bg-primary/5 pointer-events-none z-10 flex items-center justify-center rounded-xl">
          <div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
        </div>

        <motion.div
          drag="x"
          dragConstraints={{ left: -((years.length - 1) * itemWidth), right: 0 }}
          style={{ x: springX }}
          onDragEnd={handleDragEnd}
          className="flex gap-0 cursor-grab active:cursor-grabbing px-[124px]"
        >
          {years.map((year, idx) => {
            const isActive = year === activeYear;

            return (
              <div
                key={year}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveYear(year);
                  x.set(-idx * itemWidth);
                  onYearChange?.(year);
                }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveYear(year); x.set(-idx * itemWidth); onYearChange?.(year); } }}
                className={cn('w-[72px] h-[50px] flex flex-col items-center justify-center border-none shrink-0 transition-all font-mono',
                  isActive ? 'scale-115 text-primary font-black font-semibold' : 'text-muted-foreground/50 text-xs font-semibold'
                )}
              >
                <span>{year}</span>
                <span className="text-[7px] text-muted-foreground uppercase tracking-widest mt-1">Milestone</span>
              </div>
            );
          })}
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/20">
        <span className="text-[8px] text-muted-foreground font-extrabold uppercase">Swipe timeline</span>
        <h4 className="text-sm font-black text-primary font-mono">{activeYear} Track</h4>
      </div>
    </div>
  );
};
