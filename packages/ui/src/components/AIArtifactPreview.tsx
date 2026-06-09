"use client";

import React, { useState } from "react";

export type ArtifactType = "react" | "html" | "svg" | "markdown";

export interface AIArtifactPreviewProps {
  title?: string;
  type?: ArtifactType;
  code?: string;
  preview?: React.ReactNode;
  versions?: { id: string; label: string }[];
  accent?: string;
  defaultMode?: "preview" | "code";
}

const TYPE_META: Record<ArtifactType, { color: string; label: string }> = {
  react:    { color: "var(--cyan)",   label: "tsx" },
  html:     { color: "var(--amber)",  label: "html" },
  svg:      { color: "var(--violet)", label: "svg" },
  markdown: { color: "var(--mint)",   label: "md" },
};

const DEFAULT_CODE = `export function GlowButton({ children }) {
  return (
    <button className="glow">
      {children}
    </button>
  )
}`;

const DefaultPreview = ({ accent }: { accent: string }) => (
  <button
    type="button"
    style={{
      padding: "12px 24px",
      background: accent,
      color: "var(--bg)",
      border: 0,
      borderRadius: 10,
      fontFamily: "var(--font-sans)",
      fontSize: 14,
      fontWeight: 500,
      boxShadow: `0 0 32px -6px ${accent}`,
      cursor: "pointer",
      animation: "ai-glow-pulse 2.6s ease-in-out infinite",
      transition: "transform 0.18s ease",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
  >
    Ship it →
  </button>
);

export function AIArtifactPreview({
  title = "GlowButton.tsx",
  type = "react",
  code = DEFAULT_CODE,
  preview,
  versions = [
    { id: "v1", label: "v1" },
    { id: "v2", label: "v2" },
    { id: "v3", label: "v3 · latest" },
  ],
  accent = "var(--accent)",
  defaultMode = "preview",
}: AIArtifactPreviewProps) {
  const [mode, setMode] = useState<"preview" | "code">(defaultMode);
  const [activeVersion, setActiveVersion] = useState(versions[versions.length - 1]?.id);
  const meta = TYPE_META[type];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        boxShadow: `0 30px 60px -20px rgba(0,0,0,0.5), 0 0 40px -16px ${accent}`,
        animation: "ai-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
      role="region"
      aria-label={`Artifact: ${title}`}
    >
      {/* head */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--edge)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "var(--bg)",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            padding: "2px 7px",
            borderRadius: 3,
            background: `color-mix(in srgb, ${meta.color} 18%, transparent)`,
            color: meta.color,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            boxShadow: `0 0 8px -2px ${meta.color}`,
            animation: "ai-glow-pulse 2.6s ease-in-out infinite",
          }}
        >
          {meta.label}
        </span>
        <span style={{ fontSize: 12.5, color: "var(--text)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
        <div style={{ display: "flex", background: "var(--bg-3)", border: "1px solid var(--edge)", borderRadius: 6, padding: 2 }}>
          {(["preview", "code"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              style={{
                padding: "4px 10px",
                background: mode === m ? accent : "transparent",
                color: mode === m ? "var(--bg)" : "var(--text-3)",
                border: 0,
                borderRadius: 4,
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                fontWeight: 500,
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                transition: "background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
                boxShadow: mode === m ? `0 0 8px -2px ${accent}` : "none",
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* body */}
      {mode === "preview" ? (
        <div
          key="preview"
          style={{
            padding: 28,
            minHeight: 220,
            display: "grid",
            placeItems: "center",
            background: "radial-gradient(circle at 50% 50%, var(--bg-3), var(--bg))",
            backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
            animation: "ai-fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          {preview ?? <DefaultPreview accent={accent} />}
        </div>
      ) : (
        <pre
          key="code"
          style={{
            margin: 0,
            padding: 16,
            background: "var(--bg)",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            lineHeight: 1.6,
            color: "var(--text-2)",
            minHeight: 220,
            overflow: "auto",
            whiteSpace: "pre",
            animation: "ai-fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <code>{code}</code>
        </pre>
      )}

      {/* version + actions */}
      <div
        style={{
          padding: "8px 14px",
          borderTop: "1px solid var(--edge)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "var(--bg)",
        }}
      >
        {versions.map((v) => {
          const active = v.id === activeVersion;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => setActiveVersion(v.id)}
              aria-pressed={active}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10.5,
                padding: "3px 8px",
                background: active ? "var(--accent-soft)" : "transparent",
                border: `1px solid ${active ? accent : "var(--edge)"}`,
                borderRadius: 4,
                color: active ? accent : "var(--text-3)",
                cursor: "pointer",
              }}
            >
              {v.label}
            </button>
          );
        })}
        <div style={{ marginLeft: "auto", display: "flex", gap: 6, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
          <button type="button" style={btnStyle}>⎘ copy</button>
          <button type="button" style={btnStyle}>↻ regen</button>
          <button type="button" style={btnStyle}>↗ open</button>
        </div>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "4px 8px",
  background: "transparent",
  border: "1px solid var(--edge-2)",
  borderRadius: 4,
  color: "var(--text-3)",
  fontFamily: "var(--font-mono)",
  fontSize: 10.5,
  cursor: "pointer",
};
