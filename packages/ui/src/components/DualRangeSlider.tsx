"use client";

import React, { useCallback, useRef, useState } from "react";

export interface DualRangeSliderProps {
  min?: number;
  max?: number;
  step?: number;
  defaultMin?: number;
  defaultMax?: number;
  label?: string;
  unit?: string;
  accent?: string;
  onChange?: (range: [number, number]) => void;
}

export function DualRangeSlider({
  min = 0,
  max = 1000,
  step = 10,
  defaultMin = 200,
  defaultMax = 760,
  label = "Price range",
  unit = "$",
  accent = "var(--accent)",
  onChange,
}: DualRangeSliderProps) {
  const [low, setLow] = useState(defaultMin);
  const [high, setHigh] = useState(defaultMax);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<"low" | "high" | null>(null);

  const pct = useCallback((v: number) => ((v - min) / (max - min)) * 100, [min, max]);

  const fromClient = (clientX: number): number => {
    const el = trackRef.current;
    if (!el) return min;
    const r = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const raw = min + ratio * (max - min);
    return Math.round(raw / step) * step;
  };

  const onMove = useCallback(
    (clientX: number) => {
      if (!dragging.current) return;
      const v = fromClient(clientX);
      if (dragging.current === "low") {
        const next = Math.min(v, high - step);
        setLow(next);
        onChange?.([next, high]);
      } else {
        const next = Math.max(v, low + step);
        setHigh(next);
        onChange?.([low, next]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [high, low, step],
  );

  const startDrag = (which: "low" | "high") => (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = which;
    e.currentTarget.setPointerCapture(e.pointerId);
    onMove(e.clientX);
  };

  const moveDrag = (e: React.PointerEvent<HTMLDivElement>) => onMove(e.clientX);

  const endDrag = () => {
    dragging.current = null;
  };

  const onKey = (which: "low" | "high") => (e: React.KeyboardEvent) => {
    const delta = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
    if (!delta) return;
    e.preventDefault();
    if (which === "low") {
      const next = Math.max(min, Math.min(low + delta, high - step));
      setLow(next);
      onChange?.([next, high]);
    } else {
      const next = Math.min(max, Math.max(high + delta, low + step));
      setHigh(next);
      onChange?.([low, next]);
    }
  };

  const lowPct = pct(low);
  const highPct = pct(high);

  return (
    <div style={{ width: "100%", maxWidth: 360, fontFamily: "var(--font-sans)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-3)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            color: accent,
            fontWeight: 600,
          }}
        >
          {unit}{low.toLocaleString()} – {unit}{high.toLocaleString()}
        </span>
      </div>
      <div
        ref={trackRef}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        style={{
          position: "relative",
          height: 28,
          padding: "12px 0",
          touchAction: "none",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 4,
            transform: "translateY(-50%)",
            background: "var(--bg-4)",
            borderRadius: 2,
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: `${lowPct}%`,
            right: `${100 - highPct}%`,
            top: "50%",
            height: 4,
            transform: "translateY(-50%)",
            background: accent,
            borderRadius: 2,
            boxShadow: `0 0 10px -2px ${accent}`,
          }}
        />
        {([
          { key: "low" as const, value: low, pct: lowPct },
          { key: "high" as const, value: high, pct: highPct },
        ]).map((h) => (
          <div
            key={h.key}
            role="slider"
            tabIndex={0}
            aria-label={`${label} ${h.key}`}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={h.value}
            onPointerDown={startDrag(h.key)}
            onKeyDown={onKey(h.key)}
            style={{
              position: "absolute",
              left: `${h.pct}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "var(--bg-2)",
              border: `2px solid ${accent}`,
              boxShadow: `0 0 12px -2px ${accent}`,
              cursor: "grab",
              outline: "none",
              transition: "transform 0.12s ease, box-shadow 0.12s ease",
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: 6,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: "var(--text-4)",
        }}
      >
        <span>{unit}{min}</span>
        <span>{unit}{max}</span>
      </div>
    </div>
  );
}
