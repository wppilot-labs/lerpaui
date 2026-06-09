"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Circle, ArrowRight, Sparkles, X } from "lucide-react";
import { cn } from "../lib/cn";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  estMinutes: number;
  completed?: boolean;
}

export interface EmptyStateOnboardingChecklistProps {
  className?: string;
  title?: string;
  description?: string;
  steps?: OnboardingStep[];
}

const DEFAULT_STEPS: OnboardingStep[] = [
  { id: "1", title: "Create your workspace", description: "Name your workspace and invite teammates", estMinutes: 2, completed: true },
  { id: "2", title: "Connect a data source", description: "Plug in Postgres, BigQuery, or Snowflake", estMinutes: 4 },
  { id: "3", title: "Build your first dashboard", description: "Drag in metrics and customize layout", estMinutes: 6 },
  { id: "4", title: "Set up alerts", description: "Get pinged in Slack when anomalies appear", estMinutes: 3 },
  { id: "5", title: "Invite your team", description: "Share dashboards & assign roles", estMinutes: 2 },
];

export function EmptyStateOnboardingChecklist({
  className,
  title = "Welcome to Lerpa UI",
  description = "Get set up in under 20 minutes. Take it one step at a time.",
  steps = DEFAULT_STEPS,
}: EmptyStateOnboardingChecklistProps) {
  const reduced = useReducedMotion();
  const [completed, setCompleted] = useState<Set<string>>(
    () => new Set(steps.filter((s) => s.completed).map((s) => s.id)),
  );
  const [dismissed, setDismissed] = useState(false);
  const headingId = React.useId();

  if (dismissed) return null;

  const total = steps.length;
  const done = completed.size;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const totalMinutes = steps.reduce((sum, s) => sum + (completed.has(s.id) ? 0 : s.estMinutes), 0);

  const toggle = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn("relative w-full bg-background px-6 py-16 md:py-24", className)}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md sm:p-10"
      >
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss onboarding checklist"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-foreground/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          Get started
        </div>
        <h2 id={headingId} className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">{done} of {total} complete</span>
            <span className="text-muted-foreground">~{totalMinutes} min remaining</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-foreground/5" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Onboarding progress">
            <motion.div
              initial={reduced ? false : { width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-fuchsia-500"
            />
          </div>
        </div>

        <ol className="mt-8 space-y-2">
          {steps.map((s, i) => {
            const isDone = completed.has(s.id);
            const isNext = !isDone && Array.from(completed).length === i;
            return (
              <li key={s.id}>
                <div
                  className={cn(
                    "flex items-start gap-4 rounded-xl border p-4 transition-all",
                    isDone ? "border-border bg-background/40" : isNext ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border bg-background/40",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => toggle(s.id)}
                    aria-pressed={isDone}
                    aria-label={`Mark "${s.title}" as ${isDone ? "incomplete" : "complete"}`}
                    className={cn(
                      "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                      isDone ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-background hover:border-primary",
                    )}
                  >
                    {isDone ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Circle className="h-3 w-3 opacity-0" aria-hidden />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className={cn("text-sm font-semibold", isDone ? "text-muted-foreground line-through" : "text-foreground")}>
                      {s.title}
                    </div>
                    <div className="mt-0.5 text-xs text-muted-foreground">{s.description}</div>
                  </div>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">~{s.estMinutes} min</span>
                  {isNext && (
                    <a href="/" className="hidden flex-shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 sm:inline-flex">
                      Start
                      <ArrowRight className="h-3 w-3" aria-hidden />
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </motion.div>
    </section>
  );
}

export default EmptyStateOnboardingChecklist;
