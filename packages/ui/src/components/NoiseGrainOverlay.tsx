"use client";

import React, { useEffect, useId, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** SVG feTurbulence noise overlay with animated seed for organic film grain. */
export interface NoiseGrainOverlayProps {
  className?: string;
  intensity?: number;
  baseFrequency?: number;
  numOctaves?: number;
  blendMode?: React.CSSProperties['mixBlendMode'];
  animated?: boolean;
  speed?: number;
}

export const NoiseGrainOverlay: React.FC<NoiseGrainOverlayProps> = ({
  className,
  intensity = 0.35,
  baseFrequency = 0.9,
  numOctaves = 2,
  blendMode = 'overlay',
  animated = true,
  speed = 8,
}) => {
  const reduced = usePrefersReducedMotion();
  const uid = `grain-${useId().replace(/:/g, '')}`;
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (!animated || reduced) return;
    let frame = 0;
    let raf = 0;
    const stride = Math.max(1, Math.round(60 / Math.max(1, speed)));
    const tick = () => {
      frame += 1;
      if (frame % stride === 0) setSeed((s) => (s + 1) % 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated, reduced, speed]);

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
      style={{ opacity: intensity, mixBlendMode: blendMode }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id={uid}>
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency={baseFrequency}
            numOctaves={numOctaves}
            seed={seed}
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${uid})`} />
      </svg>
    </div>
  );
};
