"use client";

import React, { useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Glow color. Accepts any CSS color including rgba/oklch tokens. */
  spotlightColor?: string;
  /** Diameter of the glow in pixels. */
  spotlightSize?: number;
  /** Disable the glow entirely (defaults: also disabled if user prefers reduced motion). */
  disabled?: boolean;
}

export function SpotlightCard({
  children,
  className,
  spotlightColor = 'rgba(37, 99, 235, 0.12)',
  spotlightSize = 350,
  disabled = false,
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isFocused, setIsFocused] = useState(false);
  const reduced = usePrefersReducedMotion();
  const effectOn = !disabled && !reduced;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !effectOn) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => effectOn && setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      onFocus={() => effectOn && setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      className={cn(
        'group relative overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all duration-300',
        className
      )}
      {...props}
    >
      {effectOn && isFocused && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-100 motion-reduce:hidden"
          style={{
            background: `radial-gradient(${spotlightSize}px circle at ${coords.x}px ${coords.y}px, ${spotlightColor}, transparent 80%)`,
          }}
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
