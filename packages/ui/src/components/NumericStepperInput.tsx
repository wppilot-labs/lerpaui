"use client";

import React, { useId, useState } from "react";

export interface NumericStepperInputProps {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
  accent?: string;
  onChange?: (n: number) => void;
}

export function NumericStepperInput({
  label = "Seats",
  min = 1,
  max = 99,
  step = 1,
  defaultValue = 12,
  unit,
  accent = "var(--accent)",
  onChange,
}: NumericStepperInputProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);

  const commit = (n: number) => {
    const clamped = Math.max(min, Math.min(max, n));
    setValue(clamped);
    onChange?.(clamped);
  };

  const inc = () => commit(value + step);
  const dec = () => commit(value - step);

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div style={{ width: "100%", maxWidth: 280, fontFamily: "var(--font-sans)" }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          display: "block",
          marginBottom: 8,
        }}
      >
        {label}
      </label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: 44,
          background: "var(--bg-2)",
          border: "1px solid var(--edge-2)",
          borderRadius: 10,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          aria-label="Decrease"
          style={{
            width: 44,
            height: "100%",
            background: "var(--bg-3)",
            border: 0,
            borderRight: "1px solid var(--edge)",
            color: value <= min ? "var(--text-4)" : accent,
            fontFamily: "var(--font-mono)",
            fontSize: 18,
            fontWeight: 600,
            cursor: value <= min ? "not-allowed" : "pointer",
            lineHeight: 1,
            transition: "background 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (value > min) e.currentTarget.style.background = "var(--bg-4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-3)";
          }}
        >
          −
        </button>
        <input
          id={id}
          type="number"
          value={value}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (Number.isFinite(n)) commit(n);
          }}
          min={min}
          max={max}
          step={step}
          style={{
            flex: 1,
            height: "100%",
            background: "transparent",
            border: 0,
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            fontSize: 17,
            fontWeight: 600,
            textAlign: "center",
            outline: "none",
            MozAppearance: "textfield",
          }}
        />
        {unit ? (
          <span
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `translate(${String(value).length * 7}px, -50%)`,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--text-3)",
              letterSpacing: "0.06em",
              pointerEvents: "none",
            }}
          >
            {unit}
          </span>
        ) : null}
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          aria-label="Increase"
          style={{
            width: 44,
            height: "100%",
            background: "var(--bg-3)",
            border: 0,
            borderLeft: "1px solid var(--edge)",
            color: value >= max ? "var(--text-4)" : accent,
            fontFamily: "var(--font-mono)",
            fontSize: 18,
            fontWeight: 600,
            cursor: value >= max ? "not-allowed" : "pointer",
            lineHeight: 1,
            transition: "background 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (value < max) e.currentTarget.style.background = "var(--bg-4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-3)";
          }}
        >
          +
        </button>
      </div>
      <div
        aria-hidden="true"
        style={{
          marginTop: 8,
          height: 3,
          borderRadius: 2,
          background: "var(--bg-4)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: accent,
            boxShadow: `0 0 8px -2px ${accent}`,
            transition: "width 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
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
        <span>{min}</span>
        <span style={{ color: "var(--text-3)" }}>step {step}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
