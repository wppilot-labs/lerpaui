"use client";

import React, { useEffect, useRef, useState } from "react";

export interface MultiSelectOption {
  id: string;
  label: string;
  hint?: string;
}

export interface MultiSelectChipsCheckboxProps {
  options?: MultiSelectOption[];
  defaultSelected?: string[];
  label?: string;
  placeholder?: string;
  accent?: string;
  onChange?: (selected: string[]) => void;
}

const DEFAULT_OPTIONS: MultiSelectOption[] = [
  { id: "ai", label: "AI Interfaces", hint: "70 components" },
  { id: "btn", label: "Buttons & Inputs", hint: "41" },
  { id: "card", label: "Data & Cards", hint: "91" },
  { id: "form", label: "Forms", hint: "201" },
  { id: "nav", label: "Navigation", hint: "4" },
  { id: "fb", label: "Feedback", hint: "2" },
];

export function MultiSelectChipsCheckbox({
  options = DEFAULT_OPTIONS,
  defaultSelected = ["ai", "card"],
  label = "Filter categories",
  placeholder = "Choose categories…",
  accent = "var(--accent)",
  onChange,
}: MultiSelectChipsCheckboxProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const toggle = (id: string) => {
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    setSelected(next);
    onChange?.(next);
  };

  const remove = (id: string) => {
    const next = selected.filter((s) => s !== id);
    setSelected(next);
    onChange?.(next);
  };

  const selectedOpts = options.filter((o) => selected.includes(o.id));

  return (
    <div ref={wrapRef} style={{ width: "100%", maxWidth: 380, fontFamily: "var(--font-sans)", position: "relative" }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          display: "block",
          marginBottom: 6,
        }}
      >
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          width: "100%",
          minHeight: 42,
          padding: "6px 10px",
          background: "var(--bg-2)",
          border: `1px solid ${open ? accent : "var(--edge-2)"}`,
          borderRadius: 10,
          cursor: "pointer",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 6,
          textAlign: "left",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          boxShadow: open ? `0 0 0 3px color-mix(in srgb, ${accent} 16%, transparent)` : "none",
        }}
      >
        {selectedOpts.length === 0 ? (
          <span style={{ color: "var(--text-4)", fontSize: 13 }}>{placeholder}</span>
        ) : (
          selectedOpts.map((o) => (
            <span
              key={o.id}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                height: 24,
                padding: "0 6px 0 10px",
                background: `color-mix(in srgb, ${accent} 14%, transparent)`,
                border: `1px solid ${accent}`,
                borderRadius: 6,
                color: accent,
                fontFamily: "var(--font-mono)",
                fontSize: 11,
              }}
            >
              <span>{o.label}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  remove(o.id);
                }}
                aria-label={`Remove ${o.label}`}
                style={{
                  width: 14,
                  height: 14,
                  background: "transparent",
                  border: 0,
                  color: accent,
                  cursor: "pointer",
                  borderRadius: 3,
                  fontSize: 11,
                  lineHeight: 1,
                  opacity: 0.7,
                }}
              >
                ×
              </button>
            </span>
          ))
        )}
        <span style={{ marginLeft: "auto", color: "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: 11, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
          ▾
        </span>
      </button>
      {open ? (
        <div
          role="listbox"
          aria-multiselectable="true"
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
            maxHeight: 260,
            overflowY: "auto",
            animation: "ai-fade-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {options.map((o) => {
            const isOn = selected.includes(o.id);
            return (
              <button
                key={o.id}
                type="button"
                role="option"
                aria-selected={isOn}
                onClick={() => toggle(o.id)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 10px",
                  background: isOn ? "color-mix(in srgb, " + accent + " 8%, transparent)" : "transparent",
                  border: 0,
                  borderRadius: 6,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  color: "var(--text)",
                  transition: "background 0.12s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isOn) e.currentTarget.style.background = "var(--bg-3)";
                }}
                onMouseLeave={(e) => {
                  if (!isOn) e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 4,
                    border: `1.5px solid ${isOn ? accent : "var(--edge-2)"}`,
                    background: isOn ? accent : "transparent",
                    display: "grid",
                    placeItems: "center",
                    color: "var(--bg)",
                    fontSize: 11,
                    fontWeight: 700,
                    flexShrink: 0,
                    boxShadow: isOn ? `0 0 8px -2px ${accent}` : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  {isOn ? "✓" : ""}
                </span>
                <span style={{ flex: 1 }}>{o.label}</span>
                {o.hint ? (
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-4)" }}>
                    {o.hint}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
