'use client';

import React, { useMemo, useState } from 'react';
import { motion} from "framer-motion";
import { Cpu, Terminal, Database } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface RosterEntry {
  /** Main label shown on the row. */
  title: string;
  /** Subtitle / category. */
  artist: string;
  /** Icon component (e.g. from lucide-react). */
  icon: React.ComponentType<{ className?: string }>;
}

export interface NeoGlowTracingRosterProps {
  className?: string;
  /** Roster entries. */
  entries?: RosterEntry[];
  /** Header label. */
  label?: string;
  /** Initially focused row, or `null` for none. */
  defaultIndex?: number | null;
}

const DEFAULT_ENTRIES: RosterEntry[] = [
  { title: "Compute Layer", artist: "System Gateway", icon: Cpu },
  { title: "Vector Database", artist: "Storage Shard", icon: Database },
  { title: "Event Ledger", artist: "Ledger Net", icon: Terminal }
];

export const NeoGlowTracingRoster: React.FC<NeoGlowTracingRosterProps> = ({
  className,
  entries: entriesProp,
  label = "Concentric Neon Tracer",
  defaultIndex = 0,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(defaultIndex);
  const prefersReducedMotion = usePrefersReducedMotion();

  const list = useMemo(() => entriesProp ?? DEFAULT_ENTRIES, [entriesProp]);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div className="flex flex-col gap-2 w-full my-auto z-10">
        {list.map((track, idx) => {
          const hovered = idx === hoveredIdx;
          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              className={cn('w-full border p-3 rounded-xl flex items-center justify-between cursor-pointer transition-all relative overflow-hidden',
                hovered ? 'border-primary/20 bg-primary/5' : 'border-border bg-card'
              )}
            >
              {/* Glowing vector tracer path outline */}
              {hovered && (
                <motion.div
                  layoutId="glowTracer"
                  className="absolute inset-0 border border-primary pointer-events-none rounded-xl"
                  transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 20 }}
                  style={{ willChange: prefersReducedMotion ? undefined : 'transform' }}
                />
              )}

              <div className="flex items-center gap-3">
                <track.icon className={cn('w-4 h-4', hovered ? 'text-primary' : 'text-muted-foreground')} />
                <div className="flex flex-col">
                  <span className={cn('text-[9.5px] font-black tracking-wide leading-tight', hovered ? 'text-primary' : 'text-foreground')}>{track.title}</span>
                  <span className="text-[7.5px] text-muted-foreground font-semibold leading-tight mt-0.5">{track.artist}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover pointer to trace glowing border paths</span>
    </div>
  );
};
