"use client";

import React from "react";

export interface PromptSuggestion {
  id: string;
  label: string;
  icon?: string;
  hint?: string;
}

export interface AIPromptSuggestionsProps {
  suggestions?: PromptSuggestion[];
  accent?: string;
  title?: string;
  onSelect?: (s: PromptSuggestion) => void;
}

const DEFAULT_SUGGESTIONS: PromptSuggestion[] = [
  { id: "s1", icon: "✦",  label: "Build a settings page", hint: "Sidebar + 3 tabs" },
  { id: "s2", icon: "▤",  label: "Pricing page with toggle", hint: "Monthly / yearly" },
  { id: "s3", icon: "∗",  label: "AI chat workspace", hint: "Streaming + history" },
  { id: "s4", icon: "⛬",  label: "Storefront cart flow", hint: "Add → checkout" },
];

export function AIPromptSuggestions({
  suggestions = DEFAULT_SUGGESTIONS,
  accent = "var(--accent)",
  title = "Try a starter prompt",
  onSelect,
}: AIPromptSuggestionsProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        fontFamily: "var(--font-sans)",
        maxWidth: 540,
        width: "100%",
      }}
      role="region"
      aria-label={title}
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-3)",
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
        {title}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 8 }}>
        {suggestions.map((s, idx) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect?.(s)}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: "10px 12px",
              background: "var(--bg-2)",
              border: "1px solid var(--edge-2)",
              borderRadius: 10,
              cursor: "pointer",
              textAlign: "left",
              transition: "background 0.18s ease, border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
              color: "var(--text)",
              animation: `ai-fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 70}ms both`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.background = "var(--bg-3)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 8px 22px -12px ${accent}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--edge-2)";
              e.currentTarget.style.background = "var(--bg-2)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {s.icon ? (
                <span
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    background: "var(--accent-soft)",
                    color: accent,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {s.icon}
                </span>
              ) : null}
              <span style={{ fontSize: 13, fontWeight: 500 }}>{s.label}</span>
            </div>
            {s.hint ? (
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", paddingLeft: 30 }}>
                ↳ {s.hint}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
