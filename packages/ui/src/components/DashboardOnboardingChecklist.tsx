"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

const STEPS = [
  { id: "profile", label: "Complete your profile" },
  { id: "invite", label: "Invite a teammate" },
  { id: "project", label: "Create your first project" },
  { id: "integrate", label: "Connect an integration" },
  { id: "deploy", label: "Ship your first deploy" },
];

export interface DashboardOnboardingChecklistProps {
  className?: string;
}

export function DashboardOnboardingChecklist({ className }: DashboardOnboardingChecklistProps) {
  const [done, setDone] = useState<string[]>(["profile", "invite"]);
  const pct = Math.round((done.length / STEPS.length) * 100);

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-bold">Get started</h3>
        <span className="text-xs font-bold text-primary">{done.length}/{STEPS.length}</span>
      </div>
      <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden mb-4">
        <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <ul className="space-y-1">
        {STEPS.map((s) => {
          const checked = done.includes(s.id);
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => setDone((d) => (checked ? d.filter((x) => x !== s.id) : [...d, s.id]))}
                className="w-full flex items-center gap-3 py-2 text-left group"
                aria-pressed={checked}
              >
                <span className={cn("h-5 w-5 rounded-full border flex items-center justify-center shrink-0 transition-colors", checked ? "bg-primary border-primary" : "border-foreground/20 group-hover:border-foreground/40")}>
                  {checked && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                </span>
                <span className={cn("text-sm", checked ? "line-through text-muted-foreground/45" : "text-foreground")}>{s.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
