"use client";

import React from "react";

export interface AIRetrievalChunk {
  id: string;
  source: string;
  relevance: number; // 0–1
  used?: boolean;
}

export interface AIRetrievalQualityMeterProps {
  chunks?: AIRetrievalChunk[];
  accent?: string;
  threshold?: number;
}

const DEFAULT_CHUNKS: AIRetrievalChunk[] = [
  { id: "c1", source: "docs/components/button.md",       relevance: 0.97, used: true },
  { id: "c2", source: "docs/theme-tokens.md",            relevance: 0.91, used: true },
  { id: "c3", source: "blog/lerpa-v1-release.md",     relevance: 0.74, used: true },
  { id: "c4", source: "docs/installation/cli.md",        relevance: 0.62 },
  { id: "c5", source: "changelog/v0.9.4.md",             relevance: 0.41 },
  { id: "c6", source: "tests/snapshots/button.test.tsx", relevance: 0.18 },
];

export function AIRetrievalQualityMeter({
  chunks = DEFAULT_CHUNKS,
  accent = "var(--accent)",
  threshold = 0.6,
}: AIRetrievalQualityMeterProps) {
  const usedCount = chunks.filter((c) => c.used).length;
  const avgRel = chunks.reduce((a, b) => a + b.relevance, 0) / chunks.length;
  const aboveThreshold = chunks.filter((c) => c.relevance >= threshold).length;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 460,
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
      aria-label="Retrieval quality"
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
          retrieval quality
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
          {usedCount}/{chunks.length} used
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        <Stat title="avg relevance" value={`${(avgRel * 100).toFixed(0)}%`} color={accent} />
        <Stat title={`≥ ${(threshold * 100).toFixed(0)}%`} value={`${aboveThreshold}`} color="var(--cyan)" />
        <Stat title="threshold" value={`${(threshold * 100).toFixed(0)}%`} color="var(--text-3)" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {chunks.map((c, idx) => {
          const above = c.relevance >= threshold;
          const color = c.used ? accent : above ? "var(--cyan)" : "var(--text-4)";
          return (
            <div
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 80px 40px 36px",
                gap: 10,
                alignItems: "center",
                padding: "6px 10px",
                background: c.used ? "var(--bg-3)" : "var(--bg)",
                border: `1px solid ${c.used ? "var(--edge-2)" : "var(--edge)"}`,
                borderRadius: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 50}ms both`,
                transition: "transform 0.18s ease, border-color 0.18s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(2px)"; e.currentTarget.style.borderColor = color; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = c.used ? "var(--edge-2)" : "var(--edge)"; }}
            >
              <span style={{ color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {c.source}
              </span>
              <div style={{ height: 4, background: "var(--bg-4)", borderRadius: 2, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${c.relevance * 100}%`,
                    height: "100%",
                    background: color,
                    transformOrigin: "left center",
                    animation: `ai-bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${100 + idx * 50}ms both`,
                  }}
                />
              </div>
              <span style={{ color, textAlign: "right" }}>{(c.relevance * 100).toFixed(0)}%</span>
              <span style={{ color: c.used ? accent : "var(--text-4)", textAlign: "center", fontSize: 10 }}>
                {c.used ? "✓ used" : "—"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ title, value, color }: { title: string; value: string; color: string }) {
  return (
    <div style={{ padding: "8px 10px", background: "var(--bg)", border: "1px solid var(--edge)", borderRadius: 6, display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{title}</span>
      <span style={{ fontFamily: "var(--font-sans)", fontSize: 20, fontWeight: 500, color, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</span>
    </div>
  );
}
