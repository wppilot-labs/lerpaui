"use client";

import React from "react";

export interface AITokenUsageMeterProps {
  inputTokens?: number;
  outputTokens?: number;
  cachedTokens?: number;
  limit?: number;
  accent?: string;
}

export function AITokenUsageMeter({
  inputTokens = 14_320,
  outputTokens = 6_240,
  cachedTokens = 3_180,
  limit = 200_000,
  accent = "var(--accent)",
}: AITokenUsageMeterProps) {
  const total = inputTokens + outputTokens;
  const pct = Math.min(100, (total / limit) * 100);
  const inPct = (inputTokens / limit) * 100;
  const cachedPct = (cachedTokens / limit) * 100;
  const outPct = (outputTokens / limit) * 100;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
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
      aria-label="Token usage"
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
          tokens
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
          <span style={{ color: "var(--text)", fontWeight: 500 }}>{total.toLocaleString()}</span> / {limit.toLocaleString()}
        </span>
      </div>

      <div style={{ position: "relative", height: 10, background: "var(--bg-4)", borderRadius: 5, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${inPct}%`,
            background: "var(--cyan)",
            transformOrigin: "left center",
            animation: "ai-bar-grow 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${inPct}%`,
            top: 0,
            bottom: 0,
            width: `${cachedPct}%`,
            background: "var(--violet)",
            transformOrigin: "left center",
            animation: "ai-bar-grow 0.7s cubic-bezier(0.16, 1, 0.3, 1) 120ms both",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: `${inPct + cachedPct}%`,
            top: 0,
            bottom: 0,
            width: `${outPct}%`,
            background: accent,
            boxShadow: `0 0 8px ${accent}`,
            transformOrigin: "left center",
            animation: "ai-bar-grow 0.7s cubic-bezier(0.16, 1, 0.3, 1) 240ms both",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            animation: "ai-shimmer 2.6s linear infinite",
            mixBlendMode: "overlay",
            opacity: 0.6,
            pointerEvents: "none",
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11 }}>
        <Legend color="var(--cyan)" label="input" value={inputTokens} />
        <Legend color="var(--violet)" label="cached" value={cachedTokens} />
        <Legend color={accent} label="output" value={outputTokens} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
        <span>usage</span>
        <span style={{ color: pct > 80 ? "var(--pink)" : accent, fontWeight: 500 }}>{pct.toFixed(1)}%</span>
      </div>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: "var(--text-3)" }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} aria-hidden="true" />
        {label}
      </span>
      <span style={{ color: "var(--text)" }}>{value.toLocaleString()}</span>
    </div>
  );
}
