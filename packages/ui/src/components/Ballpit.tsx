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

interface BallpitProps {
  className?: string;
  id?: string;
  colors?: string[];
  gravity?: number;
  restitution?: number;
  density?: number;
  mouseRepulsionRadius?: number;
  mouseRepulsionForce?: number;
}

export const Ballpit: React.FC<BallpitProps> = ({
  className,
  id = 'ballpit-canvas',
  colors = ['#38BDF8', '#818CF8', '#A78BFA', '#F472B6', '#34D399', '#FB7185'],
  gravity = 0.15,
  restitution = 0.85,
  density = 25,
  mouseRepulsionRadius = 120,
  mouseRepulsionForce = 0.8,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let balls: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      mass: number;
      color: string;
    }> = [];

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.getBoundingClientRect().width || parent.clientWidth;
        canvas.height = parent.getBoundingClientRect().height || parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize balls
    const initBalls = () => {
      balls = [];
      const count = Math.min(100, Math.floor(density * 1.5));
      for (let i = 0; i < count; i++) {
        const radius = Math.random() * 14 + 8; // ball sizes between 8px and 22px
        balls.push({
          x: Math.random() * (canvas.width - radius * 2) + radius,
          y: Math.random() * (canvas.height - radius * 2) + radius,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius,
          mass: radius, // proportional mass to radius
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    initBalls();

    // Mouse listener coordinates
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      if (!ctx || !canvas) return;

      // Clean transparent clearing with subtle trail blending
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;

      // 1. Resolve ball physics and movement
      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];

        // Apply gravity vector
        ball.vy += gravity;

        // Mouse coordinates repulsion mechanics
        if (mouse.active) {
          const dx = ball.x - mouse.x;
          const dy = ball.y - mouse.y;
          const dist = Math.hypot(dx, dy);

          if (dist < mouseRepulsionRadius && dist > 0) {
            const force = (mouseRepulsionRadius - dist) / mouseRepulsionRadius;
            const pushX = (dx / dist) * force * mouseRepulsionForce * 3;
            const pushY = (dy / dist) * force * mouseRepulsionForce * 3;
            ball.vx += pushX;
            ball.vy += pushY;
          }
        }

        // Apply velocities
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Friction dampeners
        ball.vx *= 0.99;
        ball.vy *= 0.99;

        // 2. Resolve wall collisions
        // Right bound
        if (ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx = -ball.vx * restitution;
        }
        // Left bound
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx = -ball.vx * restitution;
        }
        // Bottom bound
        if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy = -ball.vy * restitution;
          // Apply surface rolling friction
          ball.vx *= 0.96;
        }
        // Top bound
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy = -ball.vy * restitution;
        }
      }

      // 3. Resolve inter-ball kinetic collisions
      for (let i = 0; i < balls.length; i++) {
        for (let j = i + 1; j < balls.length; j++) {
          const b1 = balls[i];
          const b2 = balls[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.hypot(dx, dy);
          const minDist = b1.radius + b2.radius;

          if (dist < minDist) {
            // Overlap correction to prevent clipping/sticking issues
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            // Separate balls equally along normal vector coordinates
            b1.x -= nx * overlap * 0.5;
            b1.y -= ny * overlap * 0.5;
            b2.x += nx * overlap * 0.5;
            b2.y += ny * overlap * 0.5;

            // Calculate standard elastic collision response velocities
            const kx = b1.vx - b2.vx;
            const ky = b1.vy - b2.vy;
            const p = 2 * (nx * kx + ny * ky) / (b1.mass + b2.mass);

            b1.vx -= p * b2.mass * nx * restitution;
            b1.vy -= p * b2.mass * ny * restitution;
            b2.vx += p * b1.mass * nx * restitution;
            b2.vy += p * b1.mass * ny * restitution;
          }
        }
      }

      // 4. Render all balls on canvas
      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

        // Gradient filled translucent bubble design
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius * 0.3,
          ball.y - ball.radius * 0.3,
          ball.radius * 0.1,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.3, ball.color + 'CC');
        gradient.addColorStop(1, ball.color + '44');

        ctx.fillStyle = gradient;
        ctx.shadowColor = ball.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.restore();
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [colors, gravity, restitution, density, mouseRepulsionRadius, mouseRepulsionForce, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn('absolute inset-0 h-full w-full bg-transparent', className)}
    />
  );
};
