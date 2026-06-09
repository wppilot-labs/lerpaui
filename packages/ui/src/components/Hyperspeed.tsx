"use client";

/**
 * Adapted from React Bits — MIT © David Haz
 * https://github.com/DavidHDev/react-bits
 * Licensed under the MIT License.
 * See ATTRIBUTION.md. Modifications (c) Lerpa UI, MIT.
 */

import React, { useRef, useEffect } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

interface HyperspeedProps {
  className?: string;
  id?: string;
  colors?: string[];
  speed?: number;
  density?: number;
  interactive?: boolean;
}

export const Hyperspeed: React.FC<HyperspeedProps> = ({
  className,
  id = 'hyperspeed-canvas',
  colors = ['#38BDF8', '#818CF8', '#A78BFA', '#F472B6'],
  speed = 4,
  density = 60,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lines: Array<{
      x: number;
      y: number;
      z: number;
      color: string;
      lineWidth: number;
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

    // Initialize lines
    const initLines = () => {
      lines = [];
      const count = Math.min(200, Math.floor(density * 1.5));
      for (let i = 0; i < count; i++) {
        // Distribute coordinates in a cylinder around the Z-axis
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 200 + 40; // minimum radius to avoid lines in the center
        lines.push({
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          z: Math.random() * 1000,
          color: colors[Math.floor(Math.random() * colors.length)],
          lineWidth: Math.random() * 1.5 + 0.5,
        });
      }
    };

    initLines();

    // Mouse interactive handlers
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      const relativeX = e.clientX - rect.left - rect.width / 2;
      const relativeY = e.clientY - rect.top - rect.height / 2;
      
      // Target offset scaling
      mouseRef.current.targetX = (relativeX / (rect.width / 2)) * 60;
      mouseRef.current.targetY = (relativeY / (rect.height / 2)) * 60;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const draw = () => {
      if (!ctx || !canvas) return;

      // Deep dark space trails accumulation background
      ctx.fillStyle = 'rgba(10, 10, 12, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Smooth mouse tracking interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const centerX = canvas.width / 2 + mouse.x;
      const centerY = canvas.height / 2 + mouse.y;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Move lines closer on Z axis (simulating fast camera zoom forward)
        line.z -= speed * 1.8;

        // Reset if line has passed the screen viewport bounds
        if (line.z <= 0) {
          line.z = 1000;
          const angle = Math.random() * Math.PI * 2;
          const radius = Math.random() * 200 + 40;
          line.x = Math.cos(angle) * radius;
          line.y = Math.sin(angle) * radius;
          line.color = colors[Math.floor(Math.random() * colors.length)];
        }

        // Project coordinate 3D details to 2D screen coordinate values
        // Depth division: closer lines stretch and scale outwards
        const scale = 300 / line.z;
        const px = line.x * scale + centerX;
        const py = line.y * scale + centerY;

        // Draw line trail by linking back to its previous historical coordinate location
        const prevScale = 300 / (line.z + speed * 1.8 + 15);
        const pprevX = line.x * prevScale + centerX;
        const pprevY = line.y * prevScale + centerY;

        // Skip lines that map completely outside the canvas bounds
        if (
          px < 0 || px > canvas.width || py < 0 || py > canvas.height ||
          pprevX < 0 || pprevX > canvas.width || pprevY < 0 || pprevY > canvas.height
        ) {
          continue;
        }

        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.lineWidth * scale * 0.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(pprevX, pprevY);
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [colors, speed, density, interactive, prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn('absolute inset-0 h-full w-full bg-[#0A0A0C]', className)}
    />
  );
};
