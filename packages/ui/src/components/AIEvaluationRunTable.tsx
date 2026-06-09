"use client";

import React from "react";

export interface EvalRow {
  id: string;
  test: string;
  expected: string;
  passed: boolean;
  score: number;
  latencyMs?: number;
}

export interface AIEvaluationRunTableProps {
  rows?: EvalRow[];
  accent?: string;
  suite?: string;
}

const DEFAULT_ROWS: EvalRow[] = [
  { id: "r1", test: "refund_intent",         expected: "label:refund",       passed: true,  score: 0.94, latencyMs: 412 },
  { id: "r2", test: "summarise_short_doc",   expected: "rouge-l > 0.55",     passed: true,  score: 0.71, latencyMs: 920 },
  { id: "r3", test: "json_schema_strict",    expected: "valid JSON",         passed: true,  score: 1.00, latencyMs: 380 },
  { id: "r4", test: "code_explain_python",   expected: "mentions list comp", passed: false, score: 0.42, latencyMs: 1820 },
  { id: "r5", test: "multi_turn_memory",     expected: "recalls name",       passed: true,  score: 0.88, latencyMs: 1140 },
];

export function AIEvaluationRunTable({ rows = DEFAULT_ROWS, accent = "var(--accent)", suite = "production-evals" }: AIEvaluationRunTableProps) {
  const passed = rows.filter((r) => r.passed).length;
  const avg = rows.reduce((a, b) => a + b.score, 0) / rows.length;
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 540,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
      role="region"
      aria-label={`Eval results: ${suite}`}
    >
      <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--edge)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
            <span style={{ color: accent }}>●</span> eval · {suite}
          </div>
          <div style={{ fontSize: 13, color: "var(--text)", marginTop: 2 }}>{rows.length} tests</div>
        </div>
        <div style={{ display: "flex", gap: 14, fontFamily: "var(--font-mono)", fontSize: 11 }}>
          <span><span style={{ color: accent }}>pass</span> {passed}/{rows.length}</span>
          <span><span style={{ color: "var(--cyan)" }}>avg</span> {(avg * 100).toFixed(0)}%</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "26px 1.4fr 1fr 64px 60px", padding: "8px 16px", borderBottom: "1px solid var(--edge)", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", gap: 10 }}>
        <span />
        <span>test</span>
        <span>expected</span>
        <span style={{ textAlign: "right" }}>score</span>
        <span style={{ textAlign: "right" }}>ms</span>
      </div>
      {rows.map((r) => (
        <div
          key={r.id}
          style={{
            display: "grid",
            gridTemplateColumns: "26px 1.4fr 1fr 64px 60px",
            padding: "10px 16px",
            borderBottom: "1px solid var(--edge)",
            gap: 10,
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          <span style={{ color: r.passed ? accent : "var(--pink)", fontWeight: 700 }} aria-hidden="true">{r.passed ? "✓" : "✕"}</span>
          <span style={{ color: "var(--text)" }}>{r.test}</span>
          <span style={{ color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.expected}</span>
          <span style={{ textAlign: "right", color: r.passed ? accent : "var(--pink)" }}>{(r.score * 100).toFixed(0)}%</span>
          <span style={{ textAlign: "right", color: "var(--text-3)" }}>{r.latencyMs ?? "—"}</span>
        </div>
      ))}
    </div>
  );
}
