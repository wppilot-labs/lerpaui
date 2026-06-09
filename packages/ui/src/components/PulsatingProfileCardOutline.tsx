'use client';

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles, Shield, User, Star } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface PulsatingProfileCardOutlineProps {
  className?: string;
}

export const PulsatingProfileCardOutline: React.FC<PulsatingProfileCardOutlineProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Pulsating Profile Card</span>

      <div
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-card cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between p-4 my-auto border border-border/30 group transition-shadow duration-300"
      >
        {/* Glow pulsing outline SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
          <motion.rect
            x="2"
            y="2"
            width="98%"
            height="98%"
            rx="14"
            stroke="url(#glowGradient23)"
            strokeWidth="2.5"
            strokeDasharray="40 160"
            animate={prefersReducedMotion ? undefined : {
              strokeDashoffset: isHovered ? [-200, 0] : [0, -200],
            }}
            transition={prefersReducedMotion ? undefined : {
              repeat: Infinity,
              duration: isHovered ? 2.5 : 5,
              ease: "linear"
            }}
          />
          <defs>
            <linearGradient id="glowGradient23" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex justify-between items-start z-10">
          <div className="w-8 h-8 rounded-xl bg-secondary border border-border/40 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
            <User className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-amber-500 text-[8px] font-black uppercase tracking-wider">
            <Star className="w-2.5 h-2.5 fill-amber-500 animate-spin-slow" />
            <span>TOP RATED</span>
          </div>
        </div>

        <div className="z-10 flex flex-col mt-4">
          <span className="text-[7.5px] font-mono tracking-widest text-muted-foreground uppercase">Operations VP</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Clara Oswald</h4>
          <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
            Spearheads global enterprise deployments and custom layout synchronization pipelines.
          </p>
        </div>

        <div className="flex items-center gap-1.5 border-t border-border/20 pt-2 mt-1 z-10">
          <Shield className="w-3 h-3 text-muted-foreground" />
          <span className="text-[7.5px] font-mono text-muted-foreground">clara@core.ai</span>
          <Sparkles className="w-3 h-3 text-amber-500 ml-auto opacity-70 animate-pulse" />
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover card to accelerate pulsating loops</span>
    </div>
  );
};
