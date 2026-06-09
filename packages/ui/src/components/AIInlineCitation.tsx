"use client";

import React, { useState } from "react";

export interface AIInlineCitationProps {
  index?: number;
  title?: string;
  source?: string;
  snippet?: string;
  url?: string;
  relevance?: number;
  accent?: string;
  inline?: boolean;
}

export function AIInlineCitation({
  index = 1,
  title = "Reduced-motion baseline guide",
  source = "lerpaui.com/docs/motion",
  snippet = "Wrap motion components in usePrefersReducedMotion before animating.",
  url = "#",
  relevance = 0.94,
  accent = "var(--accent)",
  inline = false,
}: AIInlineCitationProps) {
  const [open, setOpen] = useState(false);

  const marker = (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        aria-describedby={`cit-${index}`}
        aria-label={`Citation ${index}: ${title}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          minWidth: 22,
          height: 18,
          padding: "0 5px",
          borderRadius: 3,
          background: open ? accent : "var(--accent-soft)",
          color: open ? "var(--bg)" : accent,
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 700,
          cursor: "pointer",
          border: 0,
          verticalAlign: "1px",
          margin: "0 2px",
          transition: "background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
          boxShadow: open ? `0 0 10px -2px ${accent}` : "none",
          transform: open ? "translateY(-1px)" : "translateY(0)",
          animation: !open && index === 1 ? "ai-glow-pulse 3s ease-in-out infinite" : "none",
        }}
      >
        [{index}]
      </button>
      {open ? (
        <div
          id={`cit-${index}`}
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
            width: 280,
            padding: 12,
            background: "var(--bg-2)",
            border: `1px solid ${accent}`,
            borderRadius: 10,
            boxShadow: `0 18px 40px -16px rgba(0,0,0,0.6), 0 0 24px -8px ${accent}`,
            fontFamily: "var(--font-sans)",
            textAlign: "left",
            animation: "ai-fade-up 0.22s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: accent, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              [{index}] cite
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, padding: "1px 6px", borderRadius: 3, background: "var(--accent-soft)", color: accent }}>
              {(relevance * 100).toFixed(0)}%
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, marginBottom: 4 }}>{title}</div>
          <p style={{ margin: 0, fontSize: 11.5, color: "var(--text-2)", lineHeight: 1.55 }}>{snippet}</p>
          <a
            href={url}
            style={{
              display: "block",
              marginTop: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: accent,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              textDecoration: "none",
            }}
          >
            ↗ {source}
          </a>
        </div>
      ) : null}
    </span>
  );

  if (inline) return marker;

  return (
    <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--text-2)", lineHeight: 1.65, maxWidth: 420 }}>
      Wrap motion components in <code style={{ fontFamily: "var(--font-mono)", fontSize: "0.92em", color: accent, background: "var(--bg-3)", padding: "1px 5px", borderRadius: 3 }}>usePrefersReducedMotion</code>{marker} before animating; this hook subscribes to the OS-level preference{" "}
      <AIInlineCitation index={2} title="prefers-reduced-motion · MDN" snippet="Indicates whether the user has requested the system minimize the amount of non-essential motion it uses." source="developer.mozilla.org" relevance={0.88} inline accent={accent} />{" "}
      and re-renders the consumer when the flag flips.
    </p>
  );
}
