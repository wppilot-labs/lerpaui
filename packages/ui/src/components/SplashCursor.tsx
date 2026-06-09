"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React, { useEffect, useRef } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
}

interface SplashCursorProps {
  className?: string;
  particleSize?: number;
  particleCount?: number;
  glow?: boolean;
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#38bdf8', // Neon Sky Blue
  '#f43f5e', // Neon Rose Pink
  '#ec4899', // Neon Fuchsia
  '#a855f7', // Neon Purple
  '#10b981', // Neon Emerald Green
  '#f59e0b', // Neon Amber
];

export const SplashCursor: React.FC<SplashCursorProps> = ({
  className,
  particleSize = 6,
  particleCount = 4,
  glow = true,
  colors = DEFAULT_COLORS,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; px: number; py: number }>({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
  });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const createParticle = (x: number, y: number, vx: number, vy: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * particleSize + 2;
      const decay = Math.random() * 0.02 + 0.015;

      particlesRef.current.push({
        x,
        y,
        vx: vx * 0.4 + (Math.random() - 0.5) * 2,
        vy: vy * 0.4 + (Math.random() - 0.5) * 2,
        color,
        size,
        alpha: 1,
        decay,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mouse = mouseRef.current;
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      const dx = mouse.x - mouse.px;
      const dy = mouse.y - mouse.py;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 2) {
        // Spawn multiple particles for higher speeds to simulate splashing
        const spawnCount = Math.min(particleCount, Math.floor(speed / 2));
        for (let i = 0; i < spawnCount; i++) {
          createParticle(mouse.x, mouse.y, dx, dy);
        }
      }

      mouse.px = mouse.x;
      mouse.py = mouse.y;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const updateAndDraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96; // Fluid friction
        p.vy *= 0.96;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        // Render particle
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (glow) {
          ctx.shadowBlur = p.size * 2;
          ctx.shadowColor = p.color;
        }

        ctx.fillStyle = p.color;
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, particleSize, particleCount, glow, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'fixed inset-0 pointer-events-none z-50 w-full h-full mix-blend-screen',
        className
      )}
    />
  );
};
