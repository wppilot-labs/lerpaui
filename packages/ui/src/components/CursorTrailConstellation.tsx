"use client";

import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

function withAlpha(color: string, alpha: number): string {
  if (color.startsWith('rgba') || color.startsWith('rgb')) {
    return color.replace(/[\d.]+\)$/, `${alpha.toFixed(3)})`);
  }
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.length === 3 ? hex[0]! + hex[0]! : hex.slice(0, 2), 16);
    const g = parseInt(hex.length === 3 ? hex[1]! + hex[1]! : hex.slice(2, 4), 16);
    const b = parseInt(hex.length === 3 ? hex[2]! + hex[2]! : hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
  }
  return color; // fallback for named/hsl
}

/** Canvas-rendered cursor trail of glowing dots that connect into a constellation. */
export interface CursorTrailConstellationProps {
  className?: string;
  children?: React.ReactNode;
  dotColor?: string;
  lineColor?: string;
  maxDots?: number;
  linkDistance?: number;
  fadeMs?: number;
  dotSize?: number;
}

export const CursorTrailConstellation: React.FC<CursorTrailConstellationProps> = ({
  className,
  children,
  dotColor = 'rgba(168, 85, 247, 1)',
  lineColor = 'rgba(168, 85, 247, 0.5)',
  maxDots = 40,
  linkDistance = 110,
  fadeMs = 900,
  dotSize = 3,
}) => {
  const reduced = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (reduced) return;

    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const resize = () => {
      const r = wrap.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      canvas.style.width = `${r.width}px`;
      canvas.style.height = `${r.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const dots: { x: number; y: number; t: number; size: number }[] = [];

    // Track pointer velocity to scale spawn radius.
    let lastX = 0;
    let lastY = 0;
    let lastT = 0;
    let primed = false;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const now = performance.now();
      let velocity = 0;
      if (primed) {
        const dt = Math.max(1, now - lastT);
        velocity = Math.hypot(px - lastX, py - lastY) / dt * 1000; // px/sec
      }
      lastX = px;
      lastY = py;
      lastT = now;
      primed = true;
      // Faster cursor -> larger dots; clamp boost to 2.5x base size.
      const sizeBoost = Math.min(1.5, velocity / 1200);
      dots.push({ x: px, y: py, t: now, size: dotSize * (1 + sizeBoost) });
      if (dots.length > maxDots) dots.shift();
    };
    wrap.addEventListener('pointermove', onMove);

    let raf = 0;
    const draw = () => {
      const now = performance.now();
      const r = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, r.width, r.height);
      // remove stale
      while (dots.length && now - dots[0]!.t > fadeMs) dots.shift();

      // lines
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const a = dots[i]!;
          const b = dots[j]!;
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < linkDistance) {
            const ageA = 1 - (now - a.t) / fadeMs;
            const ageB = 1 - (now - b.t) / fadeMs;
            const alpha = Math.max(0, Math.min(ageA, ageB)) * (1 - d / linkDistance);
            ctx.strokeStyle = withAlpha(lineColor, alpha);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      // dots
      for (const d of dots) {
        const age = 1 - (now - d.t) / fadeMs;
        if (age <= 0) continue;
        ctx.fillStyle = withAlpha(dotColor, age);
        ctx.shadowColor = dotColor;
        ctx.shadowBlur = 12 * age;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
    };
  }, [reduced, maxDots, linkDistance, fadeMs, dotColor, lineColor, dotSize]);

  return (
    <div ref={wrapRef} className={cn('relative', className)}>
      {children}
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden />
    </div>
  );
};
