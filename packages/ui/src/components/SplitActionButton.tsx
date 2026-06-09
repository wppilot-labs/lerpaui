"use client";

import React, { useEffect, useRef, useState } from "react";

export interface SplitAction {
  id: string;
  label: string;
  hint?: string;
}

export interface SplitActionButtonProps {
  primaryLabel?: string;
  actions?: SplitAction[];
  accent?: string;
  onPrimary?: () => void;
  onSelect?: (id: string) => void;
}

const DEFAULT_ACTIONS: SplitAction[] = [
  { id: "deploy", label: "Deploy", hint: "↵" },
  { id: "preview", label: "Deploy & open preview", hint: "⌥↵" },
  { id: "dry", label: "Dry run", hint: "⌘D" },
  { id: "rollback", label: "Rollback last", hint: "⌘R" },
];

export function SplitActionButton({
  primaryLabel = "Deploy",
  actions = DEFAULT_ACTIONS,
  accent = "var(--accent)",
  onPrimary,
  onSelect,
}: SplitActionButtonProps) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "inline-block", fontFamily: "var(--font-sans)" }}>
      <div style={{ display: "inline-flex", height: 38, borderRadius: 8, overflow: "hidden", boxShadow: `0 0 18px -8px ${accent}` }}>
        <button
          type="button"
          onClick={onPrimary}
          style={{
            padding: "0 16px",
            background: accent,
            color: "var(--bg)",
            border: 0,
            borderRight: "1px solid color-mix(in srgb, black 20%, transparent)",
            fontSize: 13.5,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
          }}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="More actions"
          style={{
            padding: "0 10px",
            background: accent,
            color: "var(--bg)",
            border: 0,
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            transition: "background 0.15s ease",
          }}
        >
          <span style={{ display: "inline-block", transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "none" }}>▾</span>
        </button>
      </div>
      {open ? (
        <div
          role="menu"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            right: 0,
            minWidth: 220,
            background: "var(--bg-2)",
            border: "1px solid var(--edge-2)",
            borderRadius: 10,
            padding: 6,
            boxShadow: `0 16px 40px -16px rgba(0,0,0,0.6), 0 0 24px -10px ${accent}`,
            zIndex: 10,
            animation: "ai-fade-up 0.2s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {actions.map((a) => (
            <button
              key={a.id}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect?.(a.id);
                setOpen(false);
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: "transparent",
                border: 0,
                borderRadius: 6,
                color: "var(--text)",
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                transition: "background 0.12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--bg-3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ flex: 1 }}>{a.label}</span>
              {a.hint ? (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>{a.hint}</span>
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
