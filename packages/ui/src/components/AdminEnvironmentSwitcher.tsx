"use client";

import React, { useState } from "react";
import { Layers, Check, ChevronDown, Circle } from "lucide-react";
import { cn } from "../lib/cn";

type Env = { id: string; name: string; branch: string; region: string; tone: string };

const ENVS: Env[] = [
  { id: "prod", name: "Production", branch: "main", region: "us-east-1", tone: "text-emerald-600 dark:text-emerald-400" },
  { id: "staging", name: "Staging", branch: "release/2.4", region: "us-east-1", tone: "text-amber-600 dark:text-amber-400" },
  { id: "qa", name: "QA", branch: "develop", region: "eu-west-1", tone: "text-sky-600 dark:text-sky-400" },
  { id: "dev", name: "Development", branch: "feature/*", region: "local", tone: "text-muted-foreground" },
];

export interface AdminEnvironmentSwitcherProps {
  className?: string;
}

export function AdminEnvironmentSwitcher({ className }: AdminEnvironmentSwitcherProps) {
  const [open, setOpen] = useState(true);
  const [active, setActive] = useState("prod");
  const current = ENVS.find((e) => e.id === active) ?? ENVS[0];

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card border border-border p-3 rounded-2xl shadow-sm font-sans text-foreground",
        className,
      )}
    >
      <span className="block text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-1.5 px-1">
        Deploy environment
      </span>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-muted border border-border hover:bg-muted/70 transition-colors"
      >
        <Layers className="w-4 h-4 text-primary shrink-0" />
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <Circle className={cn("w-2 h-2 fill-current", current.tone)} />
            <span className="text-sm font-semibold">{current.name}</span>
          </div>
          <span className="text-[11px] text-muted-foreground font-mono">{current.branch}</span>
        </div>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <ul role="listbox" aria-label="Environments" className="mt-1.5 space-y-0.5">
          {ENVS.map((e) => (
            <li key={e.id} role="option" aria-selected={e.id === active}>
              <button
                type="button"
                onClick={() => {
                  setActive(e.id);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors",
                  e.id === active ? "bg-primary/10" : "hover:bg-muted",
                )}
              >
                <Circle className={cn("w-2 h-2 fill-current shrink-0", e.tone)} />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold block">{e.name}</span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {e.branch} · {e.region}
                  </span>
                </div>
                {e.id === active && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
