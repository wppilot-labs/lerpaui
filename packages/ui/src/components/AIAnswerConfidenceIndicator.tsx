"use client";

import React, { useEffect, useState } from "react";

export interface AIAnswerConfidenceIndicatorProps {
  confidence?: number; // 0–1
  accent?: string;
  label?: string;
  signals?: { name: string; weight: number }[];
}

const DEFAULT_SIGNALS = [
  { name: "source agreement", weight: 0.32 },
  { name: "retrieval relevance", weight: 0.28 },
  { name: "logit calibration", weight: 0.22 },
  { name: "tool result match", weight: 0.18 },
];

export function AIAnswerConfidenceIndicator({
  confidence = 0.86,
  accent = "var(--accent)",
  label = "Answer confidence",
  signals = DEFAULT_SIGNALS,
}: AIAnswerConfidenceIndicatorProps) {
  const pct = Math.max(0, Math.min(1, confidence));
  const level = pct >= 0.8 ? "high" : pct >= 0.5 ? "medium" : "low";
  const color = level === "high" ? accent : level === "medium" ? "var(--amber)" : "var(--pink)";

  const circumference = 2 * Math.PI * 36;
  const dash = circumference * pct;
  const [animatedDash, setAnimatedDash] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimatedDash(dash));
    return () => cancelAnimationFrame(id);
  }, [dash]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 320,
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
      aria-label={label}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
          <svg viewBox="0 0 88 88" width={88} height={88} aria-hidden="true">
            <circle cx="44" cy="44" r="36" fill="none" stroke="var(--bg-4)" strokeWidth="6" />
            <circle
              cx="44"
              cy="44"
              r="36"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${animatedDash} ${circumference}`}
              strokeDashoffset={0}
              transform="rotate(-90 44 44)"
              style={{
                filter: `drop-shadow(0 0 6px ${color})`,
                transition: "stroke-dasharray 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0,
            }}
          >
            <span style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 600, color, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {(pct * 100).toFixed(0)}%
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {level}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 6px ${color}`,
                animation: "pulse-dot 1.8s ease-in-out infinite",
              }}
            />
            {label}
          </span>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-2)", lineHeight: 1.5 }}>
            {level === "high"
              ? "Strong signal — backed by sources and consistent retrieval."
              : level === "medium"
              ? "Moderate signal — verify with one more source if critical."
              : "Weak signal — show the user a warning, request human review."}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11 }}>
        <span style={{ color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>signals</span>
        {signals.map((s, idx) => (
          <div
            key={s.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${200 + idx * 80}ms both`,
            }}
          >
            <span style={{ color: "var(--text-2)", flex: 1 }}>{s.name}</span>
            <div style={{ width: 80, height: 4, background: "var(--bg-4)", borderRadius: 2, overflow: "hidden" }}>
              <div
                style={{
                  width: `${s.weight * 100}%`,
                  height: "100%",
                  background: color,
                  transformOrigin: "left center",
                  animation: `ai-bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${260 + idx * 80}ms both`,
                }}
              />
            </div>
            <span style={{ color: "var(--text-3)", width: 32, textAlign: "right" }}>{(s.weight * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
