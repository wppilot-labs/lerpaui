"use client";

import React, { useState } from "react";

export interface ProductSwatch {
  id: string;
  label: string;
  hex?: string;
  pattern?: string;
  stock?: "in" | "low" | "out";
}

const DEFAULT_SWATCHES: ProductSwatch[] = [
  { id: "lime",   label: "Lime",         hex: "#c9ff37", stock: "in" },
  { id: "violet", label: "Violet",       hex: "#b48cff", stock: "in" },
  { id: "amber",  label: "Amber",        hex: "#ffc347", stock: "low" },
  { id: "mint",   label: "Mint",         hex: "#62d49a", stock: "in" },
  { id: "pink",   label: "Pink",         hex: "#ff3d77", stock: "in" },
  { id: "cyan",   label: "Cyan",         hex: "#5fdfff", stock: "out" },
  { id: "ink",    label: "Ink black",    hex: "#0e0b15", stock: "in" },
];

const STOCK_LABEL: Record<NonNullable<ProductSwatch["stock"]>, { text: string; color: string }> = {
  in:  { text: "in stock",      color: "var(--accent)" },
  low: { text: "only a few left", color: "var(--amber)" },
  out: { text: "sold out",      color: "var(--pink)" },
};

export interface ProductSwatchPickerProps {
  swatches?: ProductSwatch[];
  defaultSelected?: string;
  onChange?: (swatch: ProductSwatch) => void;
}

export function ProductSwatchPicker({
  swatches = DEFAULT_SWATCHES,
  defaultSelected = "lime",
  onChange,
}: ProductSwatchPickerProps) {
  const [selected, setSelected] = useState(defaultSelected);
  const current = swatches.find((s) => s.id === selected) ?? swatches[0];
  const stockMeta = current.stock ? STOCK_LABEL[current.stock] : null;

  const pick = (s: ProductSwatch) => {
    if (s.stock === "out") return;
    setSelected(s.id);
    onChange?.(s);
  };

  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        maxWidth: 440,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-3)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <span>● colour</span>
        <span style={{ color: "var(--text)" }}>
          {current.label}{stockMeta ? <span style={{ color: stockMeta.color, marginLeft: 8 }}>· {stockMeta.text}</span> : null}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Product colour"
        style={{ display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        {swatches.map((s) => {
          const active = s.id === selected;
          const sold = s.stock === "out";
          return (
            <button
              type="button"
              key={s.id}
              role="radio"
              aria-checked={active}
              aria-label={`${s.label}${sold ? " (sold out)" : ""}`}
              disabled={sold}
              onClick={() => pick(s)}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                border: `2px solid ${active ? "var(--text)" : "var(--edge)"}`,
                outline: active ? "2px solid var(--accent)" : "none",
                outlineOffset: 3,
                background: s.hex ?? s.pattern,
                position: "relative",
                cursor: sold ? "not-allowed" : "pointer",
                opacity: sold ? 0.35 : 1,
                transition: "transform 0.15s",
                transform: active ? "scale(1.06)" : "scale(1)",
                boxShadow: active ? `0 0 18px -4px ${s.hex ?? "var(--accent)"}` : "none",
              }}
            >
              {sold ? (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    color: "var(--text)",
                    fontSize: 18,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ×
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
