'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring} from "framer-motion";
import { Cpu } from 'lucide-react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface ScrollRevealCinematicImageProps {
  className?: string;
}

export const ScrollRevealCinematicImage: React.FC<ScrollRevealCinematicImageProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const springScroll = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  // map scroll progress to size and blur transitions
  const cardScale = useTransform(springScroll, [0, 0.5, 1], [0.9, 1, 0.9]);
  const blurVal = useTransform(springScroll, [0, 0.5, 1], ["8px", "0px", "8px"]);

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Cinematic Scroll Reveal</span>

      <motion.div
        style={prefersReducedMotion ? undefined : { scale: cardScale, filter: `blur(${blurVal})` }}
        className="w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-900 via-indigo-950 to-cyan-950 p-4 flex flex-col justify-between text-white shadow-xl my-auto z-0"
      >
        <div className="flex justify-between items-start">
          <span className="text-[8px] font-mono tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase font-black">CINEMATIC STAGGER</span>
          <Cpu className="w-4 h-4 text-purple-200" />
        </div>

        <div>
          <h4 className="text-xs font-black tracking-wide">Scroll Reveal Image</h4>
          <p className="text-[9px] opacity-85 leading-relaxed mt-1">Expanding and unblurring cinematic visuals beautifully as they enter viewports.</p>
        </div>
      </motion.div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Scroll page vertically to zoom reveal</span>
    </div>
  );
};
