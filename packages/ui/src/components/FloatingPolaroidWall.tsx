"use client";

import React, { useRef } from 'react';
import { motion, useReducedMotion } from "framer-motion";

import { cn } from '../lib/cn';

export interface FloatingPolaroidWallProps {
  photos?: { id: string; url: string; title: string }[];
  className?: string;
}

export const FloatingPolaroidWall: React.FC<FloatingPolaroidWallProps> = ({
  photos = [
    { id: "p1", url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop", title: "Core Architecture" },
    { id: "p2", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop", title: "Creative Lead" },
    { id: "p3", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop", title: "Design Systems" }
  ],
  className,
}) => {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div 
      ref={constraintsRef}
      className={cn('relative w-full max-w-[340px] h-60 bg-zinc-950/20 border border-border/40 rounded-2xl overflow-hidden select-none flex items-center justify-center p-3', className)}
    >
      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest absolute top-4">Drag profiles below</span>

      {photos.map((ph, idx) => {
        // Distribute polaroids scattered positions
        const left = 35 + idx * 75;
        const top = 35 + (idx % 2 === 0 ? 15 : 45);
        const rot = idx * 10 - 10;

        return (
          <motion.div
            key={ph.id}
            drag={prefersReducedMotion ? false : true}
            dragConstraints={constraintsRef}
            dragElastic={0.12}
            initial={{ left, top, rotate: rot }}
            whileDrag={prefersReducedMotion ? undefined : { scale: 1.08, zIndex: 50, shadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)" }}
            className="absolute p-2.5 pb-4 border border-border/40 bg-card rounded-xl shadow-md w-28 cursor-grab active:cursor-grabbing hover:border-primary/25"
            style={{ rotate: rot }}
          >
            <div className="w-full aspect-square rounded-lg overflow-hidden border border-border/20 mb-2">
              <img src={ph.url} alt={ph.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-foreground uppercase tracking-wide leading-none">{ph.title}</span>
              <span className="text-[7px] text-muted-foreground uppercase font-semibold">Lerpa UI Roster</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
