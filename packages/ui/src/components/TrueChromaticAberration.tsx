"use client";

import React, { useId, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Heading rendered through 3 channel-isolated SVG layers offset for true RGB split aberration. */
export interface TrueChromaticAberrationProps {
  text?: string;
  className?: string;
  maxOffset?: number;
  fontSize?: number | string;
  color?: string;
}

export const TrueChromaticAberration: React.FC<TrueChromaticAberrationProps> = ({
  text = 'CHROMATIC',
  className,
  maxOffset = 16,
  fontSize = '6rem',
  color = 'currentColor',
}) => {
  const rawId = useId().replace(/:/g, '');
  const redId = `red-${rawId}`;
  const greenId = `green-${rawId}`;
  const blueId = `blue-${rawId}`;
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const offset = useTransform(scrollYProgress, [0, 0.5, 1], [maxOffset, 0, maxOffset]);
  const dxR = useTransform(offset, (v) => -v);
  const dxB = useTransform(offset, (v) => v);

  return (
    <div
      ref={ref}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ color }}
    >
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <filter id={redId} x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="redIso"
            />
            <feOffset in="redIso" dx={reduced ? 0 : -maxOffset} dy="0" result="redShift" />
            <feMerge>
              <feMergeNode in="redShift" />
            </feMerge>
          </filter>
          <filter id={greenId} x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            />
          </filter>
          <filter id={blueId} x="-20%" y="-20%" width="140%" height="140%">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="blueIso"
            />
            <feOffset in="blueIso" dx={reduced ? 0 : maxOffset} dy="0" result="blueShift" />
            <feMerge>
              <feMergeNode in="blueShift" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <div className="relative" style={{ fontSize, fontWeight: 900, letterSpacing: '-0.02em' }}>
        <motion.span
          aria-hidden
          className="absolute inset-0 mix-blend-screen"
          style={{ filter: `url(#${redId})`, x: reduced ? 0 : dxR }}
        >
          {text}
        </motion.span>
        <span aria-hidden className="absolute inset-0 mix-blend-screen" style={{ filter: `url(#${greenId})` }}>
          {text}
        </span>
        <motion.span
          aria-hidden
          className="absolute inset-0 mix-blend-screen"
          style={{ filter: `url(#${blueId})`, x: reduced ? 0 : dxB }}
        >
          {text}
        </motion.span>
        <span className="opacity-0 select-none" aria-label={text}>
          {text}
        </span>
      </div>
    </div>
  );
};
