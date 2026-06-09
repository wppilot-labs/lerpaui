'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { FolderOpen, Mail, ChevronDown, Award } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PremiumExecutiveFocusGridProps {
  className?: string;
}

export const PremiumExecutiveFocusGrid: React.FC<PremiumExecutiveFocusGridProps> = ({ className }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const leaders = [
    { name: "Dr. Evelyn Vane", role: "CHIEF AI ARCHITECT", dept: "R&D", exp: "12 years", email: "evelyn@core.ai", bg: "from-purple-900/40 to-indigo-950/40 border-purple-500/20" },
    { name: "Team Member", role: "PRINCIPAL SECURITY", dept: "CYBER", exp: "9 years", email: "marcus@core.ai", bg: "from-cyan-900/40 to-blue-950/40 border-cyan-500/20" }
  ];

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Premium Executive Spotlight</span>

      <div className="flex flex-col gap-3 w-full my-auto">
        {leaders.map((leader, idx) => {
          const isExpanded = expandedIndex === idx;
          return (
            <motion.div
              key={idx}
              layout
              role="button"
              tabIndex={0}
              className={cn(
                "border rounded-2xl overflow-hidden bg-card/65 flex flex-col transition-all duration-300 bg-gradient-to-tr shadow-md cursor-pointer",
                isExpanded ? leader.bg : "border-border/30 hover:border-muted-foreground/20"
              )}
              onClick={() => setExpandedIndex(isExpanded ? null : idx)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedIndex(isExpanded ? null : idx); } }}
            >
              <div className="p-3.5 flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary border border-border/40 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4 text-foreground/80" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[7.5px] font-mono tracking-widest text-muted-foreground uppercase">{leader.role}</span>
                    <h4 className="text-[10px] font-black tracking-wide text-foreground uppercase mt-0.5">{leader.name}</h4>
                  </div>
                </div>
                <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform duration-300", isExpanded ? "rotate-180 text-foreground" : "")} />
              </div>

              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 220, damping: 22 }}
                    className="border-t border-border/20 px-3.5 pb-3.5 pt-2.5 bg-card/40 flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[6.5px] font-mono text-muted-foreground uppercase">DEPARTMENT</span>
                        <span className="text-[8px] font-black text-foreground uppercase">{leader.dept}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[6.5px] font-mono text-muted-foreground uppercase">EXPERIENCE</span>
                        <span className="text-[8px] font-black text-foreground uppercase">{leader.exp}</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/5 border border-border/30 rounded-lg px-2 py-1">
                        <Mail className="w-2.5 h-2.5 text-muted-foreground" />
                        <span className="text-[7px] font-mono text-foreground">{leader.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1 border-t border-border/10 pt-2">
                      <FolderOpen className="w-3 h-3 text-primary shrink-0" />
                      <span className="text-[7.5px] text-muted-foreground leading-relaxed">
                        Responsible for core similarity compiler nodes and elastic distributed system orchestration layers.
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click cards to reveal expanded metadata elastically</span>
    </div>
  );
};
