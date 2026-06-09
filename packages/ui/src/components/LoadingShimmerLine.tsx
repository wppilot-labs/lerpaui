"use client";

import React from "react";

export interface LoadingShimmerLineProps {
  width?: string | number;
  height?: number;
  accent?: string;
  rounded?: boolean;
  speed?: number;
}

export function LoadingShimmerLine({
  width = "100%",
  height = 14,
  accent = "var(--accent)",
  rounded = true,
  speed = 1.6,
}: LoadingShimmerLineProps) {
  return (
    <span
      role="status"
      aria-busy="true"
      aria-label="Loading"
      style={{
        display: "block",
        width,
        height,
        borderRadius: rounded ? height / 2 : 4,
        background: `linear-gradient(90deg, var(--bg-3) 0%, color-mix(in srgb, ${accent} 18%, var(--bg-4)) 50%, var(--bg-3) 100%)`,
        backgroundSize: "200% 100%",
        animation: `ai-shimmer ${speed}s ease-in-out infinite`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, transparent, color-mix(in srgb, ${accent} 24%, transparent), transparent)`,
          backgroundSize: "200% 100%",
          animation: `ai-shimmer ${speed * 0.8}s ease-in-out infinite`,
          mixBlendMode: "screen",
        }}
      />
    </span>
  );
}
