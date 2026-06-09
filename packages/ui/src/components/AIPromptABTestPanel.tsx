"use client";

import React, { useState } from "react";

export interface ABVariant {
  id: string;
  label: string;
  body: string;
  conversions?: number;
  impressions?: number;
}

export interface AIPromptABTestPanelProps {
  variants?: ABVariant[];
  accent?: string;
}

const DEFAULT_VARIANTS: ABVariant[] = [
  { id: "a", label: "Variant A · neutral", body: "You are a helpful assistant. Be concise.", conversions: 124, impressions: 482 },
  { id: "b", label: "Variant B · friendly", body: "You are a warm, friendly helper. Lead with empathy then answer.", conversions: 168, impressions: 478 },
];

export function AIPromptABTestPanel({ variants = DEFAULT_VARIANTS, accent = "var(--accent)" }: AIPromptABTestPanelProps) {
  const [winner] = useState<string>(() => {
    return variants
      .map((v) => ({ id: v.id, rate: v.conversions! / Math.max(1, v.impressions!) }))
      .sort((a, b) => b.rate - a.rate)[0].id;
  });

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
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
      aria-label="A/B test panel"
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
            animation: "pulse-dot 1.4s ease-in-out infinite",
          }}
        />
        A/B test · <span style={{ color: accent, fontWeight: 600 }}>live</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {variants.map((v, idx) => {
          const rate = (v.conversions ?? 0) / Math.max(1, v.impressions ?? 1);
          const isWinner = v.id === winner;
          return (
            <div
              key={v.id}
              style={{
                padding: 12,
                background: "var(--bg)",
                border: `1px solid ${isWinner ? accent : "var(--edge)"}`,
                borderRadius: 10,
                boxShadow: isWinner ? `0 0 16px -6px ${accent}` : "none",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                animation: `ai-fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 90}ms both`,
                transition: "transform 0.18s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
                  {v.label}
                  {isWinner ? (
                    <span
                      style={{
                        marginLeft: 8,
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: accent,
                        padding: "1px 6px",
                        background: "var(--accent-soft)",
                        borderRadius: 3,
                        boxShadow: `0 0 8px -2px ${accent}`,
                        animation: "ai-glow-pulse 2s ease-in-out infinite",
                        display: "inline-block",
                      }}
                    >
                      WIN
                    </span>
                  ) : null}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: 500, color: isWinner ? accent : "var(--text)", letterSpacing: "-0.02em" }}>
                  {(rate * 100).toFixed(1)}%
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", lineHeight: 1.5 }}>
                {v.body}
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-4)", display: "flex", gap: 12 }}>
                <span>{v.conversions} conv</span>
                <span>{v.impressions} imp</span>
              </div>
              <div style={{ height: 4, background: "var(--bg-4)", borderRadius: 2, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${rate * 200}%`,
                    maxWidth: "100%",
                    height: "100%",
                    background: isWinner ? accent : "var(--cyan)",
                    transformOrigin: "left center",
                    animation: `ai-bar-grow 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${200 + idx * 90}ms both`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
