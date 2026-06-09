"use client";

import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ScratchOffTicketRevealProps {
  className?: string;
}

export const ScratchOffTicketReveal: React.FC<ScratchOffTicketRevealProps> = ({
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    resetCanvas();
  }, []);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#9ca3af'; // Silver metallic color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Pattern grid on metallic coating
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    for (let x = 0; x < canvas.width; x += 12) {
      for (let y = 0; y < canvas.height; y += 12) {
        ctx.fillRect(x, y, 4, 4);
      }
    }
    setScratchedPercent(0);
    setRevealed(false);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) return; // Only rub on mouse click-drag/touch
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    calculatePercent();
  };

  const calculatePercent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparent = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 0) transparent++;
    }

    const percent = Math.round((transparent / (pixels.length / 4)) * 100);
    setScratchedPercent(percent);
    if (percent > 45) {
      setRevealed(true);
    }
  };

  return (
    <div className={cn('relative w-full max-w-[280px] h-[340px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-between p-4 select-none overflow-hidden', className)}>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Scratch Coupon</span>

      <div className="relative w-52 h-44 rounded-xl border border-border/80 bg-card overflow-hidden shadow-inner flex items-center justify-center">
        {/* Hidden promo item code */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <Sparkles className="w-6 h-6 text-primary animate-bounce mb-1" />
          <h3 className="text-xl font-black text-foreground uppercase tracking-widest">LAUNCH50</h3>
          <span className="text-[9px] text-emerald-500 font-extrabold uppercase mt-1">50% Discount Activated</span>
        </div>

        {/* Scratch overlay canvas */}
        {!revealed && (
          <canvas
            ref={canvasRef}
            width="208"
            height="176"
            onPointerMove={handlePointerMove}
            className="absolute top-0 left-0 w-full h-full cursor-crosshair z-10 touch-none"
          />
        )}
      </div>

      <div className="w-full flex justify-between items-center gap-2">
        <span className="text-[9px] font-black text-primary uppercase tracking-widest">Scrubbed: {scratchedPercent}%</span>
        <button
          type="button"
          onClick={resetCanvas}
          className="px-3 py-1.5 rounded-xl bg-card border border-border flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-muted-foreground hover:bg-secondary/40 active:scale-95 transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};
