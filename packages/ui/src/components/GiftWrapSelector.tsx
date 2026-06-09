"use client";

import React, { useState } from "react";

export interface GiftWrapOption {
  id: string;
  label: string;
  price: number;
  gradient: string;
  swatchEmoji?: string;
}

const DEFAULT_OPTIONS: GiftWrapOption[] = [
  { id: "none",   label: "No wrap",        price: 0,    gradient: "linear-gradient(135deg, var(--bg-4), var(--bg-3))", swatchEmoji: "×" },
  { id: "kraft",  label: "Kraft + twine",  price: 4.5,  gradient: "linear-gradient(135deg, #6b4f2e, #a3743a)" },
  { id: "matte",  label: "Matte black",    price: 6.0,  gradient: "linear-gradient(135deg, #0e0b15, #1c1828)" },
  { id: "foil",   label: "Lime foil",      price: 8.0,  gradient: "linear-gradient(135deg, #1a2008, #c9ff37)" },
  { id: "linen",  label: "Linen + ribbon", price: 9.5,  gradient: "linear-gradient(135deg, #d8d2c2, #f4f1f8)" },
];

export interface GiftWrapSelectorProps {
  options?: GiftWrapOption[];
  defaultSelected?: string;
  onChange?: (option: GiftWrapOption, message: string) => void;
}

export function GiftWrapSelector({
  options = DEFAULT_OPTIONS,
  defaultSelected = "kraft",
  onChange,
}: GiftWrapSelectorProps) {
  const [selected, setSelected] = useState(defaultSelected);
  const [message, setMessage] = useState("");
  const current = options.find((o) => o.id === selected) ?? options[0];

  const pick = (o: GiftWrapOption) => {
    setSelected(o.id);
    onChange?.(o, message);
  };

  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 20,
        fontFamily: "var(--font-sans)",
        maxWidth: 480,
        display: "flex",
        flexDirection: "column",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-3)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        <span>● gift wrap</span>
        <span style={{ color: "var(--accent)" }}>
          {current.price === 0 ? "Free" : `+$${current.price.toFixed(2)}`}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label="Gift wrap style"
        style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}
      >
        {options.map((o) => {
          const active = o.id === selected;
          return (
            <button
              type="button"
              key={o.id}
              role="radio"
              aria-checked={active}
              aria-label={o.label}
              title={o.label}
              onClick={() => pick(o)}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 10,
                border: `2px solid ${active ? "var(--text)" : "var(--edge)"}`,
                outline: active ? "2px solid var(--accent)" : "none",
                outlineOffset: 2,
                background: o.gradient,
                cursor: "pointer",
                position: "relative",
                transition: "transform 0.15s",
                transform: active ? "scale(1.04)" : "scale(1)",
                display: "grid",
                placeItems: "center",
                color: "var(--text)",
                fontSize: 18,
                fontFamily: "var(--font-mono)",
              }}
            >
              {o.swatchEmoji ?? ""}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label
          htmlFor="gw-msg"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--text-3)",
          }}
        >
          — message (optional)
        </label>
        <textarea
          id="gw-msg"
          value={message}
          maxLength={140}
          rows={2}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="happy launch day…"
          style={{
            background: "var(--bg)",
            border: "1px solid var(--edge-2)",
            borderRadius: 8,
            padding: "10px 12px",
            color: "var(--text)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            outline: "none",
            resize: "vertical",
            lineHeight: 1.5,
          }}
        />
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)", textAlign: "right" }}>
          {message.length}/140
        </div>
      </div>
    </div>
  );
}
