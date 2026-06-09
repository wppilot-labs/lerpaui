'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { Phone, Mail, ChevronRight, User } from 'lucide-react';
import { cn } from '../lib/cn';

export interface CorporateBoardRosterProps {
  className?: string;
}

export const CorporateBoardRoster: React.FC<CorporateBoardRosterProps> = ({ className }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(0);

  const rosters = [
    { name: "Dr. Evelyn Vane", role: "AI CORE LEAD", tag: "R&D", phone: "+1 415 908", email: "evelyn@core.ai" },
    { name: "Team Member", role: "INFRASTRUCTURE", tag: "DEVOPS", phone: "+1 415 672", email: "sven@core.ai" }
  ];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Board Roster Directory</span>

      <div className="flex flex-col gap-2 w-full my-auto">
        {rosters.map((roster, idx) => {
          const isSelected = selectedIdx === idx;
          return (
            <div
              key={idx}
              className={cn(
                "p-3 rounded-2xl border transition-all duration-300 bg-card shadow-sm flex flex-col justify-between overflow-hidden",
                isSelected ? "border-primary/40 bg-gradient-to-tr from-card to-primary/5" : "border-border/30 hover:border-muted-foreground/20"
              )}
            >
              <button
                type="button"
                aria-expanded={isSelected}
                aria-label={`${roster.name}, ${roster.role}`}
                onClick={() => setSelectedIdx(isSelected ? null : idx)}
                className="flex items-center justify-between w-full cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-7 h-7 rounded-full bg-secondary border border-border/40 flex items-center justify-center", isSelected ? "text-primary" : "")}>
                    <User className="w-3.5 h-3.5" aria-hidden="true" />
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-[9px] font-black uppercase text-foreground leading-tight">{roster.name}</h5>
                    <span className="text-[7px] text-muted-foreground font-mono uppercase tracking-wider">{roster.role}</span>
                  </div>
                </div>
                <ChevronRight className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", isSelected ? "rotate-90 text-primary" : "")} aria-hidden="true" />
              </button>

              <AnimatePresence initial={false}>
                {isSelected && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-border/20 mt-2.5 pt-2.5 flex items-center justify-between"
                  >
                    <div className="flex gap-2">
                      <button type="button" className="flex items-center gap-1.5 bg-white/5 border border-border/40 px-2 py-1 rounded-lg text-[7px] text-foreground font-mono hover:text-primary transition-colors">
                        <Phone className="w-2.5 h-2.5" aria-hidden="true" />
                        <span>DIAL</span>
                      </button>
                      <button type="button" className="flex items-center gap-1.5 bg-white/5 border border-border/40 px-2 py-1 rounded-lg text-[7px] text-foreground font-mono hover:text-primary transition-colors">
                        <Mail className="w-2.5 h-2.5" aria-hidden="true" />
                        <span>EMAIL</span>
                      </button>
                    </div>
                    <span className="text-[8px] font-mono bg-primary/10 border border-primary/20 px-2 py-0.5 rounded text-primary uppercase font-bold">{roster.tag}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click rosters to reveal contact controls</span>
    </div>
  );
};
