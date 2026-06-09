"use client";

import React, { useState } from "react";

export type AlertTone = "info" | "success" | "warn" | "error";

export interface AlertBannerProps {
  tone?: AlertTone;
  title?: string;
  description?: string;
  actionLabel?: string;
  dismissible?: boolean;
  onAction?: () => void;
  onDismiss?: () => void;
}

const TONE: Record<AlertTone, { color: string; icon: string; label: string }> = {
  info:    { color: "var(--cyan)",   icon: "ⓘ", label: "Info" },
  success: { color: "var(--mint)",   icon: "✓", label: "Success" },
  warn:    { color: "var(--amber)",  icon: "⚠", label: "Warning" },
  error:   { color: "var(--pink)",   icon: "✕", label: "Error" },
};

export function AlertBanner({
  tone = "info",
  title = "New API version available",
  description = "v2.7 ships streaming responses and tool calls. Migration guide in the changelog.",
  actionLabel = "Read changelog",
  dismissible = true,
  onAction,
  onDismiss,
}: AlertBannerProps) {
  const [open, setOpen] = useState(true);
  const t = TONE[tone];

  if (!open) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        width: "100%",
        maxWidth: 480,
        padding: "12px 14px",
        background: `color-mix(in srgb, ${t.color} 12%, var(--bg-2))`,
        border: `1px solid ${t.color}`,
        borderRadius: 10,
        fontFamily: "var(--font-sans)",
        boxShadow: `0 0 24px -10px ${t.color}`,
        animation: "ai-fade-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          borderRadius: 7,
          background: t.color,
          color: "var(--bg)",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          fontWeight: 700,
          boxShadow: `0 0 12px -2px ${t.color}`,
        }}
      >
        {t.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 600 }}>{title}</span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              padding: "1px 6px",
              borderRadius: 3,
              background: `color-mix(in srgb, ${t.color} 22%, transparent)`,
              color: t.color,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {t.label}
          </span>
        </div>
        {description ? (
          <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.5 }}>{description}</div>
        ) : null}
        {actionLabel ? (
          <button
            type="button"
            onClick={onAction}
            style={{
              marginTop: 8,
              padding: 0,
              background: "transparent",
              border: 0,
              color: t.color,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            {actionLabel} →
          </button>
        ) : null}
      </div>
      {dismissible ? (
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            onDismiss?.();
          }}
          aria-label="Dismiss"
          style={{
            flexShrink: 0,
            width: 24,
            height: 24,
            display: "grid",
            placeItems: "center",
            background: "transparent",
            border: 0,
            color: "var(--text-3)",
            cursor: "pointer",
            fontSize: 14,
            lineHeight: 1,
            borderRadius: 5,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg-3)";
            e.currentTarget.style.color = t.color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--text-3)";
          }}
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
