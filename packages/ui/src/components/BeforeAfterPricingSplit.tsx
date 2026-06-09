'use client';

import React, { useRef } from 'react';
import { motion, useSpring, useTransform, useMotionValue} from "framer-motion";
import { DollarSign } from 'lucide-react';
import { cn } from '../lib/cn';

export interface BeforeAfterPricingSplitProps {
  className?: string;
}

export const BeforeAfterPricingSplit: React.FC<BeforeAfterPricingSplitProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(130);
  const springDragX = useSpring(dragX, { stiffness: 180, damping: 20 });

  const clipWidth = useTransform(springDragX, (val) => `${val}px`);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    // Bound constraints
    dragX.set(Math.max(40, Math.min(rect.width - 40, relativeX)));
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none cursor-ew-resize', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Before/After Price Split</span>

      <div 
        ref={containerRef}
        onPointerMove={handlePointerMove}
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card shadow-lg my-auto"
      >
        {/* Underlayer (Before - High price) */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between bg-card text-foreground select-none z-0">
          <div className="flex justify-between items-start">
            <span className="text-[7.5px] font-mono tracking-widest text-red-500 uppercase font-bold">HISTORIC OVERHEAD</span>
            <span className="text-[6px] font-mono bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-red-500 uppercase font-black">EXPENSIVE</span>
          </div>
          <div className="flex items-baseline mt-4">
            <DollarSign className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-2xl font-black text-red-500">280</span>
            <span className="text-[8px] font-mono text-muted-foreground ml-1.5 uppercase">/MONTH</span>
          </div>
          <span className="text-[7px] text-muted-foreground font-mono uppercase tracking-widest leading-none">Traditional enterprise plans</span>
        </div>

        {/* Overlayer (After - Lerpa UI Optimizations) */}
        <motion.div 
          style={{ width: clipWidth }}
          className="absolute inset-y-0 left-0 p-4 flex flex-col justify-between bg-gradient-to-tr from-card to-primary/10 border-r border-primary/45 text-foreground select-none overflow-hidden z-10"
        >
          <div className="flex justify-between items-start w-[240px]">
            <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">OPTIMIZED PLAN</span>
            <span className="text-[6px] font-mono bg-primary/15 border border-primary/25 px-2 py-0.5 rounded text-primary uppercase font-black">SAVINGS</span>
          </div>
          <div className="flex items-baseline mt-4 w-[240px]">
            <DollarSign className="w-4 h-4 text-primary shrink-0" />
            <span className="text-2xl font-black text-primary">99</span>
            <span className="text-[8px] font-mono text-muted-foreground ml-1.5 uppercase">/MONTH</span>
          </div>
          <span className="text-[7px] text-primary font-mono uppercase tracking-widest leading-none w-[240px]">Lerpa UI Elastic Nodes</span>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Slide cursor horizontally to split plans</span>
    </div>
  );
};
