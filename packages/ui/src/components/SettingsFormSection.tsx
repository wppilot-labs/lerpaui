"use client";

import React, { useState } from "react";
import { cn } from "../lib/cn";

type Toggle = { id: string; title: string; desc: string };

const TOGGLES: Toggle[] = [
  { id: "public", title: "Public profile", desc: "Anyone can view your profile page." },
  { id: "indexing", title: "Search indexing", desc: "Allow search engines to list your page." },
  { id: "analytics", title: "Usage analytics", desc: "Share anonymous data to improve the product." },
];

export interface SettingsFormSectionProps {
  className?: string;
}

export function SettingsFormSection({ className }: SettingsFormSectionProps) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    public: true,
    indexing: false,
    analytics: true,
  });
  const [theme, setTheme] = useState("system");

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn(
        "w-full max-w-lg rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <h3 className="text-base font-bold">General settings</h3>
      <p className="mb-4 text-sm text-muted-foreground/55">Manage visibility and account preferences.</p>

      <ul className="divide-y divide-foreground/[0.05]">
        {TOGGLES.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="text-xs text-muted-foreground/55">{t.desc}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={!!toggles[t.id]}
              aria-label={t.title}
              onClick={() => setToggles((s) => ({ ...s, [t.id]: !s[t.id] }))}
              className={cn(
                "relative h-5 w-9 shrink-0 rounded-full transition-colors",
                toggles[t.id] ? "bg-primary" : "bg-foreground/10",
              )}
            >
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                  toggles[t.id] && "translate-x-4",
                )}
              />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-2 border-t border-foreground/[0.05] pt-4">
        <label htmlFor="sfs-theme" className="mb-1.5 block text-xs font-medium text-muted-foreground/80">
          Appearance
        </label>
        <select
          id="sfs-theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-foreground/[0.06] pt-4">
        <button
          type="reset"
          className="rounded-xl border border-border/50 px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.04]"
        >
          Reset
        </button>
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
        >
          Save settings
        </button>
      </div>
    </form>
  );
}
