"use client";

import React from "react";

export interface NoiseTextureOverlayProps {
  intensity?: number;
  baseFrequency?: number;
  height?: number | string;
  accent?: string;
  title?: string;
  body?: string;
}

export function NoiseTextureOverlay({
  intensity = 0.55,
  baseFrequency = 0.85,
  height = 240,
  accent = "var(--accent)",
  title = "Film grain texture",
  body = "SVG turbulence filter scaled and overlaid via mix-blend-mode for a cinematic noise grain.",
}: NoiseTextureOverlayProps) {
  return (
    <div
      role="figure"
      aria-label={title}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 420,
        height,
        background: `linear-gradient(135deg, ${accent}, var(--violet) 50%, var(--pink))`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: `0 30px 80px -30px rgba(0,0,0,0.6), 0 0 36px -12px ${accent}`,
        fontFamily: "var(--font-sans)",
        isolation: "isolate",
      }}
    >
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <filter id="noise-grain-filter">
          <feTurbulence type="fractalNoise" baseFrequency={baseFrequency} numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          filter: "url(#noise-grain-filter)",
          opacity: intensity,
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 30% 20%, color-mix(in srgb, white 18%, transparent), transparent 60%)",
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 18,
          background: "linear-gradient(180deg, transparent, color-mix(in srgb, black 60%, transparent))",
          color: "var(--text)",
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>{title}</div>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "color-mix(in srgb, white 80%, transparent)", lineHeight: 1.5 }}>
          {body}
        </p>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 10,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "color-mix(in srgb, white 70%, transparent)",
          }}
        >
          <span>grain {Math.round(intensity * 100)}%</span>
          <span>freq {baseFrequency.toFixed(2)}</span>
          <span style={{ marginLeft: "auto", color: "color-mix(in srgb, white 90%, transparent)" }}>SVG</span>
        </div>
      </div>
    </div>
  );
}
