"use client";

import React, { useState } from "react";
import { Search, CornerDownLeft, Plus, UserPlus, CreditCard, Settings, FileText } from "lucide-react";
import { cn } from "../lib/cn";

type Cmd = { id: string; label: string; group: string; icon: React.ComponentType<{ className?: string }>; keys: string };

const COMMANDS: Cmd[] = [
  { id: "new", label: "Create project", group: "Actions", icon: Plus, keys: "C" },
  { id: "invite", label: "Invite teammate", group: "Actions", icon: UserPlus, keys: "I" },
  { id: "billing", label: "Go to billing", group: "Navigate", icon: CreditCard, keys: "B" },
  { id: "settings", label: "Open settings", group: "Navigate", icon: Settings, keys: "," },
  { id: "docs", label: "Search docs", group: "Navigate", icon: FileText, keys: "D" },
];

export interface DashboardCommandCenterProps {
  className?: string;
}

export function DashboardCommandCenter({ className }: DashboardCommandCenterProps) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const matches = COMMANDS.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  const groups = Array.from(new Set(matches.map((m) => m.group)));

  return (
    <div className={cn("w-full max-w-sm bg-card/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl font-sans text-foreground overflow-hidden", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-foreground/[0.06]">
        <Search className="w-4 h-4 text-muted-foreground/50" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          placeholder="Type a command or search…"
          aria-label="Command search"
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40"
        />
        <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.05] text-muted-foreground/60">esc</kbd>
      </div>

      <div className="max-h-64 overflow-y-auto py-2">
        {groups.map((g) => (
          <div key={g} className="mb-1">
            <div className="px-4 py-1 text-[11px] uppercase font-bold tracking-wider text-muted-foreground/40">{g}</div>
            {matches.filter((m) => m.group === g).map((c) => {
              const idx = matches.indexOf(c);
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  type="button"
                  onMouseEnter={() => setActive(idx)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors",
                    idx === active ? "bg-primary/10" : "hover:bg-foreground/[0.03]",
                  )}
                >
                  <Icon className="w-4 h-4 text-muted-foreground/70" />
                  <span className="flex-1 text-sm">{c.label}</span>
                  <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.05] text-muted-foreground/50">{c.keys}</kbd>
                </button>
              );
            })}
          </div>
        ))}
        {matches.length === 0 && <div className="px-4 py-6 text-center text-sm text-muted-foreground/50">No results</div>}
      </div>

      <div className="flex items-center justify-between px-4 py-2 border-t border-foreground/[0.06] text-[11px] text-muted-foreground/40">
        <span className="flex items-center gap-1"><CornerDownLeft className="w-3.5 h-3.5" /> to select</span>
        <span>↑↓ to navigate</span>
      </div>
    </div>
  );
}
