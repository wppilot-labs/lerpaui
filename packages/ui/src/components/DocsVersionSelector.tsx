"use client";

import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/cn";

export interface DocsVersionSelectorProps {
  className?: string;
}

type Version = { label: string; tag?: "latest" | "beta" };

const VERSIONS: Version[] = [
  { label: "v3.0 (beta)", tag: "beta" },
  { label: "v2.4", tag: "latest" },
  { label: "v2.3" },
  { label: "v1.9" },
];

export function DocsVersionSelector({ className }: DocsVersionSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("v2.4");

  return (
    <div className={cn("relative w-44 font-sans text-foreground", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select documentation version"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-card/60 backdrop-blur-xl border border-border/50 text-sm font-medium shadow-md hover:bg-card/80 transition-colors"
      >
        <span>{selected}</span>
        <ChevronDown className={cn("w-4 h-4 text-muted-foreground/50 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Documentation versions"
          className="absolute z-10 mt-1.5 w-full rounded-xl bg-card/95 backdrop-blur-2xl border border-border/50 shadow-2xl p-1 overflow-hidden"
        >
          {VERSIONS.map((v) => {
            const value = v.label.split(" ")[0];
            const isSelected = value === selected;
            return (
              <li key={v.label} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    setSelected(value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-left transition-colors",
                    isSelected ? "bg-primary/10 text-primary" : "hover:bg-foreground/[0.04] text-foreground/80",
                  )}
                >
                  <Check className={cn("w-4 h-4 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
                  <span className="flex-1">{v.label.replace(/\s*\(.*\)/, "")}</span>
                  {v.tag === "latest" && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/15 px-1.5 py-0.5 rounded">
                      latest
                    </span>
                  )}
                  {v.tag === "beta" && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded">
                      beta
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
