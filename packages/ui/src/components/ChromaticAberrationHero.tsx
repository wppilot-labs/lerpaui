"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Hero heading with scroll-driven RGB chromatic aberration text-shadow split. */
export interface ChromaticAberrationHeroProps {
  text?: string;
  subtitle?: string;
  className?: string;
  maxOffset?: number;
}

export const ChromaticAberrationHero: React.FC<ChromaticAberrationHeroProps> = ({
  text = 'Beyond Reality',
  subtitle,
  className,
  maxOffset = 14,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const split = useTransform(scrollYProgress, [0, 0.5, 1], [0, maxOffset, 0]);
  const blur = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1.2, 0]);

  const shadow = useTransform([split, blur], (values) => {
    const [s, b] = values as [number, number];
    if (prefersReducedMotion) return 'none';
    return `${s}px 0 ${b}px rgba(255,40,80,0.85), ${-s}px 0 ${b}px rgba(40,180,255,0.85), 0 0 ${b * 2}px rgba(168,85,247,0.45)`;
  });

  return (
    <section
      ref={ref}
      className={cn(
        'relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 text-center',
        className,
      )}
    >
      <motion.h1
        style={{ textShadow: shadow }}
        className="bg-gradient-to-b from-[var(--foreground)] via-[var(--foreground)] to-[var(--foreground)]/60 bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-7xl md:text-8xl"
      >
        {text}
      </motion.h1>
      {subtitle && (
        <p className="mt-6 max-w-2xl text-base text-[var(--foreground)]/70 sm:text-lg">
          {subtitle}
        </p>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, var(--accent) 0%, transparent 60%)',
        }}
      />
    </section>
  );
};
