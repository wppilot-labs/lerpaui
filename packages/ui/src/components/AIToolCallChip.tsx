"use client";

import React, { useState } from "react";

export interface AIToolCallChipProps {
  tool?: string;
  args?: Record<string, string | number>;
  status?: "queued" | "running" | "done" | "failed";
  durationMs?: number;
  result?: string;
  accent?: string;
  expanded?: boolean;
}

const STATUS_META = {
  queued:  { color: "var(--text-3)", glyph: "○",  label: "queued" },
  running: { color: "var(--cyan)",   glyph: "▸",  label: "running" },
  done:    { color: "var(--accent)", glyph: "✓",  label: "done" },
  failed:  { color: "var(--pink)",   glyph: "✕",  label: "failed" },
};

export function AIToolCallChip({
  tool = "search_docs",
  args = { query: "reduced motion", k: 4 },
  status = "done",
  durationMs = 142,
  result = "4 chunks · top relevance 0.97",
  accent = "var(--accent)",
  expanded: defaultExpanded = false,
}: AIToolCallChipProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const meta = STATUS_META[status];

  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        background: "var(--bg-2)",
        border: `1px solid ${expanded ? accent : "var(--edge-2)"}`,
        borderRadius: 8,
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        overflow: "hidden",
        maxWidth: 380,
        transition: "border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
        boxShadow: status === "running" ? `0 0 18px -10px ${accent}` : "none",
        position: "relative",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {status === "running" ? (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: `linear-gradient(90deg, transparent 0%, ${accent} 50%, transparent 100%)`,
            backgroundSize: "200% 100%",
            opacity: 0.08,
            animation: "ai-shimmer 1.6s linear infinite",
          }}
        />
      ) : null}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto auto",
          gap: 8,
          alignItems: "center",
          padding: "6px 10px",
          background: "transparent",
          border: 0,
          color: "inherit",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            color: meta.color,
            fontWeight: 700,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            animation: status === "running" ? "pulse-dot 1.2s ease-in-out infinite" : "none",
          }}
          aria-hidden="true"
        >
          {meta.glyph}
        </span>
        <span style={{ color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {tool}<span style={{ color: "var(--text-3)" }}>()</span>
        </span>
        <span style={{ color: meta.color, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>{meta.label}</span>
        <span style={{ color: "var(--text-4)", fontSize: 10 }}>{durationMs}ms</span>
      </button>

      {expanded ? (
        <div
          style={{
            borderTop: "1px solid var(--edge)",
            padding: "8px 12px",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            animation: "ai-fade-up 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <div style={{ color: "var(--text-3)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>args</div>
          <div style={{ background: "var(--bg)", padding: "6px 9px", borderRadius: 5, border: "1px solid var(--edge)", color: "var(--text-2)", overflowX: "auto" }}>
            {`{ ${Object.entries(args).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ")} }`}
          </div>
          <div style={{ color: "var(--text-3)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>result</div>
          <div style={{ background: "var(--bg)", padding: "6px 9px", borderRadius: 5, border: "1px solid var(--edge)", color: meta.color }}>
            {meta.glyph} {result}
          </div>
        </div>
      ) : null}
    </div>
  );
}
