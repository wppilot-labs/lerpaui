"use client";

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Pointer-driven ray-cast light beams emitted from cursor position via conic gradient. */
export interface RayCastHoverEffectProps {
  className?: string;
  children?: React.ReactNode;
  rayColor?: string;
  rayCount?: number;
  intensity?: number;
}

export const RayCastHoverEffect: React.FC<RayCastHoverEffectProps> = ({
  className,
  children,
  rayColor = 'rgba(168, 85, 247, 0.55)',
  rayCount = 18,
  intensity = 0.9,
}) => {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const active = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 24 });
  const sy = useSpring(y, { stiffness: 180, damping: 24 });
  const sa = useSpring(active, { stiffness: 120, damping: 20 });

  // Build the conic stops for ray fan
  const stops = Array.from({ length: rayCount }, (_, i) => {
    const start = (i * 360) / rayCount;
    const mid = start + 360 / rayCount / 2;
    const next = start + 360 / rayCount;
    return `transparent ${start}deg, ${rayColor} ${mid}deg, transparent ${next}deg`;
  }).join(', ');

  const bg = useTransform<number, string>(
    [sx, sy] as [MotionValue<number>, MotionValue<number>],
    ([cx, cy]) => `conic-gradient(from 0deg at ${cx * 100}% ${cy * 100}%, ${stops})`,
  );

  const mask = useTransform<number, string>(
    [sx, sy] as [MotionValue<number>, MotionValue<number>],
    ([cx, cy]) => `radial-gradient(circle at ${cx * 100}% ${cy * 100}%, black 0%, black 30%, transparent 70%)`,
  );

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };

  return (
    <div
      ref={ref}
      onPointerEnter={() => active.set(intensity)}
      onPointerMove={handleMove}
      onPointerLeave={() => active.set(0)}
      className={cn('relative overflow-hidden', className)}
    >
      {children}
      <motion.div
        aria-hidden
        style={{
          background: bg,
          maskImage: mask,
          WebkitMaskImage: mask,
          opacity: sa,
          mixBlendMode: 'screen',
        }}
        className="pointer-events-none absolute inset-0"
      />
    </div>
  );
};
