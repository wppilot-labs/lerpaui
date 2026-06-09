"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Inbox, CheckCircle2, BellOff, Calendar, BookOpen, Trophy } from "lucide-react";
import { cn } from "../lib/cn";

export interface EmptyStateInboxZeroProps {
  className?: string;
  userName?: string;
  streakDays?: number;
}

const STATS = [
  { icon: CheckCircle2, label: "Cleared today", value: "47", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: BellOff, label: "Muted threads", value: "12", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: Trophy, label: "Streak days", value: "9", color: "text-amber-500", bg: "bg-amber-500/10" },
];

const SUGGESTIONS = [
  { icon: Calendar, title: "Review your week", desc: "Quick recap of meetings & deliverables" },
  { icon: BookOpen, title: "Deep-work block", desc: "Start a 90-minute focus session" },
];

export function EmptyStateInboxZero({
  className,
  userName = "Jane",
  streakDays = 9,
}: EmptyStateInboxZeroProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full overflow-hidden bg-background px-6 py-16 md:py-24", className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.78_0.18_150/0.18),transparent_55%)]" />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 text-center shadow-sm transition-shadow hover:shadow-md sm:p-14"
      >
        <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
          <motion.div
            animate={reduced ? undefined : { scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={reduced ? undefined : { duration: 2.6, ease: "easeInOut", repeat: Infinity }}
            className="absolute inset-0 rounded-full bg-emerald-500/30 blur-2xl"
            aria-hidden
          />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
            <Inbox className="h-11 w-11" aria-hidden />
            <motion.div
              initial={reduced ? false : { scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
              className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-card bg-emerald-500 text-white shadow-lg"
              aria-hidden
            >
              <CheckCircle2 className="h-5 w-5" />
            </motion.div>
          </div>
        </div>

        <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <Trophy className="h-3.5 w-3.5" aria-hidden />
          {streakDays}-day streak
        </div>
        <h2 id={headingId} className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
          Inbox zero, {userName}.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base text-muted-foreground">
          You&apos;ve cleared every thread. Take a breath and tackle something deeper.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-background/40 p-3">
              <div className={cn("mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg", s.bg, s.color)}>
                <s.icon className="h-4 w-4" aria-hidden />
              </div>
              <div className="text-xl font-black text-foreground">{s.value}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 space-y-2.5 text-left">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.title}
              type="button"
              className="group flex w-full items-center gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-left transition-all hover:border-primary/40 hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" aria-hidden />
              </span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">{s.title}</div>
                <div className="text-xs text-muted-foreground">{s.desc}</div>
              </div>
              <span className="text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:opacity-100">Start →</span>
            </button>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default EmptyStateInboxZero;
