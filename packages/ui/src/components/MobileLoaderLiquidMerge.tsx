"use client";

import React, { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface MobileLoaderLiquidMergeProps {
  className?: string;
  blobColor?: string;
}

export const MobileLoaderLiquidMerge: React.FC<MobileLoaderLiquidMergeProps> = ({
  className,
  blobColor = '#6366f1',
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    canvas.width = 120;
    canvas.height = 120;

    const particles = [
      { x: 60, y: 60, r: 16, angle: 0, speed: 0.05, distance: 18 },
      { x: 60, y: 60, r: 14, angle: Math.PI, speed: 0.05, distance: 18 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // We will draw standard particles with SVG blur filter mapped in parent wrapper
      ctx.fillStyle = blobColor;

      particles.forEach((p, _idx) => {
        p.angle += p.speed;
        p.x = 60 + Math.cos(p.angle) * p.distance;
        p.y = 60 + Math.sin(p.angle) * p.distance;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!prefersReducedMotion) {
        frameId = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => { if (frameId) cancelAnimationFrame(frameId); };
  }, [blobColor, prefersReducedMotion]);

  return (
    <div className={cn('relative flex items-center justify-center select-none w-28 h-28', className)}>
      {/* SVG liquid blending filters */}
      <svg className="hidden">
        <defs>
          <filter id="liquid-merge-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>
      
      <div style={{ filter: 'url(#liquid-merge-filter)' }} className="w-full h-full">
        <canvas ref={canvasRef} className="w-full h-full" />
      </div>
    </div>
  );
};
