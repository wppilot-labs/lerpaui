"use client";

import React, { useMemo, useState } from "react";
import { Search, FileText, Hash, CornerDownLeft, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsSearchCommandProps {
  className?: string;
}

type Result = { title: string; section: string; kind: "page" | "heading" };

const RESULTS: Result[] = [
  { title: "Installation", section: "Getting started", kind: "page" },
  { title: "Theming tokens", section: "Customization", kind: "heading" },
  { title: "useToast", section: "Hooks", kind: "page" },
  { title: "Keyboard navigation", section: "Accessibility", kind: "heading" },
  { title: "Webhooks", section: "API", kind: "page" },
];

export function DocsSearchCommand({ className }: DocsSearchCommandProps) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const matches = useMemo(
    () => RESULTS.filter((r) => (r.title + r.section).toLowerCase().includes(q.toLowerCase())),
    [q],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(matches.length - 1, 0)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg bg-card/80 backdrop-blur-2xl border border-border/50 rounded-2xl shadow-2xl font-sans text-foreground overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-2 px-4 py-3.5 border-b border-foreground/[0.06]">
        <Search className="w-4 h-4 text-muted-foreground/50" />
        <label htmlFor="docs-cmd-input" className="sr-only">
          Search documentation
        </label>
        <input
          id="docs-cmd-input"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Search documentation…"
          className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/40"
        />
        <kbd className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-foreground/[0.05] text-muted-foreground/60">esc</kbd>
      </div>

      <div className="max-h-72 overflow-y-auto py-2">
        {matches.map((r, i) => {
          const Icon = r.kind === "page" ? FileText : Hash;
          return (
            <button
              key={r.title}
              type="button"
              onMouseEnter={() => setActive(i)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                i === active ? "bg-primary/10" : "hover:bg-foreground/[0.03]",
              )}
            >
              <Icon className="w-4 h-4 text-muted-foreground/60 shrink-0" />
              <span className="flex-1 text-sm truncate">{r.title}</span>
              <span className="text-xs text-muted-foreground/40">{r.section}</span>
            </button>
          );
        })}
        {matches.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground/50">No results for “{q}”</div>
        )}
      </div>

      <div className="flex items-center gap-4 px-4 py-2.5 border-t border-foreground/[0.06] text-xs text-muted-foreground/40">
        <span className="flex items-center gap-1">
          <ArrowUp className="w-3.5 h-3.5" />
          <ArrowDown className="w-3.5 h-3.5" /> navigate
        </span>
        <span className="flex items-center gap-1">
          <CornerDownLeft className="w-3.5 h-3.5" /> open
        </span>
      </div>
    </div>
  );
}
