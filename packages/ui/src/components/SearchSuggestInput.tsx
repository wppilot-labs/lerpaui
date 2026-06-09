"use client";

import React, { useMemo, useRef, useState } from "react";

export interface SearchItem {
  id: string;
  label: string;
  kind?: string;
  hint?: string;
}

export interface SearchSuggestInputProps {
  items?: SearchItem[];
  placeholder?: string;
  accent?: string;
  onSelect?: (id: string) => void;
}

const DEFAULT_ITEMS: SearchItem[] = [
  { id: "btn-primary", label: "PrimaryActionButton", kind: "button", hint: "buttons" },
  { id: "txt-floating", label: "TextInputFloating", kind: "input", hint: "buttons" },
  { id: "ai-chat", label: "AIChatInterface", kind: "ai", hint: "ai" },
  { id: "tag-chip", label: "TagChipInput", kind: "input", hint: "buttons" },
  { id: "card-flip", label: "FlipCardProductVertical", kind: "card", hint: "cards" },
  { id: "otp", label: "OTPCodeInput", kind: "input", hint: "buttons" },
];

const KIND_COLOR: Record<string, string> = {
  button: "var(--accent)",
  input: "var(--cyan)",
  ai: "var(--violet)",
  card: "var(--pink)",
};

export function SearchSuggestInput({
  items = DEFAULT_ITEMS,
  placeholder = "Search components…",
  accent = "var(--accent)",
  onSelect,
}: SearchSuggestInputProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 5);
    return items.filter((i) => i.label.toLowerCase().includes(q) || (i.kind ?? "").toLowerCase().includes(q)).slice(0, 6);
  }, [items, query]);

  const select = (id: string) => {
    onSelect?.(id);
    setQuery("");
    setFocused(false);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(results.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[cursor];
      if (hit) select(hit.id);
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const show = focused && results.length > 0;

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 380, fontFamily: "var(--font-sans)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          height: 42,
          padding: "0 14px",
          background: "var(--bg-2)",
          border: `1px solid ${focused ? accent : "var(--edge-2)"}`,
          borderRadius: 10,
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          boxShadow: focused ? `0 0 0 3px color-mix(in srgb, ${accent} 16%, transparent)` : "none",
        }}
      >
        <span aria-hidden="true" style={{ color: focused ? accent : "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: 14, transition: "color 0.18s ease" }}>
          ⌕
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCursor(0);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => window.setTimeout(() => setFocused(false), 120)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          role="combobox"
          aria-controls="search-suggest-listbox"
          aria-expanded={show}
          aria-autocomplete="list"
          aria-label="Search"
          style={{
            flex: 1,
            background: "transparent",
            border: 0,
            color: "var(--text)",
            fontSize: 13.5,
            outline: "none",
            fontFamily: "var(--font-sans)",
          }}
        />
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            padding: "2px 6px",
            borderRadius: 3,
            border: "1px solid var(--edge)",
            color: "var(--text-3)",
          }}
        >
          ⌘K
        </span>
      </div>
      {show ? (
        <div
          id="search-suggest-listbox"
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "var(--bg-2)",
            border: "1px solid var(--edge-2)",
            borderRadius: 10,
            padding: 6,
            boxShadow: `0 24px 60px -20px rgba(0,0,0,0.6), 0 0 30px -16px ${accent}`,
            zIndex: 10,
            animation: "ai-fade-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {results.map((r, i) => {
            const active = i === cursor;
            const tone = KIND_COLOR[r.kind ?? ""] ?? accent;
            return (
              <button
                key={r.id}
                type="button"
                role="option"
                aria-selected={active}
                onMouseEnter={() => setCursor(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(r.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  background: active ? "var(--bg-3)" : "transparent",
                  border: 0,
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  color: "var(--text)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 5,
                    background: `color-mix(in srgb, ${tone} 20%, transparent)`,
                    color: tone,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {(r.kind ?? "?").slice(0, 1).toUpperCase()}
                </span>
                <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</span>
                {r.hint ? (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-4)" }}>{r.hint}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
