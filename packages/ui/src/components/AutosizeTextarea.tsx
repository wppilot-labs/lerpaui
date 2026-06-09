"use client";

import React, { useEffect, useId, useRef, useState } from "react";

export interface AutosizeTextareaProps {
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  accent?: string;
}

export function AutosizeTextarea({
  label = "Release notes",
  placeholder = "Describe what shipped this week…",
  defaultValue = "",
  maxLength = 500,
  minRows = 3,
  maxRows = 10,
  accent = "var(--accent)",
}: AutosizeTextareaProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 22;
    const maxH = lineHeight * maxRows + 24;
    el.style.height = `${Math.min(maxH, el.scrollHeight)}px`;
    el.style.overflowY = el.scrollHeight > maxH ? "auto" : "hidden";
  }, [value, maxRows]);

  const remaining = maxLength - value.length;
  const tone = remaining < 50 ? (remaining < 0 ? "var(--pink)" : "var(--amber)") : "var(--text-3)";

  return (
    <div style={{ width: "100%", maxWidth: 420, fontFamily: "var(--font-sans)" }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: focused ? accent : "var(--text-3)",
          transition: "color 0.18s ease",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      <div
        style={{
          background: "var(--bg-2)",
          border: `1px solid ${focused ? accent : "var(--edge-2)"}`,
          borderRadius: 10,
          padding: "10px 12px",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          boxShadow: focused ? `0 0 0 3px color-mix(in srgb, ${accent} 16%, transparent)` : "none",
        }}
      >
        <textarea
          id={id}
          ref={ref}
          value={value}
          onChange={(e) => {
            const next = maxLength > 0 ? e.target.value.slice(0, maxLength) : e.target.value;
            setValue(next);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          rows={minRows}
          aria-describedby={`${id}-count`}
          style={{
            width: "100%",
            background: "transparent",
            border: 0,
            color: "var(--text)",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            lineHeight: 1.55,
            outline: "none",
            resize: "none",
          }}
        />
      </div>
      <div
        id={`${id}-count`}
        style={{
          marginTop: 6,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 10.5,
          color: "var(--text-3)",
        }}
      >
        <span>Markdown supported · ⌘↵ to submit</span>
        <span style={{ color: tone, transition: "color 0.18s ease" }}>
          {value.length} / {maxLength}
        </span>
      </div>
    </div>
  );
}
