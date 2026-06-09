'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion} from "framer-motion";
import { ArrowRight, Mail } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface MinimalistLeadershipListProps {
  className?: string;
}

export const MinimalistLeadershipList: React.FC<MinimalistLeadershipListProps> = ({ className }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const lists = useMemo(() => [
    { name: "Dr. Evelyn Vane", role: "AI CORE LEAD", email: "evelyn@core.ai" },
    { name: "Team Member", role: "INFRASTRUCTURE", email: "sven@core.ai" },
    { name: "Clara Oswald", role: "OPERATIONS VP", email: "clara@core.ai" }
  ], []);

  const handleLeave = useCallback(() => setHoveredIdx(null), []);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Minimalist Leadership Directory</span>

      <div className="flex flex-col w-full my-auto relative">
        {lists.map((row, idx) => {
          const isHovered = hoveredIdx === idx;
          const isAnyHovered = hoveredIdx !== null;
          return (
            <div
              key={idx}
              onPointerEnter={() => setHoveredIdx(idx)}
              onPointerLeave={handleLeave}
              className={cn(
                "py-3 border-b border-border/40 flex items-center justify-between transition-all duration-300 relative group cursor-pointer",
                isAnyHovered && !isHovered ? "opacity-30 scale-98" : "opacity-100"
              )}
            >
              <div className="flex flex-col">
                <span className="text-[6.5px] font-mono text-muted-foreground tracking-widest uppercase">{row.role}</span>
                <h4 className={cn("text-[10px] font-black tracking-wider uppercase transition-colors mt-0.5", isHovered ? "text-primary" : "text-foreground")}>
                  {row.name}
                </h4>
                {isHovered && (
                  <motion.span
                    layoutId="emailTag23"
                    className="text-[7.5px] font-mono text-primary mt-1 flex items-center gap-1"
                    transition={prefersReducedMotion ? { duration: 0 } : undefined}
                  >
                    <Mail className="w-2.5 h-2.5" />
                    <span>{row.email}</span>
                  </motion.span>
                )}
              </div>
              <ArrowRight className={cn("w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-300", isHovered ? "translate-x-1.5 text-foreground" : "")} />
            </div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover rows to isolate member profiles</span>
    </div>
  );
};
