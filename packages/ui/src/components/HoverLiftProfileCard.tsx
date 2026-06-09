'use client';

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { Linkedin, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface HoverLiftProfileCardProps {
  className?: string;
}

export const HoverLiftProfileCard: React.FC<HoverLiftProfileCardProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Tactile Elevation Lift</span>

      <motion.div
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        animate={prefersReducedMotion ? undefined : (isHovered ? { y: -12, scale: 1.03 } : { y: 0, scale: 1 })}
        transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 200, damping: 18 }}
        style={{ willChange: prefersReducedMotion ? undefined : 'transform' }}
        className={cn(
          "relative w-full h-[180px] border border-border/30 rounded-2xl bg-card cursor-pointer shadow-md flex flex-col justify-between p-4 my-auto transition-shadow duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isHovered ? "shadow-2xl border-muted-foreground/20" : ""
        )}
      >
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded-xl bg-secondary border border-border/40 flex items-center justify-center">
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <span className="text-[8px] font-mono tracking-widest bg-secondary/80 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">LIFT</span>
        </div>

        <div className="flex flex-col mt-4">
          <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">OPERATIONS</span>
          <h4 className="text-xs font-black tracking-wide text-foreground uppercase mt-0.5">Team Member</h4>
          <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1 line-clamp-2">
            Builds automated elastic scaling servers and coordinates-aware lift widgets.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border/20 pt-2 mt-1">
          <span className="text-[7.5px] font-mono text-muted-foreground">member@example.com</span>
          <Linkedin className="w-3.5 h-3.5 text-foreground/80 hover:text-primary transition-colors" />
        </div>
      </motion.div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover card to trigger tactile elevation scaling</span>
    </div>
  );
};
