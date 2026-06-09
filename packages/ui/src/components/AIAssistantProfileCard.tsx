"use client";

import React from "react";

export interface AIAssistantProfileCardProps {
  name?: string;
  role?: string;
  bio?: string;
  capabilities?: string[];
  modelName?: string;
  accent?: string;
  online?: boolean;
}

export function AIAssistantProfileCard({
  name = "Claude · with lerpa",
  role = "Component & code agent",
  bio = "Ships features in minutes. Picks the right components from /llm.txt, runs the CLI, writes the wiring.",
  capabilities = ["read repo files", "edit src/ui/", "open pull requests", "run lerpa-cli"],
  modelName = "claude-opus-4-7",
  accent = "var(--accent)",
  online = true,
}: AIAssistantProfileCardProps) {
  return (
    <article
      style={{
        width: "100%",
        maxWidth: 360,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "border-color 0.2s ease, box-shadow 0.22s ease, transform 0.22s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = accent;
        e.currentTarget.style.boxShadow = `0 18px 40px -22px ${accent}, 0 0 24px -10px ${accent}`;
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--edge-2)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            position: "relative",
            width: 48,
            height: 48,
            borderRadius: 12,
            background: accent,
            color: "var(--bg)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 22,
            fontWeight: 700,
            boxShadow: `0 0 18px -4px ${accent}`,
            animation: "ai-glow-pulse 2.6s ease-in-out infinite",
          }}
          aria-hidden="true"
        >
          ∗
          {online ? (
            <span
              style={{
                position: "absolute",
                bottom: -2,
                right: -2,
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: accent,
                border: "2px solid var(--bg-2)",
                boxShadow: `0 0 6px ${accent}`,
                animation: "pulse-dot 1.6s ease-in-out infinite",
              }}
            />
          ) : null}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: 0, fontSize: 15, color: "var(--text)", fontWeight: 500, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {name}
          </h4>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{role}</div>
        </div>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{bio}</p>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        can do
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {capabilities.map((c, i) => (
          <span
            key={c}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              padding: "3px 8px",
              background: "var(--accent-soft)",
              color: accent,
              borderRadius: 4,
              animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${150 + i * 70}ms both`,
            }}
          >
            {c}
          </span>
        ))}
      </div>

      <div style={{ marginTop: 4, padding: "6px 10px", background: "var(--bg)", border: "1px solid var(--edge)", borderRadius: 6, fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)", display: "flex", justifyContent: "space-between" }}>
        <span>model</span>
        <span style={{ color: "var(--text)" }}>{modelName}</span>
      </div>
    </article>
  );
}
