'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DepthSlide {
  title: string;
  tag: string;
  /** Tailwind gradient classes (without `bg-gradient-to-br`). */
  color: string;
  /** Body description shown on the slide. */
  desc?: string;
}

export interface DiagonalParallaxDepthSliderProps {
  className?: string;
  /** Slides to switch between. */
  slides?: DepthSlide[];
  /** Header label. */
  label?: string;
}

const DEFAULT_SLIDES: DepthSlide[] = [
  { title: "Core Layer", tag: "Compute", color: "from-purple-900/60 to-indigo-950/60", desc: "Diagonal spring translations carry beautiful visual slide segments across layouts." },
  { title: "Sync Network", tag: "Mesh", color: "from-blue-900/60 to-cyan-950/60", desc: "Diagonal spring translations carry beautiful visual slide segments across layouts." },
  { title: "Vector Vault", tag: "Storage", color: "from-emerald-900/60 to-teal-950/60", desc: "Diagonal spring translations carry beautiful visual slide segments across layouts." },
];

export const DiagonalParallaxDepthSlider: React.FC<DiagonalParallaxDepthSliderProps> = ({
  className,
  slides = DEFAULT_SLIDES,
  label = "45-Degree Diagonal Slide",
}) => {
  const [slide, setSlide] = useState(0);

  const shiftSlide = (dir: 'prev' | 'next') => {
    const next = dir === 'prev' ? slide - 1 : slide + 1;
    if (next >= 0 && next < slides.length) {
      setSlide(next);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    }
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={slide === 0}
            onClick={() => shiftSlide('prev')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={slide === slides.length - 1}
            onClick={() => shiftSlide('next')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden shadow-inner bg-card z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ opacity: 0, x: 120, y: 120 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -120, y: -120 }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
            className={cn('absolute inset-0 bg-gradient-to-br p-4 flex flex-col justify-between text-white', slides[slide].color)}
          >
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase">{slides[slide].tag}</span>
              <Layers className="w-4 h-4 opacity-80" />
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wide">{slides[slide].title}</h4>
              {slides[slide].desc && <p className="text-[9px] leading-relaxed opacity-85 mt-1">{slides[slide].desc}</p>}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click arrows to slide diagonally</span>
    </div>
  );
};
