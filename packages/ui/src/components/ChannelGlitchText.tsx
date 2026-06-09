"use client";

import React, { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Text with periodic feFlood + feComposite + feMerge SVG glitch slice bursts. */
export interface ChannelGlitchTextProps {
  text?: string;
  className?: string;
  cyan?: string;
  magenta?: string;
  fontSize?: number | string;
  minInterval?: number;
  maxInterval?: number;
}

export const ChannelGlitchText: React.FC<ChannelGlitchTextProps> = ({
  text = 'SIGNAL_LOST',
  className,
  cyan = '#00f0ff',
  magenta = '#ff00ff',
  fontSize = '4rem',
  minInterval = 3000,
  maxInterval = 5000,
}) => {
  const rawId = useId().replace(/:/g, '');
  const filterId = `glitch-${rawId}`;
  const [burst, setBurst] = useState(false);
  const reduced = usePrefersReducedMotion();
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(() => {
    if (reduced) return;
    const timeouts = timeoutsRef.current;
    const schedule = () => {
      const delay = minInterval + Math.random() * (maxInterval - minInterval);
      const outer = setTimeout(() => {
        timeouts.delete(outer);
        setBurst(true);
        const inner = setTimeout(() => {
          timeouts.delete(inner);
          setBurst(false);
        }, 200);
        timeouts.add(inner);
        schedule();
      }, delay);
      timeouts.add(outer);
    };
    schedule();
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      timeouts.clear();
    };
  }, [reduced, minInterval, maxInterval]);

  const slice = burst ? 8 : 0;

  return (
    <span className={cn('relative inline-block', className)} style={{ fontSize, fontWeight: 800 }}>
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feFlood floodColor={magenta} result="magentaFlood" />
            <feComposite in="magentaFlood" in2="SourceAlpha" operator="in" result="magentaSlice" />
            <feOffset in="magentaSlice" dx={-slice} dy={slice / 2} result="magentaOffset" />

            <feFlood floodColor={cyan} result="cyanFlood" />
            <feComposite in="cyanFlood" in2="SourceAlpha" operator="in" result="cyanSlice" />
            <feOffset in="cyanSlice" dx={slice} dy={-slice / 2} result="cyanOffset" />

            <feMerge>
              <feMergeNode in="magentaOffset" />
              <feMergeNode in="cyanOffset" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <span
        className="block"
        style={{
          filter: `url(#${filterId})`,
          transform: burst ? `translateX(${(Math.random() - 0.5) * 6}px)` : 'translateX(0)',
          transition: 'transform 60ms steps(2)',
        }}
      >
        {text}
      </span>
    </span>
  );
};
