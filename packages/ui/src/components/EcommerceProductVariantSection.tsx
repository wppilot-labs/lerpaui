"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

const COLORS = [
  { id: "black", label: "Black", swatch: "bg-neutral-800" },
  { id: "sand", label: "Sand", swatch: "bg-amber-200" },
  { id: "forest", label: "Forest", swatch: "bg-emerald-700" },
  { id: "navy", label: "Navy", swatch: "bg-indigo-900" },
];

const SIZES = [
  { id: "xs", label: "XS", available: true },
  { id: "s", label: "S", available: true },
  { id: "m", label: "M", available: true },
  { id: "l", label: "L", available: false },
  { id: "xl", label: "XL", available: true },
];

export interface EcommerceProductVariantSectionProps {
  className?: string;
}

export function EcommerceProductVariantSection({ className }: EcommerceProductVariantSectionProps) {
  const [color, setColor] = useState("sand");
  const [size, setSize] = useState("m");

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">Color</span>
        <span className="text-xs text-muted-foreground/60">{COLORS.find((c) => c.id === color)?.label}</span>
      </div>
      <div className="flex items-center gap-2.5 mt-2" role="radiogroup" aria-label="Color">
        {COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={color === c.id}
            aria-label={c.label}
            onClick={() => setColor(c.id)}
            className={cn(
              "relative h-9 w-9 rounded-full border flex items-center justify-center transition",
              c.swatch,
              color === c.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-transparent" : "border-foreground/20 hover:scale-105",
            )}
          >
            {color === c.id && <Check className="w-4 h-4 text-white drop-shadow" />}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-5">
        <span className="text-sm font-semibold">Size</span>
        <button type="button" className="text-xs text-primary hover:underline">Size guide</button>
      </div>
      <div className="grid grid-cols-5 gap-2 mt-2" role="radiogroup" aria-label="Size">
        {SIZES.map((s) => (
          <button
            key={s.id}
            type="button"
            role="radio"
            aria-checked={size === s.id}
            aria-label={s.available ? s.label : `${s.label}, out of stock`}
            disabled={!s.available}
            onClick={() => setSize(s.id)}
            className={cn(
              "h-10 rounded-lg border text-sm font-semibold transition",
              size === s.id
                ? "bg-primary text-primary-foreground border-primary"
                : "border-foreground/[0.1] bg-foreground/[0.03] text-foreground hover:border-foreground/25",
              !s.available && "opacity-35 line-through cursor-not-allowed hover:border-foreground/[0.1]",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground/55 mt-4">Model is 5&apos;11&quot; and wears size M.</p>
    </div>
  );
}
