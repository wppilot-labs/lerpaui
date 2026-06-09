"use client";

import React from "react";

export interface AffirmInstallmentBadgeProps {
  total?: number;
  installments?: number;
  apr?: number;
  provider?: string;
}

export function AffirmInstallmentBadge({
  total = 132,
  installments = 4,
  apr = 0,
  provider = "Affirm",
}: AffirmInstallmentBadgeProps) {
  const per = total / installments;
  return (
    <div
      role="note"
      aria-label={`${installments} interest-free payments of $${per.toFixed(2)} via ${provider}`}
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 10,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        maxWidth: 360,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          background: "var(--accent)",
          color: "var(--bg)",
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 13,
          letterSpacing: "-0.01em",
          display: "grid",
          placeItems: "center",
          boxShadow: "0 0 16px -4px var(--accent-glow)",
        }}
      >
        {provider}
      </div>
      <div style={{ padding: "10px 14px", display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>
          {installments} payments of <span style={{ color: "var(--accent)" }}>${per.toFixed(2)}</span>
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
          {apr === 0 ? "0% APR · no fees" : `${apr.toFixed(1)}% APR · soft check`}
        </span>
      </div>
    </div>
  );
}
