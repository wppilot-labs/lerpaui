"use client";

import React, { useState } from "react";
import { Code2, Paintbrush, BarChart3, Briefcase, Check, ArrowRight } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthRoleSelectionCardProps {
  className?: string;
}

const ROLES = [
  { id: "engineer", icon: Code2, title: "Engineer", desc: "Build and ship features" },
  { id: "designer", icon: Paintbrush, title: "Designer", desc: "Craft the product experience" },
  { id: "analyst", icon: BarChart3, title: "Data analyst", desc: "Turn data into decisions" },
  { id: "manager", icon: Briefcase, title: "Manager", desc: "Lead projects and people" },
];

export function AuthRoleSelectionCard({ className }: AuthRoleSelectionCardProps) {
  const [selected, setSelected] = useState("engineer");

  return (
    <div
      className={cn(
        "w-full max-w-sm bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="mb-5">
        <h3 className="text-lg font-bold">What&apos;s your role?</h3>
        <p className="text-sm text-muted-foreground/65 mt-0.5">
          We&apos;ll tailor your workspace to how you work.
        </p>
      </div>

      <div role="radiogroup" aria-label="Select your role" className="grid grid-cols-2 gap-2.5">
        {ROLES.map((r) => {
          const Icon = r.icon;
          const active = selected === r.id;
          return (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(r.id)}
              className={cn(
                "relative p-3.5 rounded-xl border text-left transition-all",
                active
                  ? "bg-primary/10 border-primary/40"
                  : "bg-foreground/[0.02] border-foreground/[0.06] hover:bg-foreground/[0.04] hover:border-foreground/[0.12]",
              )}
            >
              {active && (
                <span className="absolute top-2.5 right-2.5 h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center" aria-hidden>
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
              <span
                className={cn(
                  "inline-flex h-9 w-9 rounded-lg items-center justify-center mb-2",
                  active ? "bg-primary/15 text-primary" : "bg-foreground/[0.04] text-muted-foreground/60",
                )}
              >
                <Icon className="w-4 h-4" aria-hidden />
              </span>
              <span className="block text-sm font-semibold">{r.title}</span>
              <span className="block text-xs text-muted-foreground/55 mt-0.5 leading-snug">{r.desc}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className="w-full mt-4 py-2.5 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:brightness-110 transition-all inline-flex items-center justify-center gap-1.5"
      >
        Continue
        <ArrowRight className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}
