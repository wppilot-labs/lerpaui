'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { ChevronRight, Award } from 'lucide-react';
import { cn } from '../lib/cn';

export interface StaggeredRosterFilterSwipeProps {
  className?: string;
}

export const StaggeredRosterFilterSwipe: React.FC<StaggeredRosterFilterSwipeProps> = ({ className }) => {
  const [activeTab, setActiveTab] = useState<'ENGINE' | 'CYBER'>('ENGINE');

  const engineTeam = [
    { name: "Team Member", role: "PIPELINES", desc: "Builds compile scripts and visual site assets.", bg: "from-purple-900/60 to-indigo-950/60 border-purple-500/20" },
    { name: "Team Member", role: "OPERATIONS", desc: "Manages cloud clusters and edge compiler layers.", bg: "from-purple-900/60 to-indigo-950/60 border-purple-500/20" }
  ];

  const cyberTeam = [
    { name: "Team Member", role: "SECURITY", desc: "Spearheads security compilers and vector firewalls.", bg: "from-cyan-900/60 to-blue-950/60 border-cyan-500/20" },
    { name: "Team Member", role: "PRINCIPAL", desc: "Monitors decentralized similarity matrix secure ledgers.", bg: "from-cyan-900/60 to-blue-950/60 border-cyan-500/20" }
  ];

  const activeRoster = activeTab === 'ENGINE' ? engineTeam : cyberTeam;

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Elastic Filter swiper</span>

      {/* Selector tabs */}
      <div className="flex gap-2 bg-secondary/20 border border-border/40 rounded-xl p-1 w-full shrink-0">
        <button
          onClick={() => setActiveTab('ENGINE')}
          className={cn(
            "flex-1 py-1.5 rounded-lg text-[8.5px] font-black uppercase tracking-wider transition-all cursor-pointer",
            activeTab === 'ENGINE' ? "bg-card text-foreground border border-border/40 shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          ENGINEERS
        </button>
        <button
          onClick={() => setActiveTab('CYBER')}
          className={cn(
            "flex-1 py-1.5 rounded-lg text-[8.5px] font-black uppercase tracking-wider transition-all cursor-pointer",
            activeTab === 'CYBER' ? "bg-card text-foreground border border-border/40 shadow-sm" : "text-muted-foreground hover:text-foreground"
          )}
        >
          CYBER SECURITY
        </button>
      </div>

      {/* Swiper Content Area */}
      <div className="flex flex-col gap-2 w-full my-auto h-[160px] overflow-hidden py-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ x: activeTab === 'ENGINE' ? -60 : 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: activeTab === 'ENGINE' ? 60 : -60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
            className="flex flex-col gap-2 w-full"
          >
            {activeRoster.map((member, idx) => (
              <div 
                key={idx}
                className="border border-border/40 rounded-xl p-2.5 bg-card flex items-center justify-between shadow-sm bg-gradient-to-tr from-card to-secondary/15"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                    <Award className="w-3.5 h-3.5 text-foreground/80" />
                  </div>
                  <div className="flex flex-col">
                    <h5 className="text-[9.5px] font-black uppercase text-foreground leading-tight">{member.name}</h5>
                    <span className="text-[7px] text-muted-foreground font-mono mt-0.5 uppercase tracking-widest">{member.role}</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Toggle categories to trigger elastic touch swiper rows</span>
    </div>
  );
};
