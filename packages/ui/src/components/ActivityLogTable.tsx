"use client";

import React, { useState } from "react";
import { Activity, Search, UserPlus, Settings, Upload, LogIn, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

type ActivityEvent = {
  actor: string;
  action: string;
  target: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
};

const EVENTS: ActivityEvent[] = [
  { actor: "Jane Doe", action: "invited", target: "marcus@acme.co", time: "2m ago", icon: UserPlus, tint: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10" },
  { actor: "Marcus Lee", action: "updated", target: "Billing settings", time: "18m ago", icon: Settings, tint: "text-sky-600 dark:text-sky-400 bg-sky-500/10" },
  { actor: "Priya Patel", action: "uploaded", target: "q2-report.pdf", time: "1h ago", icon: Upload, tint: "text-violet-600 dark:text-violet-400 bg-violet-500/10" },
  { actor: "Alex Kim", action: "signed in", target: "from Chrome", time: "3h ago", icon: LogIn, tint: "text-amber-600 dark:text-amber-400 bg-amber-500/10" },
  { actor: "Jane Doe", action: "deleted", target: "Project Atlas", time: "Yesterday", icon: Trash2, tint: "text-rose-600 dark:text-rose-400 bg-rose-500/10" },
];

export interface ActivityLogTableProps {
  className?: string;
}

export function ActivityLogTable({ className }: ActivityLogTableProps) {
  const [q, setQ] = useState("");
  const rows = EVENTS.filter((e) => (e.actor + e.action + e.target).toLowerCase().includes(q.toLowerCase()));

  return (
    <div className={cn("w-full max-w-lg bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold whitespace-nowrap">Activity</h3>
        </div>
        <div className="relative w-full max-w-[220px]">
          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search activity"
            aria-label="Search activity"
            className="w-full bg-foreground/[0.04] border border-border rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-primary/50 focus:outline-none"
          />
        </div>
      </div>

      <ul className="space-y-1">
        {rows.map((e, i) => (
          <li key={i} className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl hover:bg-foreground/[0.04] transition-colors">
            <span className={cn("grid place-items-center h-9 w-9 rounded-lg shrink-0", e.tint)}>
              <e.icon className="w-4 h-4" />
            </span>
            <p className="flex-1 text-sm leading-snug text-muted-foreground">
              <span className="font-semibold text-foreground">{e.actor}</span> {e.action}{" "}
              <span className="font-medium text-foreground/90">{e.target}</span>
            </p>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{e.time}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
