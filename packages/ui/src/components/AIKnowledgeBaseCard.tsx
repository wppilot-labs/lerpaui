"use client";

import React from "react";

export interface AIKnowledgeBaseCardProps {
  name?: string;
  description?: string;
  documentCount?: number;
  chunkCount?: number;
  lastSync?: string;
  status?: "synced" | "syncing" | "stale" | "error";
  accent?: string;
}

const STATUS_META = {
  synced:  { label: "synced",       color: "var(--accent)", glyph: "✓" },
  syncing: { label: "syncing…",     color: "var(--cyan)",   glyph: "↻" },
  stale:   { label: "needs sync",   color: "var(--amber)",  glyph: "⌛" },
  error:   { label: "sync failed",  color: "var(--pink)",   glyph: "✕" },
};

export function AIKnowledgeBaseCard({
  name = "Lerpa UI docs",
  description = "Public component library docs, blog posts, changelog and architecture decisions.",
  documentCount = 142,
  chunkCount = 3_840,
  lastSync = "12 min ago",
  status = "synced",
  accent = "var(--accent)",
}: AIKnowledgeBaseCardProps) {
  const meta = STATUS_META[status];

  return (
    <article
      style={{
        width: "100%",
        maxWidth: 380,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "border-color 0.2s ease, box-shadow 0.22s ease, transform 0.22s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.boxShadow = `0 18px 40px -22px ${accent}, 0 0 24px -10px ${accent}`;
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
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: "var(--accent-soft)",
            border: `1px solid ${accent}`,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 16,
            color: accent,
            flexShrink: 0,
            boxShadow: `0 0 18px -6px ${accent}`,
            animation: "ai-glow-pulse 2.6s ease-in-out infinite",
          }}
          aria-hidden="true"
        >
          ▤
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 500, color: "var(--text)", letterSpacing: "-0.01em" }}>{name}</h4>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>knowledge base</div>
        </div>
        <span
          style={{
            display: "inline-flex",
            gap: 5,
            alignItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            padding: "3px 8px",
            borderRadius: 4,
            background: "var(--bg-3)",
            color: meta.color,
            letterSpacing: "0.06em",
            border: `1px solid ${status === "syncing" ? meta.color : "transparent"}`,
            boxShadow: status === "syncing" ? `0 0 10px -2px ${meta.color}` : "none",
          }}
        >
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              animation:
                status === "syncing"
                  ? "ai-spin-slow 1.6s linear infinite"
                  : status === "stale" || status === "error"
                  ? "pulse-dot 1.5s ease-in-out infinite"
                  : "none",
            }}
          >
            {meta.glyph}
          </span>
          {meta.label}
        </span>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{description}</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        <Stat label="docs" value={documentCount.toLocaleString()} />
        <Stat label="chunks" value={chunkCount.toLocaleString()} />
        <Stat label="last sync" value={lastSync} />
      </div>
    </article>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: "8px 10px", background: "var(--bg)", border: "1px solid var(--edge)", borderRadius: 6, display: "flex", flexDirection: "column", gap: 2 }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: "var(--text-3)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
