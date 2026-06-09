'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform} from "framer-motion";
import { Cpu, Terminal, Database } from 'lucide-react';
import { cn } from '../lib/cn';

export interface SlideRow {
  title: string;
  artist: string;
  icon: React.ComponentType<{ className?: string }>;
  /** When true, this row slides in from the left; otherwise from the right. */
  left: boolean;
}

export interface StaggeredRowSlideInProps {
  className?: string;
  /** Rows to display. */
  rows?: SlideRow[];
  /** Header label. */
  label?: string;
}

const DEFAULT_ROWS: SlideRow[] = [
  { title: "Compute Layer", artist: "Engine", icon: Cpu, left: true },
  { title: "Vector Matrix", artist: "Storage", icon: Database, left: false },
  { title: "Event Sync", artist: "Protocol", icon: Terminal, left: true }
];

export const StaggeredRowSlideIn: React.FC<StaggeredRowSlideInProps> = ({
  className,
  rows: list = DEFAULT_ROWS,
  label = "Staggered Alternating Slide",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // map scroll progress to alternating offsets
  const leftX = useTransform(springScroll, [0, 0.5, 1], [-80, 0, -80]);
  const rightX = useTransform(springScroll, [0, 0.5, 1], [80, 0, 80]);

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">{label}</span>

      <div className="flex flex-col gap-2 w-full my-auto z-10 overflow-hidden py-2">
        {list.map((track, idx) => {
          const xVal = track.left ? leftX : rightX;
          return (
            <motion.div
              key={idx}
              style={{ x: xVal }}
              className="w-full border p-2.5 rounded-xl flex items-center justify-between border-border bg-card shadow-sm"
            >
              <div className="flex items-center gap-3">
                <track.icon className="w-4 h-4 text-primary shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[9.5px] font-black tracking-wide text-foreground leading-tight">{track.title}</span>
                  <span className="text-[7.5px] text-muted-foreground font-semibold leading-tight mt-0.5">{track.artist}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Scroll page to slide rows from margins</span>
    </div>
  );
};
