"use client";

import React from "react";
import { cn } from "../lib/cn";

type Status = "online" | "away" | "offline";
type Member = { name: string; role: string; initials: string; status: Status };

const DOT: Record<Status, string> = { online: "bg-emerald-400", away: "bg-amber-400", offline: "bg-muted-foreground/40" };

const TEAM: Member[] = [
  { name: "Jane Doe", role: "Designer", initials: "JD", status: "online" },
  { name: "Marcus Lee", role: "Engineer", initials: "ML", status: "online" },
  { name: "Priya Patel", role: "PM", initials: "PP", status: "away" },
  { name: "Alex Kim", role: "Engineer", initials: "AK", status: "offline" },
];

export interface DashboardTeamOverviewProps {
  className?: string;
}

export function DashboardTeamOverview({ className }: DashboardTeamOverviewProps) {
  const online = TEAM.filter((m) => m.status === "online").length;

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold">Team</h3>
        <span className="text-xs text-emerald-400 font-medium">{online} online</span>
      </div>
      <ul className="space-y-1">
        {TEAM.map((m) => (
          <li key={m.name} className="flex items-center gap-3 py-2">
            <div className="relative shrink-0">
              <div className="h-10 w-10 rounded-full bg-secondary/60 flex items-center justify-center text-xs font-bold">{m.initials}</div>
              <span className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card", DOT[m.status])} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold truncate">{m.name}</div>
              <div className="text-xs text-muted-foreground/50">{m.role}</div>
            </div>
            <span className="text-[11px] capitalize text-muted-foreground/45">{m.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
