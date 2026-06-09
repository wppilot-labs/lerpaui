"use client";

import React, { useState, useEffect } from 'react';
import { motion} from "framer-motion";
import { Mic, Square, Volume2 } from 'lucide-react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface VoiceWaveformVisualizerProps {
  className?: string;
}

const IDLE_WAVE = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4];

export const VoiceWaveformVisualizer: React.FC<VoiceWaveformVisualizerProps> = ({ className }) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<'idle' | 'listening' | 'responding'>('idle');
  const [waveHeights, setWaveHeights] = useState<number[]>(IDLE_WAVE);

  useEffect(() => {
    if (state !== 'listening') {
      setWaveHeights(IDLE_WAVE);
      return;
    }
    if (prefersReducedMotion) {
      setWaveHeights(IDLE_WAVE);
      return;
    }
    const interval = setInterval(() => {
      setWaveHeights(prev => prev.map(() => Math.floor(8 + Math.random() * 32)));
    }, 120);
    return () => clearInterval(interval);
  }, [state, prefersReducedMotion]);

  return (
    <div className={cn('w-full max-w-[320px] p-5 border border-border bg-card shadow-lg rounded-2xl select-none flex flex-col items-center gap-4 relative overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="flex items-center gap-1.5 self-start mb-1">
        <Volume2 className="w-4 h-4 text-primary" />
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">Voice Processor</span>
      </div>

      {/* Waveform loops container */}
      <div className="h-16 flex items-center justify-center gap-1.5 w-full bg-secondary/25 rounded-xl border border-border/30 px-4">
        {waveHeights.map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: prefersReducedMotion ? 8 : (state === 'responding' ? [8, 24, 8] : h) }}
            transition={prefersReducedMotion ? { duration: 0 } : (state === 'responding' ? { repeat: Infinity, duration: 0.8, delay: i * 0.08 } : { type: 'spring', stiffness: 350, damping: 15 })}
            className={cn('w-1.5 rounded-full min-h-[4px]', state === 'listening' ? 'bg-primary' : state === 'responding' ? 'bg-indigo-400' : 'bg-muted-foreground/30')}
            style={state === 'listening' ? { boxShadow: '0 0 8px rgba(var(--primary-rgb), 0.5)' } : undefined}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 mt-2">
        {state === 'idle' && (
          <button 
            onClick={() => setState('listening')}
            className="px-5 py-2.5 bg-primary text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Mic className="w-3.5 h-3.5" />
            Start Voice
          </button>
        )}

        {state === 'listening' && (
          <button 
            onClick={() => setState('responding')}
            className="px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            Analyze Voice
          </button>
        )}

        {state === 'responding' && (
          <button 
            onClick={() => setState('idle')}
            className="px-5 py-2.5 bg-rose-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:brightness-110 active:scale-95 shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Square className="w-3 h-3" />
            Disconnect
          </button>
        )}
      </div>

      <div className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mt-1">
        {state === 'idle' && 'System Idle'}
        {state === 'listening' && 'Listening... Speak Now'}
        {state === 'responding' && 'Simulating response...'}
      </div>
    </div>
  );
};
