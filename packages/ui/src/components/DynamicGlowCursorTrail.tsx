"use client";

import React, { useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface DynamicGlowCursorTrailProps {
  className?: string;
}

export const DynamicGlowCursorTrail: React.FC<DynamicGlowCursorTrailProps> = ({
  className,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const cursor = { x: canvas.width / 2, y: canvas.height / 2 };
    const particles: Array<{ x: number; y: number; speedX: number; speedY: number; size: number; alpha: number }> = [];

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;

      if (prefersReducedMotion) return;
      // Spawn dust particle
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: cursor.x,
          y: cursor.y,
          speedX: (Math.random() - 0.5) * 1.5,
          speedY: (Math.random() - 0.5) * 1.5,
          size: Math.random() * 4 + 2,
          alpha: 1,
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, idx) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.alpha -= 0.02;

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        } else {
          ctx.beginPath();
          ctx.fillStyle = `rgba(168, 85, 247, ${p.alpha})`; // Purple glowing dust
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (!prefersReducedMotion) {
        animFrame = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animFrame) cancelAnimationFrame(animFrame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: mount-only effect; prefersReducedMotion change does not need to re-init RAF loop
  }, []);

  return (
    <div className={cn('relative w-full max-w-[280px] h-[220px] bg-secondary/5 rounded-2xl border border-border flex flex-col items-center justify-between p-4 select-none overflow-hidden touch-x', className)}>
      <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Cursor Dust Trail</span>

      <canvas 
        ref={canvasRef} 
        width="240" 
        height="120" 
        className="w-full h-[120px] rounded-xl border border-border/40 bg-card/65 shadow-inner"
      />

      <span className="text-[8px] text-muted-foreground font-extrabold uppercase tracking-wide">Move cursor above panel to trace</span>
    </div>
  );
};
