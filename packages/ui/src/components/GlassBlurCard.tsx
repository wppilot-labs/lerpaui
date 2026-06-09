"use client";

import React from "react";

export interface GlassBlurCardProps {
  title?: string;
  subtitle?: string;
  body?: string;
  ctaLabel?: string;
  accent?: string;
}

export function GlassBlurCard({
  title = "Frosted glass surface",
  subtitle = "backdrop-filter blur 20px · saturate 1.6",
  body = "Layered noise + multi-stop gradient + frost blur compose a premium glass surface ready for hero overlays and modal sheets.",
  ctaLabel = "Inspect →",
  accent = "var(--accent)",
}: GlassBlurCardProps) {
  return (
    <div
      role="figure"
      aria-label={title}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        borderRadius: 18,
        padding: 4,
        background: `linear-gradient(135deg, ${accent}, var(--violet), var(--pink))`,
        fontFamily: "var(--font-sans)",
        boxShadow: `0 30px 80px -20px rgba(0,0,0,0.55), 0 0 40px -10px ${accent}`,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(700px 400px at -10% -20%, color-mix(in srgb, var(--cyan) 40%, transparent), transparent 60%), radial-gradient(500px 320px at 110% 120%, color-mix(in srgb, var(--pink) 38%, transparent), transparent 60%)",
          opacity: 0.85,
          animation: "ai-glow-pulse 5.4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "relative",
          background: "color-mix(in srgb, var(--bg-2) 72%, transparent)",
          backdropFilter: "blur(20px) saturate(1.6)",
          WebkitBackdropFilter: "blur(20px) saturate(1.6)",
          borderRadius: 14,
          padding: 22,
          border: "1px solid color-mix(in srgb, white 8%, transparent)",
        }}
      >
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 14,
            background:
              "linear-gradient(180deg, color-mix(in srgb, white 6%, transparent), transparent 50%)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span
              aria-hidden="true"
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${accent}, var(--violet))`,
                color: "var(--bg)",
                display: "grid",
                placeItems: "center",
                fontFamily: "var(--font-mono)",
                fontSize: 16,
                fontWeight: 700,
                boxShadow: `0 0 18px -2px ${accent}`,
              }}
            >
              ✦
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, color: "var(--text)", fontWeight: 600 }}>{title}</div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-3)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.04em",
                }}
              >
                {subtitle}
              </div>
            </div>
          </div>
          <p style={{ margin: 0, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.55 }}>{body}</p>
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              type="button"
              style={{
                height: 34,
                padding: "0 14px",
                background: accent,
                color: "var(--bg)",
                border: 0,
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "var(--font-sans)",
                cursor: "pointer",
                boxShadow: `0 0 16px -4px ${accent}`,
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {ctaLabel}
            </button>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                color: "var(--text-3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              · glassmorphism
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
