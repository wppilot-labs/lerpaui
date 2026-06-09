"use client";

import React, { useState } from "react";

export interface SmartSuggestion {
  id: string;
  label: string;
  icon?: string;
  kind?: "refine" | "explore" | "action";
}

export interface AISmartSuggestChipsProps {
  suggestions?: SmartSuggestion[];
  accent?: string;
  onSelect?: (id: string) => void;
  prompt?: string;
}

const DEFAULT_SUGGESTIONS: SmartSuggestion[] = [
  { id: "s1", label: "Make it more concise", icon: "✦", kind: "refine" },
  { id: "s2", label: "Show me the code", icon: "<>", kind: "action" },
  { id: "s3", label: "Compare with v1", icon: "⇄", kind: "explore" },
  { id: "s4", label: "Add tests", icon: "✓", kind: "action" },
  { id: "s5", label: "Why this approach?", icon: "?", kind: "explore" },
];

const KIND_COLOR: Record<NonNullable<SmartSuggestion["kind"]>, string> = {
  refine: "var(--cyan)",
  explore: "var(--violet)",
  action: "var(--mint)",
};

export function AISmartSuggestChips({
  suggestions = DEFAULT_SUGGESTIONS,
  accent = "var(--accent)",
  onSelect,
  prompt = "What's next?",
}: AISmartSuggestChipsProps) {
  const [picked, setPicked] = useState<string | null>(null);

  const choose = (id: string) => {
    setPicked(id);
    onSelect?.(id);
  };

  return (
    <div
      role="group"
      aria-label="Smart suggestions"
      style={{
        width: "100%",
        maxWidth: 460,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 12,
        padding: 14,
        fontFamily: "var(--font-sans)",
        boxShadow: `0 20px 50px -20px rgba(0,0,0,0.4), 0 0 30px -16px ${accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-3)",
          letterSpacing: "0.06em",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            borderRadius: 4,
            background: accent,
            color: "var(--bg)",
            display: "grid",
            placeItems: "center",
            fontSize: 10,
            fontWeight: 700,
            boxShadow: `0 0 8px -2px ${accent}`,
          }}
        >
          ✦
        </span>
        <span style={{ color: accent, letterSpacing: "0.14em", textTransform: "uppercase" }}>suggest</span>
        <span style={{ color: "var(--text-2)" }}>· {prompt}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {suggestions.map((s, idx) => {
          const isPicked = s.id === picked;
          const tint = KIND_COLOR[s.kind ?? "refine"];
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => choose(s.id)}
              aria-pressed={isPicked}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 12px",
                background: isPicked
                  ? `color-mix(in srgb, ${tint} 18%, transparent)`
                  : "var(--bg)",
                border: `1px solid ${isPicked ? tint : "var(--edge)"}`,
                borderRadius: 999,
                color: isPicked ? tint : "var(--text)",
                cursor: "pointer",
                fontSize: 12.5,
                fontFamily: "var(--font-sans)",
                transition: "all 0.18s ease",
                boxShadow: isPicked ? `0 0 14px -4px ${tint}` : "none",
                animation: `ai-fade-up 0.34s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
              }}
              onMouseEnter={(e) => {
                if (!isPicked) {
                  e.currentTarget.style.borderColor = tint;
                  e.currentTarget.style.color = tint;
                }
              }}
              onMouseLeave={(e) => {
                if (!isPicked) {
                  e.currentTarget.style.borderColor = "var(--edge)";
                  e.currentTarget.style.color = "var(--text)";
                }
              }}
            >
              {s.icon ? (
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: tint,
                  }}
                >
                  {s.icon}
                </span>
              ) : null}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
