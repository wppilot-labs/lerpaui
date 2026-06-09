'use client';

import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ElasticImageShrinkerCarouselProps {
  className?: string;
}

export const ElasticImageShrinkerCarousel: React.FC<ElasticImageShrinkerCarouselProps> = ({ className }) => {
  const [isPressing, setIsPressing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Elastic Image Shrinker</span>

      <div 
        ref={containerRef}
        onPointerDown={() => setIsPressing(true)}
        onPointerUp={() => setIsPressing(false)}
        onPointerLeave={() => setIsPressing(false)}
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card cursor-grab active:cursor-grabbing shadow-lg"
      >
        <motion.div
          animate={{
            scale: isPressing ? 0.93 : 1,
            borderRadius: isPressing ? "24px" : "16px",
          }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 15 }}
          className="w-full h-full bg-gradient-to-tr from-purple-900/80 to-indigo-900/80 p-4 flex flex-col justify-between text-white"
        >
          <div className="flex justify-between items-start">
            <span className="text-[8px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase">ELASTIC SCALE</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black tracking-wide">Press and hold element</h4>
            <p className="text-[9px] leading-relaxed opacity-85 mt-1">Pressing anywhere pulls the visual frame boundary inward elastically, snapping back on release.</p>
          </div>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Press pointer over canvas to shrink</span>
    </div>
  );
};
