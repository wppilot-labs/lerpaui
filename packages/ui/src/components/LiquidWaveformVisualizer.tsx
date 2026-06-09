"use client";

import React, { useRef, useEffect } from 'react';
import { cn } from '../lib/cn';

export interface LiquidWaveformVisualizerProps {
  className?: string;
}

export const LiquidWaveformVisualizer: React.FC<LiquidWaveformVisualizerProps> = ({
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      offset += 0.04;

      // Layer 1
      ctx.beginPath();
      ctx.fillStyle = 'rgba(147, 51, 234, 0.15)'; // Purple overlay
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.sin(x * 0.02 + offset) * 15 + canvas.height * 0.5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      // Layer 2
      ctx.beginPath();
      ctx.fillStyle = 'rgba(59, 130, 246, 0.25)'; // Blue primary
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x < canvas.width; x++) {
        const y = Math.cos(x * 0.015 - offset) * 20 + canvas.height * 0.55;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();

      animFrame = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className={cn('relative w-full max-w-[280px] h-[220px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-between p-4 select-none overflow-hidden', className)}>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Liquid Waveform</span>
      
      <canvas 
        ref={canvasRef} 
        width="240" 
        height="120" 
        className="w-full h-[120px] rounded-xl border border-border/40 bg-card/65 shadow-inner"
      />

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide">Continuous fluid wave oscillator</span>
    </div>
  );
};
