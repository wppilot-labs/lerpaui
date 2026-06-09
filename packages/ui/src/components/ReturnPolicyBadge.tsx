"use client";

import React, { useState } from "react";

export interface ReturnPolicyBadgeProps {
  days?: number;
  rule?: string;
  detail?: string;
}

export function ReturnPolicyBadge({
  days = 30,
  rule = "Free returns",
  detail = "Unworn items, original tags, prepaid label included. Refund issued within 5 business days of warehouse receipt.",
}: ReturnPolicyBadgeProps) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block", fontFamily: "var(--font-sans)" }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        aria-expanded={open}
        aria-describedby="ret-pol-tip"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 12px",
          background: "var(--accent-soft)",
          border: "1px solid var(--accent)",
          borderRadius: 8,
          color: "var(--accent)",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.02em",
          cursor: "help",
          transition: "all 0.15s",
        }}
      >
        <span aria-hidden="true">↩</span>
        <span>{days}-day · {rule}</span>
      </button>
      {open ? (
        <div
          id="ret-pol-tip"
          role="tooltip"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            zIndex: 50,
            width: 280,
            padding: 14,
            background: "var(--bg-2)",
            border: "1px solid var(--edge-2)",
            borderRadius: 10,
            boxShadow: "0 18px 40px -16px rgba(0,0,0,0.6), 0 0 24px -8px var(--accent-glow)",
            fontSize: 12,
            color: "var(--text-2)",
            lineHeight: 1.55,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: 6,
            }}
          >
            — policy · {days}d
          </div>
          {detail}
        </div>
      ) : null}
    </div>
  );
}
