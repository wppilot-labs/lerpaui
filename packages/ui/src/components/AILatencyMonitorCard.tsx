"use client";

import React, { useEffect, useState } from "react";
import { useShouldAnimate } from "../animation/hooks";

export interface AILatencyMonitorCardProps {
  accent?: string;
  endpoint?: string;
  samples?: number;
  refreshMs?: number;
}

export function AILatencyMonitorCard({
  accent = "var(--accent)",
  endpoint = "api.anthropic.com",
  samples = 32,
  refreshMs = 1400,
}: AILatencyMonitorCardProps) {
  const [history, setHistory] = useState<number[]>(() =>
    Array.from({ length: samples }, () => 180 + Math.random() * 220),
  );
  const [containerRef, shouldAnimate] = useShouldAnimate<HTMLDivElement>();

  useEffect(() => {
    if (!shouldAnimate) return;
    const id = window.setInterval(() => {
      setHistory((prev) => {
        const next = [...prev.slice(1)];
        next.push(180 + Math.random() * 220);
        return next;
      });
    }, refreshMs);
    return () => window.clearInterval(id);
  }, [refreshMs, shouldAnimate]);

  const latest = history[history.length - 1];
  const avg = history.reduce((a, b) => a + b, 0) / history.length;
  const max = Math.max(...history);
  const p95 = [...history].sort((a, b) => a - b)[Math.floor(history.length * 0.95)];

  const status = latest < 250 ? "fast" : latest < 400 ? "ok" : "slow";
  const statusColor = status === "fast" ? accent : status === "ok" ? "var(--amber)" : "var(--pink)";

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: 380,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
      role="region"
      aria-label={`Latency monitor for ${endpoint}`}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
            <span style={{ color: statusColor }}>●</span> latency · {status}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-4)" }}>{endpoint}</span>
        </div>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 32, fontWeight: 500, letterSpacing: "-0.025em", color: statusColor, lineHeight: 1 }}>
          {Math.round(latest)}<span style={{ fontSize: 14, marginLeft: 2 }}>ms</span>
        </span>
      </div>

      {/* spark */}
      <svg viewBox={`0 0 ${samples} 60`} width="100%" height={60} preserveAspectRatio="none" aria-hidden="true">
        <path
          d={history
            .map((v, i) => {
              const y = 60 - Math.min(60, (v / max) * 60);
              return `${i === 0 ? "M" : "L"}${i} ${y}`;
            })
            .join(" ")}
          stroke={accent}
          strokeWidth={1.5}
          fill="none"
          style={{ filter: `drop-shadow(0 0 4px ${accent})` }}
        />
        <path
          d={
            history
              .map((v, i) => {
                const y = 60 - Math.min(60, (v / max) * 60);
                return `${i === 0 ? "M" : "L"}${i} ${y}`;
              })
              .join(" ") + ` L${samples - 1} 60 L0 60 Z`
          }
          fill={accent}
          opacity={0.12}
        />
      </svg>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontFamily: "var(--font-mono)", fontSize: 11 }}>
        <Stat label="avg" value={`${Math.round(avg)}ms`} />
        <Stat label="p95" value={`${Math.round(p95)}ms`} />
        <Stat label="max" value={`${Math.round(max)}ms`} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "6px 8px", background: "var(--bg)", border: "1px solid var(--edge)", borderRadius: 6 }}>
      <span style={{ color: "var(--text-3)" }}>{label}</span>
      <span style={{ color: "var(--text)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}
