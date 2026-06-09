"use client";

import React, { useEffect, useState, useRef } from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface AnimatedBeamProps {
  className?: string;
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  curvature?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  pathWidth?: number;
  dashArray?: string;
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  duration = 3,
  delay = 0,
  colorFrom = 'var(--primary, #3b82f6)',
  colorTo = 'var(--accent, #10b981)',
  pathWidth = 2,
  dashArray = '40 60',
}) => {
  const [path, setPath] = useState('');
  const uniqueId = useRef(`beam-grad-${Math.random().toString(36).substring(2, 9)}`);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      // Absolute centers relative to container bounds
      const startX = fromRect.left - containerRect.left + fromRect.width / 2;
      const startY = fromRect.top - containerRect.top + fromRect.height / 2;
      const endX = toRect.left - containerRect.left + toRect.width / 2;
      const endY = toRect.top - containerRect.top + toRect.height / 2;

      // Draw SVG curve path (Q for quadratic Bezier, or L for linear)
      if (curvature === 0) {
        setPath(`M ${startX} ${startY} L ${endX} ${endY}`);
      } else {
        // Curve vertically or horizontally depending on path alignment
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        
        // Quadratic control coordinates
        const controlX = midX;
        const controlY = midY + curvature;
        
        setPath(`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`);
      }
    };

    updatePath();

    // Dynamic resize observers
    window.addEventListener('resize', updatePath);
    const observer = new ResizeObserver(() => updatePath());
    
    if (containerRef.current) observer.observe(containerRef.current);
    if (fromRef.current) observer.observe(fromRef.current);
    if (toRef.current) observer.observe(toRef.current);

    return () => {
      window.removeEventListener('resize', updatePath);
      observer.disconnect();
    };
  }, [containerRef, fromRef, toRef, curvature]);

  // Parse sum of dash values to ensure mathematically loop-perfect seamless wraps
  const dashSum = dashArray
    .split(' ')
    .map(Number)
    .reduce((a, b) => a + b, 0);

  return (
    <svg
      className={cn('pointer-events-none absolute inset-0 h-full w-full z-0 overflow-visible', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {path && (
        <>
          {/* Static trace border path underneath */}
          <path
            d={path}
            stroke="var(--border, rgba(255, 255, 255, 0.1))"
            strokeWidth={pathWidth}
            strokeOpacity={0.4}
            strokeLinecap="round"
          />

          {/* Animating highlight pulse path */}
          <motion.path
            d={path}
            stroke={`url(#${uniqueId.current})`}
            strokeWidth={pathWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={prefersReducedMotion ? undefined : {
              strokeDashoffset: [-dashSum, 0],
            }}
            transition={prefersReducedMotion ? { duration: 0 } : {
              repeat: Infinity,
              duration: duration,
              ease: 'linear',
              delay: delay,
            }}
            style={{
              strokeDasharray: dashArray,
            }}
          />

          <defs>
            <linearGradient id={uniqueId.current} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorFrom} stopOpacity={0} />
              <stop offset="50%" stopColor={colorFrom} stopOpacity={1} />
              <stop offset="100%" stopColor={colorTo} stopOpacity={0} />
            </linearGradient>
          </defs>
        </>
      )}
    </svg>
  );
};
