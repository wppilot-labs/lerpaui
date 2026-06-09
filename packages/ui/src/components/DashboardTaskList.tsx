"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

type Priority = "high" | "med" | "low";
type Task = { id: string; title: string; assignee: string; priority: Priority; done: boolean };

const PRI: Record<Priority, string> = {
  high: "bg-red-500/10 text-red-400",
  med: "bg-amber-500/10 text-amber-400",
  low: "bg-foreground/[0.05] text-muted-foreground/60",
};

const INITIAL: Task[] = [
  { id: "1", title: "Review Q3 designs", assignee: "JD", priority: "high", done: false },
  { id: "2", title: "Fix checkout bug", assignee: "ML", priority: "high", done: false },
  { id: "3", title: "Update docs", assignee: "PP", priority: "med", done: true },
  { id: "4", title: "Plan offsite", assignee: "AK", priority: "low", done: false },
];

export interface DashboardTaskListProps {
  className?: string;
}

export function DashboardTaskList({ className }: DashboardTaskListProps) {
  const [tasks, setTasks] = useState(INITIAL);
  const left = tasks.filter((t) => !t.done).length;

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Tasks</h3>
        <span className="text-xs text-muted-foreground/55">{left} remaining</span>
      </div>
      <ul className="space-y-1">
        {tasks.map((t) => (
          <li key={t.id}>
            <div className="flex items-center gap-3 py-2">
              <button
                type="button"
                role="checkbox"
                aria-checked={t.done}
                aria-label={t.title}
                onClick={() => setTasks((s) => s.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                className={cn("h-5 w-5 rounded-md border flex items-center justify-center shrink-0 transition-colors", t.done ? "bg-primary border-primary" : "border-foreground/20 hover:border-foreground/40")}
              >
                {t.done && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
              </button>
              <span className={cn("text-sm flex-1", t.done && "line-through text-muted-foreground/45")}>{t.title}</span>
              <span className={cn("text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded", PRI[t.priority])}>{t.priority}</span>
              <span className="h-7 w-7 rounded-full bg-secondary/60 flex items-center justify-center text-[11px] font-bold shrink-0">{t.assignee}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
