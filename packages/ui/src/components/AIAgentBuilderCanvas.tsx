"use client";

import React, { useMemo } from "react";

export interface AIAgentNode {
  id: string;
  label: string;
  type: "trigger" | "tool" | "model" | "output";
  x: number;
  y: number;
}

export interface AIAgentBuilderCanvasProps {
  nodes?: AIAgentNode[];
  edges?: { from: string; to: string }[];
  accent?: string;
}

const TYPE_COLOR: Record<AIAgentNode["type"], string> = {
  trigger: "var(--pink)",
  tool: "var(--cyan)",
  model: "var(--accent)",
  output: "var(--violet)",
};

const DEFAULT_NODES: AIAgentNode[] = [
  { id: "n1", label: "Webhook", type: "trigger", x: 30, y: 60 },
  { id: "n2", label: "search_docs", type: "tool", x: 170, y: 30 },
  { id: "n3", label: "claude-opus", type: "model", x: 320, y: 60 },
  { id: "n4", label: "send_reply", type: "output", x: 460, y: 60 },
];
const DEFAULT_EDGES = [
  { from: "n1", to: "n2" },
  { from: "n2", to: "n3" },
  { from: "n3", to: "n4" },
];

export function AIAgentBuilderCanvas({
  nodes = DEFAULT_NODES,
  edges = DEFAULT_EDGES,
  accent = "var(--accent)",
}: AIAgentBuilderCanvasProps) {
  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
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
      aria-label="Agent workflow canvas"
    >
      <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--edge)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", display: "flex", alignItems: "center", gap: 6 }}>
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
        agent canvas · {nodes.length} nodes
      </div>
      <div style={{ position: "relative", height: 160, background: "radial-gradient(circle at 50% 50%, var(--bg-3), var(--bg-2))" }}>
        <svg width="100%" height="100%" viewBox="0 0 540 160" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }} aria-hidden="true">
          {edges.map((e, i) => {
            const from = nodeMap.get(e.from);
            const to = nodeMap.get(e.to);
            if (!from || !to) return null;
            return (
              <path
                key={i}
                d={`M${from.x + 60} ${from.y + 18} C${from.x + 100} ${from.y + 18} ${to.x - 40} ${to.y + 18} ${to.x} ${to.y + 18}`}
                stroke={accent}
                strokeWidth={1.5}
                fill="none"
                strokeDasharray="4 4"
                style={{
                  filter: `drop-shadow(0 0 4px ${accent})`,
                  animation: `ai-canvas-flow 1.6s linear ${i * 200}ms infinite`,
                }}
              />
            );
          })}
        </svg>
        {nodes.map((n, idx) => (
          <div
            key={n.id}
            style={{
              position: "absolute",
              left: n.x,
              top: n.y,
              width: 110,
              padding: "8px 10px",
              background: "var(--bg)",
              border: `1px solid ${TYPE_COLOR[n.type]}`,
              borderRadius: 8,
              boxShadow: `0 0 14px -6px ${TYPE_COLOR[n.type]}`,
              animation: `ai-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 120}ms both, ai-glow-pulse 2.8s ease-in-out ${600 + idx * 200}ms infinite`,
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 0 22px -2px ${TYPE_COLOR[n.type]}`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 14px -6px ${TYPE_COLOR[n.type]}`; }}
          >
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: TYPE_COLOR[n.type], letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>
              {n.type}
            </div>
            <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {n.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
