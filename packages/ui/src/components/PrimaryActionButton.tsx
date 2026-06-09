"use client";

import React, { useState } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md" | "lg";

export interface PrimaryActionButtonProps {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  accent?: string;
  onClick?: () => void;
}

const SIZE: Record<ButtonSize, { h: number; px: number; fs: number; gap: number }> = {
  sm: { h: 30, px: 12, fs: 12.5, gap: 6 },
  md: { h: 38, px: 16, fs: 13.5, gap: 8 },
  lg: { h: 46, px: 22, fs: 15, gap: 10 },
};

export function PrimaryActionButton({
  label = "Ship it",
  variant = "primary",
  size = "md",
  loading: loadingProp,
  disabled = false,
  icon = "→",
  accent = "var(--accent)",
  onClick,
}: PrimaryActionButtonProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = loadingProp ?? internalLoading;
  const dim = SIZE[size];
  const off = disabled || loading;

  const styles = (() => {
    switch (variant) {
      case "secondary":
        return {
          bg: "var(--bg-3)",
          color: "var(--text)",
          border: "1px solid var(--edge-2)",
          shadow: "none" as const,
          hoverBg: "var(--bg-4)",
        };
      case "ghost":
        return {
          bg: "transparent",
          color: accent,
          border: `1px solid transparent`,
          shadow: "none" as const,
          hoverBg: "color-mix(in srgb, " + accent + " 12%, transparent)",
        };
      case "destructive":
        return {
          bg: "var(--pink)",
          color: "var(--bg)",
          border: "1px solid var(--pink)",
          shadow: "0 0 18px -6px var(--pink)" as const,
          hoverBg: "var(--pink)",
        };
      default:
        return {
          bg: accent,
          color: "var(--bg)",
          border: `1px solid ${accent}`,
          shadow: `0 0 18px -6px ${accent}`,
          hoverBg: accent,
        };
    }
  })();

  const handleClick = () => {
    if (off) return;
    if (loadingProp === undefined) {
      setInternalLoading(true);
      window.setTimeout(() => setInternalLoading(false), 1400);
    }
    onClick?.();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={off}
      aria-busy={loading}
      style={{
        height: dim.h,
        padding: `0 ${dim.px}px`,
        display: "inline-flex",
        alignItems: "center",
        gap: dim.gap,
        background: styles.bg,
        color: styles.color,
        border: styles.border,
        borderRadius: 8,
        fontFamily: "var(--font-sans)",
        fontSize: dim.fs,
        fontWeight: 500,
        cursor: off ? "not-allowed" : "pointer",
        opacity: off && !loading ? 0.5 : 1,
        boxShadow: styles.shadow,
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease",
        outline: "none",
      }}
      onMouseEnter={(e) => {
        if (off) return;
        e.currentTarget.style.transform = "translateY(-1px)";
        if (variant === "primary" || variant === "destructive") {
          e.currentTarget.style.boxShadow = styles.shadow.replace("-6px", "-2px");
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = styles.shadow;
      }}
    >
      {loading ? (
        <span
          aria-hidden="true"
          style={{
            width: dim.fs,
            height: dim.fs,
            borderRadius: "50%",
            border: `2px solid currentColor`,
            borderTopColor: "transparent",
            animation: "ai-spin-slow 0.7s linear infinite",
          }}
        />
      ) : null}
      <span>{loading ? "Working" : label}</span>
      {!loading ? (
        <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", transition: "transform 0.18s ease" }}>{icon}</span>
      ) : null}
    </button>
  );
}
