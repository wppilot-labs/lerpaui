"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number; // Animation duration in seconds
  color?: string; // Base text color
  shineColor?: string; // Accent color sweep
  disabled?: boolean;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  className,
  speed = 3,
  color = '#8A8A93', // slate-400 base
  shineColor = '#FFFFFF', // highlight white sweep
  disabled = false,
}) => {
  const animationDuration = `${speed}s`;
  const uniqueId = `shiny-text-${text.replace(/\s+/g, '-').toLowerCase().substring(0, 10)}`;
  const prefersReducedMotion = usePrefersReducedMotion();

  if (disabled || prefersReducedMotion) {
    return (
      <span style={{ color }} className={cn('inline-block font-medium', className)}>
        {text}
      </span>
    );
  }

  return (
    <>
      {/* Self-contained CSS injection prevents stylesheet dependencies */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shine-sweep-${uniqueId} {
            0% {
              background-position: -200% center;
            }
            100% {
              background-position: 200% center;
            }
          }
          .${uniqueId} {
            color: ${color};
            background: linear-gradient(
              110deg,
              ${color} 30%,
              ${shineColor} 50%,
              ${color} 70%
            );
            background-size: 200% auto;
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shine-sweep-${uniqueId} ${animationDuration} linear infinite;
          }
        `
      }} />
      <span className={cn('inline-block font-semibold', uniqueId, className)}>
        {text}
      </span>
    </>
  );
};
