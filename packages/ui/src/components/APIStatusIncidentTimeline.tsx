"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { cn } from "../lib/cn";

type Phase = "investigating" | "identified" | "monitoring" | "resolved";
type Update = { phase: Phase; time: string; text: string };

type Incident = {
  id: string;
  title: string;
  impact: "major" | "minor";
  date: string;
  updates: Update[];
};

const INCIDENT: Incident = {
  id: "inc_4821",
  title: "Elevated API error rates",
  impact: "major",
  date: "Jun 2, 2026",
  updates: [
    { phase: "resolved", time: "14:52", text: "Error rates back to normal. Incident resolved." },
    { phase: "monitoring", time: "14:20", text: "Fix deployed, monitoring recovery." },
    { phase: "identified", time: "13:48", text: "Root cause traced to a database connection leak." },
    { phase: "investigating", time: "13:31", text: "Investigating reports of 500 errors on /v1 endpoints." },
  ],
};

const PHASE: Record<Phase, { label: string; dot: string; text: string }> = {
  investigating: { label: "Investigating", dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
  identified: { label: "Identified", dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
  monitoring: { label: "Monitoring", dot: "bg-sky-500", text: "text-sky-600 dark:text-sky-400" },
  resolved: { label: "Resolved", dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
};

export interface APIStatusIncidentTimelineProps {
  className?: string;
}

export function APIStatusIncidentTimeline({ className }: APIStatusIncidentTimelineProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-start gap-2.5 mb-4">
        <span className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 grid place-items-center shrink-0">
          <AlertTriangle className="w-4 h-4" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold leading-tight">{INCIDENT.title}</h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span
              className={cn(
                "px-1.5 py-0.5 rounded font-bold uppercase tracking-wide",
                INCIDENT.impact === "major"
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400",
              )}
            >
              {INCIDENT.impact}
            </span>
            <span>{INCIDENT.date}</span>
          </div>
        </div>
      </div>

      <ol className="relative">
        <span className="absolute left-[3px] top-1.5 bottom-1.5 w-px bg-border" aria-hidden="true" />
        {INCIDENT.updates.map((u, i) => {
          const p = PHASE[u.phase];
          return (
            <li key={i} className="relative pl-5 pb-4 last:pb-0">
              <span className={cn("absolute left-0 top-1 h-[7px] w-[7px] rounded-full ring-4 ring-card", p.dot)} />
              <div className="flex items-baseline gap-2">
                <span className={cn("text-xs font-bold", p.text)}>{p.label}</span>
                <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                  {u.time}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-snug mt-0.5">{u.text}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
