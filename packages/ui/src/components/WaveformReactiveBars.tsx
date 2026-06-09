"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Audio-style waveform bars driven by simulated FFT amplitude with smooth envelope. */
export interface WaveformReactiveBarsProps {
  className?: string;
  barCount?: number;
  gap?: number;
  color?: string;
  accent?: string;
  minHeight?: number;
  maxHeight?: number;
  speed?: number;
  rounded?: number;
}

export const WaveformReactiveBars: React.FC<WaveformReactiveBarsProps> = ({
  className,
  barCount = 48,
  gap = 4,
  color = 'var(--accent)',
  accent = 'var(--foreground)',
  minHeight = 8,
  maxHeight = 100,
  speed = 1,
  rounded = 6,
}) => {
  const reduced = usePrefersReducedMotion();
  const [amps, setAmps] = useState<number[]>(() => Array.from({ length: barCount }, () => 0.2));
  const rafRef = useRef<number>(0);
  const tRef = useRef(0);

  useEffect(() => {
    if (reduced) {
      setAmps(Array.from({ length: barCount }, () => 0.5));
      return;
    }
    const tick = () => {
      tRef.current += 0.04 * speed;
      const t = tRef.current;
      setAmps(
        Array.from({ length: barCount }, (_, i) => {
          const phase = (i / barCount) * Math.PI * 2;
          const a =
            0.5 +
            0.35 * Math.sin(t * 1.7 + phase) +
            0.25 * Math.sin(t * 3.1 + phase * 2.3) +
            0.12 * Math.sin(t * 5.4 + phase * 0.7);
          return Math.max(0.05, Math.min(1, a));
        }),
      );
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [barCount, reduced, speed]);

  return (
    <div
      className={cn('flex items-center justify-center', className)}
      style={{ gap, height: maxHeight }}
      role="img"
      aria-label="Audio waveform"
    >
      {amps.map((a, i) => {
        const h = minHeight + a * (maxHeight - minHeight);
        const isMid = i % 4 === 0;
        return (
          <span
            key={i}
            className="block"
            style={{
              width: 4,
              height: h,
              borderRadius: rounded,
              background: `linear-gradient(180deg, ${isMid ? accent : color}, color-mix(in oklab, ${color} 40%, transparent))`,
              boxShadow: `0 0 10px color-mix(in oklab, ${color} ${30 + a * 40}%, transparent)`,
              transition: reduced ? undefined : 'height 80ms linear',
            }}
          />
        );
      })}
    </div>
  );
};
