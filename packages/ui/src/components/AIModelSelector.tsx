"use client";

import React, { useState } from "react";

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  context?: string;
  inputCost?: string;
  outputCost?: string;
  badge?: "new" | "fast" | "smart";
}

export interface AIModelSelectorProps {
  models?: AIModel[];
  defaultSelected?: string;
  accent?: string;
  onChange?: (model: AIModel) => void;
}

const DEFAULT_MODELS: AIModel[] = [
  { id: "claude-opus-4-7",   name: "Claude Opus 4.7",   provider: "Anthropic", context: "1M",   inputCost: "$15/M",  outputCost: "$75/M",  badge: "smart" },
  { id: "claude-sonnet-4-6", name: "Claude Sonnet 4.6", provider: "Anthropic", context: "200K", inputCost: "$3/M",   outputCost: "$15/M" },
  { id: "claude-haiku-4-5",  name: "Claude Haiku 4.5",  provider: "Anthropic", context: "200K", inputCost: "$0.8/M", outputCost: "$4/M",   badge: "fast" },
  { id: "gpt-5",             name: "GPT-5",             provider: "OpenAI",    context: "200K", inputCost: "$5/M",   outputCost: "$30/M",  badge: "new" },
  { id: "gemini-2-5-pro",    name: "Gemini 2.5 Pro",    provider: "Google",    context: "2M",   inputCost: "$3/M",   outputCost: "$15/M" },
];

const BADGE_COLOR: Record<NonNullable<AIModel["badge"]>, { bg: string; fg: string }> = {
  new:   { bg: "rgba(255,61,119,0.14)", fg: "var(--pink)" },
  fast:  { bg: "rgba(95,223,255,0.14)", fg: "var(--cyan)" },
  smart: { bg: "var(--accent-soft)",    fg: "var(--accent)" },
};

export function AIModelSelector({
  models = DEFAULT_MODELS,
  defaultSelected = "claude-opus-4-7",
  accent = "var(--accent)",
  onChange,
}: AIModelSelectorProps) {
  const [selected, setSelected] = useState(defaultSelected);

  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 14,
        fontFamily: "var(--font-sans)",
        maxWidth: 360,
        width: "100%",
      }}
      role="radiogroup"
      aria-label="Model selector"
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
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
        model
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {models.map((m, idx) => {
          const active = m.id === selected;
          const badge = m.badge ? BADGE_COLOR[m.badge] : null;
          return (
            <button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setSelected(m.id);
                onChange?.(m);
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "16px 1fr auto",
                gap: 12,
                alignItems: "center",
                padding: 10,
                background: active ? "var(--bg-3)" : "var(--bg)",
                border: `1px solid ${active ? accent : "var(--edge)"}`,
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
                boxShadow: active ? `0 0 14px -6px ${accent}` : "none",
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 50}ms both`,
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.transform = "translateX(2px)"; e.currentTarget.style.borderColor = "var(--edge-2)"; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = "var(--edge)"; } }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  border: `2px solid ${active ? accent : "var(--edge-2)"}`,
                  background: active ? accent : "transparent",
                  boxShadow: active ? "inset 0 0 0 3px var(--bg)" : "none",
                  animation: active ? "ai-glow-pulse 2.4s ease-in-out infinite" : "none",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{m.name}</span>
                  {badge ? (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        padding: "1px 6px",
                        borderRadius: 3,
                        background: badge.bg,
                        color: badge.fg,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {m.badge}
                    </span>
                  ) : null}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>
                  {m.provider}{m.context ? ` · ${m.context} ctx` : ""}
                </div>
              </div>
              {m.inputCost ? (
                <div style={{ textAlign: "right", fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", lineHeight: 1.3 }}>
                  <div>in {m.inputCost}</div>
                  {m.outputCost ? <div>out {m.outputCost}</div> : null}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
