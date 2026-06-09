'use client';

import React, { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '../lib/cn';

export interface OrganicFluidBlobsMaskProps {
  className?: string;
}

export const OrganicFluidBlobsMask: React.FC<OrganicFluidBlobsMaskProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let ticks = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ticks += 0.02;

      // Draw two dynamic circular liquid blobs
      const x1 = canvas.width / 2 + Math.sin(ticks) * 25;
      const y1 = canvas.height / 2 + Math.cos(ticks * 0.7) * 15;
      const r1 = 45 + Math.sin(ticks * 1.5) * 5;

      const x2 = canvas.width / 2 + Math.cos(ticks * 1.2) * -25;
      const y2 = canvas.height / 2 + Math.sin(ticks * 0.9) * -15;
      const r2 = 38 + Math.cos(ticks * 1.8) * 4;

      ctx.fillStyle = "rgba(168, 85, 247, 0.85)";
      ctx.beginPath();
      ctx.arc(x1, y1, r1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(59, 130, 246, 0.85)";
      ctx.beginPath();
      ctx.arc(x2, y2, r2, 0, Math.PI * 2);
      ctx.fill();

      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Organic Fluid Canvas Blobs</span>

      <div className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card shadow-inner my-auto flex flex-col justify-between p-4 z-0">
        <canvas ref={canvasRef} width="240" height="150" className="absolute inset-0 w-full h-full pointer-events-none z-10 blur-xl opacity-90 scale-102" />

        <div className="flex justify-between items-start z-20">
          <span className="text-[8px] font-mono tracking-widest bg-secondary/80 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">Liquid Mesh</span>
          <Sparkles className="w-4 h-4 text-purple-200" />
        </div>

        <div className="z-20 text-white">
          <h4 className="text-xs font-black tracking-wide text-foreground">Organic Fluid Blobs</h4>
          <p className="text-[9px] text-muted-foreground leading-relaxed mt-1">Dynamic canvas liquid loops undulating infinitely behind glass overlays.</p>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Canvas-rendered liquid background mesh</span>
    </div>
  );
};
