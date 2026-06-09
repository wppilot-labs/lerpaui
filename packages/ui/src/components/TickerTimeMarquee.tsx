"use client";

import React from "react";

export interface TickerEntry {
  id: string;
  label: string;
  value: string;
  delta?: number;
}

export interface TickerTimeMarqueeProps {
  entries?: TickerEntry[];
  speed?: number;
  accent?: string;
}

const DEFAULT_ENTRIES: TickerEntry[] = [
  { id: "AAPL", label: "AAPL", value: "184.32", delta: 1.42 },
  { id: "TSLA", label: "TSLA", value: "243.18", delta: -0.84 },
  { id: "BTC", label: "BTC/USD", value: "67,420", delta: 2.61 },
  { id: "ETH", label: "ETH/USD", value: "3,245", delta: 0.92 },
  { id: "NVDA", label: "NVDA", value: "742.50", delta: 3.18 },
  { id: "META", label: "META", value: "512.07", delta: -0.42 },
  { id: "GOOG", label: "GOOG", value: "176.85", delta: 0.21 },
  { id: "SOL", label: "SOL/USD", value: "184.62", delta: -1.18 },
];

export function TickerTimeMarquee({
  entries = DEFAULT_ENTRIES,
  speed = 40,
  accent = "var(--accent)",
}: TickerTimeMarqueeProps) {
  const repeated = [...entries, ...entries];

  return (
    <div
      role="marquee"
      aria-label="Live market ticker"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 540,
        height: 44,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 10,
        overflow: "hidden",
        fontFamily: "var(--font-mono)",
        fontSize: 12.5,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 50,
          background: "linear-gradient(90deg, var(--bg-2), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 50,
          background: "linear-gradient(270deg, var(--bg-2), transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <span
        style={{
          position: "absolute",
          left: 10,
          top: "50%",
          transform: "translateY(-50%)",
          display: "inline-flex",
          alignItems: "center",
          gap: 5,
          padding: "3px 7px",
          background: `color-mix(in srgb, ${accent} 18%, transparent)`,
          border: `1px solid ${accent}`,
          borderRadius: 5,
          fontSize: 10,
          fontWeight: 700,
          color: accent,
          letterSpacing: "0.14em",
          zIndex: 3,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
            animation: "pulse-dot 1.4s ease-in-out infinite",
          }}
        />
        LIVE
      </span>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          paddingLeft: 80,
          gap: 28,
          width: "max-content",
          animation: `ai-marquee-x ${speed}s linear infinite`,
          willChange: "transform",
        }}
      >
        {repeated.map((e, i) => {
          const positive = (e.delta ?? 0) >= 0;
          const tone = positive ? accent : "var(--pink)";
          return (
            <span
              key={`${e.id}-${i}`}
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 8,
                flexShrink: 0,
              }}
            >
              <span style={{ color: "var(--text-3)", letterSpacing: "0.06em", fontWeight: 600 }}>
                {e.label}
              </span>
              <span style={{ color: "var(--text)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
                {e.value}
              </span>
              {e.delta !== undefined ? (
                <span
                  style={{
                    color: tone,
                    fontWeight: 600,
                    fontSize: 11,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <span aria-hidden="true">{positive ? "▲" : "▼"}</span>
                  {Math.abs(e.delta).toFixed(2)}%
                </span>
              ) : null}
            </span>
          );
        })}
      </div>
    </div>
  );
}
