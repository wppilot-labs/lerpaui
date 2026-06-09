"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Award } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroAgencyStudioProps {
  className?: string;
}

const TILES = [
  { tag: "Brand", color: "from-amber-400/40 to-orange-500/20" },
  { tag: "Web", color: "from-violet-400/40 to-fuchsia-500/20" },
  { tag: "Motion", color: "from-cyan-400/40 to-blue-500/20" },
  { tag: "AR", color: "from-emerald-400/40 to-teal-500/20" },
];

const AWARDS = ["Awwwards SOTD ×6", "FWA ×3", "Webby ×2", "ADC ×4"];

export function HeroAgencyStudio({ className }: HeroAgencyStudioProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 sm:py-24",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.75_0.2_30/0.18),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4">
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            Studio est. 2014
          </motion.span>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"
          >
            <Award className="h-4 w-4 text-amber-400" aria-hidden />
            42 industry awards
          </motion.span>
        </div>

        <motion.h1
          id={headingId}
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="mt-10 text-balance font-black leading-[0.95] tracking-tight text-foreground"
          style={{ fontSize: "clamp(2.5rem, 9vw, 7.5rem)" }}
        >
          We make brands{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.88 0.18 80), oklch(0.78 0.22 30), oklch(0.7 0.2 350))",
            }}
          >
            move.
          </span>
        </motion.h1>

        <div className="mt-10 grid grid-cols-1 items-end gap-10 lg:grid-cols-[1fr_1.1fr]">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="max-w-md text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            A 22-person independent studio in Lisbon. We design identity, web, and motion for
            ambitious teams who want to be remembered, not scrolled past.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {TILES.map((t, i) => (
              <motion.div
                key={t.tag}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.32 + i * 0.06 }}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-3 backdrop-blur-sm transition-transform hover:-translate-y-0.5"
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0 -z-10 bg-gradient-to-br opacity-80",
                    t.color
                  )}
                />
                <div className="flex h-full flex-col justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                    0{i + 1}
                  </span>
                  <span className="text-base font-bold text-foreground">{t.tag}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.45 }}
          className="mt-12 flex flex-col items-stretch gap-4 border-t border-border/40 pt-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {AWARDS.map((a) => (
              <span key={a} className="font-mono">
                {a}
              </span>
            ))}
          </div>
          <a
            href="#work"
            className="group inline-flex w-fit items-center gap-2 rounded-full border border-foreground bg-foreground px-5 py-3 text-sm font-bold text-background transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 motion-reduce:hover:translate-y-0"
          >
            See the work
            <ArrowUpRight
              className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              aria-hidden
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroAgencyStudio;
