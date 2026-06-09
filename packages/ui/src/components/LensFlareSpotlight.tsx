"use client";

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Pointer-tracked lens flare with anamorphic streaks and chromatic edges. */
export interface LensFlareSpotlightProps {
  className?: string;
  children?: React.ReactNode;
  flareSize?: number;
  streakCount?: number;
  intensity?: number;
  color?: string;
  accent?: string;
}

export const LensFlareSpotlight: React.FC<LensFlareSpotlightProps> = ({
  className,
  children,
  flareSize = 280,
  streakCount = 6,
  intensity = 0.85,
  color = '255, 240, 200',
  accent = '120, 180, 255',
}) => {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 22 });
  const sy = useSpring(y, { stiffness: 200, damping: 22 });

  // Velocity-driven anamorphic streak elongation. Faster pointer X -> longer streaks.
  const velocityX = useVelocity(sx);
  const streakScale = useTransform(velocityX, (v) =>
    reduced ? 1 : 1 + Math.min(1.5, Math.abs(v) / 1200),
  );

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  const streaks = Array.from({ length: streakCount }, (_, i) => (i * 180) / streakCount);

  return (
    <div
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerMove={handleMove}
      onPointerLeave={() => setHovered(false)}
      className={cn('relative overflow-hidden', className)}
    >
      {children}
      <motion.div
        aria-hidden
        style={{ left: sx, top: sy, width: flareSize, height: flareSize, x: -flareSize / 2, y: -flareSize / 2, opacity: hovered ? intensity : 0, mixBlendMode: 'screen' }}
        className="pointer-events-none absolute"
      >
        {/* Core radial */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(${color},1) 0%, rgba(${color},0.6) 18%, rgba(${accent},0.2) 45%, transparent 70%)`,
            filter: 'blur(2px)',
          }}
        />
        {/* Chromatic outer ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, transparent 38%, rgba(${accent},0.35) 48%, transparent 58%)`,
            filter: 'blur(4px)',
          }}
        />
        {/* Anamorphic streaks */}
        {streaks.map((deg, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              width: flareSize * 2.2,
              height: 2,
              marginLeft: -(flareSize * 2.2) / 2,
              marginTop: -1,
              background: `linear-gradient(90deg, transparent, rgba(${color},${0.55 - i * 0.05}) 50%, transparent)`,
              transformOrigin: 'center',
              filter: 'blur(1.2px)',
              rotate: deg,
              scaleX: streakScale,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};
