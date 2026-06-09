"use client";

import React, { useState } from "react";

export interface WorkflowStep {
  id: string;
  label: string;
  type: "trigger" | "if" | "model" | "tool" | "output";
  description?: string;
}

export interface AIAgentWorkflowBuilderProps {
  steps?: WorkflowStep[];
  accent?: string;
}

const DEFAULT_STEPS: WorkflowStep[] = [
  { id: "s1", type: "trigger", label: "On PR opened",            description: "GitHub webhook" },
  { id: "s2", type: "if",      label: "If diff > 200 lines",     description: "Else: skip" },
  { id: "s3", type: "tool",    label: "Run code-review tool",    description: "Reads diff + linter" },
  { id: "s4", type: "model",   label: "Summarise with claude",   description: "Opus 4.7" },
  { id: "s5", type: "output",  label: "Post comment on PR",      description: "Inline review" },
];

const TYPE_META = {
  trigger: { color: "var(--pink)",   glyph: "⚡" },
  if:      { color: "var(--amber)",  glyph: "◆" },
  tool:    { color: "var(--cyan)",   glyph: "▸" },
  model:   { color: "var(--accent)", glyph: "∗" },
  output:  { color: "var(--violet)", glyph: "↗" },
};

export function AIAgentWorkflowBuilder({
  steps: defaultSteps = DEFAULT_STEPS,
  accent = "var(--accent)",
}: AIAgentWorkflowBuilderProps) {
  const [steps, setSteps] = useState(defaultSteps);

  const move = (idx: number, dir: -1 | 1) => {
    const next = idx + dir;
    if (next < 0 || next >= steps.length) return;
    const updated = [...steps];
    [updated[idx], updated[next]] = [updated[next], updated[idx]];
    setSteps(updated);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 16,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
      role="region"
      aria-label="Workflow builder"
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", padding: "0 4px", marginBottom: 4 }}>
        <span style={{ color: accent }}>●</span> workflow · {steps.length} steps
      </div>
      {steps.map((s, idx) => {
        const meta = TYPE_META[s.type];
        return (
          <div key={s.id} style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "30px 1fr auto",
                gap: 10,
                alignItems: "center",
                padding: 10,
                background: "var(--bg)",
                border: `1px solid ${meta.color}`,
                borderLeft: `3px solid ${meta.color}`,
                borderRadius: 8,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: `color-mix(in srgb, ${meta.color} 18%, transparent)`,
                  display: "grid",
                  placeItems: "center",
                  color: meta.color,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                {meta.glyph}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{s.label}</span>
                {s.description ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>{s.description}</span> : null}
              </div>
              <div style={{ display: "flex", gap: 4 }}>
                <button type="button" aria-label="Move up" onClick={() => move(idx, -1)} style={miniBtn(idx === 0)}>↑</button>
                <button type="button" aria-label="Move down" onClick={() => move(idx, 1)} style={miniBtn(idx === steps.length - 1)}>↓</button>
              </div>
            </div>
            {idx < steps.length - 1 ? (
              <div aria-hidden="true" style={{ height: 12, width: 2, background: meta.color, margin: "0 auto", opacity: 0.4 }} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function miniBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 24,
    height: 24,
    border: "1px solid var(--edge-2)",
    background: "var(--bg-3)",
    color: disabled ? "var(--text-5)" : "var(--text-3)",
    borderRadius: 4,
    fontSize: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    display: "grid",
    placeItems: "center",
  };
}
