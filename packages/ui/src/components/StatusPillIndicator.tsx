"use client";

import React from "react";

export type StatusKind = "live" | "syncing" | "idle" | "degraded" | "offline";

export interface StatusPillIndicatorProps {
  status?: StatusKind;
  label?: string;
  detail?: string;
  size?: "sm" | "md";
}

const STATUS_MAP: Record<StatusKind, { color: string; label: string; animated: boolean }> = {
  live:     { color: "var(--mint)",   label: "Live",     animated: true },
  syncing:  { color: "var(--cyan)",   label: "Syncing",  animated: true },
  idle:     { color: "var(--text-3)", label: "Idle",     animated: false },
  degraded: { color: "var(--amber)",  label: "Degraded", animated: true },
  offline:  { color: "var(--pink)",   label: "Offline",  animated: false },
};

export function StatusPillIndicator({
  status = "live",
  label,
  detail,
  size = "md",
}: StatusPillIndicatorProps) {
  const meta = STATUS_MAP[status];
  const text = label ?? meta.label;
  const h = size === "sm" ? 22 : 28;
  const fs = size === "sm" ? 10.5 : 11.5;
  const dot = size === "sm" ? 5 : 7;

  return (
    <span
      role="status"
      aria-live="polite"
      aria-label={`${text}${detail ? ", " + detail : ""}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: h,
        padding: `0 ${h * 0.4}px`,
        background: `color-mix(in srgb, ${meta.color} 14%, transparent)`,
        border: `1px solid ${meta.color}`,
        borderRadius: 999,
        color: meta.color,
        fontFamily: "var(--font-mono)",
        fontSize: fs,
        fontWeight: 600,
        letterSpacing: "0.06em",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: dot,
          height: dot,
          borderRadius: "50%",
          background: meta.color,
          boxShadow: `0 0 ${dot * 1.2}px ${meta.color}`,
          animation: meta.animated ? "pulse-dot 1.6s ease-in-out infinite" : "none",
          flexShrink: 0,
        }}
      />
      <span style={{ textTransform: "uppercase" }}>{text}</span>
      {detail ? (
        <>
          <span aria-hidden="true" style={{ color: "color-mix(in srgb, " + meta.color + " 50%, transparent)" }}>
            ·
          </span>
          <span style={{ color: "color-mix(in srgb, " + meta.color + " 80%, var(--text-2))", letterSpacing: 0, textTransform: "none" }}>
            {detail}
          </span>
        </>
      ) : null}
    </span>
  );
}
