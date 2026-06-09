"use client";

import React from "react";

export type FeedbackTone = "neutral" | "success" | "warn" | "error" | "info";

export interface InlineFormFeedbackProps {
  tone?: FeedbackTone;
  message?: string;
  hint?: string;
  showIcon?: boolean;
}

const TONE_MAP: Record<FeedbackTone, { color: string; icon: string }> = {
  neutral: { color: "var(--text-3)", icon: "·" },
  success: { color: "var(--mint)",   icon: "✓" },
  warn:    { color: "var(--amber)",  icon: "⚠" },
  error:   { color: "var(--pink)",   icon: "×" },
  info:    { color: "var(--cyan)",   icon: "ⓘ" },
};

export function InlineFormFeedback({
  tone = "error",
  message = "Email already in use",
  hint = "Try signing in instead",
  showIcon = true,
}: InlineFormFeedbackProps) {
  const t = TONE_MAP[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live={tone === "error" ? "assertive" : "polite"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        color: t.color,
        animation: "ai-fade-up 0.22s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      {showIcon ? (
        <span
          aria-hidden="true"
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: `color-mix(in srgb, ${t.color} 22%, transparent)`,
            color: t.color,
            display: "grid",
            placeItems: "center",
            fontSize: 10,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {t.icon}
        </span>
      ) : null}
      <span style={{ fontWeight: 500 }}>{message}</span>
      {hint ? (
        <span style={{ color: "var(--text-4)", fontWeight: 400 }}>· {hint}</span>
      ) : null}
    </div>
  );
}
