"use client";

import { useState } from "react";
import { RefreshCw, Pause, Play, CalendarClock } from "lucide-react";
import { cn } from "../lib/cn";

type Subscription = {
  id: string;
  name: string;
  cadence: string;
  next: string;
  price: string;
};

const SUBS: Subscription[] = [
  { id: "coffee", name: "Single-origin coffee", cadence: "Every 2 weeks", next: "Jun 14, 2026", price: "$18.00" },
  { id: "vitamins", name: "Daily vitamins", cadence: "Monthly", next: "Jun 30, 2026", price: "$29.00" },
];

export interface CustomerSubscriptionManagerProps {
  className?: string;
}

export function CustomerSubscriptionManager({ className }: CustomerSubscriptionManagerProps) {
  const [paused, setPaused] = useState<Record<string, boolean>>({ vitamins: true });

  const toggle = (id: string) => setPaused((p) => ({ ...p, [id]: !p[id] }));

  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="mb-4 flex items-center gap-2">
        <RefreshCw className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">My subscriptions</h3>
      </div>

      <div className="space-y-2.5">
        {SUBS.map((s) => {
          const isPaused = !!paused[s.id];
          return (
            <div key={s.id} className="rounded-xl border border-border bg-foreground/[0.02] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-bold">{s.name}</p>
                    <span
                      className={cn(
                        "rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                        isPaused ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      {isPaused ? "Paused" : "Active"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.cadence}</p>
                </div>
                <span className="shrink-0 text-lg font-black">{s.price}</span>
              </div>

              <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2.5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarClock className="h-4 w-4" />
                  {isPaused ? "Paused — no upcoming delivery" : `Next: ${s.next}`}
                </span>
                <button
                  type="button"
                  onClick={() => toggle(s.id)}
                  aria-label={isPaused ? `Resume ${s.name}` : `Pause ${s.name}`}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-colors",
                    isPaused
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                      : "border-border bg-foreground/[0.03] text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                  {isPaused ? "Resume" : "Pause"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
