"use client";

import React from "react";

export interface AIThinkingIndicatorProps {
  label?: string;
  accent?: string;
  variant?: "dots" | "spark" | "wave";
  size?: "sm" | "md" | "lg";
}

export function AIThinkingIndicator({
  label = "Thinking",
  accent = "var(--accent)",
  variant = "spark",
  size = "md",
}: AIThinkingIndicatorProps) {
  const dim = size === "sm" ? 28 : size === "lg" ? 56 : 40;
  const dotSize = size === "sm" ? 4 : size === "lg" ? 8 : 6;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 14px",
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 12,
        fontFamily: "var(--font-sans)",
        boxShadow: `0 0 20px -10px ${accent}`,
      }}
    >
      <div style={{ width: dim, height: dim, position: "relative", flexShrink: 0 }} aria-hidden="true">
        {variant === "dots" ? (
          <div style={{ display: "flex", gap: 4, alignItems: "center", height: "100%", justifyContent: "center" }}>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: "50%",
                  background: accent,
                  boxShadow: `0 0 8px ${accent}`,
                  animation: `pulse-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
                }}
              />
            ))}
          </div>
        ) : variant === "wave" ? (
          <div style={{ display: "flex", gap: 3, alignItems: "center", height: "100%", justifyContent: "center" }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                style={{
                  width: 3,
                  height: dim - 12,
                  borderRadius: 1.5,
                  background: accent,
                  animation: `ai-wave-bar 1s ease-in-out ${i * 0.1}s infinite`,
                  transformOrigin: "center",
                }}
              />
            ))}
          </div>
        ) : (
          <svg width={dim} height={dim} viewBox="0 0 40 40" style={{ animation: "ai-spin-slow 2.5s linear infinite" }}>
            <defs>
              <linearGradient id="ti-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="1" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <circle cx="20" cy="20" r="14" stroke="url(#ti-grad)" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="20" cy="6" r="2" fill={accent} style={{ filter: `drop-shadow(0 0 4px ${accent})` }} />
          </svg>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
          {label}
          <span style={{ color: accent, marginLeft: 2 }}>…</span>
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)", letterSpacing: "0.06em" }}>
          claude · streaming
        </span>
      </div>

    </div>
  );
}
