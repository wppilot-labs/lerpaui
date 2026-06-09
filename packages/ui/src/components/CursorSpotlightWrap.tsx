"use client";

import React, { useRef } from "react";

export interface CursorSpotlightWrapProps {
  title?: string;
  body?: string;
  accent?: string;
  radius?: number;
}

export function CursorSpotlightWrap({
  title = "Cursor-tracking spotlight",
  body = "A pointer-driven radial spotlight tracks your mouse and reveals subtle border glow beneath. Pure CSS variables drive the position — zero React re-renders per pointer event.",
  accent = "var(--accent)",
  radius = 220,
}: CursorSpotlightWrapProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    el.style.setProperty("--mo", "1");
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mo", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      role="figure"
      aria-label={title}
      style={
        {
          position: "relative",
          width: "100%",
          maxWidth: 380,
          padding: 22,
          background: "var(--bg-2)",
          border: "1px solid var(--edge-2)",
          borderRadius: 16,
          fontFamily: "var(--font-sans)",
          overflow: "hidden",
          isolation: "isolate",
          "--mx": "50%",
          "--my": "50%",
          "--mo": "0",
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `radial-gradient(${radius}px circle at var(--mx) var(--my), color-mix(in srgb, ${accent} 24%, transparent), transparent 70%)`,
          opacity: "var(--mo)",
          transition: "opacity 0.25s ease",
          zIndex: 0,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -1,
          borderRadius: 17,
          padding: 1,
          background: `radial-gradient(${radius}px circle at var(--mx) var(--my), ${accent}, transparent 60%)`,
          opacity: "var(--mo)",
          mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          pointerEvents: "none",
          transition: "opacity 0.25s ease",
          zIndex: 0,
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span
            aria-hidden="true"
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: accent,
              color: "var(--bg)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              fontWeight: 700,
              boxShadow: `0 0 18px -4px ${accent}`,
            }}
          >
            ◎
          </span>
          <span style={{ fontSize: 15, color: "var(--text)", fontWeight: 600 }}>{title}</span>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{body}</p>
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid var(--edge)",
            display: "flex",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: "var(--text-3)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <span>0 re-renders</span>
          <span>·</span>
          <span>CSS vars</span>
          <span style={{ marginLeft: "auto", color: accent }}>hover me</span>
        </div>
      </div>
    </div>
  );
}
