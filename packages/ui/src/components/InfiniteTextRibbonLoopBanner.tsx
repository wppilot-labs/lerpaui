'use client';

import React from 'react';
import { motion} from "framer-motion";
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface InfiniteTextRibbonLoopBannerProps {
  className?: string;
}

export const InfiniteTextRibbonLoopBanner: React.FC<InfiniteTextRibbonLoopBannerProps> = ({ className }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const row1 = ["NEURAL SHARD", "DISTRUBUTED NET", "QUANTUM SECURE", "ELASTIC COMPILING"];
  const row2 = ["ZERO COLD BOOT", "SYNAPSE TUNING", "VECTOR DATABASE", "LEDGER SYSTEM"];

  const marqueeVariants = {
    animate: {
      x: [0, -1000],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 25,
          ease: "linear"
        }
      }
    },
    animateReverse: {
      x: [-1000, 0],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 25,
          ease: "linear"
        }
      }
    }
  };

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Infinite Loop Ribbons</span>

      <div className="flex flex-col gap-4 w-full my-auto rotate-[-6deg] overflow-visible">
        {/* Forward Marquee */}
        <div className="flex overflow-hidden w-full relative h-10 border-y border-purple-500/20 bg-purple-500/5 items-center">
          <motion.div 
            variants={marqueeVariants}
            animate={prefersReducedMotion ? {} : "animate"}
            className="flex gap-8 whitespace-nowrap text-xs font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500"
          >
            {[...row1, ...row1, ...row1, ...row1].map((text, idx) => (
              <span key={idx} className="tracking-widest flex items-center gap-2">
                {text} <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              </span>
            ))}
          </motion.div>
        </div>

        {/* Reverse Marquee */}
        <div className="flex overflow-hidden w-full relative h-10 border-y border-cyan-500/20 bg-cyan-500/5 items-center">
          <motion.div 
            variants={marqueeVariants}
            animate={prefersReducedMotion ? {} : "animateReverse"}
            className="flex gap-8 whitespace-nowrap text-xs font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500"
          >
            {[...row2, ...row2, ...row2, ...row2].map((text, idx) => (
              <span key={idx} className="tracking-widest flex items-center gap-2">
                {text} <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Seamless opposed looping tracks</span>
    </div>
  );
};
