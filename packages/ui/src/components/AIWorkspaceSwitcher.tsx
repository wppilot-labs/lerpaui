"use client";

import React, { useState } from "react";

export interface Workspace {
  id: string;
  name: string;
  team?: string;
  initials?: string;
  badge?: string;
  members?: number;
}

export interface AIWorkspaceSwitcherProps {
  workspaces?: Workspace[];
  defaultSelectedId?: string;
  accent?: string;
  onChange?: (w: Workspace) => void;
}

const DEFAULT: Workspace[] = [
  { id: "w1", name: "Lerpa personal", initials: "C",  members: 1 },
  { id: "w2", name: "Lerpa UI core",   team: "team", initials: "LU", badge: "pro", members: 14 },
  { id: "w3", name: "Acme staging",    team: "client", initials: "A",  members: 6 },
];

export function AIWorkspaceSwitcher({ workspaces = DEFAULT, defaultSelectedId = "w2", accent = "var(--accent)", onChange }: AIWorkspaceSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(defaultSelectedId);
  const current = workspaces.find((w) => w.id === selected) ?? workspaces[0];

  return (
    <div style={{ position: "relative", fontFamily: "var(--font-sans)", width: "100%", maxWidth: 300 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        style={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "32px 1fr auto",
          gap: 10,
          alignItems: "center",
          padding: "8px 12px",
          background: "var(--bg-2)",
          border: "1px solid var(--edge-2)",
          borderRadius: 10,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            width: 30,
            height: 30,
            borderRadius: 7,
            background: accent,
            color: "var(--bg)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 700,
            boxShadow: `0 0 12px -4px ${accent}`,
          }}
        >
          {current.initials || current.name.charAt(0)}
        </span>
        <div style={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 0 }}>
          <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current.name}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>{current.team ?? "personal"}{current.members ? ` · ${current.members} ` : " "}{current.members && current.members > 1 ? "members" : "member"}</span>
        </div>
        <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)", fontSize: 11, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>▾</span>
      </button>

      {open ? (
        <div role="listbox" aria-label="Workspace" style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "var(--bg-2)", border: "1px solid var(--edge-2)", borderRadius: 10, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.6)", padding: 6, zIndex: 10 }}>
          {workspaces.map((w) => {
            const active = w.id === selected;
            return (
              <button
                key={w.id}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  setSelected(w.id);
                  setOpen(false);
                  onChange?.(w);
                }}
                style={{
                  width: "100%",
                  display: "grid",
                  gridTemplateColumns: "26px 1fr auto",
                  gap: 8,
                  alignItems: "center",
                  padding: "8px 10px",
                  background: active ? "var(--bg-3)" : "transparent",
                  border: active ? `1px solid ${accent}` : "1px solid transparent",
                  borderRadius: 6,
                  textAlign: "left",
                  cursor: "pointer",
                  marginBottom: 2,
                }}
              >
                <span aria-hidden="true" style={{ width: 24, height: 24, borderRadius: 5, background: active ? accent : "var(--bg-4)", color: active ? "var(--bg)" : "var(--text-3)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 700 }}>
                  {w.initials || w.name.charAt(0)}
                </span>
                <span style={{ fontSize: 12.5, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.name}</span>
                {w.badge ? <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "var(--accent-soft)", color: accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>{w.badge}</span> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
