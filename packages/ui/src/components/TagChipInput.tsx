"use client";

import React, { useRef, useState } from "react";

export interface TagChipInputProps {
  defaultTags?: string[];
  placeholder?: string;
  maxTags?: number;
  accent?: string;
  onChange?: (tags: string[]) => void;
}

const DEFAULT_TAGS = ["next.js", "react-19", "tailwind"];

export function TagChipInput({
  defaultTags = DEFAULT_TAGS,
  placeholder = "Add tag…",
  maxTags = 8,
  accent = "var(--accent)",
  onChange,
}: TagChipInputProps) {
  const [tags, setTags] = useState(defaultTags);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const update = (next: string[]) => {
    setTags(next);
    onChange?.(next);
  };

  const add = (raw: string) => {
    const t = raw.trim().toLowerCase().replace(/^#/, "");
    if (!t) return;
    if (tags.includes(t)) return;
    if (tags.length >= maxTags) return;
    update([...tags, t]);
    setValue("");
  };

  const remove = (t: string) => update(tags.filter((x) => x !== t));

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(value);
    } else if (e.key === "Backspace" && !value && tags.length) {
      remove(tags[tags.length - 1]);
    }
  };

  const full = tags.length >= maxTags;

  return (
    <div style={{ fontFamily: "var(--font-sans)", width: "100%", maxWidth: 380 }}>
      <div
        onClick={() => inputRef.current?.focus()}
        role="presentation"
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
          minHeight: 42,
          padding: "6px 8px",
          background: "var(--bg-2)",
          border: `1px solid var(--edge-2)`,
          borderRadius: 10,
          cursor: "text",
        }}
      >
        {tags.map((t) => (
          <span
            key={t}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              height: 26,
              padding: "0 6px 0 10px",
              background: `color-mix(in srgb, ${accent} 14%, transparent)`,
              border: `1px solid ${accent}`,
              borderRadius: 6,
              color: accent,
              fontFamily: "var(--font-mono)",
              fontSize: 11.5,
              animation: "ai-fade-up 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
            }}
          >
            <span>{t}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                remove(t);
              }}
              aria-label={`Remove ${t}`}
              style={{
                width: 16,
                height: 16,
                display: "grid",
                placeItems: "center",
                background: "transparent",
                border: 0,
                color: accent,
                cursor: "pointer",
                borderRadius: 3,
                fontSize: 11,
                lineHeight: 1,
                opacity: 0.7,
                transition: "opacity 0.15s ease, background 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.background = "color-mix(in srgb, " + accent + " 18%, transparent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "0.7";
                e.currentTarget.style.background = "transparent";
              }}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKey}
          disabled={full}
          placeholder={full ? "Max reached" : placeholder}
          aria-label="New tag"
          style={{
            flex: 1,
            minWidth: 80,
            height: 26,
            background: "transparent",
            border: 0,
            color: "var(--text)",
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            outline: "none",
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
          color: "var(--text-3)",
        }}
      >
        <span>Enter or , to add</span>
        <span style={{ color: tags.length === maxTags ? accent : "var(--text-3)" }}>
          {tags.length} / {maxTags}
        </span>
      </div>
    </div>
  );
}
