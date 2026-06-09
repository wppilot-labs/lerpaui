"use client";

import React, { useId, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Image (or gradient surface) warped by continuously animated feTurbulence + feDisplacementMap. */
export interface DisplacementWaveImageProps {
  src?: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  scale?: number;
  hoverScale?: number;
  fallbackGradient?: string;
}

export const DisplacementWaveImage: React.FC<DisplacementWaveImageProps> = ({
  src,
  alt = '',
  className,
  width = 420,
  height = 280,
  scale = 20,
  hoverScale = 48,
  fallbackGradient = 'linear-gradient(135deg, oklch(0.65 0.18 250), oklch(0.7 0.2 320))',
}) => {
  const rawId = useId().replace(/:/g, '');
  const filterId = `wave-${rawId}`;
  const turbRef = useRef<SVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const reduced = usePrefersReducedMotion();

  const activeScale = hovered ? hoverScale : scale;

  return (
    <div
      className={cn('relative inline-block overflow-hidden rounded-2xl', className)}
      style={{ width, height }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.025"
              numOctaves={2}
              seed={2}
              result="turb"
            >
              {!reduced && (
                <animate
                  ref={turbRef as React.RefObject<SVGAnimateElement>}
                  attributeName="baseFrequency"
                  dur="8s"
                  values="0.012 0.02; 0.022 0.034; 0.012 0.02"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale={reduced ? 0 : activeScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {src ? (
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="h-full w-full object-cover transition-[filter] duration-500"
          style={{ filter: reduced ? 'none' : `url(#${filterId})` }}
        />
      ) : (
        <div
          aria-hidden
          className="h-full w-full"
          style={{
            background: fallbackGradient,
            filter: reduced ? 'none' : `url(#${filterId})`,
            transition: 'filter 500ms',
          }}
        />
      )}
    </div>
  );
};
