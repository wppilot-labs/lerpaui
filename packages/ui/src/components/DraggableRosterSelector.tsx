'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import { Award, Star, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface DraggableRosterSelectorProps {
  className?: string;
}

export const DraggableRosterSelector: React.FC<DraggableRosterSelectorProps> = ({ className }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const _dragX = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  const rosters = [
    { name: "Dr. Evelyn Vane", role: "AI CORE LEAD", desc: "Similarity compilers.", tag: "PhD Stanford", icon: Cpu },
    { name: "Team Member", role: "INFRASTRUCTURE", desc: "Automated pipelines.", tag: "PhD MIT", icon: Star }
  ];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Draggable Roster Selector</span>

      <div className="flex flex-col gap-3 w-full my-auto">
        {/* Roster Cards slider */}
        <div className="flex gap-2 w-full overflow-x-auto py-1 scrollbar-none snap-x">
          {rosters.map((roster, idx) => {
            const isSelected = selectedIdx === idx;
            return (
              <div
                key={idx}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedIdx(idx)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedIdx(idx); } }}
                className={cn(
                  "p-3 rounded-2xl border flex flex-col justify-between w-32 shrink-0 bg-card cursor-pointer snap-start transition-all duration-300",
                  isSelected ? "border-primary shadow-md bg-gradient-to-tr from-card to-primary/10" : "border-border/30 opacity-70 hover:opacity-100"
                )}
              >
                <div className="flex justify-between items-start">
                  <roster.icon className={cn("w-4 h-4", isSelected ? "text-primary animate-pulse" : "text-muted-foreground")} />
                  <span className="text-[6px] font-mono bg-white/5 border border-border/40 px-1 py-0.5 rounded text-foreground/80 uppercase">{roster.tag}</span>
                </div>
                <div className="flex flex-col mt-3">
                  <h5 className="text-[8px] font-black uppercase text-foreground leading-tight">{roster.name}</h5>
                  <span className="text-[6.5px] text-muted-foreground font-mono mt-0.5 uppercase tracking-widest leading-none">{roster.role}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Specs Panel */}
        <motion.div
          key={selectedIdx}
          initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-border/40 rounded-2xl p-3.5 bg-card flex flex-col gap-2 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-primary shrink-0" />
            <h4 className="text-[9.5px] font-black uppercase text-foreground">{rosters[selectedIdx].name} Profile Specs</h4>
          </div>
          <p className="text-[9px] text-muted-foreground leading-relaxed">
            {rosters[selectedIdx].desc} Draggable roster selectors let users review member nodes inside unified comparison layouts.
          </p>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click card nodes to load specs pane elastically</span>
    </div>
  );
};
