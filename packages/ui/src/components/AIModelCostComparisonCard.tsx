"use client";

import React from "react";

export interface ModelCostRow {
  name: string;
  provider: string;
  inputPerM: number;
  outputPerM: number;
  context?: string;
}

export interface AIModelCostComparisonCardProps {
  models?: ModelCostRow[];
  accent?: string;
  estimatedInputTokens?: number;
  estimatedOutputTokens?: number;
}

const DEFAULT_MODELS: ModelCostRow[] = [
  { name: "Claude Opus 4.7",   provider: "Anthropic", inputPerM: 15,   outputPerM: 75,   context: "1M" },
  { name: "Claude Sonnet 4.6", provider: "Anthropic", inputPerM: 3,    outputPerM: 15,   context: "200K" },
  { name: "Claude Haiku 4.5",  provider: "Anthropic", inputPerM: 0.8,  outputPerM: 4,    context: "200K" },
  { name: "GPT-5",             provider: "OpenAI",    inputPerM: 5,    outputPerM: 30,   context: "200K" },
  { name: "Gemini 2.5 Pro",    provider: "Google",    inputPerM: 3,    outputPerM: 15,   context: "2M" },
];

export function AIModelCostComparisonCard({
  models = DEFAULT_MODELS,
  accent = "var(--accent)",
  estimatedInputTokens = 8000,
  estimatedOutputTokens = 2000,
}: AIModelCostComparisonCardProps) {
  const rows = models.map((m) => {
    const cost = (estimatedInputTokens / 1_000_000) * m.inputPerM + (estimatedOutputTokens / 1_000_000) * m.outputPerM;
    return { ...m, cost };
  });
  const cheapest = rows.reduce((min, r) => (r.cost < min.cost ? r : min), rows[0]);
  const maxCost = Math.max(...rows.map((r) => r.cost));

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
      }}
      role="region"
      aria-label="Model cost comparison"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ color: accent }}>●</span> cost per request
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>
          {(estimatedInputTokens / 1000).toFixed(1)}k in · {(estimatedOutputTokens / 1000).toFixed(1)}k out
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {rows.map((r) => {
          const isCheapest = r.name === cheapest.name;
          const widthPct = (r.cost / maxCost) * 100;
          return (
            <div
              key={r.name}
              style={{
                padding: "10px 12px",
                background: "var(--bg)",
                border: `1px solid ${isCheapest ? accent : "var(--edge)"}`,
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--text)" }}>{r.name}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>· {r.provider}</span>
                  {isCheapest ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, padding: "1px 6px", borderRadius: 3, background: "var(--accent-soft)", color: accent, letterSpacing: "0.08em" }}>CHEAPEST</span> : null}
                </span>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: 500, letterSpacing: "-0.02em", color: isCheapest ? accent : "var(--text)" }}>
                  ${r.cost.toFixed(4)}
                </span>
              </div>
              <div style={{ height: 4, background: "var(--bg-4)", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${widthPct}%`, height: "100%", background: isCheapest ? accent : "var(--cyan)" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
