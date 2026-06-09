"use client";

import React, { useEffect, useRef, useState } from "react";

export interface HoldToConfirmButtonProps {
  label?: string;
  confirmLabel?: string;
  holdMs?: number;
  accent?: string;
  onConfirm?: () => void;
}

export function HoldToConfirmButton({
  label = "Hold to delete",
  confirmLabel = "Deleted",
  holdMs = 1100,
  accent = "var(--pink)",
  onConfirm,
}: HoldToConfirmButtonProps) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const holding = useRef(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const tick = (t: number) => {
    if (!holding.current) return;
    if (!startRef.current) startRef.current = t;
    const p = Math.min(1, (t - startRef.current) / holdMs);
    setProgress(p);
    if (p >= 1) {
      setDone(true);
      holding.current = false;
      onConfirm?.();
      window.setTimeout(() => {
        setDone(false);
        setProgress(0);
        startRef.current = 0;
      }, 1400);
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = () => {
    if (done) return;
    holding.current = true;
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  };

  const cancel = () => {
    holding.current = false;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (!done) {
      setProgress(0);
      startRef.current = 0;
    }
  };

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const pct = Math.round(progress * 100);

  return (
    <button
      type="button"
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          start();
        }
      }}
      onKeyUp={(e) => {
        if (e.key === " " || e.key === "Enter") cancel();
      }}
      aria-label={`${label}, hold space to confirm. ${pct}% complete.`}
      style={{
        position: "relative",
        height: 44,
        minWidth: 220,
        padding: "0 18px",
        background: done ? accent : "var(--bg-2)",
        color: done ? "var(--bg)" : "var(--text)",
        border: `1px solid ${done ? accent : accent}`,
        borderRadius: 10,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: 500,
        cursor: "pointer",
        overflow: "hidden",
        userSelect: "none",
        touchAction: "none",
        boxShadow: done ? `0 0 22px -4px ${accent}` : "none",
        transition: "background 0.2s ease, color 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          background: accent,
          transition: holding.current ? "none" : "width 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          opacity: done ? 0 : 0.85,
        }}
      />
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 10, color: done ? "var(--bg)" : pct > 50 ? "var(--bg)" : "var(--text)" }}>
        <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontWeight: 700 }}>
          {done ? "✓" : "⏻"}
        </span>
        <span>{done ? confirmLabel : label}</span>
        {!done ? (
          <span style={{ marginLeft: 6, fontFamily: "var(--font-mono)", fontSize: 11, opacity: 0.7 }}>
            {pct}%
          </span>
        ) : null}
      </span>
    </button>
  );
}
