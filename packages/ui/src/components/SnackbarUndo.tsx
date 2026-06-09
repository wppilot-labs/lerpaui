"use client";

import React, { useEffect, useRef, useState } from "react";

export interface SnackbarUndoProps {
  message?: string;
  countdownMs?: number;
  accent?: string;
  onUndo?: () => void;
  onTimeout?: () => void;
  autoStart?: boolean;
}

export function SnackbarUndo({
  message = "Project archived",
  countdownMs = 5000,
  accent = "var(--accent)",
  onUndo,
  onTimeout,
  autoStart = true,
}: SnackbarUndoProps) {
  const [visible, setVisible] = useState(autoStart);
  const [progress, setProgress] = useState(0);
  const startRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    startRef.current = 0;
    const tick = (t: number) => {
      if (!startRef.current) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / countdownMs);
      setProgress(p);
      if (p >= 1) {
        setVisible(false);
        onTimeout?.();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible, countdownMs, onTimeout]);

  const remaining = Math.max(0, Math.ceil((1 - progress) * (countdownMs / 1000)));

  if (!visible) {
    return (
      <button
        type="button"
        onClick={() => setVisible(true)}
        style={{
          height: 34,
          padding: "0 14px",
          background: "var(--bg-3)",
          color: "var(--text-2)",
          border: "1px solid var(--edge-2)",
          borderRadius: 8,
          fontFamily: "var(--font-sans)",
          fontSize: 12.5,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Replay snackbar
      </button>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 12,
        width: "100%",
        maxWidth: 380,
        height: 50,
        paddingLeft: 16,
        paddingRight: 8,
        background: "var(--bg)",
        border: "1px solid var(--edge-2)",
        borderRadius: 10,
        fontFamily: "var(--font-sans)",
        overflow: "hidden",
        boxShadow: `0 20px 40px -20px rgba(0,0,0,0.5), 0 0 24px -10px ${accent}`,
        animation: "ai-fade-up 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 2,
          width: `${(1 - progress) * 100}%`,
          background: accent,
          boxShadow: `0 0 6px -1px ${accent}`,
        }}
      />
      <span
        aria-hidden="true"
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: `color-mix(in srgb, ${accent} 18%, transparent)`,
          color: accent,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        ✓
      </span>
      <span style={{ flex: 1, fontSize: 13, color: "var(--text)" }}>{message}</span>
      <button
        type="button"
        onClick={() => {
          setVisible(false);
          onUndo?.();
        }}
        style={{
          height: 30,
          padding: "0 12px",
          background: "transparent",
          color: accent,
          border: `1px solid ${accent}`,
          borderRadius: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          fontWeight: 600,
          cursor: "pointer",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `color-mix(in srgb, ${accent} 12%, transparent)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        Undo · {remaining}s
      </button>
      <button
        type="button"
        onClick={() => setVisible(false)}
        aria-label="Dismiss"
        style={{
          width: 26,
          height: 26,
          display: "grid",
          placeItems: "center",
          background: "transparent",
          border: 0,
          color: "var(--text-3)",
          cursor: "pointer",
          borderRadius: 5,
          fontSize: 14,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}
