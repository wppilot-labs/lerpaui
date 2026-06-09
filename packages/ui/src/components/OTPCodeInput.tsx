"use client";

import React, { useEffect, useRef, useState } from "react";

export interface OTPCodeInputProps {
  length?: number;
  accent?: string;
  onComplete?: (code: string) => void;
  label?: string;
}

export function OTPCodeInput({
  length = 6,
  accent = "var(--accent)",
  onComplete,
  label = "Enter verification code",
}: OTPCodeInputProps) {
  const [digits, setDigits] = useState<string[]>(() => Array(length).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const code = digits.join("");
    if (code.length === length && digits.every((d) => d !== "")) {
      setSubmitted(true);
      onComplete?.(code);
      window.setTimeout(() => setSubmitted(false), 1500);
    }
  }, [digits, length, onComplete]);

  const setAt = (idx: number, val: string) => {
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  };

  const onChange = (idx: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) {
      setAt(idx, "");
      return;
    }
    // Allow paste of full code
    if (raw.length > 1) {
      const chars = raw.replace(/\D/g, "").slice(0, length).split("");
      setDigits((prev) => {
        const next = [...prev];
        chars.forEach((c, i) => {
          if (idx + i < length) next[idx + i] = c;
        });
        return next;
      });
      const last = Math.min(length - 1, idx + chars.length);
      refs.current[last]?.focus();
      return;
    }
    const ch = raw.slice(-1);
    if (!/\d/.test(ch)) return;
    setAt(idx, ch);
    if (idx < length - 1) refs.current[idx + 1]?.focus();
  };

  const onKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      refs.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < length - 1) {
      refs.current[idx + 1]?.focus();
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-sans)", display: "flex", flexDirection: "column", gap: 10 }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: submitted ? accent : "var(--text-3)",
          transition: "color 0.2s ease",
        }}
      >
        {submitted ? "✓ verified" : label}
      </span>
      <div style={{ display: "flex", gap: 8 }}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={i === 0 ? length : 1}
            value={d}
            onChange={(e) => onChange(i, e)}
            onKeyDown={(e) => onKeyDown(i, e)}
            onFocus={(e) => e.currentTarget.select()}
            aria-label={`Digit ${i + 1} of ${length}`}
            style={{
              width: 44,
              height: 52,
              textAlign: "center",
              background: "var(--bg-2)",
              border: `1px solid ${d ? accent : "var(--edge-2)"}`,
              borderRadius: 10,
              color: "var(--text)",
              fontFamily: "var(--font-mono)",
              fontSize: 20,
              fontWeight: 600,
              outline: "none",
              transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
              boxShadow: d ? `0 0 14px -4px ${accent}` : "none",
              animation: submitted ? `ai-token-tick 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${i * 40}ms both` : undefined,
            }}
          />
        ))}
      </div>
    </div>
  );
}
