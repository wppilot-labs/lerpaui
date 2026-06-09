"use client";

import React, { forwardRef, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Interactive 3D card flip with pointer-tracked holographic glare overlay. */
export interface Card3DFlipHologramProps {
  front?: React.ReactNode;
  back?: React.ReactNode;
  className?: string;
  width?: number | string;
  height?: number | string;
  flipOnHover?: boolean;
}

export const Card3DFlipHologram = forwardRef<HTMLDivElement, Card3DFlipHologramProps>(
  ({ front, back, className, width = 320, height = 440, flipOnHover = false }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [flipped, setFlipped] = useState(false);

    const px = useMotionValue(50);
    const py = useMotionValue(50);
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);
    const flipMv = useMotionValue(0);

    const sx = useSpring(rx, { stiffness: 120, damping: 14 });
    const sy = useSpring(ry, { stiffness: 120, damping: 14 });
    const sFlip = useSpring(flipMv, { stiffness: 80, damping: 18 });

    const glareBg = useTransform<number, string>([px, py] as [MotionValue<number>, MotionValue<number>], ([x, y]) =>
      `conic-gradient(from 180deg at ${x}% ${y}%, transparent 0deg, rgba(255,255,255,0.55) 90deg, transparent 180deg, rgba(168,85,247,0.45) 270deg, transparent 360deg)`,
    );

    const combinedY = useTransform<number, number>([sy, sFlip] as [MotionValue<number>, MotionValue<number>], ([a, b]) => a + b);

    const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      px.set((x / r.width) * 100);
      py.set((y / r.height) * 100);
      ry.set(((x - r.width / 2) / r.width) * 22);
      rx.set(((r.height / 2 - y) / r.height) * 22);
    };

    const reset = () => {
      rx.set(0);
      ry.set(0);
      if (flipOnHover) {
        setFlipped(false);
        flipMv.set(0);
      }
    };

    const toggleFlip = () => {
      const next = !flipped;
      setFlipped(next);
      flipMv.set(next ? 180 : 0);
    };

    return (
      <div
        ref={ref}
        style={{ width, height, perspective: 1400 }}
        className={cn(
          'relative cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] rounded-2xl',
          className,
        )}
        role={flipOnHover ? undefined : 'button'}
        tabIndex={flipOnHover ? undefined : 0}
        aria-pressed={flipOnHover ? undefined : flipped}
        aria-label={flipOnHover ? undefined : 'Flip card'}
        onClick={() => !flipOnHover && toggleFlip()}
        onKeyDown={(e) => {
          if (flipOnHover) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleFlip();
          }
        }}
        onPointerEnter={() => {
          if (flipOnHover) {
            setFlipped(true);
            flipMv.set(180);
          }
        }}
      >
        <motion.div
          ref={containerRef}
          onPointerMove={handleMove}
          onPointerLeave={reset}
          style={{
            rotateX: prefersReducedMotion ? 0 : sx,
            rotateY: prefersReducedMotion ? (flipped ? 180 : 0) : combinedY,
            transformStyle: 'preserve-3d',
          }}
          className="relative h-full w-full"
        >
          {/* Front face */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className="absolute inset-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]"
          >
            <div className="relative z-0 h-full w-full p-6 text-[var(--foreground)]">
              {front ?? (
                <div className="flex h-full flex-col justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] opacity-60">Hologram</span>
                  <h3 className="text-3xl font-semibold">Premium Card</h3>
                </div>
              )}
            </div>
            <motion.div
              aria-hidden
              style={{ background: glareBg, mixBlendMode: 'color-dodge' }}
              className="pointer-events-none absolute inset-0 opacity-70"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                background:
                  'repeating-linear-gradient(115deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 6px)',
              }}
            />
          </div>

          {/* Back face */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--accent)]/40 to-[var(--card)] p-6 text-[var(--foreground)]"
          >
            {back ?? (
              <div className="flex h-full items-center justify-center text-center">
                <p className="text-sm opacity-80">Tap to flip back.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  },
);

Card3DFlipHologram.displayName = 'Card3DFlipHologram';
