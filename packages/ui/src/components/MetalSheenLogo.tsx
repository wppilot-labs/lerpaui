"use client";

import React, { useId, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Logo text with feSpecularLighting + feComposite sheen band; light azimuth tracks pointer. */
export interface MetalSheenLogoProps {
  text?: string;
  className?: string;
  fontSize?: number | string;
  baseColor?: string;
  lightColor?: string;
}

export const MetalSheenLogo: React.FC<MetalSheenLogoProps> = ({
  text = 'TITAN',
  className,
  fontSize = '6rem',
  baseColor = 'oklch(0.55 0.02 240)',
  lightColor = '#ffffff',
}) => {
  const rawId = useId().replace(/:/g, '');
  const filterId = `sheen-${rawId}`;
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [azimuth, setAzimuth] = useState(45);
  const [elevation, setElevation] = useState(60);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left) / rect.width;
    const cy = (e.clientY - rect.top) / rect.height;
    setAzimuth(cx * 360);
    setElevation(20 + cy * 60);
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handleMove}
      onPointerLeave={() => {
        setAzimuth(45);
        setElevation(60);
      }}
      className={cn('relative inline-block', className)}
    >
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feSpecularLighting
              in="blur"
              surfaceScale="4"
              specularConstant="1.2"
              specularExponent="22"
              lightingColor={lightColor}
              result="spec"
            >
              <feDistantLight azimuth={azimuth} elevation={elevation} />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specMask" />
            <feComposite
              in="SourceGraphic"
              in2="specMask"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
            />
          </filter>
        </defs>
      </svg>

      <span
        className="block select-none"
        style={{
          fontSize,
          fontWeight: 900,
          letterSpacing: '-0.04em',
          color: baseColor,
          filter: reduced ? 'none' : `url(#${filterId})`,
          transition: 'filter 200ms',
        }}
      >
        {text}
      </span>
    </div>
  );
};
