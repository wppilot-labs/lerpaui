"use client";

import React, { useState } from "react";

export interface RagContextPill {
  id: string;
  index: number;
  source: string;
  preview?: string;
  relevance?: number;
}

export interface AIRagContextPillsProps {
  pills?: RagContextPill[];
  accent?: string;
  inline?: boolean;
}

const DEFAULT_PILLS: RagContextPill[] = [
  { id: "p1", index: 1, source: "docs/theme-tokens.md",       preview: "Tokens live as CSS variables…",       relevance: 0.97 },
  { id: "p2", index: 2, source: "docs/motion/reduced.md",     preview: "Use usePrefersReducedMotion…",        relevance: 0.91 },
  { id: "p3", index: 3, source: "packages/ui/animation.ts",   preview: "matchMedia('(prefers-reduced…')",     relevance: 0.74 },
  { id: "p4", index: 4, source: "blog/lerpa-v1.md",        preview: "1235 components ship in v1…",           relevance: 0.62 },
];

export function AIRagContextPills({
  pills = DEFAULT_PILLS,
  accent = "var(--accent)",
  inline = false,
}: AIRagContextPillsProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        padding: inline ? 0 : 12,
        background: inline ? "transparent" : "var(--bg-2)",
        border: inline ? "none" : "1px solid var(--edge)",
        borderRadius: inline ? 0 : 10,
        fontFamily: "var(--font-mono)",
        position: "relative",
        maxWidth: 480,
      }}
      role="list"
      aria-label="Retrieved context"
    >
      {pills.map((p, idx) => {
        const isHov = hovered === p.id;
        return (
          <div
            key={p.id}
            style={{
              position: "relative",
              animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
            }}
          >
            <button
              type="button"
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(p.id)}
              onBlur={() => setHovered(null)}
              aria-describedby={isHov ? `pill-tip-${p.id}` : undefined}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 9px",
                background: isHov ? "var(--accent-soft)" : "var(--bg)",
                border: `1px solid ${isHov ? accent : "var(--edge-2)"}`,
                borderRadius: 4,
                fontSize: 11,
                color: "var(--text-2)",
                cursor: "pointer",
                transition: "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
                transform: isHov ? "translateY(-1px)" : "translateY(0)",
                boxShadow: isHov ? `0 6px 18px -10px ${accent}` : "none",
              }}
            >
              <span
                style={{
                  color: accent,
                  fontWeight: 600,
                  animation: idx === 0 ? "ai-glow-pulse 2.4s ease-in-out infinite" : "none",
                }}
              >
                [{p.index}]
              </span>
              <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.source}</span>
              {p.relevance ? (
                <span style={{ color: "var(--text-4)", fontSize: 10 }}>{(p.relevance * 100).toFixed(0)}%</span>
              ) : null}
            </button>
            {isHov && p.preview ? (
              <div
                id={`pill-tip-${p.id}`}
                role="tooltip"
                style={{
                  position: "absolute",
                  bottom: "calc(100% + 6px)",
                  left: 0,
                  zIndex: 20,
                  width: 240,
                  padding: 10,
                  background: "var(--bg-3)",
                  border: `1px solid ${accent}`,
                  borderRadius: 8,
                  fontFamily: "var(--font-sans)",
                  fontSize: 12,
                  color: "var(--text-2)",
                  lineHeight: 1.5,
                  boxShadow: `0 18px 40px -16px rgba(0,0,0,0.6), 0 0 24px -8px ${accent}`,
                  animation: "ai-fade-up 0.22s cubic-bezier(0.16, 1, 0.3, 1) both",
                }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: accent, marginBottom: 4, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  [{p.index}] · {(p.relevance ?? 0) * 100 | 0}%
                </div>
                {p.preview}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
