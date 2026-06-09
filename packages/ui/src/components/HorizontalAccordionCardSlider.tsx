'use client';

import React, { useMemo, useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles, Database, Terminal } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface AccordionStep {
  /** Title shown when the panel is expanded. */
  title: string;
  /** Short tag/category label. */
  tag: string;
  /** Description shown when expanded. */
  desc: string;
  /** Icon component (e.g. from lucide-react). */
  icon: React.ComponentType<{ className?: string }>;
  /** Tailwind gradient + border classes (without `bg-gradient-to-br`). */
  bg: string;
}

export interface HorizontalAccordionCardSliderProps {
  className?: string;
  /** Accordion steps. */
  steps?: AccordionStep[];
  /** Header label. */
  label?: string;
  /** Initially expanded panel index, or `null` for none. */
  defaultIndex?: number | null;
}

const DEFAULT_STEPS: AccordionStep[] = [
  { title: "Compute", tag: "AI", desc: "Adaptive parameter tuning layers.", icon: Sparkles, bg: "from-purple-500/10 to-indigo-500/10 border-purple-500/20 text-purple-500" },
  { title: "Gateway", tag: "NET", desc: "Secure proxy pipeline syncs.", icon: Terminal, bg: "from-blue-500/10 to-cyan-500/10 border-blue-500/20 text-blue-500" },
  { title: "Storage", tag: "DB", desc: "Sub-millisecond similarity vector lists.", icon: Database, bg: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-500" },
];

export const HorizontalAccordionCardSlider: React.FC<HorizontalAccordionCardSliderProps> = ({
  className,
  steps: stepsProp,
  label = "Horizontal Accordion",
  defaultIndex = 0,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(defaultIndex);
  const prefersReducedMotion = usePrefersReducedMotion();

  const steps = useMemo(() => stepsProp ?? DEFAULT_STEPS, [stepsProp]);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div className="flex gap-2.5 w-full h-[180px] my-auto items-center">
        {steps.map((step, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <motion.div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              className={cn('relative h-[150px] rounded-2xl border bg-gradient-to-br p-3.5 flex flex-col justify-between cursor-pointer transition-all border-border shadow-md hover:shadow-lg overflow-hidden', step.bg)}
              animate={prefersReducedMotion ? undefined : {
                flexGrow: isHovered ? 4 : 1,
              }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 20 }}
              style={{ willChange: prefersReducedMotion ? undefined : 'flex-grow' }}
            >
              <div className="flex items-center gap-2 shrink-0">
                <step.icon className="w-4 h-4 shrink-0 text-primary" />
                {isHovered && (
                  <motion.span
                    initial={prefersReducedMotion ? false : { opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-xs font-black tracking-wide text-foreground"
                  >
                    {step.title}
                  </motion.span>
                )}
              </div>

              {isHovered ? (
                <motion.div
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={prefersReducedMotion ? { duration: 0 } : { delay: 0.1 }}
                  className="shrink-0 mt-auto"
                >
                  <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">{step.tag}</span>
                  <p className="text-[9px] text-muted-foreground font-medium leading-tight mt-1.5">{step.desc}</p>
                </motion.div>
              ) : (
                <div className="text-[9px] font-black uppercase text-muted-foreground mx-auto origin-center mt-auto">
                  {step.tag}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover panels to expand horizontally</span>
    </div>
  );
};
