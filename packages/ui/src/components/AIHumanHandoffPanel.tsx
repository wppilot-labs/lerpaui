"use client";

import React from "react";

export interface AIHumanHandoffPanelProps {
  reason?: string;
  confidence?: number;
  customerName?: string;
  agentName?: string;
  ticketId?: string;
  context?: { role: string; text: string }[];
  accent?: string;
}

export function AIHumanHandoffPanel({
  reason = "Confidence below threshold (0.42). Customer asked about a refund older than 90 days — policy edge case.",
  confidence = 0.42,
  customerName = "Maya R.",
  agentName = "support-agent",
  ticketId = "TKT-4213",
  context = [
    { role: "user", text: "Hey, my order from January never arrived. I want a full refund." },
    { role: "agent", text: "Standard policy is 90 days — this one needs human review." },
  ],
  accent = "var(--accent)",
}: AIHumanHandoffPanelProps) {
  return (
    <div
      role="region"
      aria-label="Human handoff"
      style={{
        width: "100%",
        maxWidth: 440,
        background: "var(--bg-2)",
        border: "1px solid var(--amber)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 0 28px -12px rgba(255,195,71,0.45)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "rgba(255,195,71,0.14)",
            border: "1px solid var(--amber)",
            display: "grid",
            placeItems: "center",
            color: "var(--amber)",
            fontFamily: "var(--font-mono)",
            fontSize: 16,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          ⇨
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--amber)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
            handoff requested
          </div>
          <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>{ticketId} · {customerName}</div>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>conf <span style={{ color: "var(--pink)" }}>{(confidence * 100).toFixed(0)}%</span></div>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{reason}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {context.map((c, i) => (
          <div key={i} style={{ padding: "6px 10px", background: "var(--bg)", border: "1px solid var(--edge)", borderRadius: 6, fontSize: 12, color: "var(--text-2)", display: "flex", gap: 8 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: c.role === "user" ? accent : "var(--violet)", flexShrink: 0, fontWeight: 600 }}>{c.role === "user" ? "USER" : "AGT"}</span>
            <span style={{ lineHeight: 1.5 }}>{c.text}</span>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>from <span style={{ color: accent }}>{agentName}</span></div>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" style={{ flex: 1, height: 34, background: accent, color: "var(--bg)", border: 0, borderRadius: 7, fontWeight: 500, fontSize: 12.5, cursor: "pointer", boxShadow: `0 0 12px -4px ${accent}` }}>
          Claim ticket
        </button>
        <button type="button" style={{ height: 34, padding: "0 14px", background: "transparent", color: "var(--text-3)", border: "1px solid var(--edge-2)", borderRadius: 7, fontSize: 12.5, cursor: "pointer" }}>
          Return to AI
        </button>
      </div>
    </div>
  );
}
