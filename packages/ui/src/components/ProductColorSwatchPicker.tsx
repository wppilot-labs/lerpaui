"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

type Swatch = { id: string; name: string; hex: string; soldOut?: boolean };

const SWATCHES: Swatch[] = [
  { id: "midnight", name: "Midnight Navy", hex: "#1e293b" },
  { id: "clay", name: "Terracotta", hex: "#c2603f" },
  { id: "sage", name: "Sage Green", hex: "#7c9473" },
  { id: "sand", name: "Warm Sand", hex: "#d8c3a5" },
  { id: "plum", name: "Deep Plum", hex: "#6b3f6e" },
  { id: "slate", name: "Stone Grey", hex: "#94a3b8", soldOut: true },
];

export interface ProductColorSwatchPickerProps {
  className?: string;
}

export function ProductColorSwatchPicker({ className }: ProductColorSwatchPickerProps) {
  const [active, setActive] = useState("clay");
  const current = SWATCHES.find((s) => s.id === active);

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground/60 font-bold">
          Color
        </span>
        <span className="text-sm font-semibold">{current?.name}</span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {SWATCHES.map((s) => {
          const selected = active === s.id;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => !s.soldOut && setActive(s.id)}
              disabled={s.soldOut}
              aria-label={`${s.name}${s.soldOut ? " (sold out)" : ""}`}
              aria-pressed={selected}
              className={cn(
                "relative h-9 w-9 rounded-full transition-transform",
                selected
                  ? "outline outline-2 outline-offset-2 outline-foreground/80 scale-105"
                  : "hover:scale-105",
                s.soldOut && "opacity-40 cursor-not-allowed",
              )}
              style={{ backgroundColor: s.hex }}
            >
              {selected && (
                <Check
                  className="absolute inset-0 m-auto w-4 h-4 text-white drop-shadow"
                  strokeWidth={3}
                />
              )}
              {s.soldOut && (
                <span className="absolute inset-0 m-auto block h-px w-9 rotate-45 bg-foreground/70" />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-4 text-xs text-muted-foreground/55">
        {SWATCHES.filter((s) => !s.soldOut).length} colors available · free returns
      </p>
    </div>
  );
}
