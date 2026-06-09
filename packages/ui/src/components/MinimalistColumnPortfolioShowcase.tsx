'use client';

import React, { useState, useRef } from 'react';
import { motion, useSpring, useMotionValue} from "framer-motion";
import { Sparkles, FolderOpen, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';

export interface MinimalistColumnPortfolioShowcaseProps {
  className?: string;
}

export const MinimalistColumnPortfolioShowcase: React.FC<MinimalistColumnPortfolioShowcaseProps> = ({ className }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  const springX = useSpring(cursorX, { stiffness: 180, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 180, damping: 20 });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    cursorX.set(e.clientX - rect.left - 44);
    cursorY.set(e.clientY - rect.top - 20);
  };

  const rows = [
    { title: "Neuro Sync Suite", role: "AI INTERACTIVE", bg: "from-purple-500/30 to-indigo-500/20" },
    { title: "Glitch dissolve", role: "CREATIVE SHARDS", bg: "from-pink-500/30 to-rose-500/20" },
    { title: "Horizon router", role: "CORE ROUTING", bg: "from-cyan-500/30 to-blue-500/20" }
  ];

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHoveredIdx(null)}
      className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none cursor-cell', className)}
    >
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Minimalist Column Showcase</span>

      <div className="flex flex-col w-full my-auto relative">
        {rows.map((row, idx) => {
          const isHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              onPointerEnter={() => setHoveredIdx(idx)}
              className="py-4 border-b border-border/40 flex items-center justify-between transition-all duration-300 relative group"
            >
              <div className="flex flex-col">
                <span className="text-[6.5px] font-mono text-muted-foreground tracking-widest uppercase">{row.role}</span>
                <h4 className={cn("text-[10px] font-black tracking-wider uppercase transition-colors mt-0.5", isHovered ? "text-primary" : "text-foreground")}>
                  {row.title}
                </h4>
              </div>
              <ArrowRight className={cn("w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-300", isHovered ? "translate-x-1.5 text-foreground" : "")} />
            </div>
          );
        })}

        {/* Floating cursor element */}
        {hoveredIdx !== null && (
          <motion.div
            style={{ x: springX, y: springY }}
            className="absolute pointer-events-none w-22 h-10 border rounded-xl flex items-center gap-2 justify-center bg-card shadow-2xl overflow-hidden px-2 z-30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-20", rows[hoveredIdx].bg)} />
            <FolderOpen className="w-3.5 h-3.5 text-foreground z-10 shrink-0" />
            <div className="flex flex-col z-10">
              <span className="text-[6px] font-black tracking-widest uppercase opacity-90 leading-none">PREVIEW</span>
              <span className="text-[5px] font-mono text-muted-foreground leading-none mt-0.5 uppercase">OPEN SHARD</span>
            </div>
            <Sparkles className="w-2.5 h-2.5 text-primary z-10 ml-auto shrink-0" />
          </motion.div>
        )}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Slide cursor across columns to see hover badges</span>
    </div>
  );
};
