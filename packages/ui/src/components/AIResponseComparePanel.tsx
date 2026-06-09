"use client";

import React, { useState } from "react";

export interface CompareResponse {
  id: string;
  model: string;
  content: string;
  latencyMs?: number;
  tokens?: number;
  cost?: string;
}

export interface AIResponseComparePanelProps {
  responses?: CompareResponse[];
  prompt?: string;
  accent?: string;
}

const DEFAULT_RESPONSES: CompareResponse[] = [
  {
    id: "a",
    model: "claude-opus-4-7",
    content: "Lerpa UI ships 1235 token-aligned components. Each file is owned by your repo so theming swaps instantly via a single data attribute.",
    latencyMs: 880,
    tokens: 96,
    cost: "$0.0042",
  },
  {
    id: "b",
    model: "gpt-5",
    content: "Lerpa UI is a copy-paste React component library — 1235 components, 176 blocks, 6 themes. The CLI installs files directly into src/ui/.",
    latencyMs: 640,
    tokens: 88,
    cost: "$0.0028",
  },
];

export function AIResponseComparePanel({
  responses = DEFAULT_RESPONSES,
  prompt = "Describe Lerpa UI in two sentences.",
  accent = "var(--accent)",
}: AIResponseComparePanelProps) {
  const [winner, setWinner] = useState<string | null>(null);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 16,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      role="region"
      aria-label="Response comparison"
    >
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ color: accent }}>●</span> prompt
        </div>
        <div style={{ fontSize: 13, color: "var(--text)", marginTop: 4 }}>{prompt}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {responses.slice(0, 2).map((r, idx) => {
          const isWinner = winner === r.id;
          return (
            <button
              type="button"
              key={r.id}
              onClick={() => setWinner((w) => (w === r.id ? null : r.id))}
              aria-pressed={isWinner}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                padding: 12,
                background: "var(--bg)",
                border: `1px solid ${isWinner ? accent : "var(--edge)"}`,
                borderRadius: 10,
                cursor: "pointer",
                textAlign: "left",
                boxShadow: isWinner ? `0 0 16px -6px ${accent}` : "none",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "2px 6px", borderRadius: 3, background: "var(--bg-3)", color: "var(--text-2)" }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: isWinner ? accent : "var(--text-3)" }}>
                  {r.model}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--text)", lineHeight: 1.5 }}>{r.content}</p>
              <div style={{ display: "flex", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", flexWrap: "wrap" }}>
                {r.latencyMs ? <span>{r.latencyMs}ms</span> : null}
                {r.tokens ? <span>{r.tokens} tok</span> : null}
                {r.cost ? <span style={{ color: accent }}>{r.cost}</span> : null}
              </div>
              {isWinner ? (
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: accent, letterSpacing: "0.12em", textTransform: "uppercase", marginTop: -2 }}>
                  ✓ winner
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
