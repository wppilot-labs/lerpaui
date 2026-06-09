"use client";

import React, { useEffect, useState } from "react";

export interface ProgressStep {
  id: string;
  label: string;
  detail?: string;
}

export interface ProgressToastStepsProps {
  steps?: ProgressStep[];
  accent?: string;
  autoStart?: boolean;
  stepMs?: number;
  loop?: boolean;
}

const DEFAULT_STEPS: ProgressStep[] = [
  { id: "s1", label: "Resolving dependencies", detail: "32 packages" },
  { id: "s2", label: "Fetching registry", detail: "shadcn schema" },
  { id: "s3", label: "Compiling tokens", detail: "196 vars" },
  { id: "s4", label: "Writing components", detail: "1235 files" },
  { id: "s5", label: "Validating types", detail: "tsc --noEmit" },
];

export function ProgressToastSteps({
  steps = DEFAULT_STEPS,
  accent = "var(--accent)",
  autoStart = true,
  stepMs = 1100,
  loop = true,
}: ProgressToastStepsProps) {
  const [active, setActive] = useState<number>(autoStart ? 0 : -1);
  const done = active >= steps.length;

  useEffect(() => {
    if (active < 0) return;
    if (active >= steps.length) {
      if (loop) {
        const id = window.setTimeout(() => setActive(0), 1600);
        return () => window.clearTimeout(id);
      }
      return;
    }
    const id = window.setTimeout(() => setActive((a) => a + 1), stepMs);
    return () => window.clearTimeout(id);
  }, [active, steps.length, stepMs, loop]);

  const pct = done ? 100 : (active / steps.length) * 100;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!done}
      style={{
        width: "100%",
        maxWidth: 360,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 12,
        padding: 14,
        fontFamily: "var(--font-sans)",
        boxShadow: `0 24px 50px -20px rgba(0,0,0,0.5), 0 0 30px -16px ${accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        {done ? (
          <span
            aria-hidden="true"
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: accent,
              color: "var(--bg)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              fontWeight: 700,
              boxShadow: `0 0 14px -2px ${accent}`,
            }}
          >
            ✓
          </span>
        ) : (
          <span
            aria-hidden="true"
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: `2px solid ${accent}`,
              borderTopColor: "transparent",
              animation: "ai-spin-slow 0.7s linear infinite",
              flexShrink: 0,
            }}
          />
        )}
        <span style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 600 }}>
          {done ? "All done" : `Installing · step ${Math.min(active + 1, steps.length)} / ${steps.length}`}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: done ? accent : "var(--text-3)",
          }}
        >
          {Math.round(pct)}%
        </span>
      </div>
      <div
        aria-hidden="true"
        style={{
          height: 4,
          borderRadius: 2,
          background: "var(--bg-4)",
          overflow: "hidden",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: accent,
            boxShadow: `0 0 8px -1px ${accent}`,
            transition: "width 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
        {steps.map((s, idx) => {
          const isDone = idx < active || done;
          const isActive = idx === active && !done;
          return (
            <li
              key={s.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                opacity: isDone || isActive ? 1 : 0.45,
                transition: "opacity 0.25s ease",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  background: isDone ? accent : "var(--bg-3)",
                  border: `1.5px solid ${isDone ? accent : isActive ? accent : "var(--edge)"}`,
                  display: "grid",
                  placeItems: "center",
                  color: "var(--bg)",
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: "var(--font-mono)",
                  flexShrink: 0,
                  boxShadow: isActive ? `0 0 10px -1px ${accent}` : "none",
                }}
              >
                {isDone ? "✓" : ""}
              </span>
              <span style={{ fontSize: 12.5, color: "var(--text)", flex: 1 }}>{s.label}</span>
              {s.detail ? (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-4)" }}>
                  {s.detail}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
