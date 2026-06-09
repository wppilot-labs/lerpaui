"use client";

import React, { useId, useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import { Check, Layers } from "lucide-react";
import { cn } from "../lib/cn";

export interface VariantColor {
  id: string;
  label: string;
  hex: string;
}

export interface VariantSize {
  id: string;
  label: string;
}

export interface ProductVariantSwatchSelectorProps {
  className?: string;
  colors?: VariantColor[];
  sizes?: VariantSize[];
  /** Set of `${colorId}:${sizeId}` keys that are sold out. */
  outOfStock?: Set<string>;
}

const COLORS: VariantColor[] = [
  { id: "lime", label: "Volt", hex: "#c9ff37" },
  { id: "pink", label: "Bloom", hex: "#ff3d77" },
  { id: "violet", label: "Iris", hex: "#b48cff" },
  { id: "cyan", label: "Tide", hex: "#5fdfff" },
  { id: "ink", label: "Ink", hex: "#0e0b15" },
];

const SIZES: VariantSize[] = [
  { id: "xs", label: "XS" },
  { id: "s", label: "S" },
  { id: "m", label: "M" },
  { id: "l", label: "L" },
  { id: "xl", label: "XL" },
];

const DEFAULT_OOS = new Set([
  "lime:xs",
  "pink:xl",
  "ink:xs",
  "ink:xl",
  "cyan:s",
]);

export function ProductVariantSwatchSelector({
  className,
  colors = COLORS,
  sizes = SIZES,
  outOfStock = DEFAULT_OOS,
}: ProductVariantSwatchSelectorProps) {
  const [color, setColor] = useState(colors[0].id);
  const [size, setSize] = useState(sizes[2].id);
  const groupId = useId();

  const current = colors.find((c) => c.id === color) ?? colors[0];
  const isOOS = (c: string, s: string) => outOfStock.has(`${c}:${s}`);
  const currentOOS = isOOS(color, size);

  return (
    <div
      className={cn(
        "w-full max-w-xs bg-card/45 backdrop-blur-xl border border-white/5 rounded-2xl shadow-2xl select-none overflow-hidden text-foreground p-4 flex flex-col gap-4",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 font-mono select-none">
          <span className="text-[9px] uppercase tracking-widest font-bold text-primary">
            VARIANT_MATRIX
          </span>
          <span className="text-[8px] text-white/40 uppercase font-semibold">
            {current.label} · size {size.toUpperCase()}
            {currentOOS ? " · sold out" : ""}
          </span>
        </div>
        <Layers className="w-4 h-4 text-primary" aria-hidden="true" />
      </div>

      <LayoutGroup id={groupId}>
        <div>
          <span
            id={`${groupId}-color-lbl`}
            className="block text-[9px] uppercase font-bold tracking-widest text-white/40 mb-2"
          >
            Colour
          </span>
          <div
            role="radiogroup"
            aria-labelledby={`${groupId}-color-lbl`}
            className="flex flex-wrap gap-2"
          >
            {colors.map((c) => {
              const active = c.id === color;
              return (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={c.label}
                  onClick={() => setColor(c.id)}
                  className="relative w-9 h-9 rounded-full border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/60"
                  style={{ background: c.hex }}
                >
                  {active && (
                    <motion.span
                      layoutId={`${groupId}-color-active`}
                      className="absolute -inset-1 rounded-full border-2 border-primary pointer-events-none"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      aria-hidden="true"
                    />
                  )}
                  {active && (
                    <Check
                      className="absolute inset-0 m-auto w-4 h-4 text-bg mix-blend-difference"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span
            id={`${groupId}-size-lbl`}
            className="block text-[9px] uppercase font-bold tracking-widest text-white/40 mb-2"
          >
            Size
          </span>
          <div
            role="radiogroup"
            aria-labelledby={`${groupId}-size-lbl`}
            className="grid grid-cols-5 gap-1.5"
          >
            {sizes.map((s) => {
              const active = s.id === size;
              const sold = isOOS(color, s.id);
              return (
                <button
                  key={s.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  aria-label={`Size ${s.label}${sold ? " — sold out" : ""}`}
                  disabled={sold}
                  onClick={() => !sold && setSize(s.id)}
                  className={cn(
                    "relative h-9 rounded-lg text-[11px] font-bold uppercase border transition-colors",
                    sold
                      ? "border-white/5 text-white/25 cursor-not-allowed"
                      : active
                        ? "border-primary text-primary"
                        : "border-white/10 text-white/70 hover:border-white/30",
                  )}
                >
                  {active && !sold && (
                    <motion.span
                      layoutId={`${groupId}-size-active`}
                      className="absolute inset-0 rounded-lg bg-primary/10 pointer-events-none"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      aria-hidden="true"
                    />
                  )}
                  <span className="relative">{s.label}</span>
                  {sold && (
                    <svg
                      viewBox="0 0 36 36"
                      className="absolute inset-0 w-full h-full text-white/20 pointer-events-none"
                      aria-hidden="true"
                    >
                      <line
                        x1="4"
                        y1="32"
                        x2="32"
                        y2="4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </LayoutGroup>

      <div className="flex items-center justify-between text-[10px] font-mono text-white/60 border-t border-white/5 pt-3">
        <span>SKU · {current.id}-{size}-001</span>
        <span
          className={cn(
            "px-2 py-0.5 rounded-md font-bold uppercase tracking-wider",
            currentOOS
              ? "bg-pink/10 text-pink"
              : "bg-primary/10 text-primary",
          )}
          aria-live="polite"
        >
          {currentOOS ? "sold out" : "in stock"}
        </span>
      </div>
    </div>
  );
}
