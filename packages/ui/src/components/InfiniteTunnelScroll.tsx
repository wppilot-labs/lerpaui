"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useVelocity } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Perspective infinite tunnel of concentric squares/rings driven by scroll depth. */
export interface InfiniteTunnelScrollProps {
  className?: string;
  ringCount?: number;
  shape?: 'square' | 'circle';
  color?: string;
  accent?: string;
  perspective?: number;
  scrollDriven?: boolean;
  duration?: number;
}

export const InfiniteTunnelScroll: React.FC<InfiniteTunnelScrollProps> = ({
  className,
  ringCount = 24,
  shape = 'square',
  color = 'var(--border)',
  accent = 'var(--accent)',
  perspective = 800,
  scrollDriven = true,
  duration = 12,
}) => {
  const fogColor = 'rgba(8, 10, 24, 0.85)';
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [depth, setDepth] = useState(0);

  // Scroll velocity -> fog depth mix. Faster scroll => more fog overlay.
  const { scrollY } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const scrollVelocity = useVelocity(scrollY);
  const fogOpacity = useTransform(scrollVelocity, (v) => {
    if (reduced) return 0;
    // smoothstep(0, 2000, |v|)
    const t = Math.max(0, Math.min(1, Math.abs(v) / 2000));
    return t * t * (3 - 2 * t);
  });

  useEffect(() => {
    if (reduced || !scrollDriven) return;
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const center = r.top + r.height / 2;
      const offset = (window.innerHeight / 2 - center) / window.innerHeight;
      setDepth(offset);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [reduced, scrollDriven]);

  return (
    <div
      ref={containerRef}
      className={cn('relative grid place-items-center overflow-hidden', className)}
      style={{ perspective }}
    >
      <div
        className="relative"
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          animation: reduced || scrollDriven ? undefined : `tunnel-pull ${duration}s linear infinite`,
        }}
      >
        {Array.from({ length: ringCount }, (_, i) => {
          const progress = i / ringCount;
          const z = -i * 110 + depth * 1400;
          const scale = 1 - progress * 0.05;
          const opacity = Math.max(0, 1 - progress * 1.15);
          const isAccent = i % 4 === 0;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                width: 360,
                height: 360,
                marginLeft: -180,
                marginTop: -180,
                borderRadius: shape === 'circle' ? '50%' : 16,
                border: `1.5px solid ${isAccent ? accent : color}`,
                transform: `translateZ(${z}px) scale(${scale})`,
                opacity,
                boxShadow: isAccent ? `0 0 24px color-mix(in oklab, ${accent} 35%, transparent)` : undefined,
              }}
            />
          );
        })}
      </div>
      {/* Velocity-driven fog overlay */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at center, transparent 0%, ${fogColor} 75%)`,
          opacity: fogOpacity,
          mixBlendMode: 'multiply',
        }}
      />
      <style>{`
        @keyframes tunnel-pull {
          from { transform: translateZ(0); }
          to { transform: translateZ(110px); }
        }
      `}</style>
    </div>
  );
};
