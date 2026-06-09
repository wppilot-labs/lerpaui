"use client";

import React from "react";
import { Bot, Code2, BarChart3, Headphones, PenLine, Play, Settings } from "lucide-react";
import { cn } from "../lib/cn";

type Agent = {
  id: string;
  name: string;
  role: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  runs: number;
  status: "active" | "idle";
};

const AGENTS: Agent[] = [
  { id: "a1", name: "CodeReviewer", role: "Reviews PRs & flags bugs", icon: Code2, tone: "bg-sky-500/15 text-sky-300", runs: 482, status: "active" },
  { id: "a2", name: "DataAnalyst", role: "Queries & charts metrics", icon: BarChart3, tone: "bg-violet-500/15 text-violet-300", runs: 219, status: "active" },
  { id: "a3", name: "SupportBot", role: "Answers customer tickets", icon: Headphones, tone: "bg-emerald-500/15 text-emerald-300", runs: 1340, status: "idle" },
  { id: "a4", name: "CopyWriter", role: "Drafts marketing copy", icon: PenLine, tone: "bg-amber-500/15 text-amber-300", runs: 96, status: "idle" },
];

export interface AiAgentCardGridProps {
  className?: string;
}

export function AiAgentCardGrid({ className }: AiAgentCardGridProps) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-1.5 mb-4">
        <Bot className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Your agents</h3>
        <span className="ml-auto text-xs text-muted-foreground/45">{AGENTS.length} configured</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {AGENTS.map((a) => {
          const Icon = a.icon;
          return (
            <div
              key={a.id}
              className="flex flex-col rounded-xl border border-foreground/[0.06] bg-foreground/[0.02] p-4 hover:bg-foreground/[0.04] transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className={cn("h-10 w-10 grid place-items-center rounded-xl", a.tone)}>
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    a.status === "active" ? "text-emerald-400" : "text-muted-foreground/50",
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", a.status === "active" ? "bg-emerald-400" : "bg-muted-foreground/40")} />
                  {a.status === "active" ? "Active" : "Idle"}
                </span>
              </div>

              <h4 className="text-sm font-bold">{a.name}</h4>
              <p className="text-xs text-muted-foreground/60 leading-snug mt-0.5 flex-1">{a.role}</p>

              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground/45 tabular-nums">{a.runs.toLocaleString()} runs</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Configure ${a.name}`}
                    className="h-8 w-8 grid place-items-center rounded-lg text-muted-foreground/60 hover:bg-foreground/[0.06] transition"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/15 text-primary text-xs font-semibold hover:bg-primary/25 transition"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" /> Run
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
