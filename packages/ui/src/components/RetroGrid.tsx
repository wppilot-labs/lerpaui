"use client";

import React from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface RetroGridProps {
  className?: string;
  angle?: number; // Tilt angle in degrees (e.g. 50 to 75)
  gridColor?: string; // Border or grid line color
  speed?: number; // Scroll duration in seconds
  gridSize?: number; // Size of grid squares in pixels
  fadeColor?: string; // Horizon fade background color (usually matches the page background)
}

export const RetroGrid: React.FC<RetroGridProps> = ({
  className,
  angle = 55,
  gridColor = 'rgba(156, 163, 175, 0.12)', // light gray or dark-border dependent
  speed = 12,
  gridSize = 60,
  fadeColor = 'var(--background)',
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden opacity-60 [perspective:200px]',
        className
      )}
    >
      {/* 3D Grid Plane */}
      <div
        className="absolute inset-0"
        style={{
          transformOrigin: '50% 0%',
          transform: `rotateX(${angle}deg)`,
          backgroundImage: `
            linear-gradient(to right, ${gridColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
          animationDuration: prefersReducedMotion ? undefined : `${speed}s`,
          animationName: prefersReducedMotion ? undefined : 'retro-grid-scroll',
          animationTimingFunction: prefersReducedMotion ? undefined : 'linear',
          animationIterationCount: prefersReducedMotion ? undefined : 'infinite',
          width: '600%',
          height: '600%',
          left: '-250%',
          top: '-150%',
        }}
      />

      {/* Fade Mask (fades to horizon) */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: `linear-gradient(to top, transparent 0%, ${fadeColor || 'bg-background'} 80%)`,
        }}
      />

      {/* Injecting CSS Keyframes directly so we don't need tailwind.config modifications */}
      {!prefersReducedMotion && (
        <style>{`
          @keyframes retro-grid-scroll {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 0 ${gridSize}px;
            }
          }
        `}</style>
      )}
    </div>
  );
};
