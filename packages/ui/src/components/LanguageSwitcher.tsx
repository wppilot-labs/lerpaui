"use client";

import React, { useState } from "react";
import { Globe, Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

type Lang = { code: string; label: string; flag: string };

const LANGS: Lang[] = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
];

export interface LanguageSwitcherProps {
  className?: string;
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("en");
  const current = LANGS.find((l) => l.code === selected) ?? LANGS[0];

  return (
    <div className={cn("relative w-full max-w-[200px] font-sans text-foreground", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select language"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 bg-card/45 backdrop-blur-xl border border-border/50 rounded-xl px-3 py-2.5 shadow-lg hover:border-foreground/[0.15] transition-colors"
      >
        <Globe className="w-4 h-4 text-muted-foreground/60" />
        <span className="text-sm font-semibold flex-1 text-left">
          <span className="mr-1.5">{current.flag}</span>
          {current.label}
        </span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground/50 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul role="listbox" aria-label="Languages" className="absolute z-10 mt-1.5 w-full rounded-xl border border-foreground/[0.08] bg-popover/95 backdrop-blur-xl shadow-xl p-1">
          {LANGS.map((l) => {
            const on = l.code === selected;
            return (
              <li key={l.code} role="option" aria-selected={on}>
                <button
                  type="button"
                  onClick={() => { setSelected(l.code); setOpen(false); }}
                  className="w-full flex items-center gap-2 text-sm px-2.5 py-2 rounded-lg hover:bg-foreground/[0.05] transition-colors"
                >
                  <span>{l.flag}</span>
                  <span className={cn("flex-1 text-left", on ? "font-semibold" : "text-muted-foreground/80")}>{l.label}</span>
                  {on && <Check className="w-4 h-4 text-primary" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
