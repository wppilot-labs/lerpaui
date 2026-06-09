"use client";

import React, { useState, useRef } from 'react';
import { motion, useSpring} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface RGBChromaticAberrationTitleProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  intensity?: number; // Maximum offset in pixels
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

export const RGBChromaticAberrationTitle: React.FC<RGBChromaticAberrationTitleProps> = ({
  text,
  intensity = 8,
  as: Component = 'h1',
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Smooth springs for x and y offsets of the red/cyan layers
  const springOptions = { damping: 15, stiffness: 150 };
  const rX = useSpring(0, springOptions);
  const rY = useSpring(0, springOptions);
  const bX = useSpring(0, springOptions);
  const bY = useSpring(0, springOptions);

  // A title with no text must not render empty heading elements (hooks must run first).
  if (!text) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate percentage offset from center (-1 to 1)
    const offsetX = (e.clientX - centerX) / (rect.width / 2);
    const offsetY = (e.clientY - centerY) / (rect.height / 2);

    // Apply scaling based on intensity
    rX.set(-offsetX * intensity);
    rY.set(-offsetY * intensity);
    bX.set(offsetX * intensity);
    bY.set(offsetY * intensity);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rX.set(0);
    rY.set(0);
    bX.set(0);
    bY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block cursor-default select-none"
    >
      {/* Red/Rose Layer */}
      <motion.div
        style={{
          x: prefersReducedMotion ? 0 : rX,
          y: prefersReducedMotion ? 0 : rY,
        }}
        className={cn(
          'absolute inset-0 select-none text-rose-500/80 transition-opacity duration-300 pointer-events-none z-0 blur-[0.5px]',
          isHovered && !prefersReducedMotion ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Component className={className} {...props}>
          {text}
        </Component>
      </motion.div>

      {/* Cyan/Blue Layer */}
      <motion.div
        style={{
          x: prefersReducedMotion ? 0 : bX,
          y: prefersReducedMotion ? 0 : bY,
        }}
        className={cn(
          'absolute inset-0 select-none text-cyan-400/80 transition-opacity duration-300 pointer-events-none z-0 blur-[0.5px]',
          isHovered && !prefersReducedMotion ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Component className={className} {...props}>
          {text}
        </Component>
      </motion.div>

      {/* Main Base Text */}
      <Component
        className={cn(
          'relative z-10 text-foreground transition-all duration-300 transform-gpu',
          isHovered && !prefersReducedMotion && 'scale-[1.01] text-foreground/95',
          className
        )}
        {...props}
      >
        {text}
      </Component>
    </div>
  );
};
