"use client";

import React from "react";
import { Radio } from "lucide-react";
import { cn } from "../lib/cn";

type Kind = "ok" | "warn" | "err";

type Entry = { time: string; kind: Kind; text: string };

const DOT: Record<Kind, string> = { ok: "bg-emerald-400", warn: "bg-amber-400", err: "bg-red-400" };

const FEED: Entry[] = [
  { time: "09:42:11", kind: "ok", text: "Deploy v2.4.0 succeeded on production" },
  { time: "09:41:03", kind: "warn", text: "Auth service latency above 300ms" },
  { time: "09:38:55", kind: "ok", text: "Autoscaler added 2 workers (us-east)" },
  { time: "09:31:20", kind: "err", text: "Webhook delivery failed → retrying" },
  { time: "09:27:08", kind: "ok", text: "Database backup completed (4.2 GB)" },
];

export interface DashboardLiveStatusFeedBlockProps {
  className?: string;
}

export function DashboardLiveStatusFeedBlock({ className }: DashboardLiveStatusFeedBlockProps) {
  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl font-sans text-foreground overflow-hidden", className)}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/[0.05]">
        <h3 className="text-base font-bold flex items-center gap-1.5">
          <Radio className="w-4 h-4 text-primary" /> Event stream
        </h3>
        <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Live</span>
      </div>

      <ul className="divide-y divide-foreground/[0.04] font-mono">
        {FEED.map((e, i) => (
          <li key={i} className="flex items-center gap-3 px-5 py-2.5 hover:bg-foreground/[0.02] transition-colors">
            <span className="text-xs tabular-nums text-muted-foreground/40 shrink-0">{e.time}</span>
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", DOT[e.kind])} />
            <span className="text-xs text-foreground/85 truncate">{e.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
