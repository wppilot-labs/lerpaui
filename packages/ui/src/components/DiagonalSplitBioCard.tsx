'use client';

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { Mail, User, Layers, ArrowRight } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface DiagonalSplitBioCardProps {
  className?: string;
}

export const DiagonalSplitBioCard: React.FC<DiagonalSplitBioCardProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Diagonal Split Bio Card</span>

      <div
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className="relative w-full h-[180px] rounded-2xl overflow-hidden border border-border/40 bg-card cursor-pointer shadow-lg hover:shadow-xl flex flex-col justify-between p-4 my-auto group transition-shadow duration-300"
      >
        {/* Diagonal Split overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-primary/15 to-purple-500/10 pointer-events-none z-0"
          animate={prefersReducedMotion ? undefined : {
            clipPath: isHovered
              ? "polygon(0 0, 100% 0, 100% 85%, 0 100%)"
              : "polygon(0 0, 100% 0, 100% 45%, 0 85%)"
          }}
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18 }}
          style={{ willChange: prefersReducedMotion ? undefined : 'clip-path' }}
        />

        <div className="flex justify-between items-start z-10 w-full">
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-secondary">
            <User className="w-4 h-4 text-foreground/80" />
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 border border-border/40 px-2 py-0.5 rounded">
            <Layers className="w-3 h-3 text-primary" />
            <span className="text-[7px] font-mono uppercase text-foreground/80">DIAGONAL</span>
          </div>
        </div>

        <div className="z-10 flex flex-col mt-4">
          <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">RESEARCH</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
          <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
            Builds visual split panels sliding diagonal vectors at contrasting velocities.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1 z-10">
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-muted-foreground" />
            <span className="text-[7.5px] font-mono text-muted-foreground">member@example.com</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover card to shift diagonal split path</span>
    </div>
  );
};
