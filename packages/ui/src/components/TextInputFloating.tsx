"use client";

import React, { useId, useState } from "react";

export interface TextInputFloatingProps {
  label?: string;
  defaultValue?: string;
  type?: "text" | "email" | "url" | "tel";
  accent?: string;
  error?: string;
  hint?: string;
  icon?: string;
}

export function TextInputFloating({
  label = "Workspace URL",
  defaultValue = "",
  type = "text",
  accent = "var(--accent)",
  error,
  hint = "Letters, numbers, dashes",
  icon,
}: TextInputFloatingProps) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const tone = error ? "var(--pink)" : focused ? accent : "var(--edge-2)";

  return (
    <div style={{ fontFamily: "var(--font-sans)", width: "100%", maxWidth: 360 }}>
      <div
        style={{
          position: "relative",
          height: 56,
          background: "var(--bg-2)",
          border: `1px solid ${tone}`,
          borderRadius: 10,
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          boxShadow: focused && !error ? `0 0 0 3px color-mix(in srgb, ${accent} 18%, transparent)` : error ? `0 0 0 3px color-mix(in srgb, var(--pink) 14%, transparent)` : "none",
        }}
      >
        <label
          htmlFor={id}
          style={{
            position: "absolute",
            left: icon ? 38 : 14,
            top: floated ? 8 : "50%",
            transform: floated ? "none" : "translateY(-50%)",
            fontSize: floated ? 10.5 : 13.5,
            color: error ? "var(--pink)" : floated ? (focused ? accent : "var(--text-3)") : "var(--text-3)",
            letterSpacing: floated ? "0.08em" : "0",
            textTransform: floated ? "uppercase" : "none",
            pointerEvents: "none",
            transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
            background: floated ? "var(--bg-2)" : "transparent",
            padding: floated ? "0 4px" : 0,
          }}
        >
          {label}
        </label>
        {icon ? (
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily: "var(--font-mono)",
              fontSize: 14,
              color: focused ? accent : "var(--text-3)",
              transition: "color 0.18s ease",
            }}
          >
            {icon}
          </span>
        ) : null}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={!!error}
          aria-describedby={`${id}-hint`}
          style={{
            position: "absolute",
            inset: 0,
            paddingTop: floated ? 22 : 0,
            paddingLeft: icon ? 38 : 14,
            paddingRight: 14,
            background: "transparent",
            border: 0,
            color: "var(--text)",
            fontFamily: "var(--font-sans)",
            fontSize: 14,
            outline: "none",
          }}
        />
      </div>
      <div
        id={`${id}-hint`}
        style={{
          marginTop: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: error ? "var(--pink)" : "var(--text-3)",
          minHeight: 14,
          transition: "color 0.18s ease",
        }}
      >
        {error ? `× ${error}` : hint}
      </div>
    </div>
  );
}
