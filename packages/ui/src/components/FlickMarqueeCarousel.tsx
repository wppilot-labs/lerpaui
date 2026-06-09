"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, PanInfo } from 'framer-motion';
import { Zap, Play, Pause } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface FlickMarqueeCarouselProps {
  className?: string;
}

export const FlickMarqueeCarousel: React.FC<FlickMarqueeCarouselProps> = ({
  className,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 100, damping: 20 });
  const speed = useRef(-1);

  useEffect(() => {
    let frameId: number = 0;
    const loop = () => {
      if (isPlaying) {
        let current = x.get() + speed.current;
        if (current < -320) {
          current = 0;
        }
        x.set(current);
      }
      if (!prefersReducedMotion) {
        frameId = requestAnimationFrame(loop);
      }
    };
    if (!prefersReducedMotion) {
      frameId = requestAnimationFrame(loop);
    }
    return () => { if (frameId) cancelAnimationFrame(frameId); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: x motion value is stable, RAF loop reads current value
  }, [isPlaying, prefersReducedMotion]);

  const handleDragEnd = (_e: unknown, info: PanInfo) => {
    speed.current = Math.max(-5, Math.min(5, info.velocity.x * 0.05));
    if (speed.current === 0) speed.current = -1;
  };

  return (
    <div className={cn('relative w-full max-w-[320px] bg-card border border-border rounded-2xl p-4 flex flex-col justify-between select-none shadow-md overflow-hidden', className)}>
      <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Flickable Marquee</span>
        </div>

        <button
          type="button"
          aria-label={isPlaying ? 'Pause' : 'Play'}
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1 rounded bg-secondary/50 border border-border text-foreground hover:bg-secondary active:scale-95 transition-all flex items-center justify-center"
        >
          {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 text-primary fill-primary" />}
        </button>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden flex py-2 select-none"
      >
        <motion.div
          drag="x"
          dragElastic={0.05}
          style={{ x: springX }}
          onDragEnd={handleDragEnd}
          className="flex gap-3 cursor-grab active:cursor-grabbing w-max select-none"
        >
          {['Active', 'Secure', 'Modular', 'Dynamic', 'Elastic', 'Organic', 'Vibrant'].map((word, idx) => (
            <div 
              key={idx}
              className="px-4 py-2 border border-border bg-secondary/15 text-foreground rounded-xl font-black font-semibold text-xs tracking-wider uppercase"
            >
              {word}
            </div>
          ))}
        </motion.div>
      </div>
      
      <span className="text-[8px] text-muted-foreground/60 font-extrabold uppercase mt-2 text-center">Flick text banner to accelerate</span>
    </div>
  );
};
