'use client';

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { Sparkles, User, MessageSquare } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface BlurRevealTeamCardProps {
  className?: string;
}

export const BlurRevealTeamCard: React.FC<BlurRevealTeamCardProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Blur Reveal profile</span>

      <div
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl bg-card my-auto flex flex-col justify-between p-4 bg-gradient-to-tr from-card to-secondary/10 transition-shadow duration-300"
      >
        <div className="flex justify-between items-start w-full">
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center bg-secondary">
            <User className="w-4 h-4 text-foreground/80" />
          </div>
          <span className="text-[8px] font-mono tracking-widest bg-white/5 border border-border/40 px-2 py-0.5 rounded text-muted-foreground uppercase font-black">BLUR FILTER</span>
        </div>

        {/* Central visual panel that unblurs */}
        <motion.div
          animate={prefersReducedMotion ? undefined : (isHovered ? { filter: "blur(0px)", scale: 1.02 } : { filter: "blur(5px)", scale: 0.96 })}
          className="flex flex-col transition-all duration-300"
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 150, damping: 18 }}
        >
          <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">RESEARCH</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
          <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1">
            Builds blur reveal filter grids unblurring text sequentially in waves.
          </p>
        </motion.div>

        <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-muted-foreground" />
            <span className="text-[7.5px] font-mono text-muted-foreground">member@example.com</span>
          </div>
          <Sparkles className="w-3.5 h-3.5 text-primary opacity-80" />
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover card to unblur text and profile details</span>
    </div>
  );
};
