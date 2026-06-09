"use client";

import React from "react";

export interface AIToolResultDiffProps {
  toolName?: string;
  status?: "ok" | "warn" | "error";
  before?: string[];
  after?: string[];
  accent?: string;
}

const DEFAULT_BEFORE = [
  'theme: "indigo"',
  "components: 1235",
  "tokens: 196",
];
const DEFAULT_AFTER = [
  'theme: "lime"',
  "components: 1235",
  "tokens: 196",
  "patched: 4ms",
];

export function AIToolResultDiff({
  toolName = "theme.apply",
  status = "ok",
  before = DEFAULT_BEFORE,
  after = DEFAULT_AFTER,
  accent = "var(--accent)",
}: AIToolResultDiffProps) {
  const statusColor =
    status === "ok" ? accent : status === "warn" ? "var(--amber)" : "var(--pink)";

  const beforeSet = new Set(before);
  const afterSet = new Set(after);

  return (
    <div
      role="region"
      aria-label={`Tool result diff: ${toolName}`}
      style={{
        width: "100%",
        maxWidth: 460,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 12,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        boxShadow: `0 20px 50px -20px rgba(0,0,0,0.4), 0 0 30px -16px ${accent}`,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--edge)",
          background: "var(--bg)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: statusColor,
            boxShadow: `0 0 6px ${statusColor}`,
            animation: "pulse-dot 1.8s ease-in-out infinite",
          }}
        />
        <span style={{ color: "var(--text)" }}>▶ {toolName}</span>
        <span style={{ marginLeft: "auto", color: statusColor, letterSpacing: "0.14em", textTransform: "uppercase" }}>
          {status === "ok" ? "ok" : status === "warn" ? "partial" : "error"}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", fontFamily: "var(--font-mono)", fontSize: 11.5 }}>
        <div style={{ padding: "10px 12px", borderRight: "1px solid var(--edge)", background: "var(--bg)" }}>
          <div style={{ color: "var(--text-3)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>before</div>
          {before.map((line, i) => {
            const removed = !afterSet.has(line);
            return (
              <div
                key={`b-${i}`}
                style={{
                  padding: "2px 6px",
                  marginLeft: -6,
                  color: removed ? "var(--pink)" : "var(--text-2)",
                  background: removed ? "rgba(255,61,119,0.08)" : "transparent",
                  borderRadius: 3,
                  display: "flex",
                  gap: 6,
                  animation: `ai-fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms both`,
                }}
              >
                <span aria-hidden="true" style={{ color: removed ? "var(--pink)" : "var(--text-4)", width: 10, flexShrink: 0 }}>
                  {removed ? "−" : " "}
                </span>
                <span style={{ minWidth: 0, wordBreak: "break-all" }}>{line}</span>
              </div>
            );
          })}
        </div>
        <div style={{ padding: "10px 12px", background: "var(--bg-2)" }}>
          <div style={{ color: accent, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 6 }}>after</div>
          {after.map((line, i) => {
            const added = !beforeSet.has(line);
            return (
              <div
                key={`a-${i}`}
                style={{
                  padding: "2px 6px",
                  marginLeft: -6,
                  color: added ? accent : "var(--text-2)",
                  background: added ? "color-mix(in srgb, " + accent + " 12%, transparent)" : "transparent",
                  borderRadius: 3,
                  display: "flex",
                  gap: 6,
                  animation: `ai-fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) ${(i + before.length) * 40}ms both`,
                }}
              >
                <span aria-hidden="true" style={{ color: added ? accent : "var(--text-4)", width: 10, flexShrink: 0 }}>
                  {added ? "+" : " "}
                </span>
                <span style={{ minWidth: 0, wordBreak: "break-all" }}>{line}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
