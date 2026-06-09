'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '../lib/cn';

interface PixelDissolveHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc?: string;
  pixelSize?: number;
  dissolveRadius?: number;
  particleGravity?: number;
  regrowSpeed?: number; // 0 to 1, rate at which pixels repair themselves when not hovered
  width?: number;
  height?: number;
}

interface PixelCell {
  x: number;
  y: number;
  color: string;
  size: number;
  isDissolved: boolean;
  
  // Particle dynamics
  px: number; // particle x
  py: number; // particle y
  vx: number; // velocity x
  vy: number; // velocity y
  alpha: number;
  life: number;
  maxLife: number;
}

export function PixelDissolveHover({
  imageSrc = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop&q=80',
  pixelSize = 8,
  dissolveRadius = 36,
  particleGravity = 0.08,
  regrowSpeed = 0.008,
  width = 400,
  height = 400,
  className,
  ...props
}: PixelDissolveHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cellsRef = useRef<PixelCell[]>([]);
  const animationFrameId = useRef<number | null>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });

  // Initialize pixels when image loads
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      // Set canvas size to match props or image aspect ratio
      canvas.width = width;
      canvas.height = height;

      // Draw image to read pixel data
      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0, 0, width, height).data;

      // Create cells
      const cells: PixelCell[] = [];
      for (let y = 0; y < height; y += pixelSize) {
        for (let x = 0; x < width; x += pixelSize) {
          // Read color at the center of the pixel block
          const centerX = Math.min(x + Math.floor(pixelSize / 2), width - 1);
          const centerY = Math.min(y + Math.floor(pixelSize / 2), height - 1);
          const pixelIndex = (centerY * width + centerX) * 4;

          const r = imgData[pixelIndex];
          const g = imgData[pixelIndex + 1];
          const b = imgData[pixelIndex + 2];
          const a = imgData[pixelIndex + 3] / 255;

          // Skip completely transparent pixels
          if (a < 0.1) continue;

          const color = `rgba(${r}, ${g}, ${b}, ${a})`;
          const maxLife = 40 + Math.random() * 30;

          cells.push({
            x,
            y,
            color,
            size: pixelSize,
            isDissolved: false,
            px: x,
            py: y,
            vx: 0,
            vy: 0,
            alpha: 1,
            life: maxLife,
            maxLife,
          });
        }
      }

      cellsRef.current = cells;
      setImageLoaded(true);
    };
  }, [imageSrc, pixelSize, width, height]);

  // Main canvas animation loop
  useEffect(() => {
    if (!imageLoaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cells = cellsRef.current;
      const mx = mousePos.current.x;
      const my = mousePos.current.y;

      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];

        if (!cell.isDissolved) {
          // Check distance to mouse
          if (isHovering) {
            const dx = cell.x - mx;
            const dy = cell.y - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < dissolveRadius) {
              // Trigger dissolve
              cell.isDissolved = true;
              
              // Direct drift away from pointer + some random dispersion
              const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.5;
              const force = (dissolveRadius - dist) / dissolveRadius;
              const speed = 1.5 + force * 2.5;

              cell.vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 0.8;
              cell.vy = Math.sin(angle) * speed - 1.2 - Math.random() * 1.5; // drift upward
              cell.alpha = 1;
              cell.life = cell.maxLife;
            }
          }

          // Draw normal intact pixel blocks
          ctx.fillStyle = cell.color;
          ctx.fillRect(cell.x, cell.y, cell.size, cell.size);
        } else {
          // Update dissolved particle dynamics
          cell.vy += particleGravity; // apply gravity
          cell.px += cell.vx;
          cell.py += cell.vy;
          cell.life -= 1;
          cell.alpha = Math.max(0, cell.life / cell.maxLife);

          // Draw active floating particle
          if (cell.alpha > 0) {
            ctx.fillStyle = cell.color;
            ctx.globalAlpha = cell.alpha;
            
            // Shrink squares slightly as they fade
            const drawSize = cell.size * cell.alpha;
            ctx.fillRect(cell.px, cell.py, drawSize, drawSize);
            ctx.globalAlpha = 1.0;
          } else if (!isHovering) {
            // Regrow/repair pixels slowly when user is not hovering
            if (Math.random() < regrowSpeed) {
              cell.isDissolved = false;
              cell.px = cell.x;
              cell.py = cell.y;
              cell.vx = 0;
              cell.vy = 0;
              cell.alpha = 1;
              cell.life = cell.maxLife;
            }
          }
        }
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [imageLoaded, isHovering, dissolveRadius, particleGravity, regrowSpeed, width, height]);

  // Mouse event listeners
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mousePos.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    mousePos.current = { x: -1000, y: -1000 };
    setIsHovering(false);
  };

  const resetPixels = () => {
    cellsRef.current.forEach((cell) => {
      cell.isDissolved = false;
      cell.px = cell.x;
      cell.py = cell.y;
      cell.vx = 0;
      cell.vy = 0;
      cell.alpha = 1;
      cell.life = cell.maxLife;
    });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-col items-center justify-center bg-zinc-950 p-4 border border-zinc-800 rounded-2xl group overflow-hidden max-w-full",
        className
      )}
      {...props}
    >
      <div className="relative overflow-hidden rounded-xl border border-zinc-800 shadow-2xl bg-zinc-900">
        {!imageLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center text-zinc-500 font-mono text-xs animate-pulse"
            style={{ width, height }}
          >
            PARSING PIXEL CHUNKS...
          </div>
        )}

        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="block cursor-crosshair max-w-full transition-transform duration-300 group-hover:scale-[1.01]"
          style={{ width, height }}
        />

        {/* Dynamic overlay label on hover */}
        <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-zinc-300 font-bold border border-zinc-800/80 font-mono pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          HOVER TO DISINTEGRATE
        </div>
      </div>

      <button
        type="button"
        onClick={resetPixels}
        className="mt-4 flex items-center space-x-1.5 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 active:scale-95 transition-all text-xs font-semibold font-mono"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>RECONSTRUCT IMAGE</span>
      </button>
    </div>
  );
}
