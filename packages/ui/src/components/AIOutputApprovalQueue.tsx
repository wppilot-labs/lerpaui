"use client";

import React, { useState } from "react";

export interface QueueItem {
  id: string;
  preview: string;
  category: string;
  flag?: "low" | "med" | "high";
  submittedAt: string;
}

export interface AIOutputApprovalQueueProps {
  items?: QueueItem[];
  accent?: string;
}

const DEFAULT: QueueItem[] = [
  { id: "i1", preview: "Refund processed. Order #4213 was eligible…",      category: "support",     flag: "low",  submittedAt: "12:14" },
  { id: "i2", preview: "Recommend switching to Plus tier — saves you 28%…", category: "sales",       flag: "med",  submittedAt: "12:13" },
  { id: "i3", preview: "Sorry, I can't help with that medical question…",  category: "safety",      flag: "high", submittedAt: "12:11" },
  { id: "i4", preview: "Here's the SQL: SELECT * FROM users WHERE…",        category: "engineering", flag: "med",  submittedAt: "12:08" },
];

const FLAG_COLOR = { low: "var(--accent)", med: "var(--amber)", high: "var(--pink)" };

export function AIOutputApprovalQueue({ items: defaultItems = DEFAULT, accent = "var(--accent)" }: AIOutputApprovalQueueProps) {
  const [items, setItems] = useState(defaultItems);
  const dispatch = (id: string) => setItems((p) => p.filter((x) => x.id !== id));

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 460,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 16,
        fontFamily: "var(--font-sans)",
      }}
      role="region"
      aria-label="Approval queue"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
          <span style={{ color: accent }}>●</span> approval queue
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{items.length} pending</span>
      </div>
      {items.length === 0 ? (
        <div style={{ padding: 30, fontFamily: "var(--font-mono)", fontSize: 12, color: accent, textAlign: "center" }}>
          ✓ queue clear.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {items.map((it) => {
            const flagColor = it.flag ? FLAG_COLOR[it.flag] : accent;
            return (
              <div key={it.id} style={{ padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--edge)", borderLeft: `3px solid ${flagColor}`, borderRadius: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <p style={{ margin: 0, fontSize: 12.5, color: "var(--text)", lineHeight: 1.5 }}>{it.preview}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>
                  <span style={{ padding: "1px 6px", borderRadius: 3, background: `color-mix(in srgb, ${flagColor} 18%, transparent)`, color: flagColor, letterSpacing: "0.08em", textTransform: "uppercase" }}>{it.flag ?? "low"}</span>
                  <span>{it.category}</span>
                  <span>· {it.submittedAt}</span>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                    <button type="button" onClick={() => dispatch(it.id)} aria-label="Approve" style={{ width: 26, height: 22, background: accent, color: "var(--bg)", border: 0, borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>✓</button>
                    <button type="button" onClick={() => dispatch(it.id)} aria-label="Reject" style={{ width: 26, height: 22, background: "transparent", color: "var(--pink)", border: "1px solid var(--pink)", borderRadius: 4, cursor: "pointer", fontWeight: 700 }}>✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
