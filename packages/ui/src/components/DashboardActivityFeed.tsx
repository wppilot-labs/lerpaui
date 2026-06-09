"use client";

import React from "react";
import { GitCommit, MessageSquare, UserPlus, Upload, CheckCircle2 } from "lucide-react";
import { cn } from "../lib/cn";

type Event = {
  id: string;
  who: string;
  initials: string;
  action: string;
  target: string;
  time: string;
  icon: React.ComponentType<{ className?: string }>;
  tint: string;
};

const EVENTS: Event[] = [
  { id: "1", who: "Marcus", initials: "ML", action: "pushed to", target: "main", time: "2m", icon: GitCommit, tint: "text-violet-400" },
  { id: "2", who: "Priya", initials: "PP", action: "commented on", target: "#1284", time: "18m", icon: MessageSquare, tint: "text-sky-400" },
  { id: "3", who: "Jane", initials: "JD", action: "invited", target: "alex@acme.co", time: "1h", icon: UserPlus, tint: "text-emerald-400" },
  { id: "4", who: "System", initials: "SY", action: "deployed", target: "v2.4.0", time: "3h", icon: Upload, tint: "text-amber-400" },
  { id: "5", who: "Priya", initials: "PP", action: "resolved", target: "INC-77", time: "5h", icon: CheckCircle2, tint: "text-emerald-400" },
];

export interface DashboardActivityFeedProps {
  className?: string;
}

export function DashboardActivityFeed({ className }: DashboardActivityFeedProps) {
  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <h3 className="text-base font-bold mb-4">Activity</h3>
      <ol className="relative space-y-4 before:absolute before:left-[15px] before:top-1 before:bottom-1 before:w-px before:bg-foreground/[0.06]">
        {EVENTS.map((e) => {
          const Icon = e.icon;
          return (
            <li key={e.id} className="relative flex gap-3">
              <div className="relative z-10 h-8 w-8 rounded-full bg-secondary/60 border border-foreground/[0.06] flex items-center justify-center shrink-0">
                <Icon className={cn("w-4 h-4", e.tint)} />
              </div>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-sm leading-snug">
                  <span className="font-semibold">{e.who}</span>{" "}
                  <span className="text-muted-foreground/70">{e.action}</span>{" "}
                  <span className="font-medium text-foreground/90">{e.target}</span>
                </p>
                <span className="text-[11px] text-muted-foreground/40">{e.time} ago</span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
