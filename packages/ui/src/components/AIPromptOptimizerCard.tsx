"use client";

import React from "react";

export interface OptimSuggestion {
  id: string;
  label: string;
  description: string;
  impact?: "low" | "med" | "high";
  applied?: boolean;
}

export interface AIPromptOptimizerCardProps {
  suggestions?: OptimSuggestion[];
  originalScore?: number;
  improvedScore?: number;
  accent?: string;
}

const DEFAULT: OptimSuggestion[] = [
  { id: "o1", label: "Add 2-shot example pair",          description: "Helps with format consistency (+12% format accuracy).", impact: "high", applied: true },
  { id: "o2", label: "Remove hedging phrases",           description: "Cuts 38 tokens without changing intent.",                impact: "med",  applied: true },
  { id: "o3", label: "Pin temperature 0.2",              description: "Reduces variance on deterministic tasks.",                 impact: "med" },
  { id: "o4", label: "Move tool list to system prompt",  description: "Avoids re-paying token cost per turn.",                     impact: "high" },
  { id: "o5", label: "Switch to Haiku for triage",       description: "Latency −60% with negligible accuracy drop.",               impact: "high" },
];

const IMPACT_COLOR = { low: "var(--text-3)", med: "var(--amber)", high: "var(--accent)" };

export function AIPromptOptimizerCard({
  suggestions = DEFAULT,
  originalScore = 0.74,
  improvedScore = 0.91,
  accent = "var(--accent)",
}: AIPromptOptimizerCardProps) {
  const delta = improvedScore - originalScore;
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
      aria-label="Prompt optimizer"
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>before</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 22, color: "var(--text-3)", fontWeight: 500, letterSpacing: "-0.02em" }}>{(originalScore * 100).toFixed(0)}%</span>
        </div>
        <span
          style={{
            color: accent,
            fontFamily: "var(--font-mono)",
            fontSize: 20,
            display: "inline-block",
            animation: "ai-glow-pulse 1.8s ease-in-out infinite",
          }}
        >
          →
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>after</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 28, color: accent, fontWeight: 500, letterSpacing: "-0.025em", textShadow: `0 0 14px ${accent}` }}>{(improvedScore * 100).toFixed(0)}%</span>
        </div>
        <div
          style={{
            marginLeft: "auto",
            padding: "4px 9px",
            borderRadius: 5,
            background: "var(--accent-soft)",
            color: accent,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 500,
            boxShadow: `0 0 10px -2px ${accent}`,
            animation: "ai-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) 200ms both, ai-glow-pulse 2.6s ease-in-out 700ms infinite",
          }}
        >
          +{(delta * 100).toFixed(0)} pts
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {suggestions.map((s, idx) => {
          const impactColor = s.impact ? IMPACT_COLOR[s.impact] : "var(--text-3)";
          return (
            <div
              key={s.id}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr auto",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px 12px",
                background: "var(--bg)",
                border: `1px solid ${s.applied ? accent : "var(--edge)"}`,
                borderRadius: 8,
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
                transition: "transform 0.18s ease, border-color 0.18s ease",
                boxShadow: s.applied ? `0 0 12px -8px ${accent}` : "none",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(2px)"; e.currentTarget.style.borderColor = accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = s.applied ? accent : "var(--edge)"; }}
            >
              <span
                style={{
                  color: s.applied ? accent : "var(--text-4)",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 14,
                  animation: s.applied ? "ai-glow-pulse 2.4s ease-in-out infinite" : "none",
                }}
                aria-hidden="true"
              >
                {s.applied ? "✓" : "○"}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 13, color: "var(--text)" }}>{s.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", lineHeight: 1.5 }}>{s.description}</span>
              </div>
              {s.impact ? (
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  padding: "2px 6px",
                  borderRadius: 3,
                  background: `color-mix(in srgb, ${impactColor} 18%, transparent)`,
                  color: impactColor,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}>
                  {s.impact}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
