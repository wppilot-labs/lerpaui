"use client";

import React from "react";
import { Activity } from "lucide-react";
import { cn } from "../lib/cn";

type Meter = { id: string; label: string; used: number; limit: number; unit: string; tone: string };

const METERS: Meter[] = [
  { id: "msg", label: "Messages", used: 1280, limit: 2000, unit: "", tone: "bg-sky-400" },
  { id: "img", label: "Image generations", used: 47, limit: 50, unit: "", tone: "bg-amber-400" },
  { id: "tok", label: "Tokens", used: 320, limit: 500, unit: "K", tone: "bg-emerald-400" },
];

export interface AiUsageMeterSectionProps {
  className?: string;
}

export function AiUsageMeterSection({ className }: AiUsageMeterSectionProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-5 font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-primary" /> Usage this month
        </h3>
        <span className="text-xs text-muted-foreground/45">Resets in 12 days</span>
      </div>

      <ul className="space-y-4">
        {METERS.map((m) => {
          const pct = Math.min(100, Math.round((m.used / m.limit) * 100));
          const near = pct >= 90;
          return (
            <li key={m.id}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{m.label}</span>
                <span className={cn("text-xs tabular-nums", near ? "text-amber-400 font-semibold" : "text-muted-foreground/55")}>
                  {m.used.toLocaleString()}
                  {m.unit} / {m.limit.toLocaleString()}
                  {m.unit}
                </span>
              </div>
              <div
                className="h-2 w-full rounded-full bg-foreground/[0.06] overflow-hidden"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={m.label}
              >
                <div
                  className={cn("h-full rounded-full transition-all", near ? "bg-amber-400" : m.tone)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="mt-5 w-full rounded-xl bg-primary text-primary-foreground text-sm font-semibold py-2 hover:brightness-110 transition"
      >
        Upgrade plan
      </button>
    </div>
  );
}
