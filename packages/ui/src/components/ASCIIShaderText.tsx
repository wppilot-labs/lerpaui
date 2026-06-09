"use client";

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Text rendered into a density-mapped ASCII character shader effect on canvas. */
export interface ASCIIShaderTextProps {
  text?: string;
  className?: string;
  fontSize?: number;
  cellSize?: number;
  chars?: string;
  color?: string;
  animateOnHover?: boolean;
}

export const ASCIIShaderText: React.FC<ASCIIShaderTextProps> = ({
  text = 'LAUNCH',
  className,
  fontSize = 120,
  cellSize = 8,
  chars = ' .:-=+*#%@',
  color = 'var(--foreground)',
  animateOnHover = true,
}) => {
  const reduced = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const parent = canvas.parentElement;
    const w = (parent?.clientWidth ?? 600);
    const h = (parent?.clientHeight ?? 200);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    // Offscreen text rendering for sampling
    const off = document.createElement('canvas');
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d');
    if (!octx) return;
    octx.fillStyle = '#000';
    octx.fillRect(0, 0, w, h);
    octx.fillStyle = '#fff';
    octx.font = `900 ${fontSize}px Inter, system-ui, sans-serif`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';
    octx.fillText(text, w / 2, h / 2);
    const data = octx.getImageData(0, 0, w, h).data;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.font = `${cellSize}px ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      ctx.fillStyle = color;
      for (let y = 0; y < h; y += cellSize) {
        for (let x = 0; x < w; x += cellSize) {
          const idx = (Math.floor(y) * w + Math.floor(x)) * 4;
          const lum = (data[idx] ?? 0) / 255;
          if (lum < 0.05) continue;
          const wobble = hovered && !reduced ? Math.sin((x + y + t) * 0.04) * 0.18 : 0;
          const li = Math.min(chars.length - 1, Math.floor((lum + wobble) * (chars.length - 1)));
          const ch = chars[li] ?? '.';
          ctx.globalAlpha = lum;
          ctx.fillText(ch, x, y);
        }
      }
      if (hovered && !reduced) {
        t += 1.5;
        raf = requestAnimationFrame(draw);
      }
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [text, fontSize, cellSize, chars, color, hovered, reduced]);

  return (
    <div
      onPointerEnter={() => animateOnHover && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={cn('relative h-[200px] w-full', className)}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};
