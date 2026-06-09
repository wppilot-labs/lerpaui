"use client";

import React from "react";

export interface WorkflowRun {
  id: string;
  triggeredAt: string;
  triggeredBy: string;
  status: "success" | "failed" | "running";
  durationMs?: number;
  steps?: number;
}

export interface AIWorkflowRunHistoryProps {
  runs?: WorkflowRun[];
  workflowName?: string;
  accent?: string;
}

const DEFAULT_RUNS: WorkflowRun[] = [
  { id: "r142", triggeredAt: "12:14:02", triggeredBy: "PR #4213",  status: "success", durationMs: 8420, steps: 5 },
  { id: "r141", triggeredAt: "11:52:30", triggeredBy: "PR #4212",  status: "success", durationMs: 6210, steps: 5 },
  { id: "r140", triggeredAt: "11:48:11", triggeredBy: "cron 12h",  status: "running", durationMs: 1800, steps: 3 },
  { id: "r139", triggeredAt: "10:24:55", triggeredBy: "manual",    status: "failed",  durationMs: 1200, steps: 2 },
  { id: "r138", triggeredAt: "09:18:08", triggeredBy: "PR #4209",  status: "success", durationMs: 7340, steps: 5 },
];

const STATUS_META = {
  success: { color: "var(--accent)", glyph: "✓" },
  failed:  { color: "var(--pink)",   glyph: "✕" },
  running: { color: "var(--cyan)",   glyph: "▸" },
};

export function AIWorkflowRunHistory({ runs = DEFAULT_RUNS, workflowName = "review-agent", accent = "var(--accent)" }: AIWorkflowRunHistoryProps) {
  const successPct = (runs.filter((r) => r.status === "success").length / runs.length) * 100;
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 440,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
      }}
      role="region"
      aria-label={`Run history for ${workflowName}`}
    >
      <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--edge)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
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
            {workflowName}
          </div>
          <div style={{ fontSize: 13, color: "var(--text)", marginTop: 2 }}>Recent runs</div>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: accent }}>{successPct.toFixed(0)}% success</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {runs.map((r, idx) => {
          const meta = STATUS_META[r.status];
          const isRunning = r.status === "running";
          return (
            <div
              key={r.id}
              style={{
                display: "grid",
                gridTemplateColumns: "26px 1fr auto auto",
                gap: 10,
                alignItems: "center",
                padding: "10px 16px",
                borderBottom: "1px solid var(--edge)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 50}ms both`,
                transition: "background 0.18s ease, transform 0.18s ease",
                background: isRunning ? `color-mix(in srgb, ${meta.color} 6%, transparent)` : "transparent",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-3)"; e.currentTarget.style.transform = "translateX(2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = isRunning ? `color-mix(in srgb, ${meta.color} 6%, transparent)` : "transparent"; e.currentTarget.style.transform = "translateX(0)"; }}
            >
              {isRunning ? (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 2,
                    background: meta.color,
                    boxShadow: `0 0 8px ${meta.color}`,
                    animation: "ai-glow-pulse 1.4s ease-in-out infinite",
                  }}
                />
              ) : null}
              <span
                style={{
                  color: meta.color,
                  fontWeight: 700,
                  animation: isRunning ? "pulse-dot 1.1s ease-in-out infinite" : "none",
                }}
                aria-hidden="true"
              >
                {meta.glyph}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
                <span style={{ color: "var(--text)" }}>#{r.id}</span>
                <span style={{ fontSize: 10.5, color: "var(--text-3)" }}>{r.triggeredBy} · {r.triggeredAt}</span>
              </div>
              <span style={{ fontSize: 10.5, color: "var(--text-3)" }}>{r.steps ?? 0} steps</span>
              <span style={{ fontSize: 10.5, color: meta.color }}>{r.durationMs ? `${(r.durationMs / 1000).toFixed(1)}s` : "—"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
