"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Apple, Download, Star, Smartphone } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroMobileAppProps {
  className?: string;
}

const ACTIVITY = [
  { t: "Morning routine", s: "Completed", v: "12 min" },
  { t: "Deep work", s: "In progress", v: "2h 14m" },
  { t: "Workout", s: "Up next", v: "5:30 PM" },
];

export function HeroMobileApp({ className }: HeroMobileAppProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-16 sm:px-12 sm:py-20",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,oklch(0.78_0.18_180/0.18),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,oklch(0.78_0.18_320/0.16),transparent_55%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm"
          >
            <Smartphone className="h-3.5 w-3.5" aria-hidden />
            iOS 18 · Android 15
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-balance text-4xl font-black leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Your day,{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.85 0.18 180), oklch(0.78 0.2 320))",
              }}
            >
              choreographed
            </span>
            .
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-5 max-w-lg text-pretty text-base leading-relaxed text-muted-foreground"
          >
            One app for habits, focus, sleep, and energy. Designed by neuroscientists, beloved by
            two million calmer humans.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#ios"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-bold text-background shadow-lg transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 motion-reduce:hover:translate-y-0"
            >
              <Apple className="h-4 w-4" aria-hidden />
              App Store
            </a>
            <a
              href="#android"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-5 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <Download className="h-4 w-4" aria-hidden />
              Google Play
            </a>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-8 flex flex-wrap items-center gap-4 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden />
              ))}
              <span className="ml-1 font-medium text-foreground">4.9</span>
            </div>
            <span className="h-3 w-px bg-border" />
            <span>2.1M downloads</span>
            <span className="h-3 w-px bg-border" />
            <span>App of the Year 2025</span>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto"
        >
          <div className="relative h-[520px] w-[260px] rounded-[44px] border-[10px] border-foreground/90 bg-background shadow-2xl shadow-black/50">
            <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-foreground/95" />
            <div className="absolute inset-0 overflow-hidden rounded-[34px] bg-gradient-to-b from-violet-500/15 via-background to-cyan-500/10">
              <div className="px-5 pt-10">
                <div className="flex items-center justify-between text-[10px] font-bold text-foreground/80">
                  <span>9:41</span>
                  <span>● ● ●</span>
                </div>
                <div className="mt-6">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Good morning, Sam
                  </div>
                  <div className="mt-1 text-2xl font-black text-foreground">Today&apos;s flow</div>
                </div>

                <motion.div
                  initial={reduced ? false : { scale: 0.92, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="mt-5 rounded-3xl border border-border/40 bg-card/70 p-4 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                    <span>Energy</span>
                    <span className="text-emerald-400">+12%</span>
                  </div>
                  <div className="mt-2 flex h-16 items-end gap-1.5">
                    {[40, 65, 50, 80, 70, 90, 75].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={reduced ? false : { scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 + i * 0.05 }}
                        style={{ height: `${h}%`, transformOrigin: "bottom" }}
                        className="flex-1 rounded-md bg-gradient-to-t from-cyan-400 to-violet-400"
                      />
                    ))}
                  </div>
                </motion.div>

                <div className="mt-4 space-y-2">
                  {ACTIVITY.map((a, i) => (
                    <motion.div
                      key={a.t}
                      initial={reduced ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.9 + i * 0.08 }}
                      className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/60 px-3 py-2.5 backdrop-blur-sm"
                    >
                      <div>
                        <div className="text-[11px] font-bold text-foreground">{a.t}</div>
                        <div className="text-[9px] text-muted-foreground">{a.s}</div>
                      </div>
                      <span className="font-mono text-[10px] text-foreground/80">{a.v}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div
            aria-hidden
            className="absolute -bottom-8 left-1/2 -z-10 h-24 w-64 -translate-x-1/2 rounded-full bg-cyan-400/30 blur-3xl"
          />
        </motion.div>
      </div>
    </section>
  );
}

export default HeroMobileApp;
