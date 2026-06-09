"use client";

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Check, Cog } from 'lucide-react';
import { cn } from '../lib/cn';

export interface InteractiveAssemblyGuideProps {
  steps?: { title: string; desc: string }[];
  className?: string;
}

export const InteractiveAssemblyGuide: React.FC<InteractiveAssemblyGuideProps> = ({
  steps = [
    { title: "Unbox Chassis", desc: "Carefully layout main framework rails on protective foam layers." },
    { title: "Attach Support Plinths", desc: "Use metric Allen screws to secure base stabilization modules." },
    { title: "Configure Interface Panel", desc: "Inject prompt cables to active structural logic terminals." }
  ],
  className,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);

  const handleComplete = (idx: number) => {
    if (!completed.includes(idx)) {
      setCompleted(prev => [...prev, idx]);
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1);
      }
    }
  };

  return (
    <div className={cn('w-full max-w-[340px] p-5 border border-border bg-card shadow-lg rounded-2xl select-none flex flex-col gap-4 relative', className)}>
      <div className="flex items-center gap-2">
        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
          <Cog className="w-4 h-4 animate-spin-slow" />
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Setup Instructions</span>
      </div>

      <div className="relative flex flex-col gap-5 pt-2">
        {/* Connection drawing trace lines */}
        <div className="absolute left-[15px] top-6 bottom-6 w-[2px] bg-secondary pointer-events-none" />
        <div 
          className="absolute left-[15px] top-6 w-[2px] bg-primary transition-all duration-500 pointer-events-none" 
          style={{ height: `${(completed.length / (steps.length - 1)) * 80}%` }}
        />

        {steps.map((st, idx) => {
          const isDone = completed.includes(idx);
          const isActive = activeStep === idx;

          return (
            <div key={idx} className="flex gap-4 items-start relative z-10">
              {/* Step indicator node circle */}
              <motion.button
                onClick={() => setActiveStep(idx)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 font-mono text-xs font-bold cursor-pointer',
                  isDone ? 'bg-primary border-primary text-white' : 
                  isActive ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground'
                )}
              >
                {isDone ? <Check className="w-4 h-4" /> : idx + 1}
              </motion.button>

              <div className="flex flex-col gap-0.5">
                <span className={cn('text-xs font-extrabold transition-colors', 
                  isActive ? 'text-foreground' : 'text-muted-foreground',
                  isDone && 'line-through opacity-60'
                )}>
                  {st.title}
                </span>
                {isActive && (
                  <motion.p 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="text-[10px] text-muted-foreground leading-relaxed mt-1"
                  >
                    {st.desc}
                  </motion.p>
                )}
                {isActive && !isDone && (
                  <button 
                    onClick={() => handleComplete(idx)}
                    className="mt-2 self-start px-3 py-1 bg-primary text-white font-bold text-[9px] uppercase tracking-wider rounded-lg hover:brightness-115 active:scale-95 cursor-pointer"
                  >
                    Complete Step
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
