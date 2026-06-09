"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface TiltedCardProps {
  children: React.ReactNode;
  className?: string;
  maxRotation?: number; // Maximum rotation in degrees
  perspective?: number; // Perspective property in pixels
  scale?: number; // Hover scaling factor
  showGlare?: boolean; // Enable reflection/shine glare
  glareOpacity?: number; // Maximum glare opacity
}

export const TiltedCard: React.FC<TiltedCardProps> = ({
  children,
  className,
  maxRotation = 12,
  perspective = 1000,
  scale = 1.03,
  showGlare = true,
  glareOpacity = 0.25,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Motion values for tracking relative mouse position (-0.5 to 0.5)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs to avoid jittering
  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const rotateXSpring = useSpring(useTransform(y, [0, 1], [maxRotation, -maxRotation]), springConfig);
  const rotateYSpring = useSpring(useTransform(x, [0, 1], [-maxRotation, maxRotation]), springConfig);
  const scaleSpring = useSpring(1, springConfig);

  // Dynamic glare angle and position
  const glareX = useSpring(useTransform(x, [0, 1], ['0%', '100%']), springConfig);
  const glareY = useSpring(useTransform(y, [0, 1], ['0%', '100%']), springConfig);
  const glareOpacitySpring = useSpring(0, springConfig);
  const glareBackground = useTransform(
    [glareX, glareY],
    (latest: string[]) =>
      `radial-gradient(circle at ${latest[0]} ${latest[1]}, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 80%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Relative position from 0 to 1
    const relativeX = (e.clientX - rect.left) / width;
    const relativeY = (e.clientY - rect.top) / height;

    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (prefersReducedMotion) return;
    scaleSpring.set(scale);
    glareOpacitySpring.set(glareOpacity);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (prefersReducedMotion) return;
    // Reset rotations to center
    x.set(0.5);
    y.set(0.5);
    scaleSpring.set(1);
    glareOpacitySpring.set(0);
  };

  return (
    <div
      className="flex items-center justify-center"
      style={{ perspective: prefersReducedMotion ? undefined : `${perspective}px` }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-lg transition-shadow duration-300',
          isHovered && 'shadow-2xl shadow-primary/10',
          className
        )}
        style={prefersReducedMotion ? undefined : {
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          scale: scaleSpring,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Child Content - Elevated in 3D Space */}
        <div style={{ transform: prefersReducedMotion ? undefined : 'translateZ(20px)' }} className="relative z-10 w-full h-full">
          {children}
        </div>

        {/* Shine Glare Overlay */}
        {showGlare && !prefersReducedMotion && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              opacity: glareOpacitySpring,
              background: glareBackground,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
