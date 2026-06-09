"use client";

import React, { useMemo, useState } from "react";
import { ShieldCheck, Check, Mail, Smartphone, KeyRound, Monitor, ChevronRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthSecurityCheckupProps {
  className?: string;
}

type Item = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  action: string;
};

const ITEMS: Item[] = [
  { id: "email", icon: Mail, title: "Verify your email", desc: "Confirms we can reach you securely", action: "Verify" },
  { id: "2fa", icon: Smartphone, title: "Enable two-factor auth", desc: "Add a second layer of protection", action: "Enable" },
  { id: "recovery", icon: KeyRound, title: "Save recovery codes", desc: "Regain access if you lose your device", action: "Generate" },
  { id: "sessions", icon: Monitor, title: "Review active sessions", desc: "Sign out devices you don't recognize", action: "Review" },
];

export function AuthSecurityCheckup({ className }: AuthSecurityCheckupProps) {
  const [done, setDone] = useState<Record<string, boolean>>({ email: true });

  const completed = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const pct = Math.round((completed / ITEMS.length) * 100);
  const allDone = completed === ITEMS.length;

  const toggle = (id: string) => setDone((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
            allDone ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" : "bg-primary/10 border-primary/25 text-primary",
          )}
        >
          <ShieldCheck className="w-5 h-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold">Security checkup</h3>
          <p className="text-sm text-muted-foreground/60">
            {allDone ? "All set — your account is secure." : `${completed} of ${ITEMS.length} steps complete`}
          </p>
        </div>
        <span className={cn("text-2xl font-black tabular-nums", allDone ? "text-emerald-400" : "text-foreground")}>{pct}%</span>
      </div>

      <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden mb-4">
        <div
          className={cn("h-full rounded-full transition-all duration-500", allDone ? "bg-emerald-400" : "bg-primary")}
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="space-y-2">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isDone = !!done[item.id];
          return (
            <li
              key={item.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                isDone ? "bg-emerald-500/[0.06] border-emerald-500/20" : "bg-foreground/[0.02] border-foreground/[0.05]",
              )}
            >
              <span
                className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
                  isDone ? "bg-emerald-500/15 text-emerald-400" : "bg-foreground/[0.04] text-muted-foreground/55",
                )}
              >
                <Icon className="w-4 h-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <div className={cn("text-sm font-semibold", isDone && "text-muted-foreground/70 line-through")}>{item.title}</div>
                <div className="text-xs text-muted-foreground/55">{item.desc}</div>
              </div>
              {isDone ? (
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  aria-label={`Mark ${item.title} as not done`}
                  className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => toggle(item.id)}
                  className="inline-flex items-center gap-0.5 text-xs font-bold text-primary hover:underline shrink-0"
                >
                  {item.action}
                  <ChevronRight className="w-4 h-4" aria-hidden />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
