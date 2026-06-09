"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React, { useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

interface SparklesProps {
  className?: string;
  id?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  particleColor?: string;
  speed?: number;
}

export const Sparkles: React.FC<SparklesProps> = ({
  className,
  id = 'sparkles-canvas',
  background = 'transparent',
  minSize = 0.5,
  maxSize = 1.5,
  particleDensity = 80,
  particleColor = '#FFFFFF',
  speed = 1,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      opacitySpeed: number;
    }> = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Adjust coordinate resolution to match layout size
        canvas.width = parent.getBoundingClientRect().width || parent.clientWidth;
        canvas.height = parent.getBoundingClientRect().height || parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Proportional densities
    const totalArea = canvas.width * canvas.height;
    const densityCoefficient = 8000;
    const count = Math.min(250, Math.floor((totalArea / densityCoefficient) * (particleDensity / 50)));

    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (maxSize - minSize) + minSize,
        speedY: (Math.random() * 0.3 + 0.1) * speed,
        opacity: Math.random(),
        opacitySpeed: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      });
    }

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = particleColor;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.opacity += p.opacitySpeed;

        // Bounce opacity coordinates between 0 and 1
        if (p.opacity > 1) {
          p.opacity = 1;
          p.opacitySpeed = -p.opacitySpeed;
        } else if (p.opacity < 0) {
          p.opacity = 0;
          p.opacitySpeed = -p.opacitySpeed;
        }

        // Loop floating particles from top back to the bottom track
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }

        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [minSize, maxSize, particleDensity, particleColor, speed, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      style={{ background }}
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    />
  );
};
