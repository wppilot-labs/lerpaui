'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles, Database, Terminal, Shield } from 'lucide-react';
import { cn } from '../lib/cn';

export interface TimelineNavigationSliderRowProps {
  className?: string;
}

export const TimelineNavigationSliderRow: React.FC<TimelineNavigationSliderRowProps> = ({ className }) => {
  const [activeIdx, setActiveIdx] = useState(0);

  const steps = [
    { year: "Phase 1", title: "Core Genesis", desc: "UI engine and basic tokens baseline.", icon: Sparkles, color: "text-purple-500 bg-purple-500/10 border-purple-500/20" },
    { year: "Phase 2", title: "Transactional", desc: "Interactive cards and credit flips.", icon: Terminal, color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
    { year: "Phase 3", title: "Mesh Net Node", desc: "Complex grids and visual locators.", icon: Database, color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
    { year: "Phase 4", title: "Tactile Keypad", desc: "Sensor-first gestures and dial rings.", icon: Shield, color: "text-orange-500 bg-orange-500/10 border-orange-500/20" },
  ];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Timeline Nav Matrix</span>

      <div className="relative w-full flex items-center justify-between px-2 py-4">
        {/* Connection Bar */}
        <div className="absolute left-4 right-4 h-0.5 bg-border z-0" />
        <motion.div 
          animate={{ width: `${(activeIdx / (steps.length - 1)) * 100}%` }}
          className="absolute left-4 h-0.5 bg-primary z-0 max-w-[calc(100%-32px)]"
        />

        {steps.map((step, idx) => {
          const isActive = idx <= activeIdx;
          const isCurrent = idx === activeIdx;
          return (
            <button
              key={idx}
              onClick={() => {
                setActiveIdx(idx);
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(10);
              }}
              className="relative z-10 w-8 h-8 rounded-full border bg-card flex items-center justify-center hover:border-primary/45 transition-colors focus:outline-none"
              style={{
                borderColor: isCurrent ? 'var(--primary)' : isActive ? 'var(--primary)' : 'var(--border)',
              }}
            >
              <step.icon className={cn('w-3.5 h-3.5', isActive ? 'text-primary' : 'text-muted-foreground')} />
              <div className="absolute top-9 text-[8px] font-black uppercase tracking-wider text-muted-foreground whitespace-nowrap">{step.year}</div>
            </button>
          );
        })}
      </div>

      {/* Details Box */}
      <motion.div
        key={activeIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className={cn('w-full border rounded-2xl p-4 flex flex-col gap-1.5 bg-card', steps[activeIdx].color)}
      >
        <span className="text-[8px] font-mono tracking-widest uppercase bg-secondary/40 px-2 py-0.5 rounded-full w-max text-foreground/80 font-extrabold">Active Milestone</span>
        <h4 className="text-xs font-black tracking-wide text-foreground mt-1">{steps[activeIdx].title}</h4>
        <p className="text-[10px] text-muted-foreground font-medium leading-normal">{steps[activeIdx].desc}</p>
      </motion.div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click nodes to navigate roadmap</span>
    </div>
  );
};
