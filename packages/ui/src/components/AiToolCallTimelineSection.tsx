"use client";

import React from "react";
import { Wrench, Search, Database, Code, Check, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

type Step = {
  id: string;
  tool: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  status: "done" | "running" | "pending";
  duration?: string;
};

const STEPS: Step[] = [
  { id: "t1", tool: "web_search", detail: "“SaaS retention benchmarks 2024”", icon: Search, status: "done", duration: "0.8s" },
  { id: "t2", tool: "query_db", detail: "SELECT churn FROM cohorts WHERE …", icon: Database, status: "done", duration: "0.3s" },
  { id: "t3", tool: "run_python", detail: "Computing rolling retention curve", icon: Code, status: "running" },
  { id: "t4", tool: "format_report", detail: "Assemble final summary", icon: Wrench, status: "pending" },
];

export interface AiToolCallTimelineSectionProps {
  className?: string;
}

export function AiToolCallTimelineSection({ className }: AiToolCallTimelineSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <h3 className="text-sm font-bold flex items-center gap-1.5 mb-4">
        <Wrench className="w-4 h-4 text-primary" /> Tool calls
      </h3>

      <ol className="relative">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const last = i === STEPS.length - 1;
          return (
            <li key={s.id} className="relative flex gap-3 pb-4 last:pb-0">
              {!last && (
                <span
                  className={cn(
                    "absolute left-[13px] top-7 bottom-0 w-px",
                    s.status === "done" ? "bg-emerald-400/40" : "bg-foreground/[0.08]",
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  "relative z-10 h-7 w-7 shrink-0 grid place-items-center rounded-full border",
                  s.status === "done"
                    ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-400"
                    : s.status === "running"
                      ? "bg-sky-500/15 border-sky-400/40 text-sky-400"
                      : "bg-foreground/[0.03] border-foreground/[0.08] text-muted-foreground/40",
                )}
              >
                {s.status === "done" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : s.status === "running" ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </span>
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-semibold font-mono">{s.tool}()</code>
                  {s.duration && <span className="text-xs text-muted-foreground/40 tabular-nums">{s.duration}</span>}
                  {s.status === "running" && <span className="text-xs text-sky-400">running…</span>}
                </div>
                <div className="text-sm text-muted-foreground/55 truncate mt-0.5">{s.detail}</div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
