"use client";

import React, { useState } from 'react';
import { cn } from '../lib/cn';
import { usePrefersReducedMotion } from '../animation/hooks';

/** Image grid where hovered card stays sharp while neighbors blur by distance. */
export interface DepthOfFieldHoverGalleryProps {
  className?: string;
  items?: { src?: string; label?: string; bg?: string }[];
  columns?: number;
  maxBlur?: number;
  falloff?: number;
  scale?: number;
}

const defaultItems: { src?: string; label?: string; bg?: string }[] = Array.from({ length: 9 }, (_, i) => ({
  label: `Frame ${i + 1}`,
  bg: `linear-gradient(135deg, hsl(${(i * 40) % 360}, 70%, 55%), hsl(${(i * 40 + 60) % 360}, 70%, 35%))`,
}));

export const DepthOfFieldHoverGallery: React.FC<DepthOfFieldHoverGalleryProps> = ({
  className,
  items = defaultItems,
  columns = 3,
  maxBlur = 18,
  falloff = 1.3,
  scale = 1.04,
}) => {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  const distance = (i: number, h: number): number => {
    const r1 = Math.floor(i / columns);
    const c1 = i % columns;
    const r2 = Math.floor(h / columns);
    const c2 = h % columns;
    return Math.hypot(r1 - r2, c1 - c2);
  };

  return (
    <div
      className={cn('grid gap-4', className)}
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      onPointerLeave={() => setHovered(null)}
    >
      {items.map((it, i) => {
        const d = hovered === null ? 0 : distance(i, hovered);
        const blur = reduced || hovered === null ? 0 : Math.min(maxBlur, d * falloff * 6);
        const opacity = hovered === null ? 1 : Math.max(0.55, 1 - d * 0.12);
        const sc = hovered === i && !reduced ? scale : 1;
        return (
          <button
            key={i}
            onPointerEnter={() => setHovered(i)}
            onFocus={() => setHovered(i)}
            className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] text-left transition-[transform,filter,opacity] duration-300 ease-out"
            style={{
              filter: `blur(${blur}px)`,
              opacity,
              transform: `scale(${sc})`,
            }}
          >
            {it.src ? (
              <img src={it.src} alt={it.label ?? ''} className="h-full w-full object-cover" loading="lazy" decoding="async" />
            ) : (
              <div className="h-full w-full" style={{ background: it.bg }} />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-3">
              <span className="text-sm font-medium text-white">{it.label}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
