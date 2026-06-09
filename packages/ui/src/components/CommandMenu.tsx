"use client";

import React, { useMemo, useState } from "react";
import { Search, FileText, Settings, User, Plus, ArrowRight, CornerDownLeft } from "lucide-react";
import { cn } from "../lib/cn";

type Command = {
  group: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
};

const COMMANDS: Command[] = [
  { group: "Actions", label: "New document", icon: Plus, shortcut: "N" },
  { group: "Actions", label: "Invite teammate", icon: User },
  { group: "Navigation", label: "Go to settings", icon: Settings, shortcut: "," },
  { group: "Navigation", label: "Open billing", icon: FileText },
  { group: "Navigation", label: "View profile", icon: User, shortcut: "P" },
];

export interface CommandMenuProps {
  className?: string;
}

export function CommandMenu({ className }: CommandMenuProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(
    () => COMMANDS.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  const groups = useMemo(() => {
    const map = new Map<string, Command[]>();
    results.forEach((c) => {
      const arr = map.get(c.group) ?? [];
      arr.push(c);
      map.set(c.group, arr);
    });
    return Array.from(map.entries());
  }, [results]);

  let flatIndex = -1;

  return (
    <div className={cn("w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-xl font-sans text-foreground", className)}>
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          placeholder="Type a command or search…"
          aria-label="Command menu search"
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none"
        />
        <kbd className="rounded border border-border bg-foreground/[0.04] px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground">
          ⌘K
        </kbd>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        {results.length === 0 && (
          <p className="px-2 py-6 text-center text-sm text-muted-foreground">No results found.</p>
        )}
        {groups.map(([group, items]) => (
          <div key={group} className="mb-1.5">
            <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{group}</p>
            {items.map((c) => {
              flatIndex += 1;
              const isActive = flatIndex === active;
              const idx = flatIndex;
              return (
                <button
                  key={c.label}
                  type="button"
                  onMouseEnter={() => setActive(idx)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors",
                    isActive ? "bg-primary/15 text-foreground" : "text-muted-foreground hover:bg-foreground/[0.03]"
                  )}
                >
                  <c.icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span className="flex-1">{c.label}</span>
                  {c.shortcut && (
                    <kbd className="rounded border border-border bg-foreground/[0.04] px-1.5 py-0.5 text-[11px] font-bold text-muted-foreground">
                      ⌘{c.shortcut}
                    </kbd>
                  )}
                  {isActive && <ArrowRight className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CornerDownLeft className="h-3.5 w-3.5" /> to select
        </span>
        <span>↑↓ to navigate</span>
      </div>
    </div>
  );
}
