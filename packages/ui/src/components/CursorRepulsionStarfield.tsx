"use client";

import React, { useRef, useEffect } from 'react';
import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface CursorRepulsionStarfieldProps extends React.HTMLAttributes<HTMLCanvasElement> {
  starCount?: number;
  starColor?: string;
  repulsionRadius?: number;
  repulsionStrength?: number;
  connectionDistance?: number;
  glow?: boolean;
}

interface Star {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  angle: number;
}

export const CursorRepulsionStarfield: React.FC<CursorRepulsionStarfieldProps> = ({
  starCount = 180,
  starColor = 'rgb(99, 102, 241)', // Primary violet/indigo
  repulsionRadius = 120,
  repulsionStrength = 8,
  connectionDistance = 75,
  glow = true,
  className,
  ...props
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];

    // Resize container
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      initStars();
    };

    // Initialize stars
    const initStars = () => {
      stars = [];
      const w = canvas.width;
      const h = canvas.height;

      for (let i = 0; i < starCount; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: 0,
          vy: 0,
          radius: Math.random() * 2 + 0.8,
          speed: Math.random() * 0.4 + 0.1,
          angle: Math.random() * Math.PI * 2,
        });
      }
    };

    // Mouse events
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    // Listen to resize and mouse events
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    // Dynamic render Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const w = canvas.width;
      const h = canvas.height;

      // Update positions and draw
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Idle drift
        star.angle += 0.003;
        const driftX = Math.cos(star.angle) * star.speed;
        const driftY = Math.sin(star.angle) * star.speed;

        // Apply constant recovery force to base position
        const dxBase = star.baseX - star.x;
        const dyBase = star.baseY - star.y;
        
        // Elastic spring snap
        const springForce = 0.025;
        star.vx += dxBase * springForce;
        star.vy += dyBase * springForce;

        // Repulsion logic when mouse is near
        if (mx !== null && my !== null) {
          const dxMouse = star.x - mx;
          const dyMouse = star.y - my;
          const distance = Math.hypot(dxMouse, dyMouse);

          if (distance < repulsionRadius) {
            // Strong inverse proportional repulsion
            const force = (repulsionRadius - distance) / repulsionRadius;
            const repulsionForce = force * repulsionStrength;
            
            // Normalize direction vector
            const angle = Math.atan2(dyMouse, dxMouse);
            star.vx += Math.cos(angle) * repulsionForce;
            star.vy += Math.sin(angle) * repulsionForce;
          }
        }

        // Apply friction
        const friction = 0.88;
        star.vx *= friction;
        star.vy *= friction;

        // Move particle
        star.x += star.vx + driftX;
        star.y += star.vy + driftY;

        // Wrap boundaries
        if (star.x < 0) star.x = w;
        if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h;
        if (star.y > h) star.y = 0;

        // Draw star dot
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = starColor;
        if (glow) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = starColor;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Constellation lines to neighboring stars
        for (let j = i + 1; j < stars.length; j++) {
          const otherStar = stars[j];
          const dist = Math.hypot(star.x - otherStar.x, star.y - otherStar.y);

          if (dist < connectionDistance) {
            const alpha = (connectionDistance - dist) / connectionDistance * 0.12;
            ctx.beginPath();
            ctx.moveTo(star.x, star.y);
            ctx.lineTo(otherStar.x, otherStar.y);
            ctx.strokeStyle = starColor;
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.6;
            ctx.stroke();
            ctx.globalAlpha = 1.0; // reset
          }
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [starCount, starColor, repulsionRadius, repulsionStrength, connectionDistance, glow, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 -z-10 pointer-events-none block', className)}
      {...props}
    />
  );
};
