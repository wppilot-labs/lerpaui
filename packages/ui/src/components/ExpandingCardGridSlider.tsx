'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Database, Terminal } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ExpandingCardGridSliderProps {
  className?: string;
}

export const ExpandingCardGridSlider: React.FC<ExpandingCardGridSliderProps> = ({ className }) => {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const prefersReducedMotion = useReducedMotion();

  const panels = [
    { title: "Cognitive AI", tag: "AGENTS", desc: "Self-training visual agents running spring logic weights.", icon: Sparkles, bg: "from-purple-500/10 to-indigo-500/10 hover:border-purple-500/30" },
    { title: "Data Ledger", tag: "GATEWAY", desc: "Secure distributed gateways holding real-time block pipelines.", icon: Terminal, bg: "from-blue-500/10 to-cyan-500/10 hover:border-blue-500/30" },
    { title: "Mesh Net Node", tag: "SHARDS", desc: "Elastic scaling networks ensuring sub-millisecond node responses.", icon: Database, bg: "from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/30" },
  ];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Expanding Grid Deck</span>

      <div className="flex flex-col gap-3 w-full my-auto">
        {panels.map((panel, idx) => {
          const isExpanded = expandedIdx === idx;
          return (
            <motion.div
              key={idx}
              layout
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              onClick={() => {
                setExpandedIdx(isExpanded ? null : idx);
                if (typeof window !== 'undefined' && navigator.vibrate) navigator.vibrate(8);
              }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedIdx(isExpanded ? null : idx); } }}
              className={cn('relative w-full rounded-2xl border bg-gradient-to-r p-3.5 flex flex-col justify-between cursor-pointer transition-all border-border shadow-inner', panel.bg)}
              animate={{
                height: isExpanded ? 110 : 48,
              }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 22 }}
            >
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  <panel.icon className="w-4 h-4 text-primary" />
                  <span className="text-xs font-black tracking-wide text-foreground">{panel.title}</span>
                </div>
                <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">{panel.tag}</span>
              </div>
              
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-2"
                >
                  <p className="text-[9.5px] text-muted-foreground font-medium leading-relaxed">{panel.desc}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click panels to expand elastically</span>
    </div>
  );
};
