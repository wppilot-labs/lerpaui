"use client";

import React from "react";

export interface AnimatedBorderGradientCardProps {
  title?: string;
  description?: string;
  badge?: string;
  metric?: { label: string; value: string }[];
  accent?: string;
}

const DEFAULT_METRICS = [
  { label: "Themes", value: "12" },
  { label: "Tokens", value: "196" },
  { label: "Components", value: "1235" },
];

export function AnimatedBorderGradientCard({
  title = "Token aligned",
  description = "Every component shares the same 196 design tokens — swap themes by flipping one data attribute. Zero re-renders.",
  badge = "ENGINE",
  metric = DEFAULT_METRICS,
  accent = "var(--accent)",
}: AnimatedBorderGradientCardProps) {
  return (
    <div
      role="figure"
      aria-label={title}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 340,
        borderRadius: 16,
        fontFamily: "var(--font-sans)",
        padding: 1,
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -120,
          background: `conic-gradient(from 0deg, ${accent}, var(--cyan), var(--violet), var(--pink), ${accent})`,
          animation: "ai-spin-slow 6s linear infinite",
          filter: "blur(8px)",
          opacity: 0.85,
          zIndex: -1,
        }}
      />
      <div
        style={{
          position: "relative",
          background: "var(--bg-2)",
          borderRadius: 15,
          padding: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span
            aria-hidden="true"
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: accent,
              color: "var(--bg)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 13,
              fontWeight: 700,
              boxShadow: `0 0 14px -3px ${accent}`,
            }}
          >
            ⚙
          </span>
          <span style={{ fontSize: 14.5, color: "var(--text)", fontWeight: 600 }}>{title}</span>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              padding: "2px 7px",
              borderRadius: 4,
              background: `color-mix(in srgb, ${accent} 18%, transparent)`,
              color: accent,
              letterSpacing: "0.12em",
            }}
          >
            {badge}
          </span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{description}</p>
        <div
          style={{
            marginTop: 16,
            paddingTop: 14,
            borderTop: "1px solid var(--edge)",
            display: "grid",
            gridTemplateColumns: `repeat(${metric.length}, 1fr)`,
            gap: 10,
          }}
        >
          {metric.map((m, i) => (
            <div
              key={m.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 80}ms both`,
              }}
            >
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 18, color: "var(--text)", fontWeight: 600, letterSpacing: "-0.02em" }}>
                {m.value}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9.5,
                  color: "var(--text-3)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
