"use client";

import React from "react";

export interface OrbitingDotsLoaderProps {
  size?: number;
  dotCount?: number;
  speed?: number;
  accent?: string;
  label?: string;
}

export function OrbitingDotsLoader({
  size = 88,
  dotCount = 6,
  speed = 1.8,
  accent = "var(--accent)",
  label = "Loading",
}: OrbitingDotsLoaderProps) {
  const dots = Array.from({ length: dotCount });
  const dotSize = Math.max(4, Math.round(size * 0.085));
  const orbit = (size - dotSize) / 2;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          width: size,
          height: size,
          animation: `ai-spin-slow ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {dots.map((_, i) => {
          const angle = (i / dotCount) * 2 * Math.PI;
          const cx = size / 2 + Math.cos(angle) * orbit;
          const cy = size / 2 + Math.sin(angle) * orbit;
          const opacity = 0.3 + (i / dotCount) * 0.7;
          return (
            <span
              key={i}
              style={{
                position: "absolute",
                left: cx - dotSize / 2,
                top: cy - dotSize / 2,
                width: dotSize,
                height: dotSize,
                borderRadius: "50%",
                background: accent,
                boxShadow: `0 0 ${dotSize}px ${accent}`,
                opacity,
              }}
            />
          );
        })}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: dotSize * 1.4,
            height: dotSize * 1.4,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}, transparent 60%)`,
            opacity: 0.6,
            animation: "ai-glow-pulse 2.6s ease-in-out infinite",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: accent,
        }}
      >
        {label}
      </span>
    </div>
  );
}
