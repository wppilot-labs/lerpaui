"use client";

import React, { useEffect, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Layered text with random clip-path glitch slices for hero banners. */
export interface SVGGlitchTextBannerProps {
  text?: string;
  className?: string;
  interval?: number;
  slices?: number;
}

interface Slice {
  top: number;
  height: number;
  dx: number;
  hue: number;
}

const buildSlices = (n: number): Slice[] =>
  Array.from({ length: n }, () => ({
    top: Math.random() * 90,
    height: 4 + Math.random() * 16,
    dx: (Math.random() - 0.5) * 18,
    hue: Math.random() > 0.5 ? 0 : 200,
  }));

export const SVGGlitchTextBanner: React.FC<SVGGlitchTextBannerProps> = ({
  text = 'GLITCH',
  className,
  interval = 1800,
  slices = 6,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [bursts, setBursts] = useState<Slice[]>(() => buildSlices(slices));
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) return;
    let raf: number;
    let timeout: ReturnType<typeof setTimeout>;
    const tick = () => {
      setBursts(buildSlices(slices));
      setActive(true);
      timeout = setTimeout(() => setActive(false), 220);
      raf = window.setTimeout(tick, interval + Math.random() * interval) as unknown as number;
    };
    raf = window.setTimeout(tick, 500) as unknown as number;
    return () => {
      clearTimeout(raf);
      clearTimeout(timeout);
    };
  }, [interval, slices, prefersReducedMotion]);

  return (
    <div
      className={cn(
        'relative inline-flex select-none items-center justify-center',
        className,
      )}
    >
      <span className="text-6xl font-black tracking-tight text-[var(--foreground)] sm:text-8xl">
        {text}
      </span>
      {!prefersReducedMotion &&
        bursts.map((s, i) => (
          <span
            key={i}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 text-6xl font-black tracking-tight sm:text-8xl"
            style={{
              color: s.hue === 0 ? 'rgb(255,40,80)' : 'rgb(40,180,255)',
              clipPath: `inset(${s.top}% 0 ${Math.max(0, 100 - s.top - s.height)}% 0)`,
              transform: `translateX(${active ? s.dx : 0}px)`,
              transition: 'transform 80ms steps(2)',
              mixBlendMode: 'screen',
              opacity: active ? 0.9 : 0,
            }}
          >
            {text}
          </span>
        ))}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          background:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.4) 0 1px, transparent 1px 3px)',
        }}
      />
    </div>
  );
};
