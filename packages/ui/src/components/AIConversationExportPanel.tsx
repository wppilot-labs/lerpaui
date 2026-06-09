"use client";

import React, { useState } from "react";

export type ExportFormat = "json" | "markdown" | "pdf" | "txt";

export interface AIConversationExportPanelProps {
  formats?: ExportFormat[];
  defaultFormat?: ExportFormat;
  messageCount?: number;
  sizeKb?: number;
  accent?: string;
}

const FORMAT_META: Record<ExportFormat, { label: string; glyph: string; ext: string }> = {
  json:     { label: "JSON",     glyph: "{}", ext: ".json" },
  markdown: { label: "Markdown", glyph: "md", ext: ".md" },
  pdf:      { label: "PDF",      glyph: "▦",  ext: ".pdf" },
  txt:      { label: "Plain",    glyph: "T",  ext: ".txt" },
};

const SAMPLE_BY_FORMAT: Record<ExportFormat, string> = {
  json: `{
  "id": "conv_4213",
  "model": "claude-opus-4-7",
  "messages": [
    { "role": "user", "content": "Build a settings page" },
    { "role": "assistant", "content": "On it…" }
  ]
}`,
  markdown: `# Conversation · conv_4213
**Model:** claude-opus-4-7

### User
Build a settings page

### Assistant
On it…`,
  pdf: "Binary PDF (~ 142 KB) · 4 pages",
  txt: `[user]      Build a settings page
[assistant] On it…`,
};

export function AIConversationExportPanel({
  formats = ["json", "markdown", "pdf", "txt"],
  defaultFormat = "markdown",
  messageCount = 28,
  sizeKb = 14,
  accent = "var(--accent)",
}: AIConversationExportPanelProps) {
  const [format, setFormat] = useState<ExportFormat>(defaultFormat);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (typeof navigator !== "undefined") navigator.clipboard?.writeText(SAMPLE_BY_FORMAT[format]);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 440,
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
      aria-label="Export conversation"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ color: accent }}>●</span> export · {messageCount} msgs
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>~{sizeKb} KB</span>
      </div>

      <div role="radiogroup" aria-label="Export format" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
        {formats.map((f) => {
          const meta = FORMAT_META[f];
          const active = f === format;
          return (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setFormat(f)}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                padding: "10px 4px",
                background: active ? "var(--bg-3)" : "var(--bg)",
                border: `1px solid ${active ? accent : "var(--edge)"}`,
                borderRadius: 8,
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: active ? `0 0 12px -4px ${accent}` : "none",
              }}
            >
              <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: active ? accent : "var(--text-3)", fontWeight: 700 }}>
                {meta.glyph}
              </span>
              <span style={{ fontSize: 11, color: active ? "var(--text)" : "var(--text-3)" }}>{meta.label}</span>
            </button>
          );
        })}
      </div>

      <pre
        style={{
          margin: 0,
          padding: 12,
          background: "var(--bg)",
          border: "1px solid var(--edge)",
          borderRadius: 8,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-2)",
          lineHeight: 1.5,
          maxHeight: 140,
          overflowY: "auto",
          whiteSpace: "pre",
        }}
      >
        <code>{SAMPLE_BY_FORMAT[format]}</code>
      </pre>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={handleCopy}
          style={{
            flex: 1,
            height: 34,
            background: copied ? "var(--accent-soft)" : "transparent",
            color: copied ? accent : "var(--text-2)",
            border: `1px solid ${copied ? accent : "var(--edge-2)"}`,
            borderRadius: 7,
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
        >
          {copied ? "✓ copied" : "⎘ copy text"}
        </button>
        <button
          type="button"
          style={{
            flex: 1,
            height: 34,
            background: accent,
            color: "var(--bg)",
            border: 0,
            borderRadius: 7,
            cursor: "pointer",
            fontWeight: 500,
            fontSize: 12,
            boxShadow: `0 0 12px -4px ${accent}`,
          }}
        >
          ↓ download {FORMAT_META[format].ext}
        </button>
      </div>
    </div>
  );
}
