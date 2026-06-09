'use client';

import React from 'react';
import { motion} from "framer-motion";
import { Cpu, Award, Layers } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface BentoGridExecutiveLayoutProps {
  className?: string;
}

export const BentoGridExecutiveLayout: React.FC<BentoGridExecutiveLayoutProps> = ({ className }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Executive Bento Layout</span>

      {/* Bento Grid Panel */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2.5 w-full h-[220px] my-auto">
        
        {/* Cell 1: Portrait/Expertise */}
        <div className="border border-border/40 rounded-2xl bg-card p-3 flex flex-col justify-between bg-gradient-to-br from-card to-purple-950/20">
          <div className="flex justify-between items-start">
            <div className="w-6 h-6 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-[6px] font-mono bg-white/5 border border-border/40 px-1 py-0.5 rounded text-muted-foreground uppercase">CHIEF</span>
          </div>
          <div className="flex flex-col mt-2">
            <h5 className="text-[9.5px] font-black uppercase text-foreground leading-tight">Evelyn Vane</h5>
            <span className="text-[7px] text-muted-foreground font-mono mt-0.5">AI COMPILERS</span>
          </div>
        </div>

        {/* Cell 2: Performance Mini-Graph */}
        <div className="border border-border/40 rounded-2xl bg-card p-3 flex flex-col justify-between bg-gradient-to-br from-card to-cyan-950/20">
          <div className="flex justify-between items-center">
            <span className="text-[6.5px] font-mono text-muted-foreground uppercase">EFFICIENCY</span>
            <span className="text-[7.5px] font-black text-cyan-400">99.8%</span>
          </div>
          {/* Animated SVG Sparkline */}
          <div className="h-10 w-full overflow-hidden flex items-end">
            <svg viewBox="0 0 100 40" className="w-full h-8 overflow-visible">
              <motion.path
                d="M0,35 Q15,10 30,25 T60,5 T90,20 L100,20"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2.5"
                initial={prefersReducedMotion ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={prefersReducedMotion ? { duration: 0 } : { duration: 2, ease: "easeInOut" }}
              />
            </svg>
          </div>
          <span className="text-[6px] text-muted-foreground font-mono uppercase">OPTIMIZED RUNTIMES</span>
        </div>

        {/* Cell 3: Status Beacon */}
        <div className="border border-border/40 rounded-2xl bg-card p-3 flex flex-col justify-between bg-gradient-to-br from-card to-emerald-950/20">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[5.5px] font-mono text-emerald-400 uppercase font-black">AVAILABLE</span>
            </div>
            <Award className="w-3.5 h-3.5 text-emerald-400 opacity-80" />
          </div>
          <div className="flex flex-col mt-2">
            <span className="text-[6.5px] font-mono text-muted-foreground uppercase">LOCATION</span>
            <h5 className="text-[9.5px] font-black uppercase text-foreground leading-tight">SF OFFICE</h5>
          </div>
        </div>

        {/* Cell 4: Expertise Indicators */}
        <div className="border border-border/40 rounded-2xl bg-card p-3 flex flex-col justify-between bg-gradient-to-br from-card to-secondary/35">
          <div className="flex justify-between items-start">
            <span className="text-[6.5px] font-mono text-muted-foreground uppercase">TAGS</span>
            <Layers className="w-3.5 h-3.5 text-primary opacity-60" />
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            <span className="text-[5.5px] font-mono bg-white/5 border border-border/40 px-1 py-0.5 rounded text-foreground uppercase">RUST</span>
            <span className="text-[5.5px] font-mono bg-white/5 border border-border/40 px-1 py-0.5 rounded text-foreground uppercase">LLVM</span>
            <span className="text-[5.5px] font-mono bg-white/5 border border-border/40 px-1 py-0.5 rounded text-foreground uppercase">NODE</span>
          </div>
        </div>

      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Bento arrangement packing leadership bio cards</span>
    </div>
  );
};
