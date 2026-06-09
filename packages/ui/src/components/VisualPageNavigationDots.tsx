'use client';

import React, { useState } from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';

export interface NavigationSection {
  /** Section ID (used as key). */
  id: string;
  /** Display label. */
  label: string;
}

export interface VisualPageNavigationDotsProps {
  className?: string;
  /** Sections to render in the navigation. */
  sections?: NavigationSection[];
  /** Header label. */
  label?: string;
  /** Initial active section index. */
  defaultIndex?: number;
  /** Called when the active section changes. */
  onActiveChange?: (id: string, index: number) => void;
}

const DEFAULT_SECTIONS: NavigationSection[] = [
  { label: "Overview", id: "overview" },
  { label: "Features", id: "features" },
  { label: "Pricing", id: "pricing" },
  { label: "Resources", id: "resources" }
];

export const VisualPageNavigationDots: React.FC<VisualPageNavigationDotsProps> = ({
  className,
  sections = DEFAULT_SECTIONS,
  label = "Sidebar Navigation Dots",
  defaultIndex = 0,
  onActiveChange,
}) => {
  const [activeIdx, setActiveIdx] = useState(defaultIndex);

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    onActiveChange?.(sections[idx]?.id ?? "", idx);
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div className="flex items-center gap-6 w-full justify-center my-auto">
        {/* Floating Page navigation container */}
        <div className="flex flex-col gap-4 border border-border/40 bg-card rounded-2xl p-4 shadow-xl w-[220px]">
          <span className="text-[8px] text-muted-foreground font-black uppercase tracking-wider mb-1">Active Index</span>
          <div className="flex flex-col gap-2">
            {sections.map((sect, idx) => {
              const active = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={cn('flex items-center justify-between text-left p-2 rounded-xl transition-all duration-300 border border-transparent',
                    active ? 'bg-primary/5 border-primary/20 text-primary font-black scale-102' : 'hover:bg-secondary/40 text-muted-foreground'
                  )}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wide">{sect.label}</span>
                  <div className="relative w-3.5 h-3.5 rounded-full border border-border flex items-center justify-center">
                    {active && (
                      <motion.div 
                        layoutId="activeDot"
                        className="w-1.5 h-1.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 200, damping: 18 }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Click sections to transition active index</span>
    </div>
  );
};
