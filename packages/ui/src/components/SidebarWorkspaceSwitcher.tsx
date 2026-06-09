"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "../lib/cn";

type Workspace = { id: string; name: string; plan: string; initials: string; tint: string };

const WORKSPACES: Workspace[] = [
  { id: "acme", name: "Acme Inc", plan: "Enterprise", initials: "AC", tint: "from-primary to-violet-500" },
  { id: "northwind", name: "Northwind", plan: "Pro", initials: "NW", tint: "from-emerald-500 to-teal-500" },
  { id: "personal", name: "Personal", plan: "Free", initials: "PE", tint: "from-amber-500 to-orange-500" },
];

export interface SidebarWorkspaceSwitcherProps {
  className?: string;
}

export function SidebarWorkspaceSwitcher({ className }: SidebarWorkspaceSwitcherProps) {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState(WORKSPACES[0].id);
  const current = WORKSPACES.find((w) => w.id === selected)!;

  return (
    <div className={cn("relative w-full max-w-[240px] font-sans text-foreground", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-xl border border-border/50 bg-card/60 p-2 pr-2.5 backdrop-blur-xl transition-colors hover:bg-card"
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white",
            current.tint,
          )}
        >
          {current.initials}
        </span>
        <span className="min-w-0 flex-1 text-left">
          <span className="block truncate text-sm font-semibold leading-tight">{current.name}</span>
          <span className="block text-xs text-muted-foreground/55">{current.plan} plan</span>
        </span>
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground/60" />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Switch workspace"
          className="absolute left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border/50 bg-card/95 p-1.5 shadow-2xl backdrop-blur-2xl"
        >
          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/45">
            Workspaces
          </div>
          {WORKSPACES.map((w) => {
            const isSel = w.id === selected;
            return (
              <button
                key={w.id}
                type="button"
                role="option"
                aria-selected={isSel}
                onClick={() => {
                  setSelected(w.id);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-foreground/[0.04]"
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-xs font-bold text-white",
                    w.tint,
                  )}
                >
                  {w.initials}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold leading-tight">{w.name}</span>
                  <span className="block text-xs text-muted-foreground/50">{w.plan}</span>
                </span>
                {isSel && <Check className="h-4 w-4 text-primary" />}
              </button>
            );
          })}

          <div className="my-1 border-t border-foreground/[0.06]" />

          <button
            type="button"
            className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left text-sm font-medium text-muted-foreground/80 transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-dashed border-foreground/15">
              <Plus className="h-4 w-4" />
            </span>
            Create workspace
          </button>
        </div>
      )}
    </div>
  );
}
