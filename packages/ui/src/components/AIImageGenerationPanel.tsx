"use client";

import React, { useState } from "react";

export interface ImageGenResult {
  id: string;
  seed: number;
  hue?: number;
}

export interface AIImageGenerationPanelProps {
  defaultPrompt?: string;
  accent?: string;
  defaultResults?: ImageGenResult[];
}

const DEFAULT_RESULTS: ImageGenResult[] = [
  { id: "g1", seed: 142, hue: 80 },
  { id: "g2", seed: 213, hue: 200 },
  { id: "g3", seed: 360, hue: 320 },
  { id: "g4", seed: 421, hue: 40 },
];

export function AIImageGenerationPanel({
  defaultPrompt = "Cyberpunk neon city at dusk, isometric, soft purple haze, 1024x1024",
  accent = "var(--accent)",
  defaultResults = DEFAULT_RESULTS,
}: AIImageGenerationPanelProps) {
  const [prompt, setPrompt] = useState(defaultPrompt);

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
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
      role="region"
      aria-label="Image generation"
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)", display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span
          aria-hidden="true"
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accent,
            boxShadow: `0 0 6px ${accent}`,
            animation: "pulse-dot 1.8s ease-in-out infinite",
          }}
        />
        image gen
      </div>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={2}
        aria-label="Image prompt"
        style={{
          width: "100%",
          background: "var(--bg)",
          border: "1px solid var(--edge-2)",
          borderRadius: 8,
          padding: "8px 10px",
          color: "var(--text)",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          outline: "none",
          resize: "vertical",
          minHeight: 50,
        }}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
        {defaultResults.map((r, idx) => (
          <div
            key={r.id}
            style={{
              aspectRatio: "1",
              borderRadius: 8,
              overflow: "hidden",
              background: `linear-gradient(135deg, hsl(${r.hue ?? 80}, 70%, 14%), hsl(${(r.hue ?? 80) + 60}, 80%, 36%))`,
              border: "1px solid var(--edge-2)",
              position: "relative",
              cursor: "pointer",
              display: "flex",
              alignItems: "flex-end",
              padding: 8,
              animation: `ai-fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 100}ms both`,
              transition: "transform 0.22s ease, box-shadow 0.22s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = `0 14px 28px -10px hsl(${r.hue ?? 80}, 70%, 30%)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(circle at 30% 30%, hsla(${r.hue ?? 80}, 100%, 70%, 0.4), transparent 60%)`,
              }}
              aria-hidden="true"
            />
            <span style={{ position: "relative", fontFamily: "var(--font-mono)", fontSize: 10, color: "rgba(255,255,255,0.85)", padding: "2px 6px", background: "rgba(0,0,0,0.4)", borderRadius: 3 }}>
              seed {r.seed}
            </span>
          </div>
        ))}
      </div>

      <button
        type="button"
        style={{
          width: "100%",
          height: 36,
          background: accent,
          color: "var(--bg)",
          border: 0,
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          boxShadow: `0 0 14px -4px ${accent}`,
          transition: "transform 0.18s ease, box-shadow 0.18s ease",
          animation: "ai-glow-pulse 2.6s ease-in-out infinite",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 0 24px -2px ${accent}`; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 0 14px -4px ${accent}`; }}
      >
        Generate 4 more
      </button>
    </div>
  );
}
