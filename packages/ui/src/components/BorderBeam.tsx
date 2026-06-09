"use client";

import React, { useRef, useEffect, useState, useId } from 'react';
import { motion} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface BorderBeamProps {
  className?: string;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  className,
  duration = 4,
  borderWidth = 2,
  colorFrom = 'var(--primary, #3b82f6)',
  colorTo = 'transparent',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();
  const gradId = `border-beam-grad-${useId()}`;

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current.parentElement;
    if (!element) return;

    const updateDimensions = () => {
      const rect = element.getBoundingClientRect();
      setDimensions({
        width: rect.width,
        height: rect.height,
      });
    };

    updateDimensions();

    const observer = new ResizeObserver(() => {
      updateDimensions();
    });
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const path = `M ${borderWidth / 2} ${borderWidth / 2}
                L ${dimensions.width - borderWidth / 2} ${borderWidth / 2}
                L ${dimensions.width - borderWidth / 2} ${dimensions.height - borderWidth / 2}
                L ${borderWidth / 2} ${dimensions.height - borderWidth / 2}
                Z`;

  const perimeter = (dimensions.width + dimensions.height) * 2;

  return (
    <div
      ref={containerRef}
      className={cn('pointer-events-none absolute inset-0 rounded-[inherit]', className)}
    >
      {dimensions.width > 0 && dimensions.height > 0 && (
        <svg
          className="absolute inset-0 h-full w-full rounded-[inherit]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            d={path}
            stroke={`url(#${gradId})`}
            strokeWidth={borderWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: 0 }}
            animate={prefersReducedMotion ? undefined : {
              strokeDashoffset: [-perimeter, 0],
            }}
            transition={prefersReducedMotion ? undefined : {
              repeat: Infinity,
              duration: duration,
              ease: "linear",
            }}
            style={{
              strokeDasharray: `${perimeter * 0.25} ${perimeter * 0.75}`,
            }}
          />
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorFrom} />
              <stop offset="50%" stopColor={colorFrom} stopOpacity={0.5} />
              <stop offset="100%" stopColor={colorTo} stopOpacity={0} />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
};
