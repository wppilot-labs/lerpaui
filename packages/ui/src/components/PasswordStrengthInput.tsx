"use client";

import React, { useId, useMemo, useState } from "react";

export interface PasswordStrengthInputProps {
  label?: string;
  accent?: string;
  minLength?: number;
}

interface Score {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
}

function scorePassword(pw: string): Score {
  if (!pw) return { level: 0, label: "empty", color: "var(--text-4)" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length >= 14) s++;
  const lvl = Math.min(4, s) as Score["level"];
  const meta: Record<Score["level"], Omit<Score, "level">> = {
    0: { label: "empty",  color: "var(--text-4)" },
    1: { label: "weak",   color: "var(--pink)" },
    2: { label: "fair",   color: "var(--amber)" },
    3: { label: "good",   color: "var(--cyan)" },
    4: { label: "strong", color: "var(--mint)" },
  };
  return { level: lvl, ...meta[lvl] };
}

export function PasswordStrengthInput({
  label = "Password",
  accent = "var(--accent)",
  minLength = 8,
}: PasswordStrengthInputProps) {
  const id = useId();
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const score = useMemo(() => scorePassword(value), [value]);
  const tone = focused ? accent : "var(--edge-2)";

  return (
    <div style={{ fontFamily: "var(--font-sans)", width: "100%", maxWidth: 360 }}>
      <label
        htmlFor={id}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: focused ? accent : "var(--text-3)",
          transition: "color 0.18s ease",
        }}
      >
        {label}
      </label>
      <div
        style={{
          marginTop: 6,
          position: "relative",
          height: 44,
          background: "var(--bg-2)",
          border: `1px solid ${tone}`,
          borderRadius: 10,
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          boxShadow: focused ? `0 0 0 3px color-mix(in srgb, ${accent} 16%, transparent)` : "none",
        }}
      >
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-describedby={`${id}-strength`}
          style={{
            position: "absolute",
            inset: 0,
            paddingLeft: 14,
            paddingRight: 50,
            background: "transparent",
            border: 0,
            color: "var(--text)",
            fontFamily: visible ? "var(--font-mono)" : "var(--font-sans)",
            fontSize: 14,
            letterSpacing: visible ? "0.04em" : "0.18em",
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          style={{
            position: "absolute",
            right: 6,
            top: "50%",
            transform: "translateY(-50%)",
            width: 36,
            height: 32,
            background: "transparent",
            border: 0,
            color: visible ? accent : "var(--text-3)",
            cursor: "pointer",
            borderRadius: 6,
            fontFamily: "var(--font-mono)",
            fontSize: 14,
            transition: "color 0.18s ease, background 0.18s ease",
          }}
        >
          {visible ? "◉" : "○"}
        </button>
      </div>
      <div
        id={`${id}-strength`}
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", gap: 3, flex: 1 }}>
          {[1, 2, 3, 4].map((step) => (
            <span
              key={step}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                background: score.level >= step ? score.color : "var(--bg-4)",
                boxShadow: score.level >= step ? `0 0 6px -1px ${score.color}` : "none",
                transition: "background 0.25s ease, box-shadow 0.25s ease",
              }}
            />
          ))}
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: score.color,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            minWidth: 50,
            textAlign: "right",
            transition: "color 0.25s ease",
          }}
        >
          {score.label}
        </span>
      </div>
      <div style={{ marginTop: 6, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>
        {value.length < minLength
          ? `${minLength - value.length} more char(s) · mix case, digit, symbol`
          : "Meets length requirement"}
      </div>
    </div>
  );
}
