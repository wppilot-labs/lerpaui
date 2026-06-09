"use client";

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from "framer-motion";
import { Leaf, Award, Globe } from 'lucide-react';
import { cn } from '../lib/cn';

export interface EcoFriendlyImpactScoreProps {
  score?: number; // 0 to 100
  carbonSaved?: number; // in kg
  className?: string;
}

export const EcoFriendlyImpactScore: React.FC<EcoFriendlyImpactScoreProps> = ({
  score = 88,
  carbonSaved = 142.5,
  className,
}) => {
  const [active, setActive] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setActive(true);
  }, []);

  return (
    <div className={cn('p-5 rounded-2xl border border-emerald-500/25 bg-emerald-950/10 shadow-lg select-none max-w-[320px] backdrop-blur-md bg-card/75', className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Leaf className="w-4 h-4 animate-bounce" />
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-500">Green Impact</span>
        </div>
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
          <Globe className="w-3 h-3" />
          <span>Verified</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        {/* Radial leaf stroke score progress */}
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="rgba(16, 185, 129, 0.1)"
              strokeWidth="4.5"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              fill="transparent"
              stroke="oklch(var(--p))"
              strokeWidth="4.5"
              strokeDasharray={176}
              initial={{ strokeDashoffset: 176 }}
              animate={active ? { strokeDashoffset: 176 - (176 * score) / 100 } : {}}
              transition={prefersReducedMotion ? { duration: 0 } : { duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <span className="absolute text-sm font-extrabold tracking-tighter text-foreground font-mono">{score}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest leading-none">Carbon Saved</span>
          <span className="text-xl font-extrabold tracking-tight text-foreground font-mono">
            {carbonSaved} kg
          </span>
          <span className="text-[8px] text-emerald-400 uppercase font-black tracking-wider flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>Top 5% Eco Merchant</span>
          </span>
        </div>
      </div>

      {/* SVG vine growth indicator line */}
      <div className="h-[2px] w-full bg-emerald-500/10 rounded-full relative overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={active ? { width: '88%' } : {}}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, delay: 0.3 }}
          className="absolute inset-y-0 left-0 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]"
        />
      </div>
    </div>
  );
};
