"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Github, Sparkles, Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroAnimatedGridGlowProps {
  className?: string;
}

const GRID_COLS = 14;
const GRID_ROWS = 9;

interface PulseCell {
  col: number;
  row: number;
  delay: number;
  duration: number;
}

function buildPulses(count: number): PulseCell[] {
  const pulses: PulseCell[] = [];
  for (let i = 0; i < count; i += 1) {
    const x = Math.sin(i * 12.9898) * 43758.5453;
    const y = Math.sin(i * 78.233) * 43758.5453;
    const d = Math.sin(i * 4.123) * 43758.5453;
    pulses.push({
      col: Math.floor((x - Math.floor(x)) * GRID_COLS),
      row: Math.floor((y - Math.floor(y)) * GRID_ROWS),
      delay: (d - Math.floor(d)) * 6,
      duration: 3 + ((i * 37) % 4),
    });
  }
  return pulses;
}

const PULSES = buildPulses(12);

export function HeroAnimatedGridGlow({ className }: HeroAnimatedGridGlowProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();
  const rid = React.useId();
  const patternId = `grid-glow-${rid.replace(/[:]/g, "")}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-20 sm:px-12 sm:py-28",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 h-full w-full text-foreground/[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id={patternId} x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>

        <div className="absolute left-1/2 top-[-15%] h-[60%] w-[70%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.7_0.22_290/0.35),transparent_70%)] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[55%] w-[55%] rounded-full bg-[radial-gradient(closest-side,oklch(0.78_0.18_200/0.3),transparent_70%)] blur-3xl" />

        {!reduced && (
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
            }}
          >
            {PULSES.map((p, idx) => (
              <motion.span
                key={idx}
                className="rounded-md bg-primary/30 blur-[2px]"
                style={{
                  gridColumnStart: p.col + 1,
                  gridRowStart: p.row + 1,
                }}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: [0, 0.6, 0], scale: [0.4, 1, 0.4] }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
            Build velocity, unlocked
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Engineering teams ship 4x faster with Lerpa UI.
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Open-source React primitives, motion-aware components, and a copy-paste registry built
            for teams who treat the interface as the product.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <a
              href="#start"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Start building
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </a>
            <a
              href="#github"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <Github className="h-4 w-4" aria-hidden />
              View on GitHub
            </a>
          </motion.div>

          <motion.dl
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 grid grid-cols-3 gap-6 border-t border-border pt-6"
          >
            {[
              { v: "1235+", k: "Components" },
              { v: "A11y", k: "First-class" },
              { v: "MIT", k: "Licensed" },
            ].map((s) => (
              <div key={s.k} className="text-center lg:text-left">
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">{s.k}</dt>
                <dd className="mt-1 text-xl font-bold text-foreground">{s.v}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          <div className="relative aspect-[5/6] overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-400/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 truncate text-xs text-muted-foreground">lerpaui.com/preview</span>
            </div>
            <div className="space-y-3 p-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.07 }}
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary">
                    <Zap className="h-4 w-4" aria-hidden />
                  </span>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-2 w-3/4 rounded bg-foreground/15" />
                    <div className="h-2 w-1/2 rounded bg-foreground/10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroAnimatedGridGlow;
