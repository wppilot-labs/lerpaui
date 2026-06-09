'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Award, Compass, MessageSquare, Phone } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FlipCardProfileHorizontalProps {
  className?: string;
}

export const FlipCardProfileHorizontal: React.FC<FlipCardProfileHorizontalProps> = ({ className }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Horizontal Flip card</span>

      <div className="w-full h-[180px] my-auto [perspective:1000px]">
        <motion.div
          animate={{ rotateX: prefersReducedMotion ? 0 : (isFlipped ? 180 : 0) }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}
          className="relative w-full h-full [transform-style:preserve-3d]"
        >
          {/* FRONT */}
          <div className="absolute inset-0 w-full h-full border border-border rounded-2xl bg-card p-4 flex flex-col justify-between backface-hidden [backface-visibility:hidden] bg-gradient-to-tr from-card to-secondary/10">
            {/* Full-face flip trigger (front has no other interactive content) */}
            <button
              type="button"
              aria-label="Flip to contact details"
              onClick={() => setIsFlipped(true)}
              className="absolute inset-0 z-20 cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
            <div className="flex justify-between items-start w-full">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-secondary">
                <Compass className="w-4 h-4 text-foreground/80" />
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[6.5px] font-mono uppercase text-emerald-400 font-black">ACTIVE NOW</span>
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">MARKETING OUTREACH</span>
              <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Evelyn Vane</h4>
              <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1">
                Drives visual theme galleries and responsive community onboarding networks.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1">
              <span className="text-[7px] font-mono text-muted-foreground">evelyn@core.ai</span>
              <Sparkles className="w-3.5 h-3.5 text-primary opacity-80" />
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 w-full h-full border border-border rounded-2xl bg-card p-4 flex flex-col justify-between [transform:rotateX(180deg)] [backface-visibility:hidden] bg-gradient-to-tr from-emerald-900/20 to-teal-950/20 border-emerald-500/20">
            <div className="flex justify-between items-start w-full">
              <span className="text-[7.5px] font-mono tracking-widest text-emerald-400 font-bold uppercase">DIRECTORY CONTACTS</span>
              <button
                type="button"
                aria-label="Flip to front"
                onClick={() => setIsFlipped(false)}
                className="cursor-pointer text-emerald-400 hover:text-emerald-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 rounded"
              >
                <Award className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <h5 className="text-[10px] font-black uppercase text-foreground">Availability Slot</h5>
              <p className="text-[8.5px] text-muted-foreground leading-relaxed">
                Available for real-time visual showcase review sessions or custom theme consultations.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1">
              <div className="flex gap-2">
                <button type="button" className="flex items-center gap-1 bg-white/5 border border-border/40 rounded px-1.5 py-0.5 hover:bg-white/10 transition-colors text-[7.5px] font-mono text-foreground shrink-0 cursor-pointer">
                  <MessageSquare className="w-2.5 h-2.5" /> Chat
                </button>
                <button type="button" className="flex items-center gap-1 bg-white/5 border border-border/40 rounded px-1.5 py-0.5 hover:bg-white/10 transition-colors text-[7.5px] font-mono text-foreground shrink-0 cursor-pointer">
                  <Phone className="w-2.5 h-2.5" /> Call
                </button>
              </div>
              <span className="text-[7.5px] font-mono text-emerald-400">READY</span>
            </div>
          </div>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click card to physically flip horizontal X-axis</span>
    </div>
  );
};
