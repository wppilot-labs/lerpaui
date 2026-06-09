"use client";

import React, { useState } from "react";

export interface AIOutputFormat {
  id: string;
  label: string;
  glyph: string;
  description?: string;
}

export interface AIOutputFormatSelectorProps {
  formats?: AIOutputFormat[];
  defaultSelected?: string;
  accent?: string;
  onChange?: (format: AIOutputFormat) => void;
}

const DEFAULT_FORMATS: AIOutputFormat[] = [
  { id: "prose",    label: "Prose",     glyph: "¶", description: "Flowing paragraphs" },
  { id: "bullets",  label: "Bullets",   glyph: "•", description: "Bulleted list" },
  { id: "table",    label: "Table",     glyph: "▦", description: "Tabular comparison" },
  { id: "code",     label: "Code",      glyph: "</>", description: "Code block only" },
  { id: "json",     label: "JSON",      glyph: "{}", description: "Structured JSON" },
  { id: "markdown", label: "Markdown",  glyph: "md", description: "Markdown with headings" },
];

export function AIOutputFormatSelector({
  formats = DEFAULT_FORMATS,
  defaultSelected = "prose",
  accent = "var(--accent)",
  onChange,
}: AIOutputFormatSelectorProps) {
  const [selected, setSelected] = useState(defaultSelected);
  const current = formats.find((f) => f.id === selected) ?? formats[0];

  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 14,
        fontFamily: "var(--font-sans)",
        maxWidth: 380,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      role="radiogroup"
      aria-label="Output format"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-3)",
        }}
      >
        <span><span style={{ color: accent }}>●</span> output format</span>
        <span style={{ color: accent }}>{current.label}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
        {formats.map((f) => {
          const active = f.id === selected;
          return (
            <button
              key={f.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => {
                setSelected(f.id);
                onChange?.(f);
              }}
              title={f.description ?? f.label}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 4,
                alignItems: "center",
                justifyContent: "center",
                padding: "10px 6px",
                background: active ? "var(--bg-3)" : "var(--bg)",
                border: `1px solid ${active ? accent : "var(--edge)"}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: active ? `0 0 14px -6px ${accent}` : "none",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 16,
                  color: active ? accent : "var(--text-3)",
                  lineHeight: 1,
                }}
              >
                {f.glyph}
              </span>
              <span style={{ fontSize: 11, color: active ? "var(--text)" : "var(--text-3)" }}>{f.label}</span>
            </button>
          );
        })}
      </div>

      {current.description ? (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-3)",
            padding: "8px 10px",
            background: "var(--bg)",
            border: "1px solid var(--edge)",
            borderRadius: 6,
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: accent }}>→</span> {current.description}
        </div>
      ) : null}
    </div>
  );
}
