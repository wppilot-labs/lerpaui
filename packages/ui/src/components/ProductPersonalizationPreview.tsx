"use client";

import React, { useState } from "react";
import { Type } from "lucide-react";
import { cn } from "../lib/cn";

const FONTS = [
  { id: "serif", label: "Serif", className: "font-serif" },
  { id: "script", label: "Script", className: "italic font-serif" },
  { id: "mono", label: "Block", className: "font-mono tracking-widest" },
];

const COLORS = [
  { id: "gold", label: "Gold", value: "#d4af37" },
  { id: "silver", label: "Silver", value: "#cbd5e1" },
  { id: "ink", label: "Ink", value: "#e5e7eb" },
];

const MAX = 12;

export interface ProductPersonalizationPreviewProps {
  className?: string;
}

export function ProductPersonalizationPreview({
  className,
}: ProductPersonalizationPreviewProps) {
  const [text, setText] = useState("ALEX");
  const [font, setFont] = useState("serif");
  const [color, setColor] = useState("gold");

  const activeFont = FONTS.find((f) => f.id === font)!;
  const activeColor = COLORS.find((c) => c.id === color)!;

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-4 h-4 text-primary" />
        <h3 className="text-base font-bold">Add engraving</h3>
      </div>

      {/* live preview */}
      <div className="relative h-32 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-foreground/[0.06] flex items-center justify-center overflow-hidden mb-4">
        <div className="absolute inset-3 rounded-lg border border-foreground/10" />
        <span
          className={cn(
            "text-3xl font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]",
            activeFont.className,
          )}
          style={{ color: activeColor.value }}
        >
          {text || "Your text"}
        </span>
      </div>

      {/* text input */}
      <label
        htmlFor="engraving-text"
        className="block text-xs uppercase tracking-wider text-muted-foreground/60 font-bold mb-1.5"
      >
        Your text
      </label>
      <div className="relative mb-4">
        <input
          id="engraving-text"
          type="text"
          maxLength={MAX}
          value={text}
          onChange={(e) => setText(e.target.value.toUpperCase())}
          placeholder="Up to 12 characters"
          className="w-full bg-foreground/[0.03] border border-foreground/[0.06] rounded-xl px-3.5 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/40 transition-colors"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground/45 tabular-nums">
          {text.length}/{MAX}
        </span>
      </div>

      {/* font */}
      <span className="block text-xs uppercase tracking-wider text-muted-foreground/60 font-bold mb-2">
        Style
      </span>
      <div className="grid grid-cols-3 gap-2 mb-4" role="radiogroup" aria-label="Font style">
        {FONTS.map((f) => {
          const on = f.id === font;
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => setFont(f.id)}
              className={cn(
                "py-2 rounded-lg border text-sm transition-all",
                f.className,
                on
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-foreground/[0.06] bg-foreground/[0.02] text-muted-foreground/70 hover:border-foreground/25",
              )}
            >
              Aa
            </button>
          );
        })}
      </div>

      {/* color */}
      <span className="block text-xs uppercase tracking-wider text-muted-foreground/60 font-bold mb-2">
        Finish
      </span>
      <div className="flex gap-2.5" role="radiogroup" aria-label="Engraving color">
        {COLORS.map((c) => {
          const on = c.id === color;
          return (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={on}
              aria-label={c.label}
              onClick={() => setColor(c.id)}
              className={cn(
                "h-8 w-8 rounded-full transition-transform",
                on
                  ? "outline outline-2 outline-offset-2 outline-foreground/80 scale-105"
                  : "hover:scale-105",
              )}
              style={{ backgroundColor: c.value }}
            />
          );
        })}
      </div>
    </div>
  );
}
