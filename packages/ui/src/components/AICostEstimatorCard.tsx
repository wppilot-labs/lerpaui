"use client";

import React, { useMemo, useState } from "react";

export interface AICostEstimatorCardProps {
  accent?: string;
  inputCostPerMillion?: number;
  outputCostPerMillion?: number;
  defaultInputTokens?: number;
  defaultOutputTokens?: number;
  defaultRuns?: number;
  model?: string;
}

export function AICostEstimatorCard({
  accent = "var(--accent)",
  inputCostPerMillion = 15,
  outputCostPerMillion = 75,
  defaultInputTokens = 8_000,
  defaultOutputTokens = 2_000,
  defaultRuns = 1_000,
  model = "claude-opus-4-7",
}: AICostEstimatorCardProps) {
  const [inputT, setInputT] = useState(defaultInputTokens);
  const [outputT, setOutputT] = useState(defaultOutputTokens);
  const [runs, setRuns] = useState(defaultRuns);

  const { perRun, total } = useMemo(() => {
    const inCost = (inputT / 1_000_000) * inputCostPerMillion;
    const outCost = (outputT / 1_000_000) * outputCostPerMillion;
    return { perRun: inCost + outCost, total: (inCost + outCost) * runs };
  }, [inputT, outputT, runs, inputCostPerMillion, outputCostPerMillion]);

  return (
    <div
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
        gap: 16,
      }}
      role="region"
      aria-label="Cost estimator"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ color: accent }}>●</span> cost estimator
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>{model}</span>
      </div>

      <Field label="input tokens" hint="prompt + context" value={inputT} onChange={setInputT} min={100} max={50_000} step={100} accent={accent} />
      <Field label="output tokens" hint="response length" value={outputT} onChange={setOutputT} min={100} max={10_000} step={100} accent={accent} />
      <Field label="runs / month" hint="how many invocations" value={runs} onChange={setRuns} min={1} max={100_000} step={100} accent={accent} />

      <div
        style={{
          padding: "14px 16px",
          background: "var(--bg)",
          border: `1px solid ${accent}`,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          boxShadow: `0 0 24px -10px ${accent}`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>per run</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-2)" }}>
            ${perRun.toFixed(4)}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>monthly total</span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em", color: accent }}>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, hint, value, onChange, min, max, step, accent,
}: {
  label: string; hint: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; accent: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const id = `ce-${label.replace(/\s+/g, "-")}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <label htmlFor={id} style={{ fontSize: 13, color: "var(--text)" }}>
          {label}
          <span style={{ marginLeft: 6, fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>{hint}</span>
        </label>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: accent, fontWeight: 500 }}>{value.toLocaleString()}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          height: 4,
          appearance: "none",
          background: `linear-gradient(to right, ${accent} 0%, ${accent} ${pct}%, var(--bg-4) ${pct}%, var(--bg-4) 100%)`,
          borderRadius: 2,
          outline: "none",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
