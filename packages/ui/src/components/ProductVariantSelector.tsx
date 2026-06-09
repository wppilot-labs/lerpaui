"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "../lib/cn";

const COLORS = [
  { id: "black", name: "Onyx", hex: "#18181b" },
  { id: "blue", name: "Cobalt", hex: "#2563eb" },
  { id: "olive", name: "Olive", hex: "#6b7042" },
];

const SIZES = ["38", "40", "42", "44", "46"];
const OUT_OF_STOCK = new Set(["black-46", "olive-38"]);

const PRICE = 168;

export interface ProductVariantSelectorProps {
  className?: string;
}

export function ProductVariantSelector({ className }: ProductVariantSelectorProps) {
  const [color, setColor] = useState("blue");
  const [size, setSize] = useState("42");

  const currentColor = COLORS.find((c) => c.id === color);

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-bold">Trail Runner GTX</h3>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            {currentColor?.name} · EU {size}
          </p>
        </div>
        <span className="text-2xl font-black">${PRICE}</span>
      </div>

      <div className="mb-5">
        <span className="block text-xs uppercase tracking-wider text-muted-foreground/60 font-bold mb-2.5">
          Color
        </span>
        <div className="flex gap-2.5">
          {COLORS.map((c) => {
            const selected = color === c.id;
            return (
              <button
                key={c.id}
                type="button"
                aria-label={c.name}
                aria-pressed={selected}
                onClick={() => setColor(c.id)}
                className={cn(
                  "relative h-8 w-8 rounded-full transition-transform",
                  selected
                    ? "outline outline-2 outline-offset-2 outline-foreground/80 scale-105"
                    : "hover:scale-105",
                )}
                style={{ backgroundColor: c.hex }}
              >
                {selected && (
                  <Check
                    className="absolute inset-0 m-auto w-3.5 h-3.5 text-white"
                    strokeWidth={3}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mb-5">
        <span className="block text-xs uppercase tracking-wider text-muted-foreground/60 font-bold mb-2.5">
          Size (EU)
        </span>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Size">
          {SIZES.map((s) => {
            const out = OUT_OF_STOCK.has(`${color}-${s}`);
            const selected = size === s;
            return (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={out}
                onClick={() => setSize(s)}
                className={cn(
                  "h-10 w-12 rounded-lg border text-sm font-bold transition-all",
                  selected
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-foreground/[0.02] border-foreground/[0.06] hover:border-foreground/30",
                  out &&
                    "text-muted-foreground/25 line-through cursor-not-allowed hover:border-foreground/[0.06]",
                )}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-opacity"
      >
        Add to bag · ${PRICE}
      </button>
    </div>
  );
}
