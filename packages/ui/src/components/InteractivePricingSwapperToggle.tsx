'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { DollarSign } from 'lucide-react';
import { cn } from '../lib/cn';

export interface InteractivePricingSwapperToggleProps {
  className?: string;
}

export const InteractivePricingSwapperToggle: React.FC<InteractivePricingSwapperToggleProps> = ({ className }) => {
  const [cycle, setCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Pricing Swapper Toggle</span>

      <div className="flex flex-col items-center gap-4 w-full my-auto">
        {/* Toggle Switcher */}
        <div className="relative border border-border/40 rounded-xl bg-card p-1 flex gap-1 shadow-sm w-max">
          <button
            type="button"
            onClick={() => setCycle('monthly')}
            className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider relative transition-colors cursor-pointer", cycle === 'monthly' ? "text-foreground z-10" : "text-muted-foreground hover:text-foreground")}
          >
            {cycle === 'monthly' && (
              <motion.div 
                layoutId="swapperGlow23" 
                className="absolute inset-0 rounded-lg bg-secondary border border-border/40"
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              />
            )}
            <span className="relative z-20">Monthly</span>
          </button>
          
          <button
            type="button"
            onClick={() => setCycle('annual')}
            className={cn("px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider relative transition-colors cursor-pointer", cycle === 'annual' ? "text-foreground z-10" : "text-muted-foreground hover:text-foreground")}
          >
            {cycle === 'annual' && (
              <motion.div 
                layoutId="swapperGlow23" 
                className="absolute inset-0 rounded-lg bg-secondary border border-border/40"
                transition={{ type: "spring", stiffness: 220, damping: 20 }}
              />
            )}
            <span className="relative z-20">Annual</span>
          </button>
        </div>

        {/* Display cost based on toggle */}
        <div className="border border-border/30 rounded-2xl p-4 bg-card w-full max-w-[240px] shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">ENTERPRISE HUB</span>
            {cycle === 'annual' && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-emerald-500 text-[6px] font-mono tracking-widest uppercase font-black"
              >
                SAVE 20%
              </motion.span>
            )}
          </div>
          <div className="flex items-baseline mt-3">
            <DollarSign className="w-4 h-4 text-foreground/75 shrink-0" />
            <motion.span 
              key={cycle}
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl font-black text-foreground"
            >
              {cycle === 'annual' ? '79' : '99'}
            </motion.span>
            <span className="text-[8px] font-mono text-muted-foreground ml-1.5 uppercase">/MO</span>
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Toggle segmented switch elastically</span>
    </div>
  );
};
