"use client";

import React, { useId, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Image with SVG turbulence + displacement mesh distortion on hover. */
export interface MeshDistortionImageHoverProps {
  src: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  intensity?: number;
  rounded?: string;
}

export const MeshDistortionImageHover: React.FC<MeshDistortionImageHoverProps> = ({
  src,
  alt = '',
  className,
  width = 480,
  height = 320,
  intensity = 36,
  rounded = '1rem',
}) => {
  const filterId = useId().replace(/:/g, '');
  const animRef = useRef<SVGAnimateElement>(null);
  const [hovered, setHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEnter = () => {
    setHovered(true);
    if (!prefersReducedMotion && animRef.current) {
      try {
        animRef.current.beginElement();
      } catch {
        /* noop */
      }
    }
  };

  return (
    <div
      className={cn('relative inline-block overflow-hidden', className)}
      style={{ width, height, borderRadius: rounded }}
      onPointerEnter={handleEnter}
      onPointerLeave={() => setHovered(false)}
    >
      <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
        <defs>
          <filter id={`mesh-${filterId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.018"
              numOctaves={2}
              seed={4}
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale={hovered ? intensity : 0}>
              <animate
                ref={animRef}
                attributeName="scale"
                from="0"
                to={String(intensity)}
                dur="0.55s"
                begin="indefinite"
                fill="freeze"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="h-full w-full object-cover transition-[filter,transform] duration-500 ease-out"
        style={{
          filter: hovered && !prefersReducedMotion ? `url(#mesh-${filterId})` : 'none',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            'radial-gradient(circle at 50% 50%, transparent 50%, rgba(0,0,0,0.35) 100%)',
        }}
      />
    </div>
  );
};
