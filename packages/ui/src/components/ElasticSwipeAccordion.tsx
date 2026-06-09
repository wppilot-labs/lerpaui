"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ElasticSwipeAccordionProps {
  className?: string;
}

export const ElasticSwipeAccordion: React.FC<ElasticSwipeAccordionProps> = ({
  className,
}) => {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const dragY = useMotionValue(0);
  const _springY = useSpring(dragY, { stiffness: 350, damping: 25 });
  const prefersReducedMotion = useReducedMotion();

  const rows = [
    { title: 'System Orchestrator', desc: 'SaaS edge worker pipelines processing live prompt streams.' },
    { title: 'Relational Index', desc: 'PostgreSQL distributed indices running optimized query engines.' },
    { title: 'Ledger Engine', desc: 'Secure blockchain transactions and haptic billing logs.' },
  ];

  const handleDragEnd = (idx: number, info: PanInfo) => {
    if (info.offset.y > 60) {
      setActiveIdx(idx);
    } else if (info.offset.y < -30) {
      setActiveIdx(null);
    }
    dragY.set(0);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-2xl border border-border flex flex-col justify-start p-4 gap-2 select-none overflow-hidden', className)}>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest text-center mb-1">Elastic Accordion</span>

      {rows.map((row, idx) => {
        const isOpen = activeIdx === idx;

        return (
          <div key={idx} className="relative w-full border border-border rounded-xl bg-card overflow-hidden">
            <motion.div
              drag={isOpen ? false : 'y'}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.4}
              onDragEnd={(_e, info) => handleDragEnd(idx, info)}
              role="button"
              tabIndex={0}
              aria-expanded={isOpen}
              onClick={() => setActiveIdx(isOpen ? null : idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveIdx(isOpen ? null : idx); } }}
              className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-secondary/25 transition-colors"
            >
              <span className="text-xs font-black text-foreground uppercase tracking-wide">{row.title}</span>
              <ChevronDown className={cn('w-4 h-4 text-muted-foreground transition-transform duration-300', isOpen ? 'rotate-180 text-primary' : 'rotate-0')} />
            </motion.div>

            <motion.div
              animate={{ height: isOpen ? 'auto' : 0 }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 280, damping: 25 }}
              className="overflow-hidden bg-secondary/10"
            >
              <div className="p-4 border-t border-border/60">
                <p className="text-[10px] text-muted-foreground leading-relaxed">{row.desc}</p>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};
