"use client";

import React from "react";
import { Check, GitCommit, Rocket, Bug, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

type Event = {
  id: string;
  icon: React.ElementType;
  tint: string;
  title: string;
  desc: string;
  time: string;
  done: boolean;
};

const EVENTS: Event[] = [
  {
    id: "1",
    icon: Rocket,
    tint: "bg-primary/15 text-primary",
    title: "v2.4 deployed to production",
    desc: "Rolled out to 100% of traffic with zero downtime.",
    time: "10:24 AM",
    done: true,
  },
  {
    id: "2",
    icon: Check,
    tint: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    title: "QA sign-off received",
    desc: "All 142 regression checks passed.",
    time: "9:05 AM",
    done: true,
  },
  {
    id: "3",
    icon: Bug,
    tint: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    title: "Hotfix: cart total rounding",
    desc: "Patched a currency edge case reported overnight.",
    time: "Yesterday",
    done: true,
  },
  {
    id: "4",
    icon: Sparkles,
    tint: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    title: "Feature flag: AI search",
    desc: "Enabled for internal testers ahead of beta.",
    time: "2 days ago",
    done: true,
  },
  {
    id: "5",
    icon: GitCommit,
    tint: "bg-foreground/10 text-muted-foreground",
    title: "Branch opened: payments-v3",
    desc: "Initial scaffolding committed.",
    time: "3 days ago",
    done: false,
  },
];

export interface TimelineListProps {
  className?: string;
}

export function TimelineList({ className }: TimelineListProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <h3 className="mb-4 text-base font-bold">Release activity</h3>

      <ol className="relative">
        {EVENTS.map((e, i) => {
          const isLast = i === EVENTS.length - 1;
          return (
            <li key={e.id} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast && <span className="absolute left-[17px] top-9 h-[calc(100%-1.75rem)] w-px bg-foreground/[0.08]" />}
              <span
                className={cn(
                  "z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-card/60",
                  e.tint,
                )}
              >
                <e.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-semibold leading-tight">{e.title}</span>
                  <span className="shrink-0 text-xs text-muted-foreground/45">{e.time}</span>
                </div>
                <p className="mt-0.5 text-sm leading-snug text-muted-foreground/60">{e.desc}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
