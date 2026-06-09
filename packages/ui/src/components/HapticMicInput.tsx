"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence} from "framer-motion";
import { cn } from '../lib/cn';
import { Mic, MicOff } from 'lucide-react';

interface HapticMicInputProps {
  onStart?: () => void;
  onStop?: (duration: number) => void;
  className?: string;
  maxDuration?: number; // max recording duration in seconds
}

export const HapticMicInput: React.FC<HapticMicInputProps> = ({
  onStart,
  onStop,
  className,
  maxDuration = 30,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Frequency wave representation heights
  const [frequencies, setFrequencies] = useState<number[]>([20, 40, 25, 60, 30, 45, 20]);

  // Dynamic animation frequency bars loop while active
  useEffect(() => {
    if (!isActive) {
      setSeconds(0);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev >= maxDuration) {
          handleToggle();
          return maxDuration;
        }
        return prev + 1;
      });
    }, 1000);

    const freqInterval = setInterval(() => {
      // Mock sound frequencies values between 15% and 85% height
      setFrequencies(
        Array.from({ length: 9 }, () => Math.floor(Math.random() * 70) + 15)
      );
    }, 110);

    return () => {
      clearInterval(timer);
      clearInterval(freqInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: handleToggle/maxDuration captured at mount; only re-bind on active toggle
  }, [isActive]);

  const handleToggle = () => {
    if (!isActive) {
      setIsActive(true);
      if (onStart) onStart();
    } else {
      setIsActive(false);
      if (onStop) onStop(seconds);
    }
  };

  // Human readable timer string
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-6 p-6 select-none', className)}>
      <div className="relative flex items-center justify-center w-60 h-60 select-none">
        
        {/* Dynamic Sonar Echo Ripples (expanding spring waves when active) */}
        <AnimatePresence>
          {isActive && (
            <>
              {/* Ripple 1 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                className="absolute w-24 h-24 rounded-full bg-primary/20 pointer-events-none"
              />
              {/* Ripple 2 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 0.6,
                }}
                className="absolute w-24 h-24 rounded-full bg-primary/15 pointer-events-none"
              />
              {/* Ripple 3 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: 1.2,
                }}
                className="absolute w-24 h-24 rounded-full bg-primary/10 pointer-events-none"
              />
            </>
          )}
        </AnimatePresence>

        {/* Dynamic Frequencies Wave Bars in absolute circle outer perimeter */}
        <AnimatePresence>
          {isActive && (
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none z-10">
              {frequencies.map((height, idx) => (
                <motion.div
                  key={idx}
                  className="w-1.5 rounded-full bg-primary"
                  animate={{ height: `${height}%` }}
                  transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Core Microphone Tactile Toggle Circle Button */}
        <motion.button
          onClick={handleToggle}
          type="button"
          aria-label={isActive ? 'Stop recording' : 'Start recording'}
          aria-pressed={isActive}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 400, damping: 22 }}
          className={cn(
            'absolute w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-2 z-20 cursor-pointer transition-all duration-300',
            isActive
              ? 'bg-red-500 border-red-400 text-white shadow-red-500/20'
              : 'bg-primary border-primary/50 text-white shadow-primary/20 hover:bg-primary/95'
          )}
        >
          <AnimatePresence mode="wait">
            {isActive ? (
              <motion.div
                key="active"
                initial={{ scale: 0.8, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0.8, rotate: 20 }}
              >
                <MicOff className="w-8 h-8 animate-pulse" />
              </motion.div>
            ) : (
              <motion.div
                key="inactive"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
              >
                <Mic className="w-8 h-8" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Recording Prompt Information Text */}
      <div className="text-center">
        {isActive ? (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-red-500 flex items-center gap-1.5 animate-pulse uppercase tracking-wider">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
              Listening...
            </span>
            <span className="text-2xl font-mono font-bold text-foreground mt-1">
              {formatTime(seconds)}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
              Vocal Input Prompt
            </span>
            <span className="text-xs text-muted-foreground mt-1 select-none">
              Click the microphone button to start recording
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
export default HapticMicInput;
