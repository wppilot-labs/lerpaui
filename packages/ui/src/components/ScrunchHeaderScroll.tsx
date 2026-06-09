"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform} from "framer-motion";
import { ArrowDown, Layers, Search } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ScrunchListEntry {
  title: string;
  subtitle?: string;
}

export interface ScrunchHeaderScrollProps {
  className?: string;
  /** Title shown in the expanded header. */
  title?: string;
  /** Hint text below the title when expanded. */
  hint?: string;
  /** Title shown in the collapsed (mini) header. */
  miniTitle?: string;
  /** List entries rendered in the scrollable body. */
  entries?: ScrunchListEntry[];
}

const DEFAULT_ENTRIES: ScrunchListEntry[] = Array.from({ length: 6 }, (_, idx) => ({
  title: `List Element ${idx + 1}`,
  subtitle: "Trace coordinate scroll streams",
}));

export const ScrunchHeaderScroll: React.FC<ScrunchHeaderScrollProps> = ({
  className,
  title = "Scrunch Header",
  hint = "Scroll client panel below to compress",
  miniTitle = "Mini Header",
  entries = DEFAULT_ENTRIES,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ container: containerRef });

  const headerHeight = useTransform(scrollY, [0, 80], [110, 48]);
  const headerOpacity = useTransform(scrollY, [0, 60], [1, 0]);
  const flatHeaderOpacity = useTransform(scrollY, [30, 80], [0, 1]);
  const scale = useTransform(scrollY, [0, 80], [1, 0.9]);

  return (
    <div className={cn('relative w-full max-w-[300px] h-[260px] bg-card border border-border rounded-2xl overflow-hidden flex flex-col select-none shadow-lg', className)}>
      {/* Dynamic Header container */}
      <motion.div 
        style={{ height: headerHeight }}
        className="absolute top-0 inset-x-0 bg-primary text-primary-foreground flex flex-col justify-between p-3 z-10 shadow-sm border-b border-primary/20"
      >
        {/* Layer 1: Large view */}
        <motion.div 
          style={{ opacity: headerOpacity, scale }}
          className="flex flex-col gap-1.5 flex-1 justify-center pt-2"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-5 h-5 animate-pulse" />
            <h3 className="text-sm font-black uppercase tracking-wider">{title}</h3>
          </div>
          <p className="text-[10px] text-primary-foreground/75 font-semibold">{hint}</p>
        </motion.div>

        {/* Layer 2: Flat mini view */}
        <motion.div 
          style={{ opacity: flatHeaderOpacity }}
          className="absolute inset-0 flex items-center justify-between px-3"
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-4.5 h-4.5" />
            <h4 className="text-xs font-black uppercase tracking-wider">{miniTitle}</h4>
          </div>
          <Search className="w-4 h-4 opacity-75 cursor-pointer" />
        </motion.div>
      </motion.div>

      {/* Scrolling body panel */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto pt-[115px] px-3 pb-3 flex flex-col gap-2 pointer-events-auto"
      >
        <div className="flex justify-center py-2 opacity-35 animate-bounce">
          <ArrowDown className="w-4 h-4 text-muted-foreground" />
        </div>
        {entries.map((entry, idx) => (
          <div
            key={idx}
            className="p-3 bg-secondary/15 border border-border/40 rounded-xl flex items-center justify-between"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-foreground font-bold">{entry.title}</span>
              {entry.subtitle && <span className="text-[9px] text-muted-foreground">{entry.subtitle}</span>}
            </div>
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
          </div>
        ))}
      </div>
    </div>
  );
};
