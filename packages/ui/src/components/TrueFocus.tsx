"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface TrueFocusProps {
  text: string;
  className?: string;
  focusColor?: string;
  blurRadius?: number;
  glow?: boolean;
}

export const TrueFocus: React.FC<TrueFocusProps> = ({
  text,
  className,
  focusColor = '#818CF8', // primary violet-400
  blurRadius = 3,
  glow = true,
}) => {
  const words = text.split(' ');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [boxDimensions, setBoxDimensions] = useState({
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  });
  const prefersReducedMotion = usePrefersReducedMotion();

  // Keep track of box coordinates dynamically
  useEffect(() => {
    if (activeIndex === null || !wordRefs.current[activeIndex]) {
      return;
    }

    const hoveredWord = wordRefs.current[activeIndex];
    const container = containerRef.current;
    if (!hoveredWord || !container) return;

    const hoveredRect = hoveredWord.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    setBoxDimensions({
      width: hoveredRect.width + 12,
      height: hoveredRect.height + 6,
      x: hoveredRect.left - containerRect.left - 6,
      y: hoveredRect.top - containerRect.top - 3,
    });
  }, [activeIndex]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative flex flex-wrap items-center gap-x-4 gap-y-2 py-4 select-none',
        className
      )}
      onMouseLeave={() => setActiveIndex(null)}
    >
      {/* Gliding focus crosshair border box */}
      {!prefersReducedMotion && (
        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{
                opacity: 1,
                scale: 1,
                width: boxDimensions.width,
                height: boxDimensions.height,
                x: boxDimensions.x,
                y: boxDimensions.y,
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 24,
              }}
              style={{
                borderColor: focusColor,
                boxShadow: glow ? `0 0 15px ${focusColor}33` : 'none',
              }}
              className="absolute z-10 pointer-events-none rounded border-2 border-dashed bg-transparent"
            >
              {/* Elegant corner crosshairs */}
              <span
                style={{ backgroundColor: focusColor }}
                className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-full border border-background"
              />
              <span
                style={{ backgroundColor: focusColor }}
                className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full border border-background"
              />
              <span
                style={{ backgroundColor: focusColor }}
                className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-full border border-background"
              />
              <span
                style={{ backgroundColor: focusColor }}
                className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-full border border-background"
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Word array rendering */}
      {words.map((word, i) => {
        const isFocused = activeIndex === i;
        const isAnyHovered = activeIndex !== null;

        return (
          <span
            key={`${word}-${i}`}
            ref={(el) => {
              wordRefs.current[i] = el;
            }}
            onMouseEnter={() => !prefersReducedMotion && setActiveIndex(i)}
            style={prefersReducedMotion ? undefined : {
              filter:
                isAnyHovered && !isFocused
                  ? `blur(${blurRadius}px)`
                  : 'blur(0px)',
              opacity: isAnyHovered && !isFocused ? 0.45 : 1,
            }}
            className="relative cursor-default py-0.5 text-3xl font-extrabold uppercase tracking-tight text-foreground transition-all duration-300 ease-out sm:text-5xl"
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
