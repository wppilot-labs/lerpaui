"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/cn';

export interface AIProcessingMeshBackgroundProps {
  querying?: boolean;
  className?: string;
}

export const AIProcessingMeshBackground: React.FC<AIProcessingMeshBackgroundProps> = ({
  querying = false,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const cols = 20;
    const rows = 12;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Speed changes depending on querying state
      time += querying ? 0.04 : 0.015;

      ctx.strokeStyle = 'rgba(120, 119, 198, 0.08)';
      ctx.lineWidth = 1;

      // Draw grid mesh
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const x = (c / (cols - 1)) * width;
          const baseY = (r / (rows - 1)) * height;
          
          // Wave offsets
          const wave = Math.sin(c * 0.4 + time) * Math.cos(r * 0.3 + time) * (querying ? 25 : 10);
          const y = baseY + wave;

          if (r === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const baseX = (c / (cols - 1)) * width;
          const y = (r / (rows - 1)) * height + Math.sin(c * 0.4 + time) * Math.cos(r * 0.3 + time) * (querying ? 25 : 10);

          if (c === 0) ctx.moveTo(baseX, y);
          else ctx.lineTo(baseX, y);
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [querying]);

  return (
    <canvas 
      ref={canvasRef} 
      className={cn('absolute inset-0 w-full h-full pointer-events-none -z-10 bg-zinc-950', className)} 
    />
  );
};
