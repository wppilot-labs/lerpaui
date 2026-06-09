"use client";

import React, { forwardRef, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Button that magnetically attracts the cursor with tilt-based highlight. */
export interface MagneticCursorButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'ref' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration'
  > {
  strength?: number;
  tilt?: number;
}

export const MagneticCursorButton = forwardRef<HTMLButtonElement, MagneticCursorButtonProps>(
  ({ children, className, strength = 0.35, tilt = 18, ...rest }, ref) => {
    const prefersReducedMotion = usePrefersReducedMotion();
    const localRef = useRef<HTMLButtonElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rx = useMotionValue(0);
    const ry = useMotionValue(0);

    const sx = useSpring(x, { stiffness: 240, damping: 18, mass: 0.4 });
    const sy = useSpring(y, { stiffness: 240, damping: 18, mass: 0.4 });
    const srx = useSpring(rx, { stiffness: 180, damping: 14 });
    const sry = useSpring(ry, { stiffness: 180, damping: 14 });

    // Velocity-aware squash: compress on the axis of motion when pointer moves fast.
    const velocityX = useVelocity(sx);
    const velocityY = useVelocity(sy);
    const squashY = useTransform(velocityX, (v) =>
      prefersReducedMotion ? 1 : 1 - Math.min(0.15, Math.abs(v) / 2000),
    );
    const squashX = useTransform(velocityY, (v) =>
      prefersReducedMotion ? 1 : 1 - Math.min(0.15, Math.abs(v) / 2000),
    );

    const glareX = useTransform(sx, [-50, 50], ['20%', '80%']);
    const glareY = useTransform(sy, [-50, 50], ['20%', '80%']);

    const setRefs = (node: HTMLButtonElement | null) => {
      localRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    };

    const handleMove = (e: React.PointerEvent<HTMLButtonElement>) => {
      if (prefersReducedMotion || !localRef.current) return;
      const r = localRef.current.getBoundingClientRect();
      const cx = e.clientX - r.left - r.width / 2;
      const cy = e.clientY - r.top - r.height / 2;
      x.set(cx * strength);
      y.set(cy * strength);
      ry.set((cx / r.width) * tilt);
      rx.set((-cy / r.height) * tilt);
    };

    const reset = () => {
      x.set(0);
      y.set(0);
      rx.set(0);
      ry.set(0);
    };

    return (
      <motion.button
        ref={setRefs}
        onPointerMove={handleMove}
        onPointerLeave={reset}
        style={{
          x: sx,
          y: sy,
          rotateX: srx,
          rotateY: sry,
          scaleX: squashX,
          scaleY: squashY,
          transformPerspective: 600,
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          'relative inline-flex select-none items-center justify-center overflow-hidden rounded-full border border-[var(--border)] bg-[var(--accent)] px-7 py-3 text-sm font-medium text-[var(--accent-foreground,#fff)] shadow-lg shadow-black/20 transition-colors',
          className,
        )}
        {...rest}
      >
        <span className="relative z-10">{children ?? 'Hover me'}</span>
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: useTransform(
              [glareX, glareY],
              (v) => `radial-gradient(circle at ${(v as string[])[0]} ${(v as string[])[1]}, rgba(255,255,255,0.55), transparent 55%)`,
            ),
          }}
        />
      </motion.button>
    );
  },
);

MagneticCursorButton.displayName = 'MagneticCursorButton';
