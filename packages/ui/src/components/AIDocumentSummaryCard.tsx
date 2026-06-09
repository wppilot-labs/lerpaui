"use client";

import React from "react";

export interface AIDocumentSummaryCardProps {
  title?: string;
  summary?: string;
  keyPoints?: string[];
  pages?: number;
  readingTime?: string;
  accent?: string;
}

export function AIDocumentSummaryCard({
  title = "Lerpa UI v1.0 launch retrospective",
  summary = "v1 shipped on May 24 with 1235 components and 176 blocks. LCP held under 1s across all gallery routes. The biggest perf win was deferring 375 creative-effect imports behind IntersectionObserver.",
  keyPoints = [
    "1235 components, 176 blocks, 6 themes",
    "All gallery routes static-exported",
    "Reduced-motion respected globally",
    "Bundle size unchanged vs v0.9",
  ],
  pages = 14,
  readingTime = "8 min",
  accent = "var(--accent)",
}: AIDocumentSummaryCardProps) {
  return (
    <article
      style={{
        width: "100%",
        maxWidth: 440,
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
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div
          aria-hidden="true"
          style={{
            width: 40,
            height: 50,
            borderRadius: 6,
            background: "linear-gradient(135deg, var(--bg-3), var(--bg-4))",
            border: `1px solid ${accent}`,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: accent,
            flexShrink: 0,
            position: "relative",
            boxShadow: `0 0 14px -6px ${accent}`,
            animation: "ai-glow-pulse 2.8s ease-in-out infinite",
          }}
        >
          DOC
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: 0, fontSize: 14, color: "var(--text)", fontWeight: 500, lineHeight: 1.35 }}>{title}</h4>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)", marginTop: 4 }}>
            {pages} pages · {readingTime} read
          </div>
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: 6 }}>
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
        tl;dr
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>{summary}</p>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        key points
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
        {keyPoints.map((p, i) => (
          <li
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "18px 1fr",
              gap: 6,
              alignItems: "baseline",
              fontSize: 12.5,
              color: "var(--text-2)",
              animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 80}ms both`,
            }}
          >
            <span style={{ color: accent, fontFamily: "var(--font-mono)", fontWeight: 600 }} aria-hidden="true">→</span>
            <span style={{ lineHeight: 1.5 }}>{p}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
