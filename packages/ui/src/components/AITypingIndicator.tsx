"use client";

import React from "react";

export interface AITypingIndicatorProps {
  label?: string;
  accent?: string;
  showLabel?: boolean;
  inline?: boolean;
  size?: "sm" | "md";
}

export function AITypingIndicator({
  label = "claude is typing",
  accent = "var(--accent)",
  showLabel = true,
  inline = false,
  size = "md",
}: AITypingIndicatorProps) {
  const dotSize = size === "sm" ? 4 : 6;
  const gap = size === "sm" ? 3 : 4;

  const dots = (
    <span style={{ display: "inline-flex", alignItems: "center", gap, height: dotSize + 2 }} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 4px ${accent}`,
            animation: `ai-typing-bounce 1.2s ease-in-out ${i * 0.16}s infinite`,
          }}
        />
      ))}
    </span>
  );

  if (inline) return dots;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        background: "var(--bg-2)",
        border: "1px solid var(--edge)",
        borderRadius: 999,
        fontFamily: "var(--font-sans)",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 22,
          height: 22,
          borderRadius: 6,
          background: accent,
          color: "var(--bg)",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        ∗
      </span>
      {showLabel ? (
        <span style={{ fontSize: 12, color: "var(--text-2)" }}>{label}</span>
      ) : null}
      {dots}
    </div>
  );
}
