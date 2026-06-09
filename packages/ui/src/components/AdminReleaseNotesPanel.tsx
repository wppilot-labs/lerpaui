"use client";

import React from "react";
import { Rocket, Sparkles, Wrench, Bug } from "lucide-react";
import { cn } from "../lib/cn";

type Tag = "feature" | "improvement" | "fix";
type Release = {
  version: string;
  date: string;
  current?: boolean;
  changes: { tag: Tag; text: string }[];
};

const RELEASES: Release[] = [
  {
    version: "2.8.0",
    date: "Jun 1, 2026",
    current: true,
    changes: [
      { tag: "feature", text: "Semantic search across all dashboards" },
      { tag: "improvement", text: "30% faster report exports" },
    ],
  },
  {
    version: "2.7.2",
    date: "May 18, 2026",
    changes: [
      { tag: "fix", text: "Resolved Stripe webhook retry loop" },
      { tag: "fix", text: "Fixed timezone drift in scheduled jobs" },
    ],
  },
  {
    version: "2.7.0",
    date: "May 2, 2026",
    changes: [{ tag: "feature", text: "Granular per-resource team roles" }],
  },
];

const TAGS: Record<Tag, { label: string; tone: string; Icon: typeof Bug }> = {
  feature: { label: "New", tone: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10", Icon: Sparkles },
  improvement: { label: "Improved", tone: "text-sky-600 dark:text-sky-400 bg-sky-500/10", Icon: Wrench },
  fix: { label: "Fix", tone: "text-amber-600 dark:text-amber-400 bg-amber-500/10", Icon: Bug },
};

export interface AdminReleaseNotesPanelProps {
  className?: string;
}

export function AdminReleaseNotesPanel({ className }: AdminReleaseNotesPanelProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Release notes</h3>
      </div>

      <ol className="space-y-4">
        {RELEASES.map((r) => (
          <li key={r.version} className="relative pl-5">
            <span
              className={cn(
                "absolute left-0 top-1 h-2.5 w-2.5 rounded-full ring-4 ring-card",
                r.current ? "bg-primary" : "bg-muted-foreground/40",
              )}
            />
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold tabular-nums">v{r.version}</span>
              {r.current && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold uppercase tracking-wide">
                  Latest
                </span>
              )}
              <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
            </div>
            <ul className="mt-2 space-y-1.5">
              {r.changes.map((c) => {
                const { label, tone, Icon } = TAGS[c.tag];
                return (
                  <li key={c.text} className="flex items-start gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 mt-px",
                        tone,
                      )}
                    >
                      <Icon className="w-3 h-3" />
                      {label}
                    </span>
                    <span className="text-xs text-muted-foreground leading-snug">
                      {c.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  );
}
