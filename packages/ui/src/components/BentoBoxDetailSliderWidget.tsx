'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Sparkles, Terminal, Activity, Layers } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface BentoBoxDetailSliderWidgetProps {
  className?: string;
}

export const BentoBoxDetailSliderWidget: React.FC<BentoBoxDetailSliderWidgetProps> = ({ className }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const items = [
    { title: "Synthesized AI nodes", metric: "99.2% Sync", icon: Sparkles, color: "text-purple-500" },
    { title: "Pipeline Gateway network", metric: "1.2ms Load", icon: Terminal, color: "text-blue-500" },
    { title: "System cluster performance", metric: "100% Up", icon: Activity, color: "text-emerald-500" },
  ];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Bento Box Widget</span>
        <Layers className="w-3.5 h-3.5 text-muted-foreground" />
      </div>

      <div className="w-full flex-1 flex flex-col justify-center gap-4 py-3">
        {/* Metric Selector Card */}
        <div className="grid grid-cols-3 gap-2 w-full">
          {items.map((item, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                type="button"
                key={idx}
                onClick={() => {
                  setActiveIdx(idx);
                  if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(6);
                }}
                className={cn('p-2.5 rounded-xl border flex flex-col items-center gap-1 bg-card hover:border-primary/40 focus:outline-none transition-all',
                  isActive ? 'border-primary ring-2 ring-primary/10 scale-102 shadow-md' : 'border-border'
                )}
              >
                <item.icon className={cn('w-4 h-4', item.color)} />
                <span className="text-[8px] font-black uppercase text-foreground mt-0.5">{item.metric.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
            transition={prefersReducedMotion ? { duration: 0 } : undefined}
            className="w-full rounded-2xl border border-border bg-card p-4 flex flex-col justify-between min-h-[90px] shadow-inner"
          >
            <div>
              <span className="text-[8px] font-mono tracking-widest text-primary font-black uppercase">Active Core status</span>
              <h4 className="text-xs font-black tracking-wide text-foreground mt-1">{items[activeIdx].title}</h4>
            </div>
            <span className="text-[9px] text-muted-foreground font-medium mt-1 leading-snug">Continuous metric reporting mapped from distributed parameter gateways.</span>
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click dashboard metrics to inspect</span>
    </div>
  );
};
