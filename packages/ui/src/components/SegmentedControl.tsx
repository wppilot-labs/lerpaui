"use client";

import React, { useState } from "react";

export interface SegmentedOption {
  id: string;
  label: string;
  icon?: string;
}

export interface SegmentedControlProps {
  options?: SegmentedOption[];
  defaultId?: string;
  accent?: string;
  onChange?: (id: string) => void;
  size?: "sm" | "md";
}

const DEFAULT_OPTIONS: SegmentedOption[] = [
  { id: "code", label: "Code", icon: "<>" },
  { id: "preview", label: "Preview", icon: "◉" },
  { id: "split", label: "Split", icon: "▌▐" },
];

export function SegmentedControl({
  options = DEFAULT_OPTIONS,
  defaultId,
  accent = "var(--accent)",
  onChange,
  size = "md",
}: SegmentedControlProps) {
  const [activeId, setActiveId] = useState(defaultId ?? options[0]?.id);
  const h = size === "sm" ? 30 : 36;
  const fs = size === "sm" ? 11.5 : 12.5;
  const activeIndex = Math.max(0, options.findIndex((o) => o.id === activeId));

  const select = (id: string) => {
    setActiveId(id);
    onChange?.(id);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Segmented control"
      style={{
        display: "inline-flex",
        position: "relative",
        height: h,
        padding: 3,
        background: "var(--bg-3)",
        border: "1px solid var(--edge)",
        borderRadius: 10,
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 3,
          bottom: 3,
          left: `calc(3px + ${activeIndex} * (100% - 6px) / ${options.length})`,
          width: `calc((100% - 6px) / ${options.length})`,
          background: accent,
          borderRadius: 7,
          boxShadow: `0 0 14px -4px ${accent}`,
          transition: "left 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
      {options.map((o) => {
        const active = o.id === activeId;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => select(o.id)}
            style={{
              position: "relative",
              zIndex: 1,
              padding: "0 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "transparent",
              border: 0,
              color: active ? "var(--bg)" : "var(--text-2)",
              fontSize: fs,
              fontWeight: active ? 600 : 500,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "color 0.18s ease",
            }}
          >
            {o.icon ? (
              <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontSize: fs - 1 }}>
                {o.icon}
              </span>
            ) : null}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
