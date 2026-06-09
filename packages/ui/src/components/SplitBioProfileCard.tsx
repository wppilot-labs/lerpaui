'use client';

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { Linkedin, Terminal, Layers } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface SplitBioProfileCardProps {
  className?: string;
}

export const SplitBioProfileCard: React.FC<SplitBioProfileCardProps> = ({ className }) => {
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
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl bg-card my-auto flex transition-shadow duration-300"
      >
        {/* Left Side: Mock Image Section */}
        <motion.div
          animate={prefersReducedMotion ? undefined : (isHovered ? { width: "40%" } : { width: "50%" })}
          className="relative h-full bg-gradient-to-tr from-purple-950 to-indigo-900 overflow-hidden flex flex-col items-center justify-center border-r border-border/20 shrink-0"
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 18 }}
          style={{ willChange: prefersReducedMotion ? undefined : 'width' }}
        >
          <div className="absolute inset-0 bg-radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 80%)" />
          <motion.div
            animate={prefersReducedMotion ? undefined : (isHovered ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 })}
            className="text-foreground z-10"
            style={{ willChange: prefersReducedMotion ? undefined : 'transform' }}
          >
            <Terminal className="w-8 h-8 text-primary" />
          </motion.div>
          <span className="text-[7px] font-mono tracking-widest text-primary/80 z-10 mt-2 uppercase font-black">IMAGE PORT</span>
        </motion.div>

        {/* Right Side: Text Details Section */}
        <motion.div
          animate={prefersReducedMotion ? undefined : (isHovered ? { width: "60%" } : { width: "50%" })}
          className="h-full p-3.5 flex flex-col justify-between bg-card shrink-0"
          transition={prefersReducedMotion ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 18 }}
          style={{ willChange: prefersReducedMotion ? undefined : 'width' }}
        >
          <div className="flex justify-between items-start">
            <span className="text-[7px] font-mono tracking-widest text-muted-foreground uppercase font-black">BIO INFO</span>
            <Layers className="w-3.5 h-3.5 text-primary opacity-60" />
          </div>

          <div className="flex flex-col mt-2">
            <span className="text-[7px] font-mono tracking-widest text-primary uppercase font-bold">CORE COMPILING</span>
            <h4 className="text-[10px] font-black tracking-wide text-foreground uppercase mt-0.5 leading-none">Team Member</h4>
            <p className="text-[8.5px] text-muted-foreground leading-relaxed mt-1 line-clamp-3">
              Architects diag split partitions sliding elastically at contrasting speeds.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-border/20 pt-1.5 mt-1">
            <span className="text-[7px] font-mono text-muted-foreground">marcus@core.ai</span>
            <Linkedin className="w-3 h-3 text-foreground/80 hover:text-primary transition-colors" />
          </div>
        </motion.div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover card to shift diagonal split partitions elastically</span>
    </div>
  );
};
