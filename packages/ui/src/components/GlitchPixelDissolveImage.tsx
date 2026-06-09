'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';
import { cn } from '../lib/cn';

export interface GlitchPixelDissolveImageProps {
  className?: string;
}

export const GlitchPixelDissolveImage: React.FC<GlitchPixelDissolveImageProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let progress = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const rows = 15;
      const cols = 15;
      const w = canvas.width / cols;
      const h = canvas.height / rows;

      if (isHovered) {
        if (progress < 1) progress += 0.05;
      } else {
        if (progress > 0) progress -= 0.05;
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const rVal = Math.random();
          // pixel dissolve cutoff
          if (rVal > progress) {
            ctx.fillStyle = `rgba(168, 85, 247, ${0.85 - progress * 0.55})`;
            ctx.fillRect(c * w, r * h, w - 1, h - 1);
          } else {
            ctx.fillStyle = `rgba(59, 130, 246, ${progress * 0.65})`;
            ctx.fillRect(c * w + 1, r * h + 1, w - 2, h - 2);
          }
        }
      }

      animFrame = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrame);
  }, [isHovered]);

  return (
    <div className={cn('relative w-full max-w-[320px] h-[340px] bg-secondary/5 rounded-3xl border border-border flex flex-col justify-between p-5 overflow-hidden select-none', className)}>
      <span className="text-[9px] text-muted-foreground font-black tracking-widest uppercase">Glitch Pixel Dissolve Mask</span>

      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-full h-[180px] border border-border rounded-2xl overflow-hidden bg-card cursor-crosshair shadow-inner my-auto flex flex-col justify-between p-4 z-0"
      >
        <canvas ref={canvasRef} width="240" height="150" className="absolute inset-0 w-full h-full pointer-events-none z-10" />

        <div className="flex justify-between items-start z-20">
          <span className="text-[8px] font-mono tracking-widest bg-secondary/80 px-2 py-0.5 rounded-full text-foreground/80 uppercase font-black">Pixel Canvas</span>
          <Cpu className="w-4 h-4 text-purple-200" />
        </div>

        <div className="z-20 text-white">
          <h4 className="text-xs font-black tracking-wide text-foreground">Canvas Matrix Dissolve</h4>
          <p className="text-[9px] text-muted-foreground leading-relaxed mt-1">Hovering over the canvas dissolves grid cells into a neon blue/purple matrix dynamically.</p>
        </div>
      </div>

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide text-center">Hover pointer over grid to dissolve</span>
    </div>
  );
};
