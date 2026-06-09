"use client";

import React from "react";
import { Rocket, UserPlus, FolderPlus, Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

type Step = { id: string; icon: React.ComponentType<{ className?: string }>; title: string; desc: string; done: boolean; cta: string };

const STEPS: Step[] = [
  { id: "profile", icon: Check, title: "Set up your profile", desc: "Add a name and photo", done: true, cta: "Done" },
  { id: "team", icon: UserPlus, title: "Invite your team", desc: "Collaborate in real time", done: false, cta: "Invite" },
  { id: "project", icon: FolderPlus, title: "Create a project", desc: "Start from a template", done: false, cta: "Create" },
];

export interface DashboardOnboardingChecklistBlockProps {
  className?: string;
}

export function DashboardOnboardingChecklistBlock({ className }: DashboardOnboardingChecklistBlockProps) {
  const done = STEPS.filter((s) => s.done).length;
  const pct = Math.round((done / STEPS.length) * 100);

  return (
    <div className={cn("w-full max-w-xl bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-start gap-3 mb-5">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Rocket className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold">Welcome aboard 🎉</h3>
          <p className="text-xs text-muted-foreground/65">Finish setup to unlock your workspace — {pct}% complete</p>
          <div className="h-1.5 rounded-full bg-foreground/[0.06] overflow-hidden mt-2">
            <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </div>

      <ul className="grid sm:grid-cols-3 gap-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <li key={s.id} className={cn("rounded-xl border p-4 flex flex-col gap-2", s.done ? "border-emerald-500/20 bg-emerald-500/[0.04]" : "border-foreground/[0.05] bg-foreground/[0.02]")}>
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", s.done ? "bg-emerald-500/15 text-emerald-400" : "bg-secondary/50 text-foreground/80")}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold">{s.title}</div>
                <div className="text-xs text-muted-foreground/55">{s.desc}</div>
              </div>
              <button
                type="button"
                disabled={s.done}
                className={cn(
                  "mt-auto inline-flex items-center justify-center gap-1 py-1.5 text-xs font-bold rounded-lg transition-all",
                  s.done ? "text-emerald-400 cursor-default" : "bg-primary text-primary-foreground hover:brightness-110",
                )}
              >
                {s.cta} {!s.done && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
