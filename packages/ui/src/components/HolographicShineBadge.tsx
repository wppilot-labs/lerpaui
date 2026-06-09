"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Iridescent holographic foil badge with pointer-tracked conic shimmer. */
export interface HolographicShineBadgeProps {
  children?: React.ReactNode;
  className?: string;
  size?: number;
}

export const HolographicShineBadge: React.FC<HolographicShineBadgeProps> = ({
  children,
  className,
  size = 120,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [, setHovered] = useState(false);

  const px = useMotionValue(50);
  const py = useMotionValue(50);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);

  const sx = useSpring(rx, { stiffness: 200, damping: 16 });
  const sy = useSpring(ry, { stiffness: 200, damping: 16 });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    px.set((x / r.width) * 100);
    py.set((y / r.height) * 100);
    ry.set(((x - r.width / 2) / r.width) * 22);
    rx.set(((r.height / 2 - y) / r.height) * 22);
  };

  const reset = () => {
    setHovered(false);
    rx.set(0);
    ry.set(0);
    px.set(50);
    py.set(50);
  };

  return (
    <motion.div
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={reset}
      onPointerMove={handleMove}
      style={{
        width: size,
        height: size,
        rotateX: sx,
        rotateY: sy,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className={cn(
        'relative grid place-items-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] shadow-2xl',
        className,
      )}
    >
      {/* Iridescent base — reactive pointer tracking via useMotionTemplate */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: useMotionTemplate`conic-gradient(from 220deg at ${px}% ${py}%, #ff5fb1, #6ee7f6, #fef08a, #a78bfa, #ff5fb1)`,
          opacity: 0.85,
        }}
      />
      {/* Shimmer track */}
      {!prefersReducedMotion && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.65) 50%, transparent 65%)',
            mixBlendMode: 'overlay',
            animation: 'holo-shine 2.8s linear infinite',
          }}
        />
      )}
      {/* Foil grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            'repeating-linear-gradient(135deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 4px)',
          mixBlendMode: 'overlay',
        }}
      />
      <div className="relative z-10 text-center text-xs font-semibold uppercase tracking-[0.18em]">
        {children ?? 'Premium'}
      </div>
      <style>{`@keyframes holo-shine { 0% { transform: translateX(-100%);} 100% { transform: translateX(100%);} }`}</style>
    </motion.div>
  );
};
