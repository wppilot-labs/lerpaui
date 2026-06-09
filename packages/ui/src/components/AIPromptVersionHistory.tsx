"use client";

import React, { useState } from "react";

export interface PromptVersion {
  version: string;
  author: string;
  timestamp: string;
  diff: { add: number; remove: number };
  message?: string;
}

export interface AIPromptVersionHistoryProps {
  versions?: PromptVersion[];
  accent?: string;
  promptName?: string;
}

const DEFAULT: PromptVersion[] = [
  { version: "v14", author: "claude",  timestamp: "now",       diff: { add: 12, remove: 4 }, message: "Add tone guideline + cite format" },
  { version: "v13", author: "maya",    timestamp: "12m",       diff: { add: 4,  remove: 9 }, message: "Trim hedging words" },
  { version: "v12", author: "claude",  timestamp: "2h",        diff: { add: 22, remove: 6 }, message: "Insert 3 example pairs" },
  { version: "v11", author: "jules",   timestamp: "Yesterday", diff: { add: 0,  remove: 12 }, message: "Remove deprecated tools list" },
];

export function AIPromptVersionHistory({ versions = DEFAULT, accent = "var(--accent)", promptName = "support-agent.prompt" }: AIPromptVersionHistoryProps) {
  const [active, setActive] = useState(versions[0]?.version);
  return (
    <div
      style={{
        width: "100%",
        maxWidth: 420,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 16,
        fontFamily: "var(--font-sans)",
      }}
      role="region"
      aria-label={`Version history for ${promptName}`}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ color: accent }}>●</span> versions
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{promptName}</div>
      </div>
      <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
        {versions.map((v) => {
          const isActive = v.version === active;
          return (
            <li key={v.version}>
              <button
                type="button"
                onClick={() => setActive(v.version)}
                aria-current={isActive}
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto auto",
                  gap: 10,
                  alignItems: "center",
                  width: "100%",
                  padding: "8px 10px",
                  background: isActive ? "var(--bg-3)" : "var(--bg)",
                  border: `1px solid ${isActive ? accent : "var(--edge)"}`,
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                }}
              >
                <span style={{ color: accent, fontWeight: 600 }}>{v.version}</span>
                <span style={{ color: "var(--text-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.message}</span>
                <span style={{ fontSize: 10, color: "var(--text-3)" }}>
                  <span style={{ color: accent }}>+{v.diff.add}</span> <span style={{ color: "var(--pink)" }}>−{v.diff.remove}</span>
                </span>
                <span style={{ fontSize: 10, color: "var(--text-4)" }}>{v.author} · {v.timestamp}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
