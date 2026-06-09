"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // CSS Color or tailwind color variable, e.g. "rgba(var(--primary), 0.15)"
  glowSize?: number; // Radial glow size in px
  showBorderGlow?: boolean;
}

export const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className,
  glowColor = 'rgba(99, 102, 241, 0.15)', // Premium purple/indigo glow default
  glowSize = 350,
  showBorderGlow = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Spring configurations for super-smooth cursor glow updates
  const springConfig = { damping: 25, stiffness: 250, mass: 0.5 };

  const mouseX = useSpring(useMotionValue(0), springConfig);
  const mouseY = useSpring(useMotionValue(0), springConfig);
  const glowOpacity = useSpring(useMotionValue(0), springConfig);

  const glowX = useTransform(mouseX, (v) => `${v}px`);
  const glowY = useTransform(mouseY, (v) => `${v}px`);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();

    // Smoothly set coordinates relative to container
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseEnter = () => {
    if (prefersReducedMotion) return;
    glowOpacity.set(1);
  };

  const handleMouseLeave = () => {
    if (prefersReducedMotion) return;
    glowOpacity.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-md transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/5 group',
        className
      )}
    >
      {/* Background Spotlight Radial Glow */}
      {!prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            opacity: glowOpacity,
            background: `radial-gradient(${glowSize}px circle at var(--x) var(--y), ${glowColor}, transparent 80%)`,
            '--x': glowX,
            '--y': glowY,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any}
        />
      )}

      {/* Dynamic Border Shimmer Overlay */}
      {showBorderGlow && !prefersReducedMotion && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none border border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
          style={{
            maskImage: `radial-gradient(${glowSize / 1.5}px circle at var(--x) var(--y), black, transparent)`,
            WebkitMaskImage: `radial-gradient(${glowSize / 1.5}px circle at var(--x) var(--y), black, transparent)`,
            '--x': glowX,
            '--y': glowY,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any}
        />
      )}

      {/* Foreground Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};
export default SpotlightCard;
