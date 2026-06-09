"use client";

import React, { useCallback, useState } from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface PinContainerProps {
  className?: string;
  title?: string;
  href?: string;
  children: React.ReactNode;
}

export const PinContainer: React.FC<PinContainerProps> = ({
  className,
  title = 'lerpaui.com',
  href,
  children,
}) => {
  const [hovered, setHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative coordinates (-0.5 to 0.5)
    const mouseX = (e.clientX - rect.left) / width - 0.5;
    const mouseY = (e.clientY - rect.top) / height - 0.5;

    // Apply soft 3D rotation limits
    setRotateX(-mouseY * 18);
    setRotateY(mouseX * 18);
  }, [prefersReducedMotion]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setRotateX(0);
    setRotateY(0);
  }, []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn('relative group/pin cursor-pointer [perspective:1000px] z-20', className)}
    >
      {/* 3D Perspective Card Layout */}
      <motion.div
        animate={prefersReducedMotion ? undefined : {
          rotateX: rotateX,
          rotateY: rotateY,
          scale: hovered ? 1.02 : 1,
        }}
        transition={prefersReducedMotion ? { duration: 0 } : {
          type: 'spring',
          stiffness: 150,
          damping: 20,
        }}
        style={{
          transformStyle: 'preserve-3d',
          willChange: prefersReducedMotion ? undefined : 'transform',
        }}
        className="relative rounded-2xl border border-border bg-card p-4 shadow-md transition-shadow duration-300 hover:shadow-xl"
      >
        <div style={{ transform: prefersReducedMotion ? undefined : 'translateZ(30px)' }}>{children}</div>
      </motion.div>

      {/* Floating Glowing 3D coordinates tag / Pin Indicator */}
      {hovered && (
        <div className="absolute inset-x-0 top-0 flex items-center justify-center -translate-y-12 select-none pointer-events-none">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={prefersReducedMotion ? { duration: 0 } : {
              type: 'spring',
              stiffness: 220,
              damping: 18,
            }}
            className="flex flex-col items-center"
          >
            {/* Gloss coordinate label popover */}
            <div className="flex items-center gap-1.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-100 text-xs font-semibold px-4 py-1.5 shadow-2xl backdrop-blur-sm pointer-events-auto">
              <span>{title}</span>
              {href && <span className="text-primary">➔</span>}
            </div>

            {/* Glowing connecting vector line */}
            <div className="relative h-12 w-px bg-gradient-to-b from-primary via-primary/50 to-transparent">
              {/* Ripple ping glows */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary/20 animate-ping" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
