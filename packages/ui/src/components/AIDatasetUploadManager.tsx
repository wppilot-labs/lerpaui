"use client";

import React from "react";

export interface DatasetEntry {
  id: string;
  name: string;
  rows: number;
  status: "ingesting" | "ready" | "error";
  progress?: number;
  embedding?: string;
}

export interface AIDatasetUploadManagerProps {
  datasets?: DatasetEntry[];
  accent?: string;
}

const DEFAULT: DatasetEntry[] = [
  { id: "d1", name: "support-tickets-q1.jsonl", rows: 12_482, status: "ready",      progress: 100, embedding: "text-embedding-3-large" },
  { id: "d2", name: "product-catalog.csv",       rows: 4_213,  status: "ingesting", progress: 64,  embedding: "text-embedding-3-large" },
  { id: "d3", name: "release-notes.md",          rows: 142,    status: "ready",      progress: 100, embedding: "text-embedding-3-small" },
  { id: "d4", name: "user-feedback.jsonl",       rows: 0,      status: "error",      progress: 0 },
];

const STATUS_META = {
  ready:     { color: "var(--accent)", glyph: "✓",  label: "ready" },
  ingesting: { color: "var(--cyan)",   glyph: "▸",  label: "ingesting" },
  error:     { color: "var(--pink)",   glyph: "✕",  label: "error" },
};

export function AIDatasetUploadManager({ datasets = DEFAULT, accent = "var(--accent)" }: AIDatasetUploadManagerProps) {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 16,
        fontFamily: "var(--font-sans)",
      }}
      role="region"
      aria-label="Dataset manager"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ color: accent }}>●</span> datasets
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{datasets.length} sources</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {datasets.map((d) => {
          const meta = STATUS_META[d.status];
          return (
            <div key={d.id} style={{ padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--edge)", borderRadius: 8, display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 8, alignItems: "center" }}>
                <span style={{ color: meta.color, fontWeight: 700 }} aria-hidden="true">{meta.glyph}</span>
                <span style={{ fontSize: 13, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: meta.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>{meta.label}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>{d.rows.toLocaleString()} rows</span>
              </div>
              {d.status === "ingesting" ? (
                <div style={{ height: 3, background: "var(--bg-4)", borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ width: `${d.progress ?? 0}%`, height: "100%", background: meta.color, transition: "width 0.4s" }} />
                </div>
              ) : null}
              {d.embedding ? <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)" }}>↳ {d.embedding}</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
