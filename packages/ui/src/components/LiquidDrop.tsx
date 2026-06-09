"use client";

import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Gooey blob with hover-spawned drops that merge via Gaussian blur + alpha matrix trick. */
export interface LiquidDropProps {
  className?: string;
  size?: number;
  color?: string;
  blur?: number;
  label?: string;
}

interface Drop {
  id: number;
  x: number;
}

export const LiquidDrop: React.FC<LiquidDropProps> = ({
  className,
  size = 120,
  color = 'oklch(0.65 0.22 280)',
  blur = 12,
  label = 'Hover',
}) => {
  const rawId = useId().replace(/:/g, '');
  const filterId = `goo-${rawId}`;
  const reduced = usePrefersReducedMotion();
  const [drops, setDrops] = useState<Drop[]>([]);
  const counter = useRef(0);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      timeouts.clear();
    };
  }, []);

  const spawn = () => {
    if (reduced) return;
    const id = counter.current++;
    const x = (Math.random() - 0.5) * size * 0.6;
    setDrops((prev) => [...prev, { id, x }]);
    const t = setTimeout(() => {
      timeoutsRef.current.delete(t);
      setDrops((prev) => prev.filter((d) => d.id !== id));
    }, 1400);
    timeoutsRef.current.add(t);
  };

  const dropSize = size * 0.35;

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size * 1.8, height: size * 2.4 }}
      onPointerEnter={spawn}
      onPointerMove={(e) => {
        if (Math.random() < 0.04) spawn();
        void e;
      }}
      role="img"
      aria-label={label}
    >
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <div
        className="relative h-full w-full"
        style={{ filter: reduced ? 'none' : `url(#${filterId})` }}
      >
        <div
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: size,
            height: size,
            background: color,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <AnimatePresence>
          {drops.map((d) => (
            <motion.div
              key={d.id}
              className="absolute left-1/2 rounded-full"
              style={{
                width: dropSize,
                height: dropSize,
                background: color,
                top: 0,
              }}
              initial={{ y: -dropSize, x: d.x - dropSize / 2, opacity: 0 }}
              animate={{ y: size * 0.9, x: d.x - dropSize / 2, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 60, damping: 12, duration: 1.2 }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
