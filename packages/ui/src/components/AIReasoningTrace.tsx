"use client";

import React, { useState } from "react";

export interface AIReasoningStep {
  id: string;
  label: string;
  detail?: string;
  duration?: string;
}

export interface AIReasoningTraceProps {
  steps?: AIReasoningStep[];
  accent?: string;
  collapsedByDefault?: boolean;
  totalDuration?: string;
}

const DEFAULT_STEPS: AIReasoningStep[] = [
  { id: "s1", label: "Parse user intent", detail: "User wants pricing page with monthly toggle. Two tiers expected.", duration: "12ms" },
  { id: "s2", label: "Retrieve relevant components", detail: "Matched `PricingTiered`, `BillingPlanLimitAlert`, `ToggleSwitch`.", duration: "84ms" },
  { id: "s3", label: "Verify token alignment", detail: "All 3 components share `--accent` and `--bg-2`. Theme-safe.", duration: "6ms" },
  { id: "s4", label: "Compose final response", detail: "Drafted snippet with mount transition and reduced-motion fallback.", duration: "143ms" },
];

export function AIReasoningTrace({
  steps = DEFAULT_STEPS,
  accent = "var(--accent)",
  collapsedByDefault = false,
  totalDuration = "245ms",
}: AIReasoningTraceProps) {
  const [open, setOpen] = useState(!collapsedByDefault);

  return (
    <div
      role="region"
      aria-label="AI reasoning trace"
      style={{
        width: "100%",
        maxWidth: 440,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 12,
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
        boxShadow: `0 20px 50px -20px rgba(0,0,0,0.4), 0 0 30px -16px ${accent}`,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
          background: "var(--bg)",
          border: 0,
          borderBottom: open ? "1px solid var(--edge)" : "0",
          color: "var(--text)",
          cursor: "pointer",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.06em",
          textAlign: "left",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 14,
            display: "inline-block",
            color: accent,
            transition: "transform 0.18s ease",
            transform: open ? "rotate(90deg)" : "none",
          }}
        >
          ▸
        </span>
        <span style={{ color: accent, letterSpacing: "0.14em", textTransform: "uppercase" }}>thinking</span>
        <span style={{ color: "var(--text-3)" }}>· {steps.length} steps</span>
        <span style={{ marginLeft: "auto", color: "var(--text-4)" }}>{totalDuration}</span>
      </button>

      {open ? (
        <ol
          style={{
            listStyle: "none",
            margin: 0,
            padding: "10px 14px 14px",
            display: "flex",
            flexDirection: "column",
            gap: 0,
            position: "relative",
          }}
        >
          {steps.map((s, idx) => (
            <li
              key={s.id}
              style={{
                position: "relative",
                paddingLeft: 22,
                paddingTop: 8,
                paddingBottom: 8,
                animation: `ai-fade-up 0.34s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 4,
                  top: 13,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: accent,
                  boxShadow: `0 0 8px ${accent}`,
                }}
              />
              {idx < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 7,
                    top: 22,
                    bottom: -4,
                    width: 2,
                    background: `linear-gradient(180deg, ${accent}, transparent)`,
                    opacity: 0.4,
                  }}
                />
              ) : null}
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ fontSize: 12.5, color: "var(--text)", fontWeight: 500 }}>{s.label}</span>
                {s.duration ? (
                  <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)" }}>{s.duration}</span>
                ) : null}
              </div>
              {s.detail ? (
                <div style={{ marginTop: 4, fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.5 }}>{s.detail}</div>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}
