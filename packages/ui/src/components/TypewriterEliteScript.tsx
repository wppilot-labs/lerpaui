'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../lib/cn';

interface TypewriterEliteScriptProps extends React.HTMLAttributes<HTMLHeadingElement> {
  phrases: string[];
  typeSpeedRange?: [number, number]; // [minSpeed, maxSpeed] in ms per character
  backspaceSpeed?: number; // ms per character
  phrasePauseDuration?: number; // ms to pause after typing a phrase
  backspaceDelayDuration?: number; // ms to pause before deleting
  cursorStyle?: 'pipe' | 'block' | 'underscore';
  cursorColor?: string;
  typingSpeed?: number;
  backspacingSpeed?: number;
}

export function TypewriterEliteScript({
  phrases = [
    'Enterprise Cloud Architectures.',
    'High-Performance Canvas Graphics.',
    'Ultra-Fluid React Frameworks.',
    'Bespoke Interactive Portfolios.',
  ],
  typeSpeedRange = [60, 150],
  backspaceSpeed = 35,
  phrasePauseDuration = 2200,
  backspaceDelayDuration = 800,
  cursorStyle = 'pipe',
  cursorColor = 'bg-purple-500',
  typingSpeed,
  backspacingSpeed,
  className,
  ...props
}: TypewriterEliteScriptProps) {
  const [currentText, setCurrentText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const finalTypeSpeedRange = React.useMemo<[number, number]>(() => {
    if (typingSpeed !== undefined) {
      return [typingSpeed, typingSpeed + 50];
    }
    return typeSpeedRange;
  }, [typeSpeedRange, typingSpeed]);

  const finalBackspaceSpeed = backspacingSpeed !== undefined ? backspacingSpeed : backspaceSpeed;

  useEffect(() => {
    const activePhrase = phrases[phraseIndex] || '';

    // If waiting at boundaries (typed or backspaced fully)
    if (isWaiting) return;

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing Phase
        const nextChar = activePhrase.substring(0, currentText.length + 1);
        setCurrentText(nextChar);

        if (nextChar === activePhrase) {
          // Fully typed! Wait before backspacing
          setIsWaiting(true);
          timerRef.current = setTimeout(() => {
            setIsWaiting(false);
            setIsDeleting(true);
          }, phrasePauseDuration);
        } else {
          // Compute randomized human typing speed
          const randomSpeed =
            Math.floor(Math.random() * (finalTypeSpeedRange[1] - finalTypeSpeedRange[0])) +
            finalTypeSpeedRange[0];
          
          // Slight extra pause on punctuation marks for realistic human breathing spacing
          const lastTypedChar = nextChar[nextChar.length - 1];
          const hasPunctuation = ['.', ',', '!', '?', ';'].includes(lastTypedChar);
          const nextDelay = hasPunctuation ? randomSpeed + 250 : randomSpeed;

          timerRef.current = setTimeout(handleTyping, nextDelay);
        }
      } else {
        // Backspacing Phase
        const nextChar = activePhrase.substring(0, currentText.length - 1);
        setCurrentText(nextChar);

        if (nextChar === '') {
          // Fully erased! Wait before starting next phrase
          setIsWaiting(true);
          timerRef.current = setTimeout(() => {
            setIsWaiting(false);
            setIsDeleting(false);
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
          }, backspaceDelayDuration);
        } else {
          timerRef.current = setTimeout(handleTyping, finalBackspaceSpeed);
        }
      }
    };

    // Calculate initial trigger delay
    const initialDelay = isDeleting ? finalBackspaceSpeed : finalTypeSpeedRange[0];
    timerRef.current = setTimeout(handleTyping, initialDelay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [currentText, isDeleting, phraseIndex, isWaiting, phrases, finalTypeSpeedRange, finalBackspaceSpeed, phrasePauseDuration, backspaceDelayDuration]);

  // Caret cursor configuration styles
  const caretClasses = {
    pipe: 'inline-block w-[3px] h-[1.1em] ml-1 align-middle',
    block: 'inline-block w-[0.6em] h-[1em] ml-1 align-middle',
    underscore: 'inline-block w-[0.8em] h-[3px] ml-0.5 align-baseline',
  };

  return (
    <h1
      aria-label={phrases[phraseIndex] || phrases[0] || 'Typewriter'}
      className={cn(
        "text-3xl md:text-5xl font-black text-white tracking-tight leading-tight select-none font-mono",
        className
      )}
      {...props}
    >
      <span>{currentText}</span>
      
      {/* Blinking Caret - blinks only when waiting/paused, solid when actively typing */}
      <span
        className={cn(
          caretClasses[cursorStyle],
          cursorColor,
          isWaiting ? "animate-pulse" : "opacity-100"
        )}
        style={{
          // Custom blink rate when idle
          animationDuration: isWaiting ? '0.8s' : '0s',
        }}
      />
    </h1>
  );
}
export default TypewriterEliteScript;
