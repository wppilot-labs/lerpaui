"use client";

import React, { useRef, useState } from "react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

export interface MagneticButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** px the button drifts toward the cursor at the edge */
  strength?: number;
  children?: React.ReactNode;
}

/**
 * Signature CTA — magnetic cursor pull + sheen sweep. Real <button>, keyboard-safe,
 * magnet disabled under prefers-reduced-motion. Theme-aware (primary tokens).
 */
export function MagneticButton({ strength = 10, className, children = "Get started", ...props }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();
  const [t, setT] = useState({ x: 0, y: 0 });

  const onMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
    const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
    setT({ x: dx * strength, y: dy * strength });
  };

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setT({ x: 0, y: 0 })}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-[transform,box-shadow] duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]",
        className,
      )}
      style={{ transform: `translate(${t.x}px, ${t.y}px)` }}
      {...props}
    >
      {!reduced && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}
