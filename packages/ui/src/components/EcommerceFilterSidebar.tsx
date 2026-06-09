"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { cn } from "../lib/cn";

const CATS = [
  { id: "tees", label: "T-Shirts", count: 124 },
  { id: "hoodies", label: "Hoodies", count: 58 },
  { id: "jackets", label: "Jackets", count: 33 },
  { id: "pants", label: "Pants", count: 71 },
];

const COLORS = [
  { id: "black", swatch: "bg-neutral-800", label: "Black" },
  { id: "white", swatch: "bg-neutral-100", label: "White" },
  { id: "blue", swatch: "bg-blue-500", label: "Blue" },
  { id: "green", swatch: "bg-emerald-500", label: "Green" },
  { id: "red", swatch: "bg-red-500", label: "Red" },
];

export interface EcommerceFilterSidebarProps {
  className?: string;
}

export function EcommerceFilterSidebar({ className }: EcommerceFilterSidebarProps) {
  const [cats, setCats] = useState<Record<string, boolean>>({ tees: true, jackets: true });
  const [colors, setColors] = useState<Record<string, boolean>>({ blue: true });
  const [max, setMax] = useState(120);

  const toggleCat = (id: string) => setCats((s) => ({ ...s, [id]: !s[id] }));
  const toggleColor = (id: string) => setColors((s) => ({ ...s, [id]: !s[id] }));

  return (
    <div className={cn("w-full max-w-[240px] bg-card/45 backdrop-blur-xl border border-border/50 p-4 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">Filters</h3>
        <button type="button" className="inline-flex items-center gap-1 text-xs text-muted-foreground/60 hover:text-foreground transition">
          <X className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/55">Category</div>
        <ul className="mt-2 space-y-1.5">
          {CATS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                role="checkbox"
                aria-checked={!!cats[c.id]}
                onClick={() => toggleCat(c.id)}
                className="flex w-full items-center gap-2 text-xs group"
              >
                <span className={cn(
                  "h-4 w-4 rounded border flex items-center justify-center shrink-0 transition",
                  cats[c.id] ? "bg-primary border-primary" : "border-foreground/15 group-hover:border-foreground/30",
                )}>
                  {cats[c.id] && <Check className="w-3 h-3 text-primary-foreground" />}
                </span>
                <span className="flex-1 text-left text-muted-foreground/80 group-hover:text-foreground">{c.label}</span>
                <span className="text-xs text-muted-foreground/40">{c.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4 border-t border-foreground/[0.05] pt-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/55">Max price</span>
          <span className="text-sm font-semibold">${max}</span>
        </div>
        <label htmlFor="filter-price" className="sr-only">Maximum price</label>
        <input
          id="filter-price"
          type="range"
          min={0}
          max={300}
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          className="w-full mt-2 accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground/40 mt-1">
          <span>$0</span>
          <span>$300</span>
        </div>
      </div>

      <div className="mt-4 border-t border-foreground/[0.05] pt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/55">Color</div>
        <div className="flex flex-wrap gap-2 mt-2">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="checkbox"
              aria-checked={!!colors[c.id]}
              aria-label={c.label}
              onClick={() => toggleColor(c.id)}
              className={cn(
                "h-7 w-7 rounded-full border flex items-center justify-center transition",
                c.swatch,
                colors[c.id] ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent" : "border-foreground/20 hover:scale-110",
              )}
            >
              {colors[c.id] && <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
