"use client";

import React from "react";

export interface SourceHealthSignal {
  label: string;
  state: "ok" | "warn" | "fail";
  detail?: string;
}

export interface AIKnowledgeSourceHealthCardProps {
  sourceName?: string;
  type?: string;
  signals?: SourceHealthSignal[];
  accent?: string;
}

const DEFAULT_SIGNALS: SourceHealthSignal[] = [
  { label: "Crawl reachable",  state: "ok",   detail: "200 OK · 142 ms" },
  { label: "Schema unchanged", state: "ok",   detail: "no diff vs last sync" },
  { label: "Token budget",     state: "warn", detail: "72% · within 30d window" },
  { label: "Embedding model",  state: "ok",   detail: "text-embedding-3-large" },
  { label: "PII scan",         state: "fail", detail: "2 emails flagged in chunk #84" },
];

const STATE_COLOR = {
  ok:   { fg: "var(--accent)", glyph: "✓" },
  warn: { fg: "var(--amber)",  glyph: "▲" },
  fail: { fg: "var(--pink)",   glyph: "✕" },
};

export function AIKnowledgeSourceHealthCard({
  sourceName = "lerpaui.com/docs",
  type = "web crawl",
  signals = DEFAULT_SIGNALS,
  accent = "var(--accent)",
}: AIKnowledgeSourceHealthCardProps) {
  const failing = signals.filter((s) => s.state === "fail").length;
  const warning = signals.filter((s) => s.state === "warn").length;
  const overall = failing > 0 ? "fail" : warning > 0 ? "warn" : "ok";
  const meta = STATE_COLOR[overall];

  return (
    <article
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
        transition: "border-color 0.2s ease, box-shadow 0.22s ease, transform 0.22s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = meta.fg;
        e.currentTarget.style.boxShadow = `0 18px 40px -22px ${meta.fg}, 0 0 24px -10px ${meta.fg}`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--edge-2)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            border: `1px solid ${meta.fg}`,
            background: `color-mix(in srgb, ${meta.fg} 14%, transparent)`,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            color: meta.fg,
            fontSize: 16,
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: `0 0 14px -2px ${meta.fg}`,
            animation: overall === "fail" ? "pulse-dot 1.2s ease-in-out infinite" : "ai-glow-pulse 2.6s ease-in-out infinite",
          }}
        >
          {meta.glyph}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {sourceName}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)", letterSpacing: "0.08em" }}>
            {type} · {failing} fail · {warning} warn
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {signals.map((s, i) => {
          const c = STATE_COLOR[s.state];
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr auto",
                gap: 8,
                alignItems: "center",
                padding: "6px 8px",
                background: "var(--bg)",
                border: `1px solid ${s.state === "fail" ? c.fg : "var(--edge)"}`,
                borderRadius: 6,
                fontFamily: "var(--font-mono)",
                fontSize: 11.5,
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 60}ms both`,
                boxShadow: s.state === "fail" ? `0 0 12px -8px ${c.fg}` : "none",
              }}
            >
              <span
                style={{
                  color: c.fg,
                  fontWeight: 600,
                  animation: s.state === "fail" ? "pulse-dot 1.3s ease-in-out infinite" : "none",
                }}
                aria-hidden="true"
              >
                {c.glyph}
              </span>
              <span style={{ color: "var(--text-2)" }}>{s.label}</span>
              {s.detail ? (
                <span style={{ color: c.fg, fontSize: 10.5 }}>{s.detail}</span>
              ) : null}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        style={{
          width: "100%",
          height: 34,
          background: "transparent",
          border: `1px solid ${accent}`,
          color: accent,
          borderRadius: 8,
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          fontWeight: 500,
          cursor: "pointer",
          transition: "background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-soft)"; e.currentTarget.style.boxShadow = `0 0 14px -4px ${accent}`; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        Re-sync source
      </button>
    </article>
  );
}
