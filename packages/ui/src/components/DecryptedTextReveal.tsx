"use client";

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface DecryptedTextRevealProps extends React.HTMLAttributes<HTMLElement> {
  text: string;
  speed?: number;
  scrambleDuration?: number;
  characterSet?: string;
  revealDelay?: number;
  triggerOnHover?: boolean;
  animateOnMount?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div';
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

export const DecryptedTextReveal: React.FC<DecryptedTextRevealProps> = ({
  text,
  speed = 40,
  scrambleDuration = 1200,
  characterSet = DEFAULT_CHARS,
  revealDelay = 0,
  triggerOnHover = true,
  animateOnMount = true,
  as: Component = 'h2',
  className,
  ...props
}) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const startScramble = () => {
    if (prefersReducedMotion) {
      setDisplayText(text);
      return;
    }

    if (isAnimating) return;
    setIsAnimating(true);

    const startTime = Date.now();
    const length = text.length;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / scrambleDuration, 1);

      // Compute how many characters are fully revealed based on progress
      const revealedCount = Math.floor(progress * length);

      let scrambled = '';
      for (let i = 0; i < length; i++) {
        if (text[i] === ' ') {
          scrambled += ' ';
          continue;
        }

        if (i < revealedCount) {
          scrambled += text[i];
        } else {
          const randomChar = characterSet[Math.floor(Math.random() * characterSet.length)];
          scrambled += randomChar;
        }
      }

      setDisplayText(scrambled);

      if (progress < 1) {
        animationRef.current = setTimeout(tick, speed);
      } else {
        setDisplayText(text);
        setIsAnimating(false);
      }
    };

    tick();
  };

  useEffect(() => {
    let mountDelayTimeout: ReturnType<typeof setTimeout>;

    if (animateOnMount) {
      mountDelayTimeout = setTimeout(() => {
        startScramble();
      }, revealDelay);
    } else {
      setDisplayText(text);
    }

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
      if (mountDelayTimeout) clearTimeout(mountDelayTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: only re-run mount animation on text/preference changes
  }, [text, animateOnMount, revealDelay, prefersReducedMotion]);

  const handleMouseEnter = () => {
    if (triggerOnHover && !isAnimating) {
      startScramble();
    }
  };

  return (
    <Component
      className={cn(
        'font-mono select-none tracking-tight text-foreground transition-colors duration-200',
        isAnimating && 'text-primary/95 shadow-primary/10',
        className
      )}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {displayText}
    </Component>
  );
};
