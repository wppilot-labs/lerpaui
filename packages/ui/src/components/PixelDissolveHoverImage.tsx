"use client";

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

export interface PixelDissolveHoverImageProps extends React.HTMLAttributes<HTMLDivElement> {
  imageSrc: string;
  imageAlt?: string;
  gridColumns?: number; // Number of columns in the pixel grid
  gridRows?: number; // Number of rows in the pixel grid
  revealRadius?: number; // Radius of cells to dissolve (in cell distance terms, e.g. 2 or 3)
  maskColorClass?: string; // Background color class of the mask cells
}

export const PixelDissolveHoverImage: React.FC<PixelDissolveHoverImageProps> = ({
  imageSrc,
  imageAlt = 'Premium image',
  gridColumns = 12,
  gridRows = 12,
  revealRadius = 2.5,
  maskColorClass = 'bg-background',
  className,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCell, setHoveredCell] = useState<{ c: number; r: number } | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create grid cells coordinates
  const cells = React.useMemo(() => {
    const temp = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridColumns; c++) {
        temp.push({ r, c, id: `${r}-${c}` });
      }
    }
    return temp;
  }, [gridColumns, gridRows]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate which grid cell the mouse is currently over
    const c = Math.floor((x / rect.width) * gridColumns);
    const r = Math.floor((y / rect.height) * gridRows);

    // Keep within bounds
    const colIdx = Math.max(0, Math.min(c, gridColumns - 1));
    const rowIdx = Math.max(0, Math.min(r, gridRows - 1));

    setHoveredCell({ c: colIdx, r: rowIdx });
  };

  const handleMouseLeave = () => {
    setHoveredCell(null);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border bg-muted cursor-crosshair transform-gpu select-none shadow-xl',
        className
      )}
      style={{
        aspectRatio: '16/10',
      }}
      {...props}
    >
      {/* High-quality underlying image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="h-full w-full object-cover pointer-events-none"
        draggable={false}
      />

      {/* Grid of dissolvable mask blocks overlay */}
      {!prefersReducedMotion && (
        <div
          className="absolute inset-0 grid pointer-events-none"
          style={{
            gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridRows}, minmax(0, 1fr))`,
          }}
        >
          {cells.map((cell) => {
            let isDissolved = false;

            if (hoveredCell) {
              // Calculate Manhattan/Euclidean distance from the hovered cell
              const dx = cell.c - hoveredCell.c;
              const dy = cell.r - hoveredCell.r;
              const distance = Math.hypot(dx, dy);

              if (distance <= revealRadius) {
                isDissolved = true;
              }
            }

            return (
              <div
                key={cell.id}
                className={cn('w-full h-full transition-all transform-gpu', maskColorClass)}
                style={{
                  opacity: isDissolved ? 0 : 1,
                  transform: isDissolved ? 'scale(0.8) rotate(5deg)' : 'scale(1.02) rotate(0deg)',
                  // Digital random dissolve scattering feel using transitions
                  transitionDuration: !mounted
                    ? '300ms'
                    : isDissolved
                      ? `${250 + Math.random() * 200}ms`
                      : `${300 + Math.random() * 200}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                  // Add a light subtle grid cell outline so it looks like a retro pixel board
                  boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.02)',
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
