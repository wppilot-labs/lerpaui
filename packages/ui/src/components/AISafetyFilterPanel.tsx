"use client";

import React, { useState } from "react";

export interface SafetyFilter {
  id: string;
  label: string;
  description: string;
  level: "off" | "low" | "med" | "high";
}

export interface AISafetyFilterPanelProps {
  filters?: SafetyFilter[];
  accent?: string;
}

const DEFAULT: SafetyFilter[] = [
  { id: "f1", label: "Harmful content",  description: "Blocks violence / self-harm / hate.",        level: "high" },
  { id: "f2", label: "Sexual content",   description: "Filters explicit sexual material.",          level: "high" },
  { id: "f3", label: "Personal info",    description: "Redacts emails / phone / SSN.",              level: "med" },
  { id: "f4", label: "Profanity",        description: "Optional profanity filter.",                  level: "low" },
  { id: "f5", label: "Prompt injection", description: "Detect attempted system-prompt override.",   level: "high" },
];

const LEVEL_COLOR = { off: "var(--text-3)", low: "var(--cyan)", med: "var(--amber)", high: "var(--accent)" };
const LEVELS: SafetyFilter["level"][] = ["off", "low", "med", "high"];

export function AISafetyFilterPanel({ filters: defaultFilters = DEFAULT, accent = "var(--accent)" }: AISafetyFilterPanelProps) {
  const [filters, setFilters] = useState(defaultFilters);

  const setLevel = (id: string, level: SafetyFilter["level"]) => {
    setFilters((p) => p.map((f) => (f.id === id ? { ...f, level } : f)));
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 460,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      role="region"
      aria-label="Safety filters"
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
        <span style={{ color: accent }}>●</span> safety filters
      </div>
      {filters.map((f) => (
        <div key={f.id} style={{ padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--edge)", borderRadius: 8, display: "flex", flexDirection: "column", gap: 8 }}>
          <div>
            <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{f.label}</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{f.description}</div>
          </div>
          <div role="radiogroup" aria-label={`Level for ${f.label}`} style={{ display: "flex", gap: 4 }}>
            {LEVELS.map((l) => {
              const active = f.level === l;
              return (
                <button
                  key={l}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setLevel(f.id, l)}
                  style={{
                    flex: 1,
                    padding: "5px 0",
                    background: active ? `color-mix(in srgb, ${LEVEL_COLOR[l]} 18%, transparent)` : "transparent",
                    border: `1px solid ${active ? LEVEL_COLOR[l] : "var(--edge)"}`,
                    borderRadius: 5,
                    color: active ? LEVEL_COLOR[l] : "var(--text-3)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
