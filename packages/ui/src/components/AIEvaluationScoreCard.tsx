"use client";

import React from "react";

export interface ScoreCategory {
  name: string;
  score: number;
  weight?: number;
}

export interface AIEvaluationScoreCardProps {
  overall?: number;
  categories?: ScoreCategory[];
  modelName?: string;
  accent?: string;
}

const DEFAULT_CATEGORIES: ScoreCategory[] = [
  { name: "Accuracy",     score: 0.92, weight: 0.3 },
  { name: "Helpfulness",  score: 0.88, weight: 0.25 },
  { name: "Safety",       score: 0.97, weight: 0.25 },
  { name: "Latency",      score: 0.74, weight: 0.1 },
  { name: "Cost",         score: 0.81, weight: 0.1 },
];

export function AIEvaluationScoreCard({
  overall,
  categories = DEFAULT_CATEGORIES,
  modelName = "claude-opus-4-7",
  accent = "var(--accent)",
}: AIEvaluationScoreCardProps) {
  const weightedTotal = categories.reduce((a, c) => a + c.score * (c.weight ?? 1), 0);
  const weightedSum   = categories.reduce((a, c) => a + (c.weight ?? 1), 0);
  const overallScore = overall ?? weightedTotal / weightedSum;
  const grade =
    overallScore >= 0.9 ? "A" : overallScore >= 0.8 ? "B" : overallScore >= 0.7 ? "C" : "D";
  const gradeColor = overallScore >= 0.9 ? accent : overallScore >= 0.7 ? "var(--amber)" : "var(--pink)";

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 380,
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
      aria-label={`Eval score for ${modelName}`}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div
          aria-hidden="true"
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            background: `color-mix(in srgb, ${gradeColor} 18%, transparent)`,
            border: `1px solid ${gradeColor}`,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-sans)",
            fontSize: 32,
            fontWeight: 600,
            color: gradeColor,
            letterSpacing: "-0.02em",
            boxShadow: `0 0 22px -8px ${gradeColor}`,
          }}
        >
          {grade}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            overall score
          </div>
          <div style={{ fontFamily: "var(--font-sans)", fontSize: 30, fontWeight: 500, color: "var(--text)", letterSpacing: "-0.025em", lineHeight: 1 }}>
            {(overallScore * 100).toFixed(1)}<span style={{ fontSize: 16, color: gradeColor, marginLeft: 2 }}>%</span>
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{modelName}</div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {categories.map((c) => (
          <div key={c.name} style={{ display: "grid", gridTemplateColumns: "100px 1fr 40px", gap: 8, alignItems: "center", fontFamily: "var(--font-mono)", fontSize: 11 }}>
            <span style={{ color: "var(--text-2)" }}>{c.name}</span>
            <div style={{ height: 6, background: "var(--bg-4)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ width: `${c.score * 100}%`, height: "100%", background: accent }} />
            </div>
            <span style={{ color: "var(--text-3)", textAlign: "right" }}>{(c.score * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
