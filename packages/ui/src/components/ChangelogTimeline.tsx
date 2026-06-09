"use client";

import React from "react";
import { Sparkles, Wrench, Bug } from "lucide-react";
import { cn } from "../lib/cn";

type Release = {
  version: string;
  date: string;
  tag: "Feature" | "Improvement" | "Fix";
  title: string;
  notes: string;
};

const RELEASES: Release[] = [
  {
    version: "v2.4.0",
    date: "Jun 1, 2026",
    tag: "Feature",
    title: "Team workspaces",
    notes: "Invite teammates, share projects, and manage roles from a single place.",
  },
  {
    version: "v2.3.1",
    date: "May 18, 2026",
    tag: "Improvement",
    title: "Faster dashboard loads",
    notes: "Cut initial render time by 40% with streamed server components.",
  },
  {
    version: "v2.3.0",
    date: "May 2, 2026",
    tag: "Fix",
    title: "Webhook retries",
    notes: "Failed webhooks now retry with exponential backoff up to 5 times.",
  },
];

const TAG_META: Record<Release["tag"], { icon: React.ComponentType<{ className?: string }>; tint: string }> = {
  Feature: { icon: Sparkles, tint: "text-violet-600 dark:text-violet-400 bg-violet-500/10 border-violet-500/20" },
  Improvement: { icon: Wrench, tint: "text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/20" },
  Fix: { icon: Bug, tint: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

export interface ChangelogTimelineProps {
  className?: string;
}

export function ChangelogTimeline({ className }: ChangelogTimelineProps) {
  return (
    <div className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <h3 className="mb-5 text-sm font-bold">Changelog</h3>

      <ol className="relative space-y-6 border-l border-border pl-6">
        {RELEASES.map((r) => {
          const meta = TAG_META[r.tag];
          return (
            <li key={r.version} className="relative">
              <span className="absolute -left-[30px] top-0.5 grid h-6 w-6 place-items-center rounded-full border border-border bg-card text-primary">
                <meta.icon className="h-3 w-3" />
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold">{r.version}</span>
                <span className={cn("rounded-full border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide", meta.tint)}>
                  {r.tag}
                </span>
                <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
              </div>
              <h4 className="mt-1 text-sm font-semibold">{r.title}</h4>
              <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{r.notes}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
