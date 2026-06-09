"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Plus, Minus, Award, ShieldCheck, Truck } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ProductBenefitAccordionProps {
  className?: string;
}

export const ProductBenefitAccordion: React.FC<ProductBenefitAccordionProps> = ({ className }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const benefits = [
    { 
      title: "Lifetime Warranty Protection", 
      desc: "Every visual component model features lifelong structural validation. In case of updates we deliver hotkey adjustments safely.", 
      icon: ShieldCheck, 
      color: "from-emerald-500/10 to-transparent border-emerald-500/25 text-emerald-400" 
    },
    { 
      title: "Global Express Logistics", 
      desc: "Fast delivery of prompt variables code straight onto hosting clusters. We support bun/npm/pnpm targets securely.", 
      icon: Truck, 
      color: "from-indigo-500/10 to-transparent border-indigo-500/25 text-indigo-400" 
    },
    { 
      title: "Accredited Elite Certs", 
      desc: "Conforms fully to international Zod specifications schema bounds and accessibility guidelines ratios checks.", 
      icon: Award, 
      color: "from-amber-500/10 to-transparent border-amber-500/25 text-amber-400" 
    }
  ];

  return (
    <div className={cn('w-full max-w-[340px] p-5 border border-border bg-card shadow-lg rounded-2xl select-none flex flex-col gap-3 relative', className)}>
      <div className="flex items-center gap-1.5 pb-2 border-b border-border/40 mb-1">
        <Award className="w-4 h-4 text-primary animate-pulse" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Product Benefits</span>
      </div>

      <div className="space-y-2.5">
        {benefits.map((benefit, idx) => {
          const isOpen = activeIndex === idx;
          const Icon = benefit.icon;

          return (
            <div 
              key={idx}
              className={cn(
                'border rounded-xl transition-all duration-300 bg-gradient-to-tr overflow-hidden shadow-sm',
                isOpen ? benefit.color : 'border-border/60 bg-transparent'
              )}
            >
              <button
                type="button"
                onClick={() => setActiveIndex(isOpen ? null : idx)}
                className="w-full p-3.5 flex items-center justify-between cursor-pointer active:scale-99 select-none"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  <span className={cn('text-[11.5px] font-extrabold text-left transition-colors', isOpen ? 'text-foreground font-black' : 'text-muted-foreground')}>{benefit.title}</span>
                </div>
                {isOpen ? <Minus className="w-3.5 h-3.5 text-muted-foreground" /> : <Plus className="w-3.5 h-3.5 text-muted-foreground" />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                  >
                    <p className="px-3.5 pb-4 pt-0.5 text-[10px] text-muted-foreground leading-relaxed">
                      {benefit.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
