"use client";

import React, { useRef, useState, useEffect, useId } from 'react';
import { motion, useSpring, useTransform, useMotionValue} from "framer-motion";
import { cn } from '../lib/cn';

export interface ScrollTiedProgressLineProps {
  /** Nested elements within the border container */
  children: React.ReactNode;
  /** Container class names */
  className?: string;
  /** Color of the glowing trace border, e.g. "text-primary" */
  lineColor?: string;
  /** Width of the stroke line in pixels, default 2 */
  lineWidth?: number;
  /** Border corner radius in pixels, default 16 */
  borderRadius?: number;
}

export const ScrollTiedProgressLine: React.FC<ScrollTiedProgressLineProps> = ({
  children,
  className,
  lineColor = 'text-emerald-500',
  lineWidth = 2.5,
  borderRadius = 20,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const rawId = useId().replace(/:/g, '');
  const gradientId = `neon-glow-grad-${rawId}`;
  const filterId = `neon-glow-blur-${rawId}`;
  
  // Progress tracker values (0 to 1)
  const scrollProgress = useMotionValue(0);
  const progressSpring = useSpring(scrollProgress, { stiffness: 90, damping: 20 });

  // Tracking element dimensions dynamically using ResizeObserver
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const rect = entries[0].contentRect;
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Tracking screen scrolling position of the element
  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Element position coordinates relative to view
      const elementTop = rect.top;
      const elementHeight = rect.height;

      // Scroll calculation:
      // Start of scroll entry (when card top reaches bottom of viewport) -> progress 0
      // End of scroll exit (when card bottom leaves top of viewport) -> progress 1
      const totalScrollSpan = viewportHeight + elementHeight;
      const currentScrollPosition = viewportHeight - elementTop;

      let pct = currentScrollPosition / totalScrollSpan;
      pct = Math.max(0, Math.min(1, pct)); // clamp

      scrollProgress.set(pct);
    };

    // Trigger on mount + scroll + resize
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [scrollProgress]);

  // Perimeter math for SVG dash array:
  // Perimeter of a rectangle is approximately 2 * (w + h)
  const perimeter = 2 * (dimensions.width + dimensions.height);
  
  // Transform standard progress ratio to dash offset
  // When progress is 0, dashOffset = perimeter (hidden)
  // When progress is 1, dashOffset = 0 (fully drawn)
  const strokeDashoffset = useTransform(progressSpring, [0, 1], [perimeter, 0]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-[20px] p-[1.5px] overflow-hidden bg-zinc-900/10 dark:bg-black/10 transition-shadow duration-300 hover:shadow-xl group",
        className
      )}
    >
      {/* Absolute overlay tracing SVG border path */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className={cn(
            "absolute inset-0 w-full h-full pointer-events-none z-20",
            lineColor
          )}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          fill="none"
        >
          <defs>
            {/* High fidelity neon glow gradient */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Underlay faint grey track guide */}
          <rect
            x={lineWidth / 2}
            y={lineWidth / 2}
            width={dimensions.width - lineWidth}
            height={dimensions.height - lineWidth}
            rx={borderRadius}
            stroke="currentColor"
            strokeWidth={lineWidth}
            className="opacity-15 dark:opacity-10 transition-opacity group-hover:opacity-20"
          />

          {/* Active scroll-tied glowing path overlay */}
          <motion.rect
            x={lineWidth / 2}
            y={lineWidth / 2}
            width={dimensions.width - lineWidth}
            height={dimensions.height - lineWidth}
            rx={borderRadius}
            stroke={`url(#${gradientId})`}
            strokeWidth={lineWidth}
            strokeLinecap="round"
            filter={`url(#${filterId})`}
            style={{
              strokeDasharray: perimeter,
              strokeDashoffset,
            }}
          />
        </svg>
      )}

      {/* Main card nested contents container wrapper */}
      <div 
        className="w-full h-full relative z-10 rounded-[inherit] overflow-hidden bg-card text-card-foreground p-5"
        style={{ borderRadius: borderRadius - 1 }}
      >
        {children}
      </div>
    </div>
  );
};
