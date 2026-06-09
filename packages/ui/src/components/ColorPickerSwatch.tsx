"use client";

import React, { useState } from "react";

export interface ColorPickerSwatchProps {
  defaultColor?: string;
  swatches?: string[];
  label?: string;
  accent?: string;
  onChange?: (color: string) => void;
}

const DEFAULT_SWATCHES = [
  "#6CFF9D",
  "#62D49A",
  "#5FDFFF",
  "#B48CFF",
  "#FF3D77",
  "#FFC347",
  "#FF6B35",
  "#0B0F12",
];

function isValidHex(v: string) {
  return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(v.trim());
}

function normalizeHex(v: string) {
  let h = v.trim().replace(/^#?/, "#");
  if (h.length === 4) {
    h = "#" + h.slice(1).split("").map((c) => c + c).join("");
  }
  return h.toUpperCase();
}

export function ColorPickerSwatch({
  defaultColor = "#62D49A",
  swatches = DEFAULT_SWATCHES,
  label = "Accent color",
  accent = "var(--accent)",
  onChange,
}: ColorPickerSwatchProps) {
  const [color, setColor] = useState(defaultColor);
  const [text, setText] = useState(defaultColor);

  const commit = (val: string) => {
    if (!isValidHex(val)) return;
    const next = normalizeHex(val);
    setColor(next);
    setText(next);
    onChange?.(next);
  };

  return (
    <div style={{ width: "100%", maxWidth: 320, fontFamily: "var(--font-sans)" }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          display: "block",
          marginBottom: 10,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span
          aria-hidden="true"
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: color,
            border: "1px solid var(--edge-2)",
            boxShadow: `0 0 16px -4px ${color}, inset 0 0 0 1px color-mix(in srgb, white 14%, transparent)`,
            transition: "all 0.18s ease",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 10px",
              height: 40,
              background: "var(--bg-2)",
              border: `1px solid var(--edge-2)`,
              borderRadius: 8,
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-3)" }}>#</span>
            <input
              type="text"
              value={text.replace(/^#/, "")}
              onChange={(e) => setText("#" + e.target.value.replace(/^#/, "").toUpperCase())}
              onBlur={() => commit(text)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commit(text);
                  (e.target as HTMLInputElement).blur();
                }
              }}
              maxLength={6}
              aria-label="Hex color value"
              style={{
                flex: 1,
                background: "transparent",
                border: 0,
                color: "var(--text)",
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                letterSpacing: "0.05em",
                outline: "none",
                textTransform: "uppercase",
              }}
            />
            <input
              type="color"
              value={color}
              onChange={(e) => commit(e.target.value)}
              aria-label="Pick color"
              style={{
                width: 26,
                height: 26,
                border: "1px solid var(--edge)",
                borderRadius: 6,
                background: "transparent",
                cursor: "pointer",
                padding: 0,
              }}
            />
          </div>
          <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>
            Enter hex · 3 or 6 chars
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {swatches.map((s) => {
          const active = s.toUpperCase() === color.toUpperCase();
          return (
            <button
              key={s}
              type="button"
              onClick={() => commit(s)}
              aria-label={`Pick ${s}`}
              aria-pressed={active}
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                background: s,
                border: `2px solid ${active ? accent : "var(--edge-2)"}`,
                cursor: "pointer",
                padding: 0,
                boxShadow: active ? `0 0 12px -2px ${accent}, inset 0 0 0 1px color-mix(in srgb, white 16%, transparent)` : "none",
                transition: "all 0.18s ease",
                transform: active ? "scale(1.06)" : "scale(1)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
