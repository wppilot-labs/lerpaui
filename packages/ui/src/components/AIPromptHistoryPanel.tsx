"use client";

import React, { useState } from "react";

export interface HistoryItem {
  id: string;
  prompt: string;
  result?: string;
  timestamp: string;
  model?: string;
  starred?: boolean;
}

export interface AIPromptHistoryPanelProps {
  items?: HistoryItem[];
  accent?: string;
}

const DEFAULT_ITEMS: HistoryItem[] = [
  { id: "h1", prompt: "Summarise the v1 launch blog post", model: "opus-4.7", timestamp: "now",  starred: true,  result: "1235 components, 176 blocks…" },
  { id: "h2", prompt: "Explain the reduced-motion gating", model: "opus-4.7", timestamp: "12m",   result: "Wrap motion primitives in usePrefersReducedMotion." },
  { id: "h3", prompt: "Draft release notes for v1.1",     model: "sonnet-4.6", timestamp: "1h" },
  { id: "h4", prompt: "What's the cheapest model for refunds?", model: "haiku-4.5", timestamp: "2h" },
  { id: "h5", prompt: "Generate 5 OG image prompts",       model: "opus-4.7", timestamp: "Yesterday", starred: true },
];

export function AIPromptHistoryPanel({ items: defaultItems = DEFAULT_ITEMS, accent = "var(--accent)" }: AIPromptHistoryPanelProps) {
  const [items, setItems] = useState(defaultItems);
  const [query, setQuery] = useState("");

  const toggle = (id: string) => setItems((p) => p.map((x) => (x.id === id ? { ...x, starred: !x.starred } : x)));
  const visible = query.trim() ? items.filter((i) => i.prompt.toLowerCase().includes(query.toLowerCase())) : items;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
      role="region"
      aria-label="Prompt history"
    >
      <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--edge)", display: "flex", gap: 10, alignItems: "center" }}>
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
          history
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="filter…"
          aria-label="Filter history"
          style={{ flex: 1, height: 26, padding: "0 10px", background: "var(--bg)", border: "1px solid var(--edge-2)", borderRadius: 5, color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: 11, outline: "none" }}
        />
      </div>
      <div style={{ maxHeight: 320, overflowY: "auto" }}>
        {visible.length === 0 ? (
          <div style={{ padding: 30, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)", textAlign: "center" }}>no matches.</div>
        ) : (
          visible.map((it, idx) => (
            <div
              key={it.id}
              style={{
                padding: "10px 14px",
                borderBottom: "1px solid var(--edge)",
                display: "flex",
                flexDirection: "column",
                gap: 4,
                animation: `ai-fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 50}ms both`,
                transition: "background 0.18s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  type="button"
                  aria-label="Star"
                  onClick={() => toggle(it.id)}
                  style={{
                    background: "transparent",
                    border: 0,
                    color: it.starred ? accent : "var(--text-4)",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: 0,
                    transition: "transform 0.18s ease, color 0.18s ease",
                    animation: it.starred ? "ai-glow-pulse 2.6s ease-in-out infinite" : "none",
                  }}
                >
                  {it.starred ? "★" : "☆"}
                </button>
                <span style={{ fontSize: 13, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.prompt}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)" }}>{it.timestamp}</span>
              </div>
              {it.result ? <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", paddingLeft: 22, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>↳ {it.result}</div> : null}
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: accent, paddingLeft: 22 }}>{it.model}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
