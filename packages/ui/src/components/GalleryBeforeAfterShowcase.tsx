"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/cn";

export interface BeforeAfterPair {
  id: string;
  label: string;
  beforeHue: number;
  afterHue: number;
  beforeNote?: string;
  afterNote?: string;
}

export interface GalleryBeforeAfterShowcaseProps {
  className?: string;
  title?: string;
  description?: string;
  pairs?: BeforeAfterPair[];
}

const DEFAULT_PAIRS: BeforeAfterPair[] = [
  { id: "1", label: "Landing page redesign", beforeHue: 220, afterHue: 290, beforeNote: "Before", afterNote: "After" },
  { id: "2", label: "Dashboard overhaul", beforeHue: 30, afterHue: 180, beforeNote: "v1", afterNote: "v2" },
  { id: "3", label: "Onboarding flow", beforeHue: 350, afterHue: 145 },
];

function BeforeAfter({ pair }: { pair: BeforeAfterPair }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const sliderId = React.useId();

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    setPct(next);
  }, []);

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
      if (typeof x === "number") updateFromClientX(x);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [dragging, updateFromClientX]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPct((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + 4));
    if (e.key === "Home") setPct(0);
    if (e.key === "End") setPct(100);
  };

  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
      <div ref={containerRef} className="relative aspect-[16/10] w-full overflow-hidden select-none" aria-hidden>
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, oklch(0.75 0.16 ${pair.beforeHue}), oklch(0.55 0.2 ${(pair.beforeHue + 40) % 360}))` }} />
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-y-0 left-0 w-screen" style={{ background: `linear-gradient(135deg, oklch(0.78 0.2 ${pair.afterHue}), oklch(0.58 0.22 ${(pair.afterHue + 40) % 360}))` }} />
        </div>
        <div className="absolute left-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          {pair.afterNote ?? "After"}
        </div>
        <div className="absolute right-3 top-3 rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white backdrop-blur">
          {pair.beforeNote ?? "Before"}
        </div>

        <div
          className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.2)]"
          style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
        />
        <button
          type="button"
          role="slider"
          aria-label={`${pair.label} compare slider`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          aria-controls={sliderId}
          onMouseDown={(e) => { e.preventDefault(); setDragging(true); }}
          onTouchStart={(e) => { e.preventDefault(); setDragging(true); }}
          onKeyDown={onKey}
          className={cn(
            "absolute z-20 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full border-2 border-white bg-foreground text-background shadow-lg transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
            dragging ? "scale-110" : "hover:scale-105",
          )}
          style={{ left: `${pct}%`, top: "50%" }}
        >
          <GripVertical className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <figcaption id={sliderId} className="px-4 py-3 text-sm font-semibold text-foreground">
        {pair.label}
      </figcaption>
    </figure>
  );
}

export function GalleryBeforeAfterShowcase({
  className,
  title = "Side-by-side comparisons",
  description = "Drag the handle on any frame to compare versions.",
  pairs = DEFAULT_PAIRS,
}: GalleryBeforeAfterShowcaseProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full bg-background px-6 py-16 md:py-24", className)}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h2 id={headingId} className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-base text-muted-foreground">{description}</p>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {pairs.map((p) => (<BeforeAfter key={p.id} pair={p} />))}
        </motion.div>
      </div>
    </section>
  );
}

export default GalleryBeforeAfterShowcase;
