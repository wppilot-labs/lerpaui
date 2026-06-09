"use client";

import React from "react";

export interface AISourceCardProps {
  title?: string;
  source?: string;
  snippet?: string;
  url?: string;
  index?: number;
  relevance?: number;
  accent?: string;
  type?: "web" | "doc" | "code" | "video" | "image";
}

const TYPE_GLYPH: Record<NonNullable<AISourceCardProps["type"]>, string> = {
  web: "⌘",
  doc: "📄",
  code: "</>",
  video: "▶",
  image: "🖼",
};

export function AISourceCard({
  title = "Component-driven design tokens",
  source = "lerpaui.com/docs/theme-tokens",
  snippet = "Tokens live as CSS variables, swap by flipping a single data attribute on the html element at runtime — no rebuild required.",
  index = 1,
  relevance = 0.94,
  accent = "var(--accent)",
  type = "doc",
}: AISourceCardProps) {
  return (
    <article
      style={{
        width: "100%",
        maxWidth: 380,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 12,
        padding: 14,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition: "border-color 0.18s ease, box-shadow 0.22s ease, transform 0.22s ease",
        animation: "ai-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.boxShadow = `0 18px 40px -22px ${accent}, 0 0 24px -10px ${accent}`;
        e.currentTarget.style.transform = "translateY(-3px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--edge-2)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 5,
            background: accent,
            color: "var(--bg)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: `0 0 10px -2px ${accent}`,
            animation: "ai-glow-pulse 2.6s ease-in-out infinite",
          }}
        >
          [{index}]
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {TYPE_GLYPH[type]} {type}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            padding: "2px 7px",
            borderRadius: 3,
            background: "var(--accent-soft)",
            color: accent,
            letterSpacing: "0.05em",
          }}
        >
          {(relevance * 100).toFixed(0)}%
        </span>
      </div>
      <h4 style={{ margin: 0, fontSize: 14, color: "var(--text)", fontWeight: 500, lineHeight: 1.35 }}>{title}</h4>
      <p style={{ margin: 0, fontSize: 12, color: "var(--text-2)", lineHeight: 1.55 }}>{snippet}</p>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)", paddingTop: 4, borderTop: "1px solid var(--edge)", marginTop: 4, display: "flex", justifyContent: "space-between" }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{source}</span>
        <span style={{ color: accent, marginLeft: 8 }}>open →</span>
      </div>
    </article>
  );
}
