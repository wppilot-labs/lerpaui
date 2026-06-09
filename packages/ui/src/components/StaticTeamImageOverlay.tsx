'use client';

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { Linkedin, Award, Cpu } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface StaticTeamImageOverlayProps {
  className?: string;
}

export const StaticTeamImageOverlay: React.FC<StaticTeamImageOverlayProps> = ({ className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnter = useCallback(() => setIsHovered(true), []);
  const handleLeave = useCallback(() => setIsHovered(false), []);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Static Team Image Overlay</span>

      <div
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl bg-card my-auto transition-shadow duration-300"
      >
        {/* Full-bleed background image simulation with gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

        {/* Simulating a dynamic abstract vector background representing image scale */}
        <motion.div
          animate={prefersReducedMotion ? undefined : (isHovered ? { scale: 1.1, rotate: 2 } : { scale: 1, rotate: 0 })}
          className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-indigo-950 to-cyan-950 transition-all duration-500"
          style={{ willChange: prefersReducedMotion ? undefined : 'transform' }}
        />

        {/* Small floating particles simulating image details */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <Cpu className="w-16 h-16 text-primary/40 animate-pulse" />
        </div>

        <div className="absolute inset-0 p-4 flex flex-col justify-between z-20">
          <div className="flex justify-between items-start">
            <span className="text-[7.5px] font-mono tracking-widest bg-black/60 border border-white/10 px-2 py-0.5 rounded text-white uppercase font-black">IMAGE OVERLAY</span>
            <Award className="w-4 h-4 text-primary" />
          </div>

          <div className="flex flex-col">
            <span className="text-[7.5px] font-mono tracking-widest text-primary uppercase font-bold">RESEARCH</span>
            <h4 className="text-xs font-black tracking-wide text-white uppercase mt-0.5">Dr. Evelyn Vane</h4>
            
            <motion.div
              initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: isHovered ? 1 : 0 } : (isHovered ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 })}
              className="overflow-hidden mt-1.5"
            >
              <p className="text-[9px] text-white/80 leading-relaxed">
                Spearheads core similarity matrix architectures and neural system compiler synchronization.
              </p>
            </motion.div>

            <div className="flex items-center justify-between border-t border-white/10 pt-2 mt-2">
              <span className="text-[7.5px] font-mono text-white/70">evelyn@core.ai</span>
              <Linkedin className="w-3.5 h-3.5 text-white/80 hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover profile to slide up text bio pane elastically</span>
    </div>
  );
};
