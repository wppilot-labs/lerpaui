"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Brain, Cpu, Sparkles, Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface HeroAiStartupProps {
  className?: string;
}

const ORBIT_NODES = [
  { angle: 0, icon: Brain, label: "Reasoning" },
  { angle: 60, icon: Cpu, label: "Compute" },
  { angle: 120, icon: Zap, label: "Inference" },
  { angle: 180, icon: Sparkles, label: "Memory" },
  { angle: 240, icon: Brain, label: "Vision" },
  { angle: 300, icon: Cpu, label: "Tools" },
];

export function HeroAiStartup({ className }: HeroAiStartupProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative isolate w-full overflow-hidden rounded-3xl border border-border/50 bg-background px-6 py-20 sm:px-12 sm:py-28",
        className
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.22_290/0.18),transparent_60%)]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.span
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300"
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            GPT-class reasoning, your data
          </motion.span>

          <motion.h1
            id={headingId}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-balance text-5xl font-black leading-[1.02] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
          >
            The intelligence{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, oklch(0.85 0.15 300), oklch(0.75 0.2 250), oklch(0.85 0.18 200))",
              }}
            >
              layer
            </span>{" "}
            your stack was missing.
          </motion.h1>

          <motion.p
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Build agents that reason over your codebase, your docs, and your customers. One API,
            every frontier model, zero glue code.
          </motion.p>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.26 }}
            className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <a
              href="#api"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-lg shadow-violet-500/20 transition-all hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 motion-reduce:hover:translate-y-0"
            >
              Get an API key
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden
              />
            </a>
            <a
              href="#docs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/40"
            >
              Read the docs
            </a>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex items-center gap-6 border-t border-border/40 pt-6 text-xs text-muted-foreground"
          >
            <div>
              <div className="text-2xl font-black text-foreground">240ms</div>
              <div className="mt-1 uppercase tracking-wider">p50 latency</div>
            </div>
            <div className="h-10 w-px bg-border/50" />
            <div>
              <div className="text-2xl font-black text-foreground">99.99%</div>
              <div className="mt-1 uppercase tracking-wider">uptime SLA</div>
            </div>
            <div className="h-10 w-px bg-border/50" />
            <div>
              <div className="text-2xl font-black text-foreground">SOC 2</div>
              <div className="mt-1 uppercase tracking-wider">Type II</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto hidden aspect-square w-full max-w-md lg:block"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={reduced ? undefined : { rotate: 360 }}
              transition={
                reduced ? undefined : { duration: 80, ease: "linear", repeat: Infinity }
              }
              className="relative h-full w-full"
            >
              <div className="absolute inset-12 rounded-full border border-border/40" />
              <div className="absolute inset-4 rounded-full border border-dashed border-border/30" />
              {ORBIT_NODES.map((n, i) => {
                const rad = (n.angle * Math.PI) / 180;
                const r = 45;
                const x = 50 + Math.cos(rad) * r;
                const y = 50 + Math.sin(rad) * r;
                return (
                  <motion.div
                    key={i}
                    animate={reduced ? undefined : { rotate: -360 }}
                    transition={
                      reduced
                        ? undefined
                        : { duration: 80, ease: "linear", repeat: Infinity }
                    }
                    style={{
                      position: "absolute",
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-card/80 text-violet-300 shadow-lg shadow-violet-500/20 backdrop-blur-md"
                  >
                    <n.icon className="h-5 w-5" aria-hidden />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          <motion.div
            animate={reduced ? undefined : { scale: [1, 1.08, 1], opacity: [0.85, 1, 0.85] }}
            transition={
              reduced
                ? undefined
                : { duration: 3.6, ease: "easeInOut", repeat: Infinity }
            }
            className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-violet-300/40 bg-gradient-to-br from-violet-500/40 to-fuchsia-500/30 shadow-2xl shadow-violet-500/40 backdrop-blur-xl"
          >
            <Brain className="h-9 w-9 text-violet-100" aria-hidden />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroAiStartup;
