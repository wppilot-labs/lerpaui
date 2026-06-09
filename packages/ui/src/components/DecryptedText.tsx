"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React, { useEffect, useState, useRef } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface DecryptedTextProps {
  text: string;
  className?: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  useHover?: boolean;
  characters?: string;
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:"",./<>?';

export const DecryptedText: React.FC<DecryptedTextProps> = ({
  text,
  className,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  useHover = true,
  characters = DEFAULT_CHARS,
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timerRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const startDecryption = () => {
    if (isDecrypting || prefersReducedMotion) return;
    setIsDecrypting(true);

    let iteration = 0;
    const length = text.length;

    // Clear previous timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';

            if (sequential) {
              // Sequentially decrypt characters from left to right
              const revealThreshold = Math.floor(iteration / maxIterations);
              if (index < revealThreshold) {
                return text[index];
              }
            } else {
              // Randomized decryption
              if (Math.random() < iteration / (maxIterations * length)) {
                return text[index];
              }
            }

            // Return a random scramble character
            const randomIndex = Math.floor(Math.random() * characters.length);
            return characters[randomIndex];
          })
          .join('');
      });

      iteration++;

      const isFinished = sequential
        ? Math.floor(iteration / maxIterations) >= length
        : displayText === text && iteration > maxIterations;

      if (isFinished) {
        setDisplayText(text);
        setIsDecrypting(false);
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      }
    }, speed);
  };

  useEffect(() => {
    if (prefersReducedMotion) return;
    // Start automatically on mount
    startDecryption();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: re-run decryption only when text/motion preference changes
  }, [text, prefersReducedMotion]);

  const handleMouseEnter = () => {
    if (useHover && !prefersReducedMotion) {
      startDecryption();
    }
  };

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      className={cn(
        'font-mono select-none transition-colors duration-200 cursor-default text-foreground',
        isDecrypting && 'text-primary',
        className
      )}
      style={isDecrypting ? { filter: 'drop-shadow(0 0 8px rgba(var(--primary-rgb), 0.5))' } : undefined}
    >
      {displayText}
    </span>
  );
};
