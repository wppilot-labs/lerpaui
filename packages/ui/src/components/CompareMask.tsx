"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring} from "framer-motion";
import { cn } from '../lib/cn';
import { ArrowLeftRight } from 'lucide-react';

interface CompareMaskProps {
  before: React.ReactNode | string;
  after: React.ReactNode | string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
  initialPercent?: number; // 0 to 100
  aspectRatio?: string; // e.g. "aspect-video", "aspect-[4/3]", "h-[400px]"
}

export const CompareMask: React.FC<CompareMaskProps> = ({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className,
  initialPercent = 50,
  aspectRatio = 'aspect-video w-full',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Track width safely to avoid layout thrashing
  useEffect(() => {
    if (!containerRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Motion value for the horizontal drag offset
  const dragX = useMotionValue((initialPercent / 100) * dimensions.width);

  // Update drag position if dimensions change (e.g. on resize)
  useEffect(() => {
    if (dimensions.width > 0) {
      dragX.set((initialPercent / 100) * dimensions.width);
    }
  }, [dimensions.width, initialPercent, dragX]);

  // Spring transition for super buttery smooth slide
  const smoothX = useSpring(dragX, { stiffness: 300, damping: 30, mass: 0.8 });

  // Calculate percentage clip based on position
  const clipPercent = useTransform(smoothX, (x) => {
    if (dimensions.width === 0) return initialPercent;
    const clampedX = Math.max(0, Math.min(x, dimensions.width));
    return (clampedX / dimensions.width) * 100;
  });

  // Clip paths for before and after blocks
  const beforeClipPath = useTransform(clipPercent, (pct) => `inset(0 0 0 ${pct}%)`);
  const afterClipPath = useTransform(clipPercent, (pct) => `inset(0 ${100 - pct}% 0 0)`);

  const renderContent = (content: React.ReactNode | string, label: string, isBefore: boolean) => {
    if (typeof content === 'string') {
      return (
        <div className="relative w-full h-full select-none">
          <img
            src={content}
            alt={label}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div
            className={cn(
              "absolute bottom-4 px-3 py-1 text-xs font-semibold bg-background/80 backdrop-blur-md text-foreground rounded-full border border-border shadow-sm pointer-events-none select-none",
              isBefore ? "right-4" : "left-4"
            )}
          >
            {label}
          </div>
        </div>
      );
    }

    return (
      <div className="relative w-full h-full">
        {content}
        <div
          className={cn(
            "absolute bottom-4 px-3 py-1 text-xs font-semibold bg-background/80 backdrop-blur-md text-foreground rounded-full border border-border shadow-sm pointer-events-none select-none",
            isBefore ? "right-4" : "left-4"
          )}
        >
          {label}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-muted/20 select-none shadow-md group',
        aspectRatio,
        className
      )}
    >
      {/* Before / Under Layer (clipped from left as dragX slides right) */}
      <motion.div
        className="absolute inset-0 w-full h-full z-10"
        style={{ clipPath: beforeClipPath }}
      >
        {renderContent(before, beforeLabel, true)}
      </motion.div>

      {/* After / Over Layer (clipped from right as dragX slides left) */}
      <motion.div
        className="absolute inset-0 w-full h-full z-0"
        style={{ clipPath: afterClipPath }}
      >
        {renderContent(after, afterLabel, false)}
      </motion.div>

      {/* Interactive Drag Handle */}
      {dimensions.width > 0 && (
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: dimensions.width }}
          dragElastic={0}
          dragMomentum={false}
          style={{ x: dragX }}
          className="absolute top-0 bottom-0 w-1 hover:w-2 z-20 cursor-ew-resize group-hover:scale-x-105 active:scale-x-110"
        >
          {/* Vertical Split Line */}
          <div
            className="absolute inset-y-0 -left-[1px] right-0 bg-primary/80 backdrop-blur-sm pointer-events-none"
            style={{ boxShadow: '0 0 10px rgba(var(--primary-rgb), 0.5)' }}
          />

          {/* Floating Slider Button Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background border-2 border-primary shadow-lg shadow-black/35 flex items-center justify-center transition-all group-hover:scale-110 active:scale-95 group-hover:border-accent">
            <ArrowLeftRight className="w-4 h-4 text-primary animate-pulse" />
          </div>

          {/* Fancy subtle dots indicating slider action */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/60" />
        </motion.div>
      )}
    </div>
  );
};
