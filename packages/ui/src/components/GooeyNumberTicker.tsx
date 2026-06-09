"use client";

import React, { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Animated number counter with gooey SVG-filter morphing digit transitions. */
export interface GooeyNumberTickerProps {
  value?: number;
  className?: string;
  fontSize?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
}

const useCount = (target: number, duration: number, reduced: boolean) => {
  const [v, setV] = useState(target);
  useEffect(() => {
    if (reduced) {
      setV(target);
      return;
    }
    const start = performance.now();
    const from = v;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - p, 3);
      setV(Math.round(from + (target - from) * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, reduced]);
  return v;
};

export const GooeyNumberTicker: React.FC<GooeyNumberTickerProps> = ({
  value = 1234,
  className,
  fontSize = 96,
  duration = 1.4,
  prefix = '',
  suffix = '',
  color = 'var(--foreground)',
}) => {
  const reduced = usePrefersReducedMotion();
  const uid = `goo-${useId().replace(/:/g, '')}`;
  const display = useCount(value, duration, reduced);
  const digits = String(display).split('');

  return (
    <div className={cn('relative inline-flex items-center', className)} style={{ color }}>
      <svg className="absolute h-0 w-0" aria-hidden>
        <defs>
          <filter id={uid}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      <div
        style={{ filter: reduced ? undefined : `url(#${uid})`, fontSize }}
        className="flex items-baseline font-bold leading-none tabular-nums"
      >
        {prefix && <span>{prefix}</span>}
        {digits.map((d, i) => (
          <span key={`pos-${i}`} className="relative inline-block overflow-hidden" style={{ width: `${fontSize * 0.6}px`, height: `${fontSize}px` }}>
            <AnimatePresence mode="popLayout">
              <motion.span
                key={d + i}
                initial={reduced ? false : { y: '100%', opacity: 0, scale: 0.6 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={reduced ? { opacity: 0 } : { y: '-100%', opacity: 0, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                className="absolute inset-0 grid place-items-center"
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </span>
        ))}
        {suffix && <span>{suffix}</span>}
      </div>
    </div>
  );
};
