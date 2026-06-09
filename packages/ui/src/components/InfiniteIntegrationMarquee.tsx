"use client";

import React, { useRef, useState, useEffect } from 'react';

import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface IntegrationItem {
  name: string;
  icon: React.ReactNode;
}

export interface InfiniteIntegrationMarqueeProps {
  /** Integration logo items */
  items: IntegrationItem[];
  /** Scrolling speed scale (higher is faster), default 1 */
  speed?: number;
  /** Scrolling direction */
  direction?: 'left' | 'right';
  /** Container class name */
  className?: string;
}

export const InfiniteIntegrationMarquee: React.FC<InfiniteIntegrationMarqueeProps> = ({
  items,
  speed = 1,
  direction = 'left',
  className,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  
  const [offset, setOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [width, setWidth] = useState(0);

  // Speed dampening state
  const speedMultiplier = useRef(1);
  const offsetRef = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  // Measure single row width to know where to loop
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        // Divide by 2 because items are cloned to loop infinitely
        setWidth(entries[0].contentRect.width / 2);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  // High performance smooth ticking loop
  useEffect(() => {
    if (width === 0) return;

    const loop = () => {
      // Smoothly interpolate the speed multiplier (lerp)
      const targetMultiplier = isHovered ? 0.12 : 1.0; // Dampen to 12% speed on hover
      speedMultiplier.current = speedMultiplier.current * 0.92 + targetMultiplier * 0.08;

      // Base step size per frame
      const baseStep = 0.85 * speed * speedMultiplier.current;

      if (direction === 'left') {
        offsetRef.current += baseStep;
        if (offsetRef.current >= width) {
          offsetRef.current = 0;
        }
      } else {
        offsetRef.current -= baseStep;
        if (offsetRef.current <= 0) {
          offsetRef.current = width;
        }
      }

      setOffset(offsetRef.current);
      if (!prefersReducedMotion) {
        animationFrameId.current = requestAnimationFrame(loop);
      }
    };

    if (!prefersReducedMotion) {
      animationFrameId.current = requestAnimationFrame(loop);
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [width, isHovered, speed, direction, prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full overflow-hidden py-6 bg-zinc-950/5 dark:bg-black/10 border-y border-border/80 flex flex-col justify-center select-none",
        className
      )}
    >
      {/* Fade masks on Left and Right borders */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Scrolling Row */}
      <div
        ref={rowRef}
        className="flex min-w-max gap-4"
        style={{
          transform: `translate3d(-${offset}px, 0, 0)`,
          willChange: 'transform',
        }}
      >
        {/* Render base items + duplicated items to create a seamless loops */}
        {Array.from({ length: 4 }).map((_, loopIdx) => (
          <div key={`loop-${loopIdx}`} className="flex gap-4 shrink-0">
            {items.map((item, itemIdx) => (
              <div
                key={`badge-${loopIdx}-${itemIdx}`}
                className="group/badge relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-border bg-card/60 backdrop-blur-sm text-card-foreground shadow-sm hover:shadow-md hover:border-emerald-500/40 dark:hover:border-emerald-400/30 hover:bg-card transition-all duration-200 cursor-pointer"
              >
                {/* Brand Icon wrapper */}
                <div className="w-5 h-5 flex items-center justify-center text-primary group-hover/badge:scale-110 transition-transform duration-200">
                  {item.icon}
                </div>

                {/* Brand Name */}
                <span className="text-xs font-semibold tracking-tight leading-none text-muted-foreground group-hover/badge:text-foreground transition-colors duration-200">
                  {item.name}
                </span>

                {/* Hover Glow Highlight Circle */}
                <div className="absolute -inset-px rounded-[inherit] border border-primary/20 opacity-0 group-hover/badge:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
