"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Matrix-style scramble that resolves to final text letter-by-letter. */
export interface TextScrambleRevealProps {
  text?: string;
  className?: string;
  chars?: string;
  duration?: number;
  delay?: number;
  startOnView?: boolean;
}

const DEFAULT_CHARS = '!<>-_\\/[]{}—=+*^?#________';

export const TextScrambleReveal: React.FC<TextScrambleRevealProps> = ({
  text = 'Welcome to the future.',
  className,
  chars = DEFAULT_CHARS,
  duration = 1400,
  delay = 0,
  startOnView = true,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text.replace(/[^\s]/g, ' '));
  const startedRef = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplay(text);
      return;
    }
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const targets = text.split('');
      const startTime = performance.now() + delay;
      let raf = 0;

      const tick = (now: number) => {
        const elapsed = Math.max(0, now - startTime);
        const progress = Math.min(1, elapsed / duration);
        const reveal = Math.floor(progress * targets.length);
        const next = targets
          .map((ch, i) => {
            if (i < reveal || ch === ' ') return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        setDisplay(next);
        if (progress < 1) raf = requestAnimationFrame(tick);
        else setDisplay(text);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    if (!startOnView || !ref.current) {
      const cancel = start();
      return cancel;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          start();
          obs.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [text, chars, duration, delay, startOnView, prefersReducedMotion]);

  return (
    <span
      ref={ref}
      className={cn(
        'inline-block whitespace-pre-wrap font-mono text-[var(--foreground)] tabular-nums',
        className,
      )}
    >
      {display}
    </span>
  );
};
