"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureComparisonSliderProps {
  className?: string;
}

/** Before/after comparison slider visualizing two states with a draggable handle. */
export function FeatureComparisonSlider({ className }: FeatureComparisonSliderProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const [pos, setPos] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dragging = React.useRef(false);

  const setFromClientX = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, x)));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + 4));
    if (e.key === "Home") setPos(0);
    if (e.key === "End") setPos(100);
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 md:py-24",
        className,
      )}
    >
      <div className="mx-auto max-w-4xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id={headingId}
            className="text-3xl font-semibold tracking-tight text-balance text-foreground sm:text-4xl md:text-5xl"
          >
            See the difference, instantly.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Drag to compare the before and after — same content, two very different experiences.
          </p>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="relative mt-12 aspect-[16/9] w-full select-none overflow-hidden rounded-2xl border bg-card shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-800 to-zinc-900" aria-hidden>
            <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
              Before
            </span>
            <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
            aria-hidden
          >
            <span className="absolute right-4 top-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
              After
            </span>
          </div>
          <div
            className="absolute inset-y-0 -ml-px w-0.5 bg-white/80"
            style={{ left: `${pos}%` }}
            aria-hidden
          />
          <button
            type="button"
            role="slider"
            aria-label="Comparison slider position"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(pos)}
            onKeyDown={onKey}
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-background text-foreground shadow-lg ring-2 ring-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-[var(--ring)]"
            style={{ left: `${pos}%` }}
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden />
          </button>
        </motion.div>

        <p className="mt-3 text-center text-xs text-muted-foreground">
          Drag the handle, or use ← → keys to compare.
        </p>
      </div>
    </section>
  );
}

export default FeatureComparisonSlider;
