"use client";

import React from "react";

export interface AIRagChunkInspectorProps {
  source?: string;
  chunkIndex?: number;
  text?: string;
  embedding?: string;
  scores?: { name: string; value: number }[];
  metadata?: { key: string; value: string }[];
  accent?: string;
}

export function AIRagChunkInspector({
  source = "docs/animation/reduced-motion.md",
  chunkIndex = 14,
  text = "When users have prefers-reduced-motion: reduce set, components must skip non-essential motion. Wrap animated primitives in usePrefersReducedMotion to subscribe to the media query and re-render on flip.",
  embedding = "text-embedding-3-large",
  scores = [
    { name: "semantic",   value: 0.94 },
    { name: "keyword bm25", value: 0.71 },
    { name: "freshness",  value: 0.62 },
    { name: "authority",  value: 0.88 },
  ],
  metadata = [
    { key: "page",       value: "3" },
    { key: "tokens",     value: "142" },
    { key: "updated",    value: "May 18, 2026" },
    { key: "author",     value: "core team" },
  ],
  accent = "var(--accent)",
}: AIRagChunkInspectorProps) {
  const composite = scores.reduce((a, b) => a + b.value, 0) / scores.length;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 460,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
      role="region"
      aria-label={`Chunk inspector for ${source}`}
    >
      <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--edge)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: accent, letterSpacing: "0.06em" }}>
            chunk #{chunkIndex}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {source}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, color: accent, letterSpacing: "-0.025em", lineHeight: 1 }}>
            {(composite * 100).toFixed(0)}%
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>composite</span>
        </div>
      </div>

      <div style={{ padding: 14, background: "var(--bg)", borderBottom: "1px solid var(--edge)" }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text)", lineHeight: 1.6 }}>{text}</p>
      </div>

      <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          score breakdown
        </div>
        {scores.map((s) => (
          <div key={s.name} style={{ display: "grid", gridTemplateColumns: "120px 1fr 44px", gap: 8, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11 }}>
            <span style={{ color: "var(--text-2)" }}>{s.name}</span>
            <div style={{ height: 5, background: "var(--bg-4)", borderRadius: 2, overflow: "hidden" }}>
              <div style={{ width: `${s.value * 100}%`, height: "100%", background: accent }} />
            </div>
            <span style={{ color: "var(--text-3)", textAlign: "right" }}>{(s.value * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--edge)", background: "var(--bg)" }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>
          metadata
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 4 }}>
          {metadata.map((m) => (
            <div key={m.key} style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--font-mono)", fontSize: 10.5 }}>
              <span style={{ color: "var(--text-3)" }}>{m.key}</span>
              <span style={{ color: "var(--text)" }}>{m.value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: accent }}>
          ↳ embedded with {embedding}
        </div>
      </div>
    </div>
  );
}
