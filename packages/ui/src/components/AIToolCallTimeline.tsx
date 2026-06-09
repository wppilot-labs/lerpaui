"use client";

import React from "react";

export interface ToolCall {
  id: string;
  tool: string;
  status: "queued" | "running" | "done" | "failed";
  durationMs?: number;
  result?: string;
}

export interface AIToolCallTimelineProps {
  calls?: ToolCall[];
  accent?: string;
  title?: string;
}

const DEFAULT_CALLS: ToolCall[] = [
  { id: "t1", tool: "search_docs", status: "done", durationMs: 142, result: "4 chunks · top 0.97" },
  { id: "t2", tool: "read_file", status: "done", durationMs: 18, result: "src/ui/Button.tsx" },
  { id: "t3", tool: "lint_project", status: "running", durationMs: 320 },
  { id: "t4", tool: "post_comment", status: "queued" },
];

const STATUS_META = {
  queued:  { color: "var(--text-3)", glyph: "○" },
  running: { color: "var(--cyan)",   glyph: "▸" },
  done:    { color: "var(--accent)", glyph: "✓" },
  failed:  { color: "var(--pink)",   glyph: "✕" },
};

export function AIToolCallTimeline({ calls = DEFAULT_CALLS, accent = "var(--accent)", title = "Tool calls" }: AIToolCallTimelineProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-mono)",
      }}
      role="region"
      aria-label={title}
    >
      <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
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
        {title} · {calls.length}
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 4 }}>
        {calls.map((c, idx) => {
          const meta = STATUS_META[c.status];
          const isRunning = c.status === "running";
          return (
            <li
              key={c.id}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr auto auto",
                gap: 10,
                alignItems: "center",
                padding: "8px 10px",
                background: "var(--bg)",
                border: `1px solid ${isRunning ? meta.color : "var(--edge)"}`,
                borderRadius: 6,
                fontSize: 12,
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
                transition: "transform 0.18s ease, border-color 0.18s ease, background 0.18s ease",
                boxShadow: isRunning ? `0 0 14px -8px ${meta.color}` : "none",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(2px)"; e.currentTarget.style.background = "var(--bg-3)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.background = "var(--bg)"; }}
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
              <span style={{ color: "var(--text)" }}>{c.tool}<span style={{ color: "var(--text-3)" }}>()</span></span>
              {c.result ? <span style={{ color: "var(--text-3)", fontSize: 10.5 }}>{c.result}</span> : <span />}
              <span style={{ color: "var(--text-4)", fontSize: 10 }}>{c.durationMs ? `${c.durationMs}ms` : "—"}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
