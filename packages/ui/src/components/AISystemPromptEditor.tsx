"use client";

import React, { useState } from "react";

export interface SystemPromptTemplate {
  id: string;
  label: string;
  body: string;
}

export interface AISystemPromptEditorProps {
  defaultPrompt?: string;
  templates?: SystemPromptTemplate[];
  accent?: string;
  maxLength?: number;
  onSave?: (text: string) => void;
}

const DEFAULT_TEMPLATES: SystemPromptTemplate[] = [
  {
    id: "support",
    label: "Support agent",
    body: "You are a friendly support agent for Lerpa UI. Be concise, cite docs sources, and never guess. If you don't know, say so and offer to open a ticket.",
  },
  {
    id: "coder",
    label: "Coding pair",
    body: "You are a senior pair-programmer. Always ask before destructive operations, prefer the smallest diff, write tests when changing behaviour, and use TypeScript strict mode.",
  },
  {
    id: "writer",
    label: "Marketing writer",
    body: "You are a punchy marketing copywriter. Lead with the benefit, keep sentences under 18 words, drop hedging adverbs, and finish with a single CTA.",
  },
];

export function AISystemPromptEditor({
  defaultPrompt = DEFAULT_TEMPLATES[0].body,
  templates = DEFAULT_TEMPLATES,
  accent = "var(--accent)",
  maxLength = 2000,
  onSave,
}: AISystemPromptEditorProps) {
  const [value, setValue] = useState(defaultPrompt);
  const [activeTpl, setActiveTpl] = useState<string | undefined>(templates[0]?.id);

  const applyTpl = (t: SystemPromptTemplate) => {
    setActiveTpl(t.id);
    setValue(t.body);
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
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
      aria-label="System prompt editor"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
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
          system prompt
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: value.length > maxLength * 0.9 ? "var(--amber)" : "var(--text-3)" }}>
          {value.length}/{maxLength}
        </span>
      </div>

      {/* template chips */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {templates.map((t, idx) => {
          const active = t.id === activeTpl;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => applyTpl(t)}
              aria-pressed={active}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                padding: "4px 9px",
                background: active ? "var(--accent-soft)" : "var(--bg)",
                border: `1px solid ${active ? accent : "var(--edge)"}`,
                borderRadius: 5,
                color: active ? accent : "var(--text-3)",
                cursor: "pointer",
                transition: "background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease",
                transform: active ? "translateY(-1px)" : "translateY(0)",
                boxShadow: active ? `0 0 10px -4px ${accent}` : "none",
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 70}ms both`,
              }}
            >
              {active ? "✓ " : "+ "}{t.label}
            </button>
          );
        })}
      </div>

      <label htmlFor="sys-prompt" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        System prompt body
      </label>
      <textarea
        id="sys-prompt"
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, maxLength))}
        rows={8}
        placeholder="You are a helpful assistant…"
        style={{
          width: "100%",
          background: "var(--bg)",
          border: "1px solid var(--edge-2)",
          borderRadius: 10,
          padding: "10px 12px",
          color: "var(--text)",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.55,
          outline: "none",
          resize: "vertical",
          minHeight: 140,
        }}
      />

      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={() => {
            setValue("");
            setActiveTpl(undefined);
          }}
          style={{
            height: 32,
            padding: "0 12px",
            background: "transparent",
            color: "var(--text-3)",
            border: "1px solid var(--edge-2)",
            borderRadius: 7,
            fontSize: 12,
            cursor: "pointer",
          }}
        >
          Clear
        </button>
        <button
          type="button"
          onClick={() => onSave?.(value)}
          disabled={value.length === 0}
          style={{
            height: 32,
            padding: "0 14px",
            background: value.length ? accent : "var(--bg-3)",
            color: value.length ? "var(--bg)" : "var(--text-4)",
            border: 0,
            borderRadius: 7,
            fontSize: 12,
            fontWeight: 500,
            cursor: value.length ? "pointer" : "not-allowed",
            boxShadow: value.length ? `0 0 12px -4px ${accent}` : "none",
            transition: "transform 0.18s ease, box-shadow 0.18s ease",
            animation: value.length ? "ai-glow-pulse 2.6s ease-in-out infinite" : "none",
          }}
        >
          Save prompt
        </button>
      </div>
    </div>
  );
}
