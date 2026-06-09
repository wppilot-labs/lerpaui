"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Clock, Milestone } from 'lucide-react';
import { cn } from '../lib/cn';

export interface TimelineStep {
  /** Label shown on the dial (e.g. year, version, label). */
  year: string;
  /** Step title shown in the detail panel. */
  title: string;
  /** Short description shown in the detail panel. */
  desc: string;
}

export interface CircularRadialTimelineProps {
  className?: string;
  /** Steps along the timeline. */
  steps?: TimelineStep[];
  /** Header label shown above the dial. */
  label?: string;
  /** Initial active step index. */
  defaultIndex?: number;
}

const DEFAULT_STEPS: TimelineStep[] = [
  { year: "2023", title: "Discovery", desc: "Initial research and concept validation milestones." },
  { year: "2024", title: "Foundation", desc: "Core architecture and design system established." },
  { year: "2025", title: "Iteration", desc: "Major feature expansions and product launches." },
  { year: "2026", title: "Scale", desc: "Optimizing for growth and broader audience reach." }
];

export const CircularRadialTimeline: React.FC<CircularRadialTimelineProps> = ({
  className,
  steps = DEFAULT_STEPS,
  label = "Radial Milestones",
  defaultIndex = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  return (
    <div className={cn('w-full max-w-[340px] p-5 border border-border bg-card shadow-lg rounded-2xl select-none flex flex-col gap-4 relative overflow-hidden', className)}>
      <div className="flex items-center gap-2 pb-3 border-b border-border/40 mb-1">
        <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Milestone className="w-4 h-4 text-indigo-400" />
        </div>
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">{label}</span>
      </div>

      <div className="flex items-center justify-center py-4 relative h-36">
        {/* Connection track path line */}
        <div className="absolute inset-x-6 h-[2px] bg-secondary pointer-events-none" />
        <div 
          className="absolute left-6 h-[2px] bg-indigo-500 transition-all duration-500 pointer-events-none" 
          style={{ width: ((activeIndex / (steps.length - 1)) * 82) + "%" }}
        />

        <div className="relative flex justify-between w-full px-4 z-10">
          {steps.map((st, idx) => {
            const isActive = activeIndex === idx;
            const isDone = idx < activeIndex;

            return (
              <div key={idx} className="flex flex-col items-center">
                <motion.button
                  onClick={() => setActiveIndex(idx)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'w-9 h-9 rounded-full border flex items-center justify-center font-bold text-[10.5px] cursor-pointer transition-colors duration-300 font-mono relative',
                    isActive ? 'bg-indigo-600 border-indigo-500 text-white' :
                    isDone ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-400' : 'bg-card border-border text-muted-foreground'
                  )}
                  style={isActive ? { boxShadow: '0 0 12px rgba(var(--primary-rgb), 0.5)' } : undefined}
                >
                  {st.year}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="min-h-[90px] bg-secondary/35 border border-border/40 p-4 rounded-xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            transition={{ duration: 0.22 }}
            className="flex flex-col gap-1"
          >
            <span className="text-xs font-black text-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              {steps[activeIndex].title}
            </span>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              {steps[activeIndex].desc}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
