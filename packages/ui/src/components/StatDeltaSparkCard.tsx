"use client";

import React, { useMemo } from "react";

export interface StatDeltaSparkCardProps {
  label?: string;
  value?: string;
  delta?: number;
  series?: number[];
  unit?: string;
  accent?: string;
  period?: string;
}

const DEFAULT_SERIES = [12, 14, 13, 17, 16, 22, 24, 23, 28, 32, 31, 38, 42, 48];

export function StatDeltaSparkCard({
  label = "Monthly active users",
  value = "48.2k",
  delta = 12.4,
  series = DEFAULT_SERIES,
  unit = "MAU",
  accent = "var(--accent)",
  period = "vs. last 30d",
}: StatDeltaSparkCardProps) {
  const positive = delta >= 0;
  const deltaColor = positive ? accent : "var(--pink)";

  const { path, area, lastX, lastY } = useMemo(() => {
    const W = 200;
    const H = 56;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const range = max - min || 1;
    const dx = W / Math.max(1, series.length - 1);
    const pts = series.map((v, i) => {
      const x = i * dx;
      const y = H - ((v - min) / range) * (H - 8) - 4;
      return [x, y] as const;
    });
    const pathD = pts.map(([x, y], i) => (i === 0 ? `M${x.toFixed(1)},${y.toFixed(1)}` : `L${x.toFixed(1)},${y.toFixed(1)}`)).join(" ");
    const areaD = `${pathD} L${W},${H} L0,${H} Z`;
    const [lx, ly] = pts[pts.length - 1];
    return { path: pathD, area: areaD, lastX: lx, lastY: ly };
  }, [series]);

  return (
    <div
      role="region"
      aria-label={`${label}: ${value} ${unit}`}
      style={{
        width: "100%",
        maxWidth: 280,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 16,
        fontFamily: "var(--font-sans)",
        boxShadow: `0 20px 50px -20px rgba(0,0,0,0.4), 0 0 30px -18px ${accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-3)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            padding: "2px 6px",
            borderRadius: 3,
            border: "1px solid var(--edge)",
            color: "var(--text-3)",
            letterSpacing: "0.1em",
          }}
        >
          {unit}
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 30, color: "var(--text)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>{value}</span>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            padding: "3px 7px",
            borderRadius: 999,
            background: `color-mix(in srgb, ${deltaColor} 16%, transparent)`,
            color: deltaColor,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          <span aria-hidden="true">{positive ? "▲" : "▼"}</span>
          <span>{Math.abs(delta).toFixed(1)}%</span>
        </span>
      </div>
      <svg
        width="100%"
        height="56"
        viewBox="0 0 200 56"
        preserveAspectRatio="none"
        style={{ marginTop: 14, display: "block" }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={deltaColor} stopOpacity="0.42" />
            <stop offset="100%" stopColor={deltaColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#spark-grad)" />
        <path
          d={path}
          fill="none"
          stroke={deltaColor}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: `drop-shadow(0 0 4px ${deltaColor})`,
          }}
        />
        <circle
          cx={lastX}
          cy={lastY}
          r="3"
          fill={deltaColor}
          style={{
            filter: `drop-shadow(0 0 6px ${deltaColor})`,
            animation: "pulse-dot 1.8s ease-in-out infinite",
          }}
        />
      </svg>
      <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-4)", letterSpacing: "0.06em" }}>
        {period}
      </div>
    </div>
  );
}
