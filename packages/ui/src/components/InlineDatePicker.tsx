"use client";

import React, { useMemo, useState } from "react";

export interface InlineDatePickerProps {
  defaultDate?: Date;
  accent?: string;
  onChange?: (d: Date) => void;
  label?: string;
}

const DOW = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatHeader(d: Date) {
  return d.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

export function InlineDatePicker({
  defaultDate = new Date(),
  accent = "var(--accent)",
  onChange,
  label = "Select a date",
}: InlineDatePickerProps) {
  const [view, setView] = useState(() => startOfMonth(defaultDate));
  const [selected, setSelected] = useState<Date>(defaultDate);
  const today = useMemo(() => new Date(), []);

  const days = useMemo(() => {
    const first = startOfMonth(view);
    // Convert to Monday-start: getDay() Sun=0..Sat=6 → shift so Mon=0..Sun=6
    const leading = (first.getDay() + 6) % 7;
    const start = new Date(first);
    start.setDate(first.getDate() - leading);
    const out: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      out.push(d);
    }
    return out;
  }, [view]);

  const shift = (delta: number) => {
    const next = new Date(view);
    next.setMonth(view.getMonth() + delta);
    setView(next);
  };

  const pick = (d: Date) => {
    setSelected(d);
    onChange?.(d);
    if (d.getMonth() !== view.getMonth()) setView(startOfMonth(d));
  };

  return (
    <div
      role="group"
      aria-label={label}
      style={{
        width: "100%",
        maxWidth: 320,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 14,
        fontFamily: "var(--font-sans)",
        boxShadow: `0 18px 40px -20px rgba(0,0,0,0.45), 0 0 24px -16px ${accent}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 600 }}>{formatHeader(view)}</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {(["−", "today", "+"] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => {
                if (kind === "−") shift(-1);
                else if (kind === "+") shift(1);
                else {
                  pick(new Date());
                }
              }}
              aria-label={kind === "−" ? "Previous month" : kind === "+" ? "Next month" : "Today"}
              style={{
                width: kind === "today" ? "auto" : 26,
                height: 26,
                padding: kind === "today" ? "0 8px" : 0,
                background: "var(--bg-3)",
                border: "1px solid var(--edge)",
                borderRadius: 6,
                color: "var(--text-2)",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                lineHeight: 1,
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = accent;
                e.currentTarget.style.color = accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--edge)";
                e.currentTarget.style.color = "var(--text-2)";
              }}
            >
              {kind}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 6 }}>
        {DOW.map((d) => (
          <div
            key={d}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--text-4)",
              textAlign: "center",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {days.map((d) => {
          const inMonth = d.getMonth() === view.getMonth();
          const isSelected = isSameDay(d, selected);
          const isToday = isSameDay(d, today);
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => pick(d)}
              aria-label={d.toDateString()}
              aria-pressed={isSelected}
              style={{
                height: 32,
                background: isSelected ? accent : "transparent",
                color: isSelected ? "var(--bg)" : inMonth ? "var(--text)" : "var(--text-4)",
                border: `1px solid ${isSelected ? accent : isToday ? accent : "transparent"}`,
                borderRadius: 7,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: isSelected ? 600 : 500,
                cursor: "pointer",
                position: "relative",
                transition: "all 0.15s ease",
                boxShadow: isSelected ? `0 0 12px -4px ${accent}` : "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) e.currentTarget.style.background = "var(--bg-3)";
              }}
              onMouseLeave={(e) => {
                if (!isSelected) e.currentTarget.style.background = "transparent";
              }}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 10,
          paddingTop: 10,
          borderTop: "1px solid var(--edge)",
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 11,
        }}
      >
        <span style={{ color: "var(--text-3)" }}>Selected</span>
        <span style={{ color: accent, fontWeight: 600 }}>
          {selected.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>
    </div>
  );
}
