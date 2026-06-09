'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface LiquidMorphSliderTransitionsProps {
  className?: string;
}

export const LiquidMorphSliderTransitions: React.FC<LiquidMorphSliderTransitionsProps> = ({ className }) => {
  const [slide, setSlide] = useState(0);

  const slides = [
    { title: "Organic Morph Deck", text: "Switches slide indices leveraging beautiful liquid SVG blur matrices.", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { title: "Fluid Processing Node", text: "Liquid merges and separates to construct visual layout assets.", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { title: "Elastic Shard Database", text: "Synchronized edge parameters executing similarity vector sweeps.", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  ];

  const shiftSlide = (dir: 'prev' | 'next') => {
    const next = dir === 'prev' ? slide - 1 : slide + 1;
    if (next >= 0 && next < slides.length) {
      setSlide(next);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    }
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      {/* SVG Liquid Filter Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none">
        <defs>
          <filter id="liquid-slider-morph">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Liquid Morph transitions</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous slide"
            disabled={slide === 0}
            onClick={() => shiftSlide('prev')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            disabled={slide === slides.length - 1}
            onClick={() => shiftSlide('next')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div 
        className="relative w-full h-[180px] flex items-center justify-center z-0"
        style={{ filter: 'url(#liquid-slider-morph)' }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={slide}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 140, damping: 15 }}
            className={cn('w-[240px] h-[140px] border rounded-3xl p-4 flex flex-col justify-between bg-card shadow-lg', slides[slide].color)}
          >
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">MORPH SLIDE</span>
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wide text-foreground">{slides[slide].title}</h4>
              <p className="text-[9px] text-muted-foreground font-medium leading-normal mt-1">{slides[slide].text}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click arrows to trigger goo transitions</span>
    </div>
  );
};
