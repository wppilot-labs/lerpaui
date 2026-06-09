"use client";

import React from "react";
import { Folder, MoreHorizontal } from "lucide-react";
import { cn } from "../lib/cn";

type Project = { name: string; tag: string; progress: number; members: number; tint: string };

const PROJECTS: Project[] = [
  { name: "Website redesign", tag: "Design", progress: 72, members: 4, tint: "bg-violet-400" },
  { name: "Mobile app v2", tag: "Engineering", progress: 38, members: 6, tint: "bg-sky-400" },
  { name: "Q3 campaign", tag: "Marketing", progress: 91, members: 3, tint: "bg-emerald-400" },
];

export interface DashboardProjectOverviewProps {
  className?: string;
}

export function DashboardProjectOverview({ className }: DashboardProjectOverviewProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold flex items-center gap-1.5"><Folder className="w-4 h-4 text-primary" /> Projects</h3>
        <span className="text-xs text-muted-foreground/50">3 active</span>
      </div>

      <ul className="space-y-2.5">
        {PROJECTS.map((p) => (
          <li key={p.name} className="p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{p.name}</div>
                <span className="text-[11px] uppercase tracking-wide text-muted-foreground/50">{p.tag}</span>
              </div>
              <button type="button" aria-label="Project options" className="text-muted-foreground/40 hover:text-foreground transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              <div className="flex-1 h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden">
                <div className={cn("h-full rounded-full", p.tint)} style={{ width: `${p.progress}%` }} />
              </div>
              <span className="text-xs font-bold tabular-nums w-8 text-right">{p.progress}%</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
