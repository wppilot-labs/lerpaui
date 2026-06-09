"use client";

import React, { useRef } from 'react';
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useTransform,
  useVelocity,
} from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Text marquee bent into a rotating 3D cylinder via per-letter rotateY. */
export interface MarqueeRing3DProps {
  text?: string;
  className?: string;
  radius?: number;
  duration?: number;
  fontSize?: number;
  color?: string;
  tilt?: number;
}

export const MarqueeRing3D: React.FC<MarqueeRing3DProps> = ({
  text = 'LAUNCH • UI • PREMIUM • COMPONENTS • ',
  className,
  radius = 220,
  duration = 18,
  fontSize = 36,
  color = 'var(--foreground)',
  tilt = -18,
}) => {
  const reduced = usePrefersReducedMotion();
  const chars = text.split('');
  const step = 360 / chars.length;

  // Scroll-velocity-boosted rotation. Default rate (deg/sec) + scrollVelocity*0.02.
  const baseRate = 360 / duration; // deg/sec
  const rotation = useMotionValue(0);
  const lastFrameRef = useRef<number | null>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  useAnimationFrame((t) => {
    if (reduced) return;
    const prev = lastFrameRef.current;
    lastFrameRef.current = t;
    if (prev == null) return;
    const dt = (t - prev) / 1000; // sec
    const sv = scrollVelocity.get();
    const rate = Math.max(0, baseRate + sv * 0.02); // deg/sec
    rotation.set(rotation.get() + rate * dt);
  });
  const rotateYDeg = useTransform(rotation, (deg) => deg);

  return (
    <div
      className={cn('relative grid place-items-center', className)}
      style={{
        perspective: 1200,
        width: radius * 2.4,
        height: radius * 2.4,
      }}
    >
      <motion.div
        className="relative"
        style={{
          width: radius * 2,
          height: radius * 2,
          transformStyle: 'preserve-3d',
          rotateX: tilt,
          rotateY: reduced ? 0 : rotateYDeg,
        }}
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 select-none font-bold tracking-tight"
            style={{
              fontSize,
              color,
              transform: `translate(-50%, -50%) rotateY(${i * step}deg) translateZ(${radius}px)`,
              transformOrigin: 'center',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              textShadow:
                '0 0 14px color-mix(in oklab, var(--accent) 60%, transparent)',
            }}
          >
            {ch}
          </span>
        ))}
        {/* Reflective base */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: radius * 1.6,
            height: radius * 0.2,
            background:
              'radial-gradient(ellipse, color-mix(in oklab, var(--accent) 35%, transparent), transparent 70%)',
            transform: 'translate(-50%, 80%) rotateX(90deg)',
            transformOrigin: 'center',
            filter: 'blur(6px)',
          }}
        />
      </motion.div>
    </div>
  );
};
