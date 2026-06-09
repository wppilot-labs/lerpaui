"use client";

import React, { useState } from "react";

export interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  tokens: number;
  uses: number;
  starred?: boolean;
  preview: string;
}

export interface AIPromptTemplateGalleryProps {
  templates?: PromptTemplate[];
  accent?: string;
}

const DEFAULT: PromptTemplate[] = [
  { id: "t1", title: "Support agent",     category: "Support",   tokens: 320, uses: 4_213, starred: true,  preview: "You are a support agent for {product}…" },
  { id: "t2", title: "Code reviewer",     category: "Engineering", tokens: 480, uses: 2_180, starred: false, preview: "Review the diff. Focus on correctness…" },
  { id: "t3", title: "Marketing writer",  category: "Growth",    tokens: 220, uses: 982,   starred: true,  preview: "Punchy copy. Lead with benefit…" },
  { id: "t4", title: "SQL generator",     category: "Data",      tokens: 380, uses: 1_440, starred: false, preview: "Generate Postgres SQL. Always EXPLAIN…" },
  { id: "t5", title: "Translator (12-lang)", category: "i18n",   tokens: 280, uses: 612,   starred: false, preview: "Translate the input. Preserve markdown…" },
  { id: "t6", title: "Triage classifier", category: "Support",   tokens: 180, uses: 3_124, starred: false, preview: "Classify the ticket: bug | question | …" },
];

const CAT_COLOR: Record<string, string> = {
  Support: "var(--accent)",
  Engineering: "var(--cyan)",
  Growth: "var(--pink)",
  Data: "var(--violet)",
  i18n: "var(--amber)",
};

export function AIPromptTemplateGallery({ templates = DEFAULT, accent = "var(--accent)" }: AIPromptTemplateGalleryProps) {
  const [cat, setCat] = useState<string | "all">("all");
  const cats = Array.from(new Set(templates.map((t) => t.category)));
  const visible = cat === "all" ? templates : templates.filter((t) => t.category === cat);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 540,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 16,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      role="region"
      aria-label="Prompt template gallery"
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
        <span style={{ color: accent }}>●</span> templates · {templates.length}
      </div>

      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {["all", ...cats].map((c) => {
          const isActive = c === cat;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={isActive}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "3px 8px",
                background: isActive ? "var(--accent-soft)" : "var(--bg)",
                border: `1px solid ${isActive ? accent : "var(--edge)"}`,
                borderRadius: 4,
                color: isActive ? accent : "var(--text-3)",
                cursor: "pointer",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 8 }}>
        {visible.map((t) => {
          const catColor = CAT_COLOR[t.category] ?? accent;
          return (
            <button
              key={t.id}
              type="button"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: 12,
                background: "var(--bg)",
                border: "1px solid var(--edge)",
                borderRadius: 8,
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = catColor)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--edge)")}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, flex: 1 }}>{t.title}</span>
                {t.starred ? <span style={{ color: accent }}>★</span> : null}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>
                <span style={{ padding: "1px 6px", borderRadius: 3, background: `color-mix(in srgb, ${catColor} 18%, transparent)`, color: catColor }}>{t.category}</span>
                <span>{t.tokens} tok</span>
                <span>{t.uses.toLocaleString()} uses</span>
              </div>
              <p style={{ margin: 0, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {t.preview}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
