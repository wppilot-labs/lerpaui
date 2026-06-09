"use client";

import React, { useState } from "react";

export interface AIRagChunk {
  id: string;
  index: number;
  source: string;
  text: string;
  relevance: number;
  page?: number;
  highlighted?: boolean;
}

export interface AIRagSourceViewerProps {
  chunks?: AIRagChunk[];
  accent?: string;
  query?: string;
}

const DEFAULT_CHUNKS: AIRagChunk[] = [
  {
    id: "k1",
    index: 1,
    source: "docs/animation/reduced-motion.md",
    page: 3,
    relevance: 0.95,
    highlighted: true,
    text: "When users have prefers-reduced-motion: reduce set, components must skip non-essential motion. This includes parallax, large transforms, looping micro-interactions, and confetti.",
  },
  {
    id: "k2",
    index: 2,
    source: "packages/ui/src/animation/hooks.ts",
    relevance: 0.88,
    text: "usePrefersReducedMotion subscribes to the matchMedia query and re-renders the consumer when the OS-level preference flips.",
  },
  {
    id: "k3",
    index: 3,
    source: "docs/a11y/motion-checklist.md",
    page: 1,
    relevance: 0.71,
    text: "Decorative motion is opt-out for users; functional motion should remain (loading spinners stay, but spring-bounce decoration disappears).",
  },
];

export function AIRagSourceViewer({
  chunks = DEFAULT_CHUNKS,
  accent = "var(--accent)",
  query = "how do I gate animations on reduced-motion?",
}: AIRagSourceViewerProps) {
  const [activeId, setActiveId] = useState(chunks[0]?.id);
  const active = chunks.find((c) => c.id === activeId) ?? chunks[0];

  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        width: "100%",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
      }}
      role="region"
      aria-label="RAG source viewer"
    >
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid var(--edge)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
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
          query
        </span>
        <span style={{ fontSize: 13, color: "var(--text)" }}>{query}</span>
      </div>

      <div style={{ display: "flex", gap: 6, padding: "10px 12px", borderBottom: "1px solid var(--edge)", overflowX: "auto" }}>
        {chunks.map((c, idx) => {
          const isActive = c.id === active.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "5px 10px",
                background: isActive ? accent : "var(--bg-3)",
                color: isActive ? "var(--bg)" : "var(--text-3)",
                border: 0,
                borderRadius: 5,
                cursor: "pointer",
                fontWeight: 600,
                flexShrink: 0,
                boxShadow: isActive ? `0 0 10px -4px ${accent}` : "none",
                transition: "background 0.18s ease, color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 70}ms both`,
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.background = "var(--bg-4)"; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.background = "var(--bg-3)"; } }}
            >
              [{c.index}] {(c.relevance * 100).toFixed(0)}%
            </button>
          );
        })}
      </div>

      <div
        key={active.id}
        style={{
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          animation: "ai-fade-up 0.36s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: accent, letterSpacing: "0.06em" }}>
          {active.source}{active.page ? ` · p.${active.page}` : ""}
        </div>
        <div
          style={{
            padding: 14,
            background: active.highlighted ? `linear-gradient(90deg, var(--accent-soft), transparent 80%)` : "var(--bg)",
            border: `1px solid ${active.highlighted ? accent : "var(--edge)"}`,
            borderLeft: `3px solid ${accent}`,
            borderRadius: 6,
            fontSize: 13.5,
            color: "var(--text)",
            lineHeight: 1.6,
          }}
        >
          {active.text}
        </div>
      </div>
    </div>
  );
}
