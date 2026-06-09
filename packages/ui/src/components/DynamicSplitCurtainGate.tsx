'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Layers, RefreshCw, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DynamicSplitCurtainGateProps {
  className?: string;
}

export const DynamicSplitCurtainGate: React.FC<DynamicSplitCurtainGateProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <div className="flex justify-between items-center w-full z-10">
        <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Split Curtain Reveal Gate</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg border border-border bg-card text-muted-foreground hover:bg-secondary/40 transition-all active:scale-95 flex items-center gap-1"
        >
          <RefreshCw className={cn('w-3 h-3', isOpen ? 'rotate-180' : '')} />
          <span className="text-[8px] font-black uppercase tracking-wider">{isOpen ? "Reset" : "Open"}</span>
        </button>
      </div>

      <div className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card shadow-inner my-auto flex flex-col justify-between p-4 z-0">
        <div className="flex justify-between items-start">
          <span className="text-[8px] font-mono tracking-widest bg-secondary/40 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">Gate Active</span>
          <Cpu className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h4 className="text-xs font-black tracking-wide">Dynamic Split Gate</h4>
          <p className="text-[9px] text-muted-foreground leading-relaxed mt-1">Staggered curtain elements slide away diagonally or vertically to reveal dashboard screens.</p>
        </div>

        {/* Curtain Gate Layers */}
        <AnimatePresence>
          {!isOpen && (
            <div className="absolute inset-0 flex z-20 pointer-events-none">
              {/* Left panel curtain */}
              <motion.div
                initial={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18 }}
                className="w-1/2 h-full bg-gradient-to-tr from-purple-900 to-indigo-900 border-r border-white/10 flex items-center justify-end pr-4 text-white/40"
              >
                <Layers className="w-6 h-6 animate-pulse" />
              </motion.div>
              {/* Right panel curtain */}
              <motion.div
                initial={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18 }}
                className="w-1/2 h-full bg-gradient-to-bl from-indigo-900 to-purple-900 border-l border-white/10 flex items-center justify-start pl-4 text-white/44"
              >
                <Layers className="w-6 h-6 animate-pulse" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click Open to trigger curtain transitions</span>
    </div>
  );
};
