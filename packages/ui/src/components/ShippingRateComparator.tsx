"use client";

import React, { useState } from "react";

export interface ShippingRate {
  id: string;
  carrier: string;
  service: string;
  eta: string;
  price: number;
  badge?: "fastest" | "cheapest" | "free";
}

const DEFAULT_RATES: ShippingRate[] = [
  { id: "std",   carrier: "DHL Standard",  service: "Ground",  eta: "5-7 days", price: 0,    badge: "free" },
  { id: "exp",   carrier: "DHL Express",   service: "Priority", eta: "2-3 days", price: 8.5,  badge: "cheapest" },
  { id: "next",  carrier: "FedEx",         service: "Overnight", eta: "Tomorrow", price: 22.0, badge: "fastest" },
];

const BADGE_COLOR: Record<NonNullable<ShippingRate["badge"]>, { bg: string; fg: string }> = {
  free: { bg: "var(--accent-soft)", fg: "var(--accent)" },
  cheapest: { bg: "rgba(95,223,255,0.14)", fg: "var(--cyan)" },
  fastest: { bg: "rgba(255,61,119,0.14)", fg: "var(--pink)" },
};

export interface ShippingRateComparatorProps {
  rates?: ShippingRate[];
  defaultSelected?: string;
  onSelect?: (rate: ShippingRate) => void;
}

export function ShippingRateComparator({
  rates = DEFAULT_RATES,
  defaultSelected = "exp",
  onSelect,
}: ShippingRateComparatorProps) {
  const [selected, setSelected] = useState(defaultSelected);

  const pick = (r: ShippingRate) => {
    setSelected(r.id);
    onSelect?.(r);
  };

  return (
    <div
      style={{
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        maxWidth: 540,
      }}
      role="radiogroup"
      aria-label="Shipping rate"
    >
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-3)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: 14,
        }}
      >
        ● select carrier
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {rates.map((r) => {
          const active = r.id === selected;
          const badgeStyle = r.badge ? BADGE_COLOR[r.badge] : null;
          return (
            <button
              type="button"
              key={r.id}
              role="radio"
              aria-checked={active}
              onClick={() => pick(r)}
              style={{
                display: "grid",
                gridTemplateColumns: "20px 1fr auto",
                gap: 14,
                alignItems: "center",
                padding: 14,
                background: active ? "var(--bg-3)" : "var(--bg)",
                border: `1px solid ${active ? "var(--accent)" : "var(--edge-2)"}`,
                borderRadius: 10,
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: active ? "0 0 16px -6px var(--accent-glow)" : "none",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  border: `2px solid ${active ? "var(--accent)" : "var(--edge-2)"}`,
                  background: active ? "var(--accent)" : "transparent",
                  boxShadow: active ? "inset 0 0 0 3px var(--bg)" : "none",
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)" }}>{r.carrier}</span>
                  {badgeStyle ? (
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        padding: "2px 7px",
                        borderRadius: 3,
                        background: badgeStyle.bg,
                        color: badgeStyle.fg,
                      }}
                    >
                      {r.badge}
                    </span>
                  ) : null}
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                  {r.service} · {r.eta}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 18,
                  fontWeight: 500,
                  color: active ? "var(--accent)" : "var(--text)",
                  letterSpacing: "-0.02em",
                }}
              >
                {r.price === 0 ? "Free" : `$${r.price.toFixed(2)}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
