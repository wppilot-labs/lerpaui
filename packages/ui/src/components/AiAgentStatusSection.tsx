"use client";

import React from "react";
import { Bot, Activity, Cpu, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

const subtasks = [
  { id: "p1", label: "Read 12 support tickets", done: true },
  { id: "p2", label: "Cluster by topic", done: true },
  { id: "p3", label: "Draft canned replies", done: false },
  { id: "p4", label: "Submit for review", done: false },
];

export interface AiAgentStatusSectionProps {
  className?: string;
}

export function AiAgentStatusSection({ className }: AiAgentStatusSectionProps) {
  const done = subtasks.filter((s) => s.done).length;
  const pct = Math.round((done / subtasks.length) * 100);

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="h-11 w-11 grid place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-card animate-pulse" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold truncate">SupportBot</h3>
          <p className="text-xs text-emerald-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Working · triaging tickets
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] px-3 py-2">
          <div className="text-xs text-muted-foreground/50 flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5" /> Tokens
          </div>
          <div className="text-base font-bold tabular-nums mt-0.5">8.2K</div>
        </div>
        <div className="rounded-xl bg-foreground/[0.02] border border-foreground/[0.05] px-3 py-2">
          <div className="text-xs text-muted-foreground/50 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Runtime
          </div>
          <div className="text-base font-bold tabular-nums mt-0.5">24s</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-muted-foreground/70">Progress</span>
        <span className="text-xs tabular-nums text-muted-foreground/55">{pct}%</span>
      </div>
      <div
        className="h-2 w-full rounded-full bg-foreground/[0.06] overflow-hidden mb-3"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Agent progress"
      >
        <div className="h-full rounded-full bg-emerald-400 transition-all" style={{ width: `${pct}%` }} />
      </div>

      <ul className="space-y-1.5">
        {subtasks.map((s) => (
          <li key={s.id} className="flex items-center gap-2 text-sm">
            {s.done ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : s.id === "p3" ? (
              <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
            ) : (
              <span className="h-3.5 w-3.5 rounded-full border border-foreground/[0.15] shrink-0" />
            )}
            <span className={cn(s.done ? "text-muted-foreground/50 line-through" : "text-foreground/90")}>{s.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
