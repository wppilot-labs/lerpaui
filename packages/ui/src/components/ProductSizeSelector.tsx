"use client";

import React, { useState } from "react";
import { cn } from "../lib/cn";

type Size = { value: string; label: string; stock: number };

const SIZES: Size[] = [
  { value: "xs", label: "XS", stock: 4 },
  { value: "s", label: "S", stock: 12 },
  { value: "m", label: "M", stock: 0 },
  { value: "l", label: "L", stock: 7 },
  { value: "xl", label: "XL", stock: 2 },
  { value: "xxl", label: "2XL", stock: 9 },
];

export interface ProductSizeSelectorProps {
  className?: string;
}

export function ProductSizeSelector({ className }: ProductSizeSelectorProps) {
  const [active, setActive] = useState("s");
  const current = SIZES.find((s) => s.value === active);

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground/60 font-bold">
          Select size
        </span>
        <button
          type="button"
          className="text-xs font-semibold text-primary hover:underline"
        >
          Size guide
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Size">
        {SIZES.map((s) => {
          const selected = active === s.value;
          const out = s.stock === 0;
          return (
            <button
              key={s.value}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`Size ${s.label}${out ? " (out of stock)" : ""}`}
              disabled={out}
              onClick={() => setActive(s.value)}
              className={cn(
                "h-11 rounded-xl border text-sm font-bold transition-all",
                selected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20"
                  : "bg-foreground/[0.02] border-foreground/[0.06] text-foreground hover:border-foreground/30",
                out &&
                  "text-muted-foreground/30 border-foreground/[0.04] line-through cursor-not-allowed hover:border-foreground/[0.04]",
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      <p
        className={cn(
          "mt-3 text-xs",
          current && current.stock > 0 && current.stock <= 4
            ? "text-amber-400"
            : "text-muted-foreground/55",
        )}
      >
        {current && current.stock > 0
          ? current.stock <= 4
            ? `Only ${current.stock} left in size ${current.label}`
            : "In stock · ships in 1–2 days"
          : "Out of stock"}
      </p>
    </div>
  );
}
