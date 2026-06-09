'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ChevronDown, Award } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AccordionPricingComparisonProps {
  className?: string;
}

export const AccordionPricingComparison: React.FC<AccordionPricingComparisonProps> = ({ className }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const comparisons = [
    { title: "SLA Support Time", standard: "24h Email SLA", premium: "1h Premium Phone SLA", border: "border-purple-500/20" },
    { title: "Compiler Channels", standard: "3 Parallel pipelines", premium: "Unlimited compiler networks", border: "border-cyan-500/20" }
  ];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Pricing Accordion</span>

      <div className="flex flex-col gap-3 w-full my-auto">
        {comparisons.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <div
              key={idx}
              className={cn(
                "border rounded-2xl bg-card transition-all duration-300 shadow-sm overflow-hidden cursor-pointer",
                isExpanded ? "border-primary/45" : "border-border/30 hover:border-muted-foreground/20"
              )}
              role="button"
              tabIndex={0}
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedIndex(isExpanded ? null : idx); } }}
            >
              <div className="p-3.5 flex items-center justify-between w-full">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-[9.5px] font-black uppercase text-foreground">{item.title}</h4>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-300", isExpanded ? "rotate-180 text-foreground" : "")} />
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : undefined}
                    className="border-t border-border/20 px-3.5 pb-3.5 pt-2.5 bg-card/45 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between text-[8px] font-mono border-b border-border/10 pb-1.5">
                      <span className="text-muted-foreground">STANDARD PLAN:</span>
                      <span className="text-foreground uppercase font-black">{item.standard}</span>
                    </div>
                    <div className="flex items-center justify-between text-[8px] font-mono">
                      <span className="text-primary font-bold">PREMIUM PLAN:</span>
                      <span className="text-primary uppercase font-black">{item.premium}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click rows to compare features side-by-side</span>
    </div>
  );
};
