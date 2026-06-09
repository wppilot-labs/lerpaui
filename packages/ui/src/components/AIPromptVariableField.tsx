"use client";

import React, { useMemo, useState } from "react";

export interface PromptVariable {
  name: string;
  type?: "text" | "number" | "list";
  defaultValue?: string;
  required?: boolean;
  description?: string;
}

export interface AIPromptVariableFieldProps {
  template?: string;
  variables?: PromptVariable[];
  accent?: string;
}

const DEFAULT_TEMPLATE = "You are a {{role}} helping with {{topic}}. Respond in {{tone}} tone. Always end with a {{cta}}.";
const DEFAULT_VARS: PromptVariable[] = [
  { name: "role",  defaultValue: "support agent",  required: true,  description: "Persona for the assistant" },
  { name: "topic", defaultValue: "billing",         required: true,  description: "Subject domain" },
  { name: "tone",  defaultValue: "friendly",        description: "neutral / friendly / formal" },
  { name: "cta",   defaultValue: "next step",       description: "Call-to-action style" },
];

export function AIPromptVariableField({
  template = DEFAULT_TEMPLATE,
  variables = DEFAULT_VARS,
  accent = "var(--accent)",
}: AIPromptVariableFieldProps) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(variables.map((v) => [v.name, v.defaultValue ?? ""])),
  );

  const filled = useMemo(() => {
    return template.replace(/\{\{(\w+)\}\}/g, (_, k) => values[k] || `{{${k}}}`);
  }, [template, values]);

  const parts = template.split(/(\{\{\w+\}\})/g);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 16,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      role="region"
      aria-label="Prompt variable editor"
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
            animation: "pulse-dot 1.8s ease-in-out infinite",
          }}
        />
        template · {variables.length} vars
      </div>

      {/* template display with highlighted slots */}
      <div
        style={{
          padding: 12,
          background: "var(--bg)",
          border: "1px solid var(--edge)",
          borderRadius: 8,
          fontFamily: "var(--font-mono)",
          fontSize: 12.5,
          color: "var(--text-2)",
          lineHeight: 1.7,
        }}
      >
        {parts.map((p, i) => {
          const m = p.match(/^\{\{(\w+)\}\}$/);
          if (m) {
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  padding: "1px 7px",
                  margin: "0 2px",
                  borderRadius: 4,
                  background: "var(--accent-soft)",
                  border: `1px dashed ${accent}`,
                  color: accent,
                  fontWeight: 600,
                  animation: `ai-glow-pulse 2.4s ease-in-out ${i * 200}ms infinite`,
                }}
              >
                {m[1]}
              </span>
            );
          }
          return <span key={i}>{p}</span>;
        })}
      </div>

      {/* variable fields */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {variables.map((v) => (
          <div key={v.name} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <label htmlFor={`var-${v.name}`} style={{ display: "flex", alignItems: "baseline", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-2)" }}>
              <span style={{ color: accent }}>{`{{${v.name}}}`}</span>
              {v.required ? <span style={{ color: "var(--pink)", fontSize: 9 }}>required</span> : null}
              {v.description ? <span style={{ color: "var(--text-3)", fontSize: 10 }}>· {v.description}</span> : null}
            </label>
            <input
              id={`var-${v.name}`}
              value={values[v.name] ?? ""}
              onChange={(e) => setValues((p) => ({ ...p, [v.name]: e.target.value }))}
              placeholder={v.defaultValue}
              style={{
                width: "100%",
                height: 30,
                padding: "0 10px",
                background: "var(--bg)",
                border: "1px solid var(--edge-2)",
                borderRadius: 6,
                color: "var(--text)",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                outline: "none",
              }}
            />
          </div>
        ))}
      </div>

      {/* resolved preview */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>resolved</span>
        <div
          key={filled}
          style={{
            padding: "8px 10px",
            background: "var(--accent-soft)",
            border: `1px solid ${accent}`,
            borderRadius: 6,
            fontFamily: "var(--font-mono)",
            fontSize: 11.5,
            color: "var(--text)",
            lineHeight: 1.55,
            animation: "ai-fade-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
            boxShadow: `0 0 18px -10px ${accent}`,
          }}
        >
          {filled}
        </div>
      </div>
    </div>
  );
}
