"use client";

import React, { useState } from "react";

export interface AIRegenerateToolbarProps {
  accent?: string;
  variants?: string[];
  defaultVariant?: string;
  onRegenerate?: (variant: string) => void;
}

const DEFAULT_VARIANTS = ["shorter", "longer", "simpler", "more technical", "more friendly"];

export function AIRegenerateToolbar({
  accent = "var(--accent)",
  variants = DEFAULT_VARIANTS,
  defaultVariant = "shorter",
  onRegenerate,
}: AIRegenerateToolbarProps) {
  const [active, setActive] = useState(defaultVariant);
  const [spinning, setSpinning] = useState(false);

  const trigger = () => {
    setSpinning(true);
    onRegenerate?.(active);
    window.setTimeout(() => setSpinning(false), 800);
  };

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: 6,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 10,
        fontFamily: "var(--font-sans)",
        flexWrap: "wrap",
        maxWidth: 480,
      }}
      role="toolbar"
      aria-label="Regenerate response"
    >
      <button
        type="button"
        onClick={trigger}
        aria-label="Regenerate"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "6px 12px",
          background: accent,
          color: "var(--bg)",
          border: 0,
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: `0 0 12px -4px ${accent}`,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            transform: spinning ? "rotate(360deg)" : "rotate(0deg)",
            transition: "transform 0.8s",
            fontFamily: "var(--font-mono)",
          }}
        >
          ↻
        </span>
        Regenerate
      </button>
      <div style={{ width: 1, height: 18, background: "var(--edge)" }} aria-hidden="true" />
      {variants.map((v) => {
        const isActive = v === active;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={isActive}
            onClick={() => setActive(v)}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              padding: "4px 9px",
              background: isActive ? "var(--accent-soft)" : "transparent",
              border: `1px solid ${isActive ? accent : "var(--edge)"}`,
              borderRadius: 5,
              color: isActive ? accent : "var(--text-3)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}
