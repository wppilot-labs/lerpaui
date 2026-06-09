"use client";

import React from "react";
import {
  GitMerge,
  MessageSquare,
  CheckCircle2,
  FileEdit,
  UserPlus,
} from "lucide-react";
import { cn } from "../lib/cn";

type Activity = {
  id: string;
  actor: string;
  initials: string;
  action: string;
  target: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const ACTIVITY: Activity[] = [
  {
    id: "1",
    actor: "Priya Patel",
    initials: "PP",
    action: "merged",
    target: "feat/billing-webhooks",
    time: "2m ago",
    icon: GitMerge,
    accent: "text-violet-400 bg-violet-500/10 border-violet-500/20",
  },
  {
    id: "2",
    actor: "Marcus Lee",
    initials: "ML",
    action: "commented on",
    target: "API rate limits",
    time: "18m ago",
    icon: MessageSquare,
    accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
  {
    id: "3",
    actor: "Jane Doe",
    initials: "JD",
    action: "completed",
    target: "Onboarding redesign",
    time: "1h ago",
    icon: CheckCircle2,
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "4",
    actor: "Alex Kim",
    initials: "AK",
    action: "edited",
    target: "Q3 roadmap doc",
    time: "3h ago",
    icon: FileEdit,
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    id: "5",
    actor: "Sofia Reyes",
    initials: "SR",
    action: "joined",
    target: "Platform team",
    time: "Yesterday",
    icon: UserPlus,
    accent: "text-rose-400 bg-rose-500/10 border-rose-500/20",
  },
];

export interface TeamActivityTimelineProps {
  className?: string;
}

export function TeamActivityTimeline({ className }: TeamActivityTimelineProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Activity</h3>
        <span className="text-xs text-muted-foreground/50">Today</span>
      </div>

      <ol className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[17px] top-2 bottom-3 w-px bg-border/60"
        />
        {ACTIVITY.map((a) => {
          const Icon = a.icon;
          return (
            <li key={a.id} className="relative flex gap-3 pb-4 last:pb-0">
              <span
                className={cn(
                  "relative z-10 mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
                  a.accent,
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-xs leading-snug text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {a.actor}
                  </span>{" "}
                  {a.action}{" "}
                  <span className="font-medium text-foreground/90">
                    {a.target}
                  </span>
                </p>
                <span className="mt-0.5 block text-xs text-muted-foreground/45">
                  {a.time}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
