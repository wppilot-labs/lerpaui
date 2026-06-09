"use client";

import React, { useState } from "react";

export interface AIChatSession {
  id: string;
  title: string;
  preview?: string;
  timestamp?: string;
  pinned?: boolean;
  group?: string;
}

export interface AIChatSidebarProps {
  sessions?: AIChatSession[];
  activeId?: string;
  accent?: string;
  width?: number | string;
  onSelect?: (id: string) => void;
  onNewChat?: () => void;
}

const DEFAULT_SESSIONS: AIChatSession[] = [
  { id: "s1", title: "Build settings page", preview: "Sidebar + billing tabs…", timestamp: "now", pinned: true, group: "Today" },
  { id: "s2", title: "Theme switcher refactor", preview: "Lime → violet runtime swap.", timestamp: "12m", group: "Today" },
  { id: "s3", title: "Reduce LCP under 1s", preview: "Hero image priority + preload.", timestamp: "2h", group: "Today" },
  { id: "s4", title: "A11y audit for forms", preview: "axe-core 0 errors target.", timestamp: "Yesterday", group: "Yesterday" },
  { id: "s5", title: "RAG citation UI", preview: "Inline pills with hover detail.", timestamp: "Yesterday", group: "Yesterday" },
  { id: "s6", title: "Migrate to Tailwind v4", preview: "@theme block + token map.", timestamp: "2d", group: "Earlier" },
];

export function AIChatSidebar({
  sessions = DEFAULT_SESSIONS,
  activeId = "s1",
  accent = "var(--accent)",
  width = 260,
  onSelect,
  onNewChat,
}: AIChatSidebarProps) {
  const [q, setQ] = useState("");

  const filtered = q.trim()
    ? sessions.filter((s) => s.title.toLowerCase().includes(q.toLowerCase()) || (s.preview ?? "").toLowerCase().includes(q.toLowerCase()))
    : sessions;

  const grouped = filtered.reduce<Record<string, AIChatSession[]>>((acc, s) => {
    const g = s.group ?? "All";
    if (!acc[g]) acc[g] = [];
    acc[g].push(s);
    return acc;
  }, {});

  return (
    <aside
      style={{
        width,
        background: "var(--bg-2)",
        border: "1px solid var(--edge)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        height: 480,
      }}
      role="navigation"
      aria-label="Chat history"
    >
      <div style={{ padding: 12, borderBottom: "1px solid var(--edge)", display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
        <button
          type="button"
          onClick={onNewChat}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            height: 44,
            padding: "0 12px",
            background: accent,
            color: "var(--bg)",
            border: 0,
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 500,
            fontSize: 13,
            boxShadow: `0 0 14px -4px ${accent}`,
          }}
        >
          <span aria-hidden="true" style={{ fontFamily: "var(--font-mono)", fontSize: 14 }}>+</span>
          New chat
        </button>
        <div style={{ position: "relative" }}>
          <label htmlFor="ai-side-search" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}>
            Search chats
          </label>
          <input
            id="ai-side-search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            style={{
              width: "100%",
              height: 40,
              padding: "0 12px",
              background: "var(--bg)",
              border: "1px solid var(--edge-2)",
              borderRadius: 8,
              color: "var(--text)",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              outline: "none",
            }}
          />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 8 }}>
        {Object.keys(grouped).length === 0 ? (
          <div style={{ padding: 30, textAlign: "center", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-3)" }}>
            no chats match.
          </div>
        ) : (
          Object.entries(grouped).map(([group, items]) => (
            <div key={group} style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-3)",
                  padding: "6px 10px",
                }}
              >
                {group}
              </div>
              {items.map((s) => {
                const active = s.id === activeId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelect?.(s.id)}
                    aria-current={active ? "true" : undefined}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      background: active ? "var(--bg-3)" : "transparent",
                      border: active ? `1px solid ${accent}` : "1px solid transparent",
                      borderRadius: 8,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: 2,
                      transition: "all 0.15s",
                      color: "var(--text)",
                      marginBottom: 2,
                    }}
                    onMouseEnter={(e) => {
                      if (!active) e.currentTarget.style.background = "var(--bg-3)";
                    }}
                    onMouseLeave={(e) => {
                      if (!active) e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {s.pinned ? (
                        <span style={{ color: accent, fontFamily: "var(--font-mono)", fontSize: 10 }} aria-label="pinned">
                          ★
                        </span>
                      ) : null}
                      <span style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {s.title}
                      </span>
                      {s.timestamp ? (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--text-4)" }}>{s.timestamp}</span>
                      ) : null}
                    </div>
                    {s.preview ? (
                      <span
                        style={{
                          fontSize: 11.5,
                          color: "var(--text-3)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.preview}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
