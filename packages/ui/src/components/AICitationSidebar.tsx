"use client";

import React, { useState } from "react";

export interface AICitation {
  id: string;
  index: number;
  title: string;
  url?: string;
  snippet?: string;
  source?: string;
  relevance?: number;
}

export interface AICitationSidebarProps {
  citations?: AICitation[];
  accent?: string;
  defaultActiveId?: string;
}

const DEFAULT_CITATIONS: AICitation[] = [
  { id: "1", index: 1, title: "Component-driven design tokens",                 source: "docs/theme-tokens.md",      snippet: "Tokens live as CSS variables and swap by flipping a data attribute at runtime.", relevance: 0.97 },
  { id: "2", index: 2, title: "Reduced motion baseline",                        source: "docs/a11y/motion.md",       snippet: "Wrap motion primitives in usePrefersReducedMotion to skip non-essential animation.", relevance: 0.91 },
  { id: "3", index: 3, title: "Lerpa UI v1.0 release notes",                    source: "blog/v1-launch.md",         snippet: "1235 components, 176 blocks, 6 themes — all shadcn-CLI installable.", relevance: 0.74 },
  { id: "4", index: 4, title: "Tailwind v4 @theme block reference",             source: "docs/tailwind-v4.md",       snippet: "@theme replaces tailwind.config — colors and tokens declared at root level.", relevance: 0.62 },
];

export function AICitationSidebar({
  citations = DEFAULT_CITATIONS,
  accent = "var(--accent)",
  defaultActiveId = "1",
}: AICitationSidebarProps) {
  const [activeId, setActiveId] = useState(defaultActiveId);
  const active = citations.find((c) => c.id === activeId) ?? citations[0];

  return (
    <aside
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        width: 320,
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      aria-label="Citations"
    >
      <div
        style={{
          padding: "12px 14px",
          borderBottom: "1px solid var(--edge)",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
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
        sources · {citations.length}
      </div>

      <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 4 }}>
        {citations.map((c, idx) => {
          const isActive = c.id === active.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveId(c.id)}
              aria-current={isActive}
              style={{
                display: "grid",
                gridTemplateColumns: "22px 1fr auto",
                gap: 8,
                alignItems: "center",
                padding: "8px 10px",
                background: isActive ? "var(--bg-3)" : "transparent",
                border: isActive ? `1px solid ${accent}` : "1px solid transparent",
                borderRadius: 6,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease",
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
                boxShadow: isActive ? `0 0 14px -8px ${accent}` : "none",
              }}
              onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.transform = "translateX(2px)"; } }}
              onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateX(0)"; } }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  display: "grid",
                  placeItems: "center",
                  background: isActive ? accent : "var(--bg-3)",
                  color: isActive ? "var(--bg)" : "var(--text-3)",
                  fontWeight: 600,
                  animation: isActive ? "ai-glow-pulse 2.4s ease-in-out infinite" : "none",
                }}
              >
                [{c.index}]
              </span>
              <span style={{ fontSize: 12, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {c.title}
              </span>
              {c.relevance ? (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: isActive ? accent : "var(--text-4)" }}>
                  {(c.relevance * 100).toFixed(0)}%
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div
        key={active.id}
        style={{
          margin: 10,
          marginTop: 0,
          padding: 12,
          background: "var(--bg)",
          border: "1px solid var(--edge)",
          borderRadius: 8,
          fontSize: 12,
          color: "var(--text-2)",
          lineHeight: 1.55,
          animation: "ai-fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: accent, marginBottom: 6, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          [{active.index}] {active.source}
        </div>
        <div style={{ color: "var(--text)", fontWeight: 500, marginBottom: 6 }}>{active.title}</div>
        {active.snippet ? <div>{active.snippet}</div> : null}
      </div>
    </aside>
  );
}
