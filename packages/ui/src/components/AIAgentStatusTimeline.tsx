"use client";

import React from "react";

export interface AgentEvent {
  id: string;
  timestamp: string;
  label: string;
  status: "ok" | "running" | "warn" | "fail";
  detail?: string;
}

export interface AIAgentStatusTimelineProps {
  events?: AgentEvent[];
  agentName?: string;
  accent?: string;
}

const DEFAULT_EVENTS: AgentEvent[] = [
  { id: "e1", timestamp: "12:14:02", status: "ok",      label: "Webhook received",        detail: "PR #4213 opened" },
  { id: "e2", timestamp: "12:14:03", status: "ok",      label: "Cloned repo to /tmp/r",   detail: "142 ms · 9.4 MB" },
  { id: "e3", timestamp: "12:14:05", status: "running", label: "Running lerpa lint",   detail: "checking 18 files…" },
  { id: "e4", timestamp: "12:14:07", status: "warn",    label: "2 a11y warnings",         detail: "label-has-associated-control" },
  { id: "e5", timestamp: "12:14:09", status: "ok",      label: "Posted review comment",   detail: "GitHub API · 201 Created" },
];

const STATUS_META = {
  ok:      { color: "var(--accent)", glyph: "✓" },
  running: { color: "var(--cyan)",   glyph: "▸" },
  warn:    { color: "var(--amber)",  glyph: "▲" },
  fail:    { color: "var(--pink)",   glyph: "✕" },
};

export function AIAgentStatusTimeline({
  events = DEFAULT_EVENTS,
  agentName = "review-agent",
  accent = "var(--accent)",
}: AIAgentStatusTimelineProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 440,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
      }}
      role="region"
      aria-label="Agent status timeline"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ color: accent }}>●</span> timeline · {agentName}
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{events.length} events</div>
      </div>

      <ol style={{ position: "relative", listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <div aria-hidden="true" style={{ position: "absolute", left: 11, top: 8, bottom: 8, width: 2, background: "var(--bg-4)", zIndex: 0 }} />
        {events.map((e) => {
          const meta = STATUS_META[e.status];
          return (
            <li key={e.id} style={{ display: "grid", gridTemplateColumns: "24px 1fr auto", gap: 10, alignItems: "flex-start", position: "relative", zIndex: 1 }}>
              <span
                aria-hidden="true"
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "var(--bg)",
                  border: `2px solid ${meta.color}`,
                  display: "grid",
                  placeItems: "center",
                  color: meta.color,
                  fontSize: 11,
                  fontWeight: 700,
                  boxShadow: e.status === "running" ? `0 0 12px -2px ${meta.color}` : "none",
                  animation: e.status === "running" ? "pulse-dot 1.4s ease-in-out infinite" : "none",
                }}
              >
                {meta.glyph}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{e.label}</span>
                {e.detail ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: meta.color }}>{e.detail}</span> : null}
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)" }}>{e.timestamp}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
