"use client";

import React, { useState } from "react";

export type ArgType = "string" | "number" | "boolean" | "enum";

export interface FunctionArg {
  name: string;
  type: ArgType;
  required?: boolean;
  value: string | number | boolean;
  options?: string[];
  description?: string;
}

export interface AIFunctionArgEditorProps {
  functionName?: string;
  args?: FunctionArg[];
  accent?: string;
}

const DEFAULT_ARGS: FunctionArg[] = [
  { name: "query", type: "string", required: true, value: "pricing page templates", description: "Search query to embed" },
  { name: "limit", type: "number", required: false, value: 8, description: "Max results" },
  { name: "hybrid", type: "boolean", required: false, value: true, description: "Use BM25 + dense" },
  { name: "scope", type: "enum", required: false, value: "user", options: ["user", "team", "global"], description: "Index scope" },
];

const TYPE_COLOR: Record<ArgType, string> = {
  string: "var(--mint)",
  number: "var(--amber)",
  boolean: "var(--pink)",
  enum: "var(--violet)",
};

export function AIFunctionArgEditor({
  functionName = "search_docs",
  args: initialArgs = DEFAULT_ARGS,
  accent = "var(--accent)",
}: AIFunctionArgEditorProps) {
  const [args, setArgs] = useState(initialArgs);

  const update = (idx: number, value: string | number | boolean) => {
    setArgs((prev) => prev.map((a, i) => (i === idx ? { ...a, value } : a)));
  };

  return (
    <div
      role="region"
      aria-label={`Edit arguments for ${functionName}`}
      style={{
        width: "100%",
        maxWidth: 440,
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
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: accent }}>ƒ</span>
        <span style={{ color: "var(--text)" }}>{functionName}</span>
        <span style={{ color: "var(--text-4)" }}>(</span>
        <span style={{ color: "var(--text-3)" }}>{args.length} args</span>
        <span style={{ color: "var(--text-4)" }}>)</span>
        <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          editable
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {args.map((a, idx) => (
          <div
            key={a.name}
            style={{
              padding: "10px 14px",
              borderBottom: idx < args.length - 1 ? "1px solid var(--edge)" : 0,
              display: "flex",
              flexDirection: "column",
              gap: 6,
              animation: `ai-fade-up 0.34s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text)" }}>{a.name}</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  padding: "1px 6px",
                  borderRadius: 3,
                  background: `color-mix(in srgb, ${TYPE_COLOR[a.type]} 18%, transparent)`,
                  color: TYPE_COLOR[a.type],
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {a.type}
              </span>
              {a.required ? (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: accent, letterSpacing: "0.1em" }}>required</span>
              ) : null}
              {a.description ? (
                <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-3)" }}>{a.description}</span>
              ) : null}
            </div>
            {a.type === "boolean" ? (
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(a.value)}
                onClick={() => update(idx, !a.value)}
                style={{
                  width: 44,
                  height: 22,
                  borderRadius: 999,
                  border: 0,
                  padding: 2,
                  background: a.value ? accent : "var(--bg-4)",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.18s ease",
                  boxShadow: a.value ? `0 0 12px -4px ${accent}` : "none",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "var(--bg)",
                    transform: a.value ? "translateX(22px)" : "translateX(0)",
                    transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                />
              </button>
            ) : a.type === "enum" && a.options ? (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {a.options.map((opt) => {
                  const active = opt === a.value;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update(idx, opt)}
                      aria-pressed={active}
                      style={{
                        padding: "3px 10px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        background: active ? "color-mix(in srgb, " + accent + " 14%, transparent)" : "transparent",
                        border: `1px solid ${active ? accent : "var(--edge)"}`,
                        color: active ? accent : "var(--text-3)",
                        borderRadius: 4,
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ) : (
              <input
                type={a.type === "number" ? "number" : "text"}
                value={String(a.value)}
                onChange={(e) =>
                  update(idx, a.type === "number" ? Number(e.target.value) : e.target.value)
                }
                aria-label={a.name}
                style={{
                  width: "100%",
                  padding: "6px 10px",
                  background: "var(--bg)",
                  border: "1px solid var(--edge)",
                  borderRadius: 6,
                  color: "var(--text)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  outline: "none",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
