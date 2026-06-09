"use client";

import React from "react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../animation/hooks";

type State = "operational" | "degraded" | "down";

export interface LiveStatusBeaconProps {
  service?: string;
  state?: State;
  uptime?: number[];
  className?: string;
}

const TONE: Record<State, { dot: string; label: string; text: string }> = {
  operational: { dot: "bg-emerald-500", label: "Operational", text: "text-emerald-600 dark:text-emerald-400" },
  degraded: { dot: "bg-amber-500", label: "Degraded", text: "text-amber-600 dark:text-amber-400" },
  down: { dot: "bg-red-500", label: "Outage", text: "text-red-600 dark:text-red-400" },
};

/**
 * Signature status card — a live pulsing beacon ring + 30-bar uptime sparkline.
 * Reduced-motion stops the pulse. Theme-aware (light + dark).
 */
export function LiveStatusBeacon({
  service = "API Gateway",
  state = "operational",
  uptime = Array.from({ length: 30 }, (_, i) => (i === 11 || i === 23 ? 62 : 96 + ((i * 7) % 4))),
  className,
}: LiveStatusBeaconProps) {
  const reduced = usePrefersReducedMotion();
  const tone = TONE[state];

  return (
    <div className={cn("w-full max-w-sm rounded-2xl border border-border bg-card text-card-foreground p-6 shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex h-3 w-3">
            {!reduced && <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60", tone.dot)} />}
            <span className={cn("relative inline-flex h-3 w-3 rounded-full", tone.dot)} />
          </span>
          <h3 className="text-base font-semibold">{service}</h3>
        </div>
        <span className={cn("text-sm font-medium", tone.text)}>{tone.label}</span>
      </div>

      <div className="mt-5 flex h-10 items-end gap-[3px]" aria-hidden="true">
        {uptime.map((u, i) => (
          <div
            key={i}
            className={cn("flex-1 rounded-sm", u < 80 ? "bg-amber-500/70" : "bg-emerald-500/55")}
            style={{ height: `${u}%` }}
          />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>30 days ago</span>
        <span className="font-medium text-foreground">99.98% uptime</span>
        <span>today</span>
      </div>
    </div>
  );
}
