"use client";

import React, { useRef, useState } from "react";
import { Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface SpotlightFeatureCardProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

/**
 * Signature feature card — cursor-tracking spotlight that works in BOTH light and dark
 * (most spotlight cards are dark-only) via color-mix on the primary token.
 */
export function SpotlightFeatureCard({
  icon = <Zap className="h-5 w-5" />,
  title = "Lightning fast",
  description = "Ship in minutes with primitives that stay out of your way — fully typed, themeable, and accessible by default.",
  className,
}: SpotlightFeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -200, y: -200, on: false });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setPos((p) => ({ ...p, on: false }))}
      className={cn(
        "group relative w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm transition-colors",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          opacity: pos.on ? 1 : 0,
          background: `radial-gradient(220px circle at ${pos.x}px ${pos.y}px, color-mix(in oklab, var(--color-primary, #6366f1) 14%, transparent), transparent 65%)`,
        }}
      />
      <div className="relative">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/15">
          {icon}
        </div>
        <h3 className="mt-4 text-base font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
