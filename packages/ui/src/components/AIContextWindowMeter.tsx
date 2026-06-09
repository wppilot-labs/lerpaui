"use client";

import React from "react";

export interface AIContextWindowMeterProps {
  used?: number;
  limit?: number;
  accent?: string;
  segments?: { label: string; tokens: number; color?: string }[];
}

const DEFAULT_SEGMENTS = [
  { label: "system",      tokens: 2_400,  color: "var(--text-3)" },
  { label: "history",     tokens: 18_600, color: "var(--cyan)" },
  { label: "tools",       tokens: 4_200,  color: "var(--violet)" },
  { label: "current",     tokens: 6_400,  color: "var(--accent)" },
];

export function AIContextWindowMeter({
  used,
  limit = 200_000,
  accent = "var(--accent)",
  segments = DEFAULT_SEGMENTS,
}: AIContextWindowMeterProps) {
  const totalUsed = used ?? segments.reduce((acc, s) => acc + s.tokens, 0);
  const pct = Math.min(100, (totalUsed / limit) * 100);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 440,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
      role="region"
      aria-label="Context window usage"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            aria-hidden="true"
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: accent,
              boxShadow: `0 0 6px ${accent}`,
              animation: "pulse-dot 1.8s ease-in-out infinite",
            }}
          />
          context window
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
          <span style={{ color: "var(--text)", fontWeight: 500 }}>{(totalUsed / 1000).toFixed(1)}k</span> / {(limit / 1000).toFixed(0)}k
        </span>
      </div>

      {/* segmented bar */}
      <div style={{ display: "flex", height: 12, background: "var(--bg-4)", borderRadius: 6, overflow: "hidden", position: "relative" }}>
        {segments.map((s, i) => {
          const w = (s.tokens / limit) * 100;
          return (
            <div
              key={i}
              style={{
                width: `${w}%`,
                background: s.color || accent,
                borderRight: i < segments.length - 1 ? "1px solid var(--bg)" : "none",
                transformOrigin: "left center",
                animation: `ai-bar-grow 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${i * 90}ms both`,
              }}
              title={`${s.label} · ${s.tokens.toLocaleString()}`}
              aria-label={`${s.label}: ${s.tokens} tokens`}
            />
          );
        })}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation: "ai-shimmer 3s linear infinite",
            mixBlendMode: "overlay",
            opacity: 0.55,
            pointerEvents: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11 }}>
        {segments.map((s, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${260 + i * 70}ms both`,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color || accent }} aria-hidden="true" />
            <span style={{ color: "var(--text-3)", flex: 1 }}>{s.label}</span>
            <span style={{ color: "var(--text-2)" }}>{s.tokens.toLocaleString()}</span>
            <span style={{ color: "var(--text-4)", width: 48, textAlign: "right" }}>{((s.tokens / limit) * 100).toFixed(1)}%</span>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "6px 10px",
          background: "var(--bg)",
          border: "1px solid var(--edge)",
          borderRadius: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: pct > 85 ? "var(--pink)" : pct > 65 ? "var(--amber)" : accent,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{pct > 85 ? "⚠ near limit" : pct > 65 ? "▸ healthy" : "✓ plenty of room"}</span>
        <span>{pct.toFixed(1)}%</span>
      </div>
    </div>
  );
}
