"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface CursorAttractionMagnetProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart' | 'style'> {
  children: React.ReactNode;
  range?: number; // Proximity attraction range in px
  strength?: number; // Attraction strength for outer border (0 to 1)
  innerStrength?: number; // Attraction strength for inner child content (0 to 1)
}

export const CursorAttractionMagnet: React.FC<CursorAttractionMagnetProps> = ({
  children,
  range = 100,
  strength = 0.35,
  innerStrength = 0.55,
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAttracted, setIsAttracted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Smooth springs for outer container movement
  const springOptions = { damping: 15, stiffness: 120, mass: 0.8 };
  const x = useSpring(0, springOptions);
  const y = useSpring(0, springOptions);

  // Smooth springs for inner content (gives nested depth)
  const innerX = useSpring(0, springOptions);
  const innerY = useSpring(0, springOptions);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from mouse to center of the component
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.hypot(dx, dy);

      if (distance < range) {
        // Proximity factor (1 at center, 0 at the edge of the range)
        const proximityFactor = (range - distance) / range;
        
        x.set(dx * strength * proximityFactor);
        y.set(dy * strength * proximityFactor);
        innerX.set(dx * innerStrength * proximityFactor);
        innerY.set(dy * innerStrength * proximityFactor);
        
        setIsAttracted(true);
      } else {
        // Smoothly snap back to center
        x.set(0);
        y.set(0);
        innerX.set(0);
        innerY.set(0);
        setIsAttracted(false);
      }
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
      innerX.set(0);
      innerY.set(0);
      setIsAttracted(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [range, strength, innerStrength, prefersReducedMotion, x, y, innerX, innerY]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        x: prefersReducedMotion ? 0 : x,
        y: prefersReducedMotion ? 0 : y,
      }}
      className={cn(
        'relative inline-block rounded-xl border border-border bg-card p-4 transition-shadow duration-300 transform-gpu',
        isAttracted ? 'shadow-lg shadow-primary/5 border-primary/50' : 'shadow-sm',
        className
      )}
      {...props}
    >
      <motion.div
        style={{
          x: prefersReducedMotion ? 0 : innerX,
          y: prefersReducedMotion ? 0 : innerY,
        }}
        className="relative z-10 w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
