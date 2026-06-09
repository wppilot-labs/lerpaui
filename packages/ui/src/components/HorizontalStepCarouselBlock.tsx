'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { cn } from '../lib/cn';

export interface HorizontalStepCarouselBlockProps {
  className?: string;
}

export const HorizontalStepCarouselBlock: React.FC<HorizontalStepCarouselBlockProps> = ({ className }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Define Interface", tag: "STEP 01", desc: "Formulate core design tokens, layout parameters, and accessibility settings.", color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { title: "Integrate Shards", tag: "STEP 02", desc: "Build backend database similarity pipelines with fast sharding layers.", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { title: "Confirm Deploy", tag: "STEP 03", desc: "Launch to multiple distributed edge servers, verifying system health.", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  ];

  const shiftStep = (dir: 'prev' | 'next') => {
    const next = dir === 'prev' ? step - 1 : step + 1;
    if (next >= 0 && next < steps.length) {
      setStep(next);
      if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
    }
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Progress Step Carousel</span>
        <div className="flex gap-1.5">
          <button
            type="button"
            aria-label="Previous step"
            disabled={step === 0}
            onClick={() => shiftStep('prev')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next step"
            disabled={step === steps.length - 1}
            onClick={() => shiftStep('next')}
            className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 disabled:opacity-40 disabled:pointer-events-none transition-all active:scale-90"
          >
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-[180px] flex items-center justify-center z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={cn('w-[240px] h-[140px] border rounded-2xl p-4 flex flex-col justify-between bg-card shadow-md', steps[step].color)}
          >
            <div className="flex justify-between items-start">
              <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">{steps[step].tag}</span>
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <Check className="w-3 h-3" />
              </div>
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wide text-foreground">{steps[step].title}</h4>
              <p className="text-[9px] text-muted-foreground font-medium leading-relaxed mt-1">{steps[step].desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Timeline indicators */}
      <div className="w-full flex items-center gap-2 px-1 z-10">
        {steps.map((_, idx) => {
          const isActive = idx <= step;
          return (
            <div 
              key={idx} 
              className={cn('h-1 flex-1 rounded-full transition-all duration-300',
                isActive ? 'bg-primary' : 'bg-border'
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
