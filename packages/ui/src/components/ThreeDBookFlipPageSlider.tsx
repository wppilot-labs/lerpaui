'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ThreeDBookFlipPageSliderProps {
  className?: string;
}

export const ThreeDBookFlipPageSlider: React.FC<ThreeDBookFlipPageSliderProps> = ({ className }) => {
  const [page, setPage] = useState(0);

  const pages = [
    { title: "UI Design Manual", chapter: "Chapter 1", text: "Premium web aesthetic principles leveraging dark micro-animations, translucent layers, and high-fidelity spring systems." },
    { title: "Motion Dynamics", chapter: "Chapter 2", text: "Spring physics rules defining perfect damping balances, canvas particles inertia trackers, and gesture response models." },
    { title: "Architecture Ledger", chapter: "Chapter 3", text: "Sync patterns compiling monorepos, validating item schemas with Zod, and deploying atomic block packages." },
  ];

  const shiftPage = (dir: 'prev' | 'next') => {
    const next = dir === 'prev' ? page - 1 : page + 1;
    if (next >= 0 && next < pages.length) {
      setPage(next);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    }
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">3D Book Page Flip</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page === 0}
            onClick={() => shiftPage('prev')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next page"
            disabled={page === pages.length - 1}
            onClick={() => shiftPage('next')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div 
        className="relative w-full h-[180px] flex items-center justify-center z-0"
        style={{ perspective: '1200px' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className="absolute w-[240px] h-[150px] bg-card border border-border rounded-xl shadow-2xl p-4 flex flex-col justify-between origin-left"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Book Spine Overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-secondary/50 to-transparent border-r border-border/10 rounded-l-xl pointer-events-none" />

            <div className="flex justify-between items-start pl-3">
              <span className="text-[8px] font-mono tracking-widest bg-secondary/50 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">{pages[page].chapter}</span>
              <BookOpen className="w-3.5 h-3.5 text-primary" />
            </div>

            <div className="pl-3">
              <h4 className="text-xs font-black tracking-wide text-foreground">{pages[page].title}</h4>
              <p className="text-[9px] text-muted-foreground font-medium leading-relaxed mt-1 line-clamp-3">{pages[page].text}</p>
            </div>

            <div className="w-full flex justify-end">
              <span className="text-[8px] font-mono text-muted-foreground/60 font-bold">PAGE {page + 1} OF {pages.length}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click arrows to flip pages in 3D</span>
    </div>
  );
};
