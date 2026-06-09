"use client";

import React, { useState } from "react";

export interface DismissibleBannerPromoProps {
  badge?: string;
  message?: string;
  ctaLabel?: string;
  accent?: string;
  onCta?: () => void;
  onDismiss?: () => void;
}

export function DismissibleBannerPromo({
  badge = "NEW",
  message = "Theme Studio · live-edit 196 tokens in your browser",
  ctaLabel = "Open studio →",
  accent = "var(--accent)",
  onCta,
  onDismiss,
}: DismissibleBannerPromoProps) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <div
      role="banner"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        maxWidth: 540,
        padding: "10px 12px 10px 14px",
        background: `linear-gradient(90deg, ${accent}, var(--violet) 60%, var(--pink))`,
        borderRadius: 10,
        overflow: "hidden",
        color: "var(--bg)",
        fontFamily: "var(--font-sans)",
        boxShadow: `0 18px 40px -16px ${accent}, 0 0 22px -8px var(--violet)`,
        animation: "ai-fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, color-mix(in srgb, white 14%, transparent), transparent 60%)",
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          position: "relative",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          padding: "3px 7px",
          borderRadius: 4,
          background: "color-mix(in srgb, black 30%, transparent)",
          backdropFilter: "blur(4px)",
          color: "var(--bg)",
          letterSpacing: "0.14em",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {badge}
      </span>
      <span style={{ position: "relative", flex: 1, fontSize: 13, fontWeight: 500 }}>{message}</span>
      <button
        type="button"
        onClick={onCta}
        style={{
          position: "relative",
          height: 28,
          padding: "0 12px",
          background: "var(--bg)",
          color: accent,
          border: 0,
          borderRadius: 6,
          fontSize: 12,
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          boxShadow: "0 4px 10px -2px rgba(0,0,0,0.3)",
          flexShrink: 0,
          transition: "transform 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-1px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {ctaLabel}
      </button>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          onDismiss?.();
        }}
        aria-label="Dismiss banner"
        style={{
          position: "relative",
          width: 24,
          height: 24,
          display: "grid",
          placeItems: "center",
          background: "transparent",
          border: 0,
          color: "color-mix(in srgb, var(--bg) 80%, transparent)",
          cursor: "pointer",
          fontSize: 14,
          lineHeight: 1,
          borderRadius: 5,
          flexShrink: 0,
          transition: "all 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "var(--bg)";
          e.currentTarget.style.background = "color-mix(in srgb, black 18%, transparent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "color-mix(in srgb, var(--bg) 80%, transparent)";
          e.currentTarget.style.background = "transparent";
        }}
      >
        ×
      </button>
    </div>
  );
}
