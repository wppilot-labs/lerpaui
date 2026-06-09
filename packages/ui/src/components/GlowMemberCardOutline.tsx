'use client';

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles, Cpu, Shield } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface GlowMemberCardOutlineProps {
  className?: string;
}

export const GlowMemberCardOutline: React.FC<GlowMemberCardOutlineProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Glow Border Drawing Card</span>

      <div
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-card cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between p-4 my-auto border border-border/30 group transition-shadow duration-300"
      >
        {/* Neon Vector Drawing outline SVG overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none">
          <motion.rect
            x="2"
            y="2"
            width="98%"
            height="98%"
            rx="14"
            stroke="url(#neonGradient)"
            strokeWidth="2.5"
            strokeDasharray="20 180"
            animate={prefersReducedMotion ? undefined : (isHovered ? {
              strokeDashoffset: [-200, 0],
            } : {
              strokeDashoffset: 0
            })}
            transition={prefersReducedMotion ? undefined : {
              repeat: Infinity,
              duration: 4,
              ease: "linear"
            }}
          />
          <defs>
            <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        <div className="flex justify-between items-start z-10">
          <div className="w-8 h-8 rounded-xl bg-secondary border border-border/40 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-[8px] font-mono tracking-widest bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded text-purple-400 uppercase font-black">NEO SHARD</span>
        </div>

        <div className="z-10 flex flex-col mt-4">
          <span className="text-[7.5px] font-mono tracking-widest text-muted-foreground uppercase">INFRASTRUCTURE</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
          <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
            Builds automated pipeline compilers and glowing laser tracking grids.
          </p>
        </div>

        <div className="flex items-center gap-1.5 border-t border-border/20 pt-2 mt-1 z-10">
          <Shield className="w-3 h-3 text-muted-foreground" />
          <span className="text-[7.5px] font-mono text-muted-foreground">sven@core.ai</span>
          <Sparkles className="w-3 h-3 text-purple-400 ml-auto opacity-70 animate-pulse" />
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover card to trigger neon laser drawing paths</span>
    </div>
  );
};
