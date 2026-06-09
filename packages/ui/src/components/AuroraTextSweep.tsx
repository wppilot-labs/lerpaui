"use client";

import React from "react";

export interface AuroraTextSweepProps {
  text?: string;
  speed?: number;
  colors?: string[];
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE: Record<NonNullable<AuroraTextSweepProps["size"]>, number> = {
  sm: 22,
  md: 36,
  lg: 56,
  xl: 84,
};

export function AuroraTextSweep({
  text = "Ship something premium",
  speed = 6,
  colors = ["var(--accent)", "var(--violet)", "var(--pink)", "var(--cyan)", "var(--accent)"],
  className,
  size = "lg",
}: AuroraTextSweepProps) {
  const gradient = `linear-gradient(120deg, ${colors.join(", ")})`;
  return (
    <span
      role="heading"
      aria-level={2}
      aria-label={text}
      className={className}
      style={{
        display: "inline-block",
        fontFamily: "var(--font-sans)",
        fontSize: SIZE[size],
        fontWeight: 600,
        letterSpacing: "-0.025em",
        lineHeight: 1.05,
        background: gradient,
        backgroundSize: "300% auto",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
        animation: `aurora ${speed}s linear infinite`,
        filter: `drop-shadow(0 0 24px color-mix(in srgb, ${colors[0]} 38%, transparent))`,
      }}
    >
      {text}
    </span>
  );
}
