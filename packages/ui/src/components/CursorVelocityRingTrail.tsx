"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface CursorVelocityRingTrailProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: string; // Border color class or CSS hex code
  size?: number; // Base diameter of the cursor ring in px
  ringWidth?: number; // Thickness of the ring border in px
  trailDelay?: number; // Lag factor (0.01 to 0.3). Lower means more lag/trail
  maxStretch?: number; // Max scaling factor when moving at high speeds
  velocityScaling?: number; // Sensitivity of velocity stretch mapping
}

export const CursorVelocityRingTrail: React.FC<CursorVelocityRingTrailProps> = ({
  color = 'border-primary',
  size = 40,
  ringWidth = 2,
  trailDelay = 0.08,
  maxStretch = 1.6,
  velocityScaling = 0.15,
  className,
  ...props
}) => {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    // Track mouse coordinates
    let mouseX = 0;
    let mouseY = 0;

    // Current positions of the trailing dot and ring
    let dotX = 0;
    let dotY = 0;
    let ringX = 0;
    let ringY = 0;

    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!hasMoved) {
        hasMoved = true;
        // Instantly align first to prevent sliding in from (0,0)
        dotX = mouseX;
        dotY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    let animationFrameId: number;

    const update = () => {
      if (hasMoved) {
        // Interpolate (Lerp) positions
        dotX += (mouseX - dotX) * 0.25;
        dotY += (mouseY - dotY) * 0.25;

        const prevRingX = ringX;
        const prevRingY = ringY;

        ringX += (mouseX - ringX) * trailDelay;
        ringY += (mouseY - ringY) * trailDelay;

        // Calculate velocity (distance between frames)
        const dx = ringX - prevRingX;
        const dy = ringY - prevRingY;
        const distance = Math.hypot(dx, dy);

        // Map velocity to stretch scale and squash scale (conserves volume)
        const speed = Math.min(distance * velocityScaling, maxStretch - 1);
        const stretch = 1 + speed;
        const squash = 1 / (1 + speed * 0.6);

        // Angle in degrees for direction of movement
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Apply transformations using direct styles for buttery smooth 120Hz performance
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${stretch}, ${squash})`;
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [trailDelay, maxStretch, velocityScaling, prefersReducedMotion]);

  // If accessibility prefers reduced motion, hide custom cursor entirely
  if (prefersReducedMotion) return null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-50 overflow-hidden transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0',
        className
      )}
      {...props}
    >
      {/* Outer Stretching Ring */}
      <div
        ref={ringRef}
        className={cn(
          'absolute left-0 top-0 rounded-full border transform-gpu ease-out will-change-transform',
          color
        )}
        style={{
          width: size,
          height: size,
          borderWidth: ringWidth,
        }}
      />
      
      {/* Center Precise Dot */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-primary transform-gpu will-change-transform"
      />
    </div>
  );
};
