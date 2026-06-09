"use client";

import React, { useState } from "react";

export interface AIPromptInputProps {
  placeholder?: string;
  accent?: string;
  model?: string;
  tools?: string[];
  showTools?: boolean;
  onSubmit?: (text: string, opts: { model: string; tools: string[] }) => void;
}

export function AIPromptInput({
  placeholder = "Ask anything…",
  accent = "var(--accent)",
  model = "claude-opus-4-7",
  tools = ["web", "code", "files"],
  showTools = true,
  onSubmit,
}: AIPromptInputProps) {
  const [value, setValue] = useState("");
  const [activeTools, setActiveTools] = useState<string[]>(["web"]);

  const toggleTool = (t: string) =>
    setActiveTools((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!value.trim()) return;
    onSubmit?.(value.trim(), { model, tools: activeTools });
    setValue("");
  };

  return (
    <form
      onSubmit={submit}
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 14,
        fontFamily: "var(--font-sans)",
        maxWidth: 540,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <label htmlFor="ai-prompt" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        AI prompt
      </label>
      <textarea
        id="ai-prompt"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        rows={3}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "var(--bg)",
          border: "1px solid var(--edge)",
          borderRadius: 10,
          padding: "10px 12px",
          color: "var(--text)",
          fontFamily: "var(--font-sans)",
          fontSize: 14,
          outline: "none",
          resize: "vertical",
          minHeight: 72,
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            padding: "4px 9px",
            background: "var(--bg-3)",
            border: "1px solid var(--edge-2)",
            borderRadius: 6,
            color: "var(--text-2)",
          }}
        >
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
          {model}
        </span>

        {showTools
          ? tools.map((t) => {
              const active = activeTools.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTool(t)}
                  aria-pressed={active}
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    padding: "4px 9px",
                    background: active ? "var(--accent-soft)" : "var(--bg)",
                    border: active ? `1px solid ${accent}` : "1px solid var(--edge)",
                    borderRadius: 6,
                    color: active ? accent : "var(--text-3)",
                    cursor: "pointer",
                    transition: "background 0.18s ease, border-color 0.18s ease, color 0.18s ease, transform 0.18s ease",
                    transform: active ? "translateY(-1px)" : "translateY(0)",
                  }}
                >
                  {active ? "✓ " : "+ "}
                  {t}
                </button>
              );
            })
          : null}

        <button
          type="submit"
          aria-label="Send prompt"
          disabled={!value.trim()}
          style={{
            marginLeft: "auto",
            height: 32,
            padding: "0 14px",
            background: value.trim() ? accent : "var(--bg-3)",
            color: value.trim() ? "var(--bg)" : "var(--text-4)",
            border: 0,
            borderRadius: 8,
            fontWeight: 500,
            fontSize: 12.5,
            cursor: value.trim() ? "pointer" : "not-allowed",
            boxShadow: value.trim() ? `0 0 14px -4px ${accent}` : "none",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            transition: "background 0.2s ease, box-shadow 0.2s ease, transform 0.18s ease",
            transform: value.trim() ? "translateY(0)" : "translateY(0)",
            animation: value.trim() ? "ai-glow-pulse 2.4s ease-in-out infinite" : "none",
          }}
        >
          Send <span aria-hidden="true" style={{ display: "inline-block", animation: value.trim() ? "ai-fade-up 0.5s ease-out" : "none" }}>→</span>
        </button>
      </div>
    </form>
  );
}
