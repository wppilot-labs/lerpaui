"use client";

import React from "react";

export interface EmptyStateCardProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  accent?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

export function EmptyStateCard({
  title = "No projects yet",
  description = "Spin up your first workspace to start shipping in seconds. Templates, theme studio, and a 1235-component library are one click away.",
  primaryLabel = "Create project",
  secondaryLabel = "Browse templates",
  accent = "var(--accent)",
  onPrimary,
  onSecondary,
}: EmptyStateCardProps) {
  return (
    <div
      role="region"
      aria-label={title}
      style={{
        width: "100%",
        maxWidth: 360,
        background: "var(--bg-2)",
        border: "1px dashed var(--edge-2)",
        borderRadius: 16,
        padding: "28px 22px",
        textAlign: "center",
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: -40,
          left: "50%",
          transform: "translateX(-50%)",
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, color-mix(in srgb, ${accent} 22%, transparent), transparent 70%)`,
          animation: "ai-glow-pulse 5s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "relative",
          width: 72,
          height: 72,
          borderRadius: 18,
          background: "var(--bg-3)",
          border: `1px solid ${accent}`,
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-mono)",
          fontSize: 28,
          color: accent,
          boxShadow: `0 0 26px -6px ${accent}, inset 0 0 0 1px color-mix(in srgb, ${accent} 18%, transparent)`,
          animation: "ai-fade-up 0.45s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <span>◇</span>
        <span
          style={{
            position: "absolute",
            inset: -1,
            borderRadius: 18,
            border: `1px solid ${accent}`,
            opacity: 0.35,
            animation: "ai-glow-pulse 2.6s ease-in-out infinite",
          }}
        />
      </div>
      <div style={{ position: "relative" }}>
        <h3
          style={{
            margin: 0,
            fontSize: 17,
            color: "var(--text)",
            fontWeight: 600,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            color: "var(--text-2)",
            lineHeight: 1.55,
            maxWidth: 290,
            marginInline: "auto",
          }}
        >
          {description}
        </p>
      </div>
      <div style={{ position: "relative", display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          type="button"
          onClick={onPrimary}
          style={{
            height: 36,
            padding: "0 16px",
            background: accent,
            color: "var(--bg)",
            border: 0,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: `0 0 18px -4px ${accent}`,
            transition: "transform 0.15s ease",
            fontFamily: "var(--font-sans)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={onSecondary}
          style={{
            height: 36,
            padding: "0 14px",
            background: "transparent",
            color: "var(--text-2)",
            border: "1px solid var(--edge-2)",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "var(--font-sans)",
            transition: "border-color 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = accent;
            e.currentTarget.style.color = accent;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--edge-2)";
            e.currentTarget.style.color = "var(--text-2)";
          }}
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}
