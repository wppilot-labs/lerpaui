"use client";

import React, { useRef, useState } from "react";

export interface Tilt3DGlareCardProps {
  title?: string;
  subtitle?: string;
  body?: string;
  badge?: string;
  accent?: string;
  intensity?: number;
}

export function Tilt3DGlareCard({
  title = "Lerpa UI · Premium",
  subtitle = "1235 token-aligned components",
  body = "Tilt-tracked 3D parallax card with hardware-accelerated transforms and pointer-driven specular glare.",
  badge = "PRO",
  accent = "var(--accent)",
  intensity = 14,
}: Tilt3DGlareCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - y) * intensity;
    const ry = (x - 0.5) * intensity;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    if (glareRef.current) {
      glareRef.current.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, color-mix(in srgb, ${accent} 28%, transparent), transparent 60%)`;
    }
  };

  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "perspective(800px) rotateX(0) rotateY(0)";
    if (glareRef.current) glareRef.current.style.background = "transparent";
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => {
        setHovered(false);
        reset();
      }}
      role="figure"
      aria-label={title}
      style={{
        width: "100%",
        maxWidth: 320,
        background: "linear-gradient(140deg, var(--bg-2), var(--bg))",
        border: "1px solid var(--edge-2)",
        borderRadius: 16,
        padding: 20,
        fontFamily: "var(--font-sans)",
        transformStyle: "preserve-3d",
        transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease",
        boxShadow: hovered
          ? `0 30px 80px -20px rgba(0,0,0,0.55), 0 0 60px -16px ${accent}`
          : `0 12px 30px -16px rgba(0,0,0,0.4)`,
        position: "relative",
        overflow: "hidden",
        willChange: "transform",
        cursor: "default",
      }}
    >
      <div
        ref={glareRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          borderRadius: 16,
          mixBlendMode: "screen",
          transition: "background 0.2s ease",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, transform: "translateZ(40px)" }}>
        <span
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: accent,
            color: "var(--bg)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 16,
            fontWeight: 700,
            boxShadow: `0 0 20px -4px ${accent}`,
            flexShrink: 0,
          }}
        >
          ✦
        </span>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 14.5, color: "var(--text)", fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 11.5, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>{subtitle}</div>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            padding: "2px 8px",
            borderRadius: 4,
            background: `color-mix(in srgb, ${accent} 18%, transparent)`,
            color: accent,
            letterSpacing: "0.12em",
          }}
        >
          {badge}
        </span>
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          color: "var(--text-2)",
          lineHeight: 1.55,
          transform: "translateZ(20px)",
        }}
      >
        {body}
      </p>
      <div
        style={{
          marginTop: 18,
          paddingTop: 14,
          borderTop: "1px solid var(--edge)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-3)",
          transform: "translateZ(30px)",
        }}
      >
        <span style={{ color: accent }}>$</span>
        <span>tilt me — pointer-driven 3D</span>
        <span style={{ marginLeft: "auto", color: hovered ? accent : "var(--text-4)" }}>{hovered ? "live" : "idle"}</span>
      </div>
    </div>
  );
}
