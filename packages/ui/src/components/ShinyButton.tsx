"use client";

import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface ShinyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  className?: string;
  children: React.ReactNode;
  magnetStrength?: number;
  sheenColor?: string;
}

export const ShinyButton: React.FC<ShinyButtonProps> = ({
  className,
  children,
  magnetStrength = 0.25,
  sheenColor = 'rgba(255, 255, 255, 0.15)',
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Spring magnetic pulls
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 15 });
  const springY = useSpring(y, { stiffness: 120, damping: 15 });

  // Sheen coordinates
  const sheenX = useMotionValue(-100);
  const sheenY = useMotionValue(-100);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Mouse coordinates relative to button center
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    // Apply magnetic pull toward cursor
    if (!prefersReducedMotion) {
      x.set(mouseX * magnetStrength);
      y.set(mouseY * magnetStrength);
    }

    // Apply absolute mouse position for sheen
    sheenX.set(e.clientX - rect.left);
    sheenY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    // Move sheen out of sight
    sheenX.set(-200);
    sheenY.set(-200);
  };

  const background = useMotionTemplate`radial-gradient(100px circle at ${sheenX}px ${sheenY}px, ${sheenColor}, transparent 80%)`;

  return (
    <motion.button
      type="button"
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border bg-card px-6 py-3 font-semibold text-foreground transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring select-none cursor-pointer',
        className
      )}
      {...props}
    >
      {/* Dynamic Cursor Spotlight sheen */}
      <motion.div
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{ background }}
      />
      
      {/* Accent subtle shine border */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full pointer-events-none" style={{ animation: 'shimmer 3s infinite linear' }} />
      
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  );
};
