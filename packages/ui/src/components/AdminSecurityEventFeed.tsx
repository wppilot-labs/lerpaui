"use client";

import React from "react";
import { ShieldAlert, LogIn, KeyRound, UserX, Globe, ShieldCheck } from "lucide-react";
import { cn } from "../lib/cn";

type Severity = "high" | "medium" | "low";
type SecurityEvent = {
  id: string;
  Icon: typeof LogIn;
  title: string;
  actor: string;
  ip: string;
  time: string;
  severity: Severity;
};

const EVENTS: SecurityEvent[] = [
  { id: "1", Icon: UserX, title: "Failed login (5 attempts)", actor: "unknown", ip: "203.0.113.44", time: "2m ago", severity: "high" },
  { id: "2", Icon: KeyRound, title: "API key rotated", actor: "j.doe@acme.co", ip: "10.0.4.18", time: "21m ago", severity: "medium" },
  { id: "3", Icon: LogIn, title: "New device sign-in", actor: "m.lee@acme.co", ip: "198.51.100.7", time: "1h ago", severity: "medium" },
  { id: "4", Icon: ShieldCheck, title: "2FA enabled", actor: "p.patel@acme.co", ip: "10.0.4.91", time: "3h ago", severity: "low" },
  { id: "5", Icon: Globe, title: "Login from new country (DE)", actor: "a.kim@acme.co", ip: "203.0.113.9", time: "5h ago", severity: "high" },
];

const SEV: Record<Severity, string> = {
  high: "text-red-600 dark:text-red-400 bg-red-500/10",
  medium: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
  low: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
};

export interface AdminSecurityEventFeedProps {
  className?: string;
}

export function AdminSecurityEventFeed({ className }: AdminSecurityEventFeedProps) {
  return (
    <div
      className={cn(
        "w-full max-w-md bg-card border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Security events</h3>
        <span className="ml-auto inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          live
        </span>
      </div>

      <ul className="space-y-2">
        {EVENTS.map((e) => (
          <li
            key={e.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-muted border border-border"
          >
            <span className={cn("w-8 h-8 rounded-lg grid place-items-center shrink-0", SEV[e.severity])}>
              <e.Icon className="w-4 h-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-tight truncate">{e.title}</p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                <span className="truncate">{e.actor}</span>
                <span>·</span>
                <span className="font-mono">{e.ip}</span>
              </div>
            </div>
            <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
              {e.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
