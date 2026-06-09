"use client";

import React, { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Activity, Globe2, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";
import { cn } from "../lib/cn";

interface StatsCounterSectionProps {
  className?: string;
}

interface Stat {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  format?: (n: number) => string;
  Icon: React.ComponentType<{ className?: string }>;
  hint: string;
}

const STATS: Stat[] = [
  { label: "Active workspaces", value: 142000, suffix: "+", Icon: Users, hint: "+18% YoY", format: (n) => `${Math.round(n / 1000)}K` },
  { label: "Uptime guarantee", value: 99.99, suffix: "%", Icon: ShieldCheck, hint: "Last 12 months", format: (n) => n.toFixed(2) },
  { label: "Regions served", value: 38, Icon: Globe2, hint: "5 continents", format: (n) => Math.round(n).toString() },
  { label: "Avg response", value: 42, suffix: "ms", Icon: Activity, hint: "p95 globally", format: (n) => Math.round(n).toString() },
];

function useCountUp(target: number, run: boolean, durationMs = 1100) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!run) return;
    let cancelled = false;
    function step(ts: number) {
      if (startRef.current == null) startRef.current = ts;
      const t = Math.min(1, (ts - startRef.current) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      if (!cancelled) setValue(target * eased);
      if (t < 1 && !cancelled) {
        rafRef.current = requestAnimationFrame(step);
      }
    }
    rafRef.current = requestAnimationFrame(step);
    return () => {
      cancelled = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startRef.current = null;
    };
  }, [target, run, durationMs]);

  return value;
}

function StatTile({ stat, run }: { stat: Stat; run: boolean }) {
  const v = useCountUp(stat.value, run);
  const display = (stat.format ?? ((n: number) => Math.round(n).toString()))(v);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
      <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-primary/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <stat.Icon className="h-4 w-4 text-primary" aria-hidden="true" />
          {stat.label}
        </div>
        <div className="text-4xl font-semibold tracking-tight text-foreground tabular-nums md:text-5xl">
          {stat.prefix}
          {display}
          {stat.suffix}
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
          {stat.hint}
        </div>
      </div>
    </div>
  );
}

export function StatsCounterSection({ className }: StatsCounterSectionProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (reduced) {
      setRun(true);
      return;
    }
    const node = sectionRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setRun(true);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "w-full rounded-3xl border border-border/50 bg-card/30 px-6 py-12 backdrop-blur-xl sm:px-10 sm:py-16",
        "relative overflow-hidden font-sans text-foreground",
        className,
      )}
      aria-labelledby="stats-counter-heading"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-24 right-1/3 h-48 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl space-y-10">
        <div className="space-y-3 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            By the numbers
          </span>
          <h2
            id="stats-counter-heading"
            className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl"
          >
            Built for scale, trusted at every{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              tier
            </span>
          </h2>
          <p className="mx-auto max-w-md text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Metrics from the last quarter across all production accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatTile key={s.label} stat={s} run={run} />
          ))}
        </div>
      </div>
    </section>
  );
}
