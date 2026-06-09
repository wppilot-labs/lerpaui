"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ResponsiveMultiStepWizardProps {
  className?: string;
}

export const ResponsiveMultiStepWizard: React.FC<ResponsiveMultiStepWizardProps> = ({ className }) => {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Define Model", desc: "Configure parameter weight settings for Claude or Llama" },
    { title: "Setup API Keys", desc: "Inject access keys credentials to connect the gateway" },
    { title: "Verify System", desc: "Perform Zod registry checks and automated compile tests" }
  ];

  return (
    <div className={cn('w-full max-w-[340px] p-5 border border-border bg-card shadow-lg rounded-2xl select-none flex flex-col gap-4 relative', className)}>
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Setup Wizard</span>
        <span className="text-[9px] font-black font-mono bg-secondary px-2 py-0.5 rounded border border-border text-foreground">Step {(step + 1) + " of 3"}</span>
      </div>

      {/* Progress timeline line */}
      <div className="relative flex justify-between items-center py-2">
        <div className="absolute inset-x-6 h-[2px] bg-secondary pointer-events-none" />
        <div 
          className="absolute left-6 h-[2px] bg-primary transition-all duration-300 pointer-events-none" 
          style={{ width: ((step / (steps.length - 1)) * 82) + "%" }}
        />

        {steps.map((st, idx) => {
          const isActive = step === idx;
          const isDone = idx < step;

          return (
            <button
              type="button"
              key={idx}
              onClick={() => setStep(idx)}
              className={cn(
                'w-7 h-7 rounded-full border flex items-center justify-center text-[10px] font-bold z-10 transition-colors cursor-pointer select-none',
                isActive ? 'bg-primary border-primary text-white' :
                isDone ? 'bg-primary/20 border-primary text-primary' : 'bg-card border-border text-muted-foreground'
              )}
            >
              {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
            </button>
          );
        })}
      </div>

      <div className="min-h-[80px] bg-secondary/25 border border-border/30 p-3.5 rounded-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.18 }}
            className="flex flex-col gap-0.5"
          >
            <span className="text-xs font-black text-foreground">{steps[step].title}</span>
            <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1">
              {steps[step].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between border-t border-border/40 pt-3">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep(prev => prev - 1)}
          className="px-3.5 py-1.5 border border-border/80 hover:border-primary/20 text-muted-foreground hover:text-foreground rounded-lg disabled:opacity-40 active:scale-95 transition-all text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          type="button"
          disabled={step === steps.length - 1}
          onClick={() => setStep(prev => prev + 1)}
          className="px-3.5 py-1.5 bg-primary text-white hover:brightness-110 rounded-lg disabled:opacity-40 active:scale-95 transition-all text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed shadow-sm"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
