"use client";

import React, { useState } from "react";

export interface AgentPermission {
  id: string;
  label: string;
  scope: string;
  granted: boolean;
  risk?: "low" | "med" | "high";
}

export interface AIAgentPermissionPanelProps {
  permissions?: AgentPermission[];
  agentName?: string;
  accent?: string;
  onToggle?: (id: string, granted: boolean) => void;
}

const DEFAULT: AgentPermission[] = [
  { id: "p1", label: "Read repo files",        scope: "fs:read",      granted: true,  risk: "low" },
  { id: "p2", label: "Run shell commands",     scope: "shell:exec",   granted: true,  risk: "high" },
  { id: "p3", label: "Edit files in src/",     scope: "fs:write",     granted: true,  risk: "med" },
  { id: "p4", label: "Open PRs on your behalf", scope: "git:push",    granted: false, risk: "high" },
  { id: "p5", label: "Send webhooks externally", scope: "net:fetch",  granted: false, risk: "med" },
];

const RISK_COLOR = { low: "var(--accent)", med: "var(--amber)", high: "var(--pink)" };

export function AIAgentPermissionPanel({
  permissions = DEFAULT,
  agentName = "code-reviewer agent",
  accent = "var(--accent)",
  onToggle,
}: AIAgentPermissionPanelProps) {
  const [state, setState] = useState(permissions);

  const toggle = (id: string) => {
    setState((p) => p.map((x) => x.id === id ? { ...x, granted: !x.granted } : x));
    const next = state.find((x) => x.id === id);
    if (next) onToggle?.(id, !next.granted);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 400,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      role="region"
      aria-label="Agent permissions"
    >
      <div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ color: accent }}>●</span> permissions
        </div>
        <div style={{ fontSize: 14, color: "var(--text)", marginTop: 2, fontWeight: 500 }}>{agentName}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {state.map((p) => (
          <div
            key={p.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 10,
              alignItems: "center",
              padding: "10px 12px",
              background: "var(--bg)",
              border: `1px solid ${p.granted ? "var(--edge-2)" : "var(--edge)"}`,
              borderRadius: 8,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, color: "var(--text)" }}>{p.label}</span>
                {p.risk ? (
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    padding: "1px 5px",
                    borderRadius: 3,
                    background: `color-mix(in srgb, ${RISK_COLOR[p.risk]} 18%, transparent)`,
                    color: RISK_COLOR[p.risk],
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}>
                    {p.risk}
                  </span>
                ) : null}
              </div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{p.scope}</span>
            </div>
            <button
              type="button"
              onClick={() => toggle(p.id)}
              role="switch"
              aria-checked={p.granted}
              aria-label={`${p.granted ? "Revoke" : "Grant"} ${p.label}`}
              style={{
                width: 36,
                height: 20,
                borderRadius: 999,
                background: p.granted ? accent : "var(--bg-4)",
                border: `1px solid ${p.granted ? accent : "var(--edge-2)"}`,
                position: "relative",
                cursor: "pointer",
                boxShadow: p.granted ? `0 0 12px -4px ${accent}` : "none",
                transition: "all 0.2s",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 2,
                  left: p.granted ? 18 : 2,
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: p.granted ? "var(--bg)" : "var(--text-3)",
                  transition: "all 0.2s cubic-bezier(0.2,0.8,0.2,1)",
                }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
