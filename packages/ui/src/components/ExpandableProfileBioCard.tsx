'use client';

import React, { useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { Linkedin, Award, Plus, X } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ExpandableProfileBioCardProps {
  className?: string;
}

export const ExpandableProfileBioCard: React.FC<ExpandableProfileBioCardProps> = ({ className }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const team = [
    { name: "Team Member", role: "INFRASTRUCTURE", tag: "PIPELINES", desc: "Responsible for automated compile scripts and visual site assets.", bg: "from-purple-900/60 to-indigo-950/60 border-purple-500/20" },
    { name: "Clara Oswald", role: "OPERATIONS", tag: "THEMES", desc: "Architects client-safe variables and Next.js compiler grids.", bg: "from-cyan-900/60 to-blue-950/60 border-cyan-500/20" }
  ];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Elastic Grid Expansions</span>

      <div className="flex flex-col gap-2.5 w-full my-auto relative">
        {team.map((member, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <motion.div
              key={idx}
              layout
              role="button"
              tabIndex={0}
              aria-expanded={isSelected}
              className={cn(
                "border rounded-2xl p-3.5 flex flex-col justify-between bg-card cursor-pointer shadow-md transition-all duration-300 relative overflow-hidden",
                isSelected ? member.bg + " z-30 scale-102" : "border-border/30 hover:border-muted-foreground/20"
              )}
              onClick={() => setSelectedIdx(isSelected ? null : idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedIdx(isSelected ? null : idx); } }}
              transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                    <Award className="w-4 h-4 text-foreground/80" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7.5px] font-mono tracking-widest text-muted-foreground uppercase">{member.role}</span>
                    <h4 className="text-[10px] font-black tracking-wide text-foreground uppercase mt-0.5">{member.name}</h4>
                  </div>
                </div>

                <div className="p-1 rounded-full bg-white/5 border border-border/40 hover:bg-white/10 transition-colors">
                  {isSelected ? <X className="w-3 h-3 text-foreground" /> : <Plus className="w-3 h-3 text-muted-foreground" />}
                </div>
              </div>

              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3.5 border-t border-border/20 pt-3 flex flex-col gap-2"
                >
                  <p className="text-[9px] text-muted-foreground leading-relaxed">
                    {member.desc} Expanded elastic transitions elastically resize bounds shifting siblings beautifully.
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[7px] font-mono bg-white/10 px-2 py-0.5 rounded text-foreground uppercase tracking-widest">{member.tag}</span>
                    <Linkedin className="w-3.5 h-3.5 text-foreground opacity-80 hover:text-primary ml-auto" />
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click member rows to toggle spring bio panes</span>
    </div>
  );
};
