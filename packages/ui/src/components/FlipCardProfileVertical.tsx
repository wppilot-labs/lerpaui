'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, Award, User, Linkedin, Twitter } from 'lucide-react';
import { cn } from '../lib/cn';

export interface FlipCardProfileVerticalProps {
  className?: string;
}

export const FlipCardProfileVertical: React.FC<FlipCardProfileVerticalProps> = ({ className }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Vertical Flip card</span>

      <div 
        role="button" 
        tabIndex={0} 
        onClick={() => setIsFlipped(!isFlipped)} 
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(!isFlipped); } }}
        className="w-full h-[180px] my-auto cursor-pointer [perspective:1000px]"
      >
        <motion.div
          animate={{ rotateY: prefersReducedMotion ? 0 : (isFlipped ? 180 : 0) }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 16 }}
          className="relative w-full h-full [transform-style:preserve-3d]"
        >
          {/* FRONT */}
          <div className="absolute inset-0 w-full h-full border border-border rounded-2xl bg-card p-4 flex flex-col justify-between backface-hidden [backface-visibility:hidden] bg-gradient-to-tr from-card to-secondary/10">
            <div className="flex justify-between items-start w-full">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-secondary">
                <User className="w-4 h-4 text-foreground/80" />
              </div>
              <span className="text-[7px] font-mono tracking-widest bg-white/5 border border-border/40 px-2 py-0.5 rounded text-muted-foreground uppercase font-black">FLIP PROFILE</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">RESEARCH DIRECTORY</span>
              <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
              <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1">
                Directs multi-cluster similarity indices and vector compilers.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1">
              <span className="text-[7px] font-mono text-muted-foreground">member@example.com</span>
              <Sparkles className="w-3.5 h-3.5 text-primary opacity-80" />
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 w-full h-full border border-border rounded-2xl bg-card p-4 flex flex-col justify-between [transform:rotateY(180deg)] [backface-visibility:hidden] bg-gradient-to-tr from-purple-900/20 to-indigo-950/20 border-purple-500/20">
            <div className="flex justify-between items-start w-full">
              <span className="text-[7.5px] font-mono tracking-widest text-purple-400 font-bold uppercase">DETAILED CREDS</span>
              <Award className="w-4 h-4 text-purple-400" />
            </div>

            <div className="flex flex-col gap-2">
              <h5 className="text-[10px] font-black uppercase text-foreground">Active Credentials</h5>
              <ul className="text-[8px] text-muted-foreground flex flex-col gap-1 list-disc list-inside">
                <li>PhD Machine Learning (Stanford)</li>
                <li>Ex-Meta Core Infra Team</li>
                <li>Compiler Architecture Lead</li>
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1">
              <div className="flex gap-1.5">
                <Linkedin className="w-3.5 h-3.5 text-foreground/80 hover:text-purple-400 transition-colors" />
                <Twitter className="w-3.5 h-3.5 text-foreground/80 hover:text-purple-400 transition-colors" />
              </div>
              <span className="text-[7.5px] font-mono text-purple-400">CREDENTIALS APPROVED</span>
            </div>
          </div>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click card to physically flip vertical Y-axis</span>
    </div>
  );
};
