"use client";

import React, { useState } from "react";

export interface AIChatMessageActionsProps {
  accent?: string;
  textToCopy?: string;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onEdit?: () => void;
  onShare?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onSpeak?: () => void;
}

type ActionKey = "copy" | "regen" | "edit" | "share" | "like" | "dislike" | "speak";

const ACTIONS: { key: ActionKey; label: string; glyph: string }[] = [
  { key: "copy", label: "Copy", glyph: "⎘" },
  { key: "regen", label: "Regenerate", glyph: "↻" },
  { key: "edit", label: "Edit", glyph: "✎" },
  { key: "share", label: "Share", glyph: "↗" },
  { key: "speak", label: "Read aloud", glyph: "🔊" },
  { key: "like", label: "Helpful", glyph: "↑" },
  { key: "dislike", label: "Not helpful", glyph: "↓" },
];

export function AIChatMessageActions({
  accent = "var(--accent)",
  textToCopy = "",
  onCopy,
  onRegenerate,
  onEdit,
  onShare,
  onLike,
  onDislike,
  onSpeak,
}: AIChatMessageActionsProps) {
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [copied, setCopied] = useState(false);

  const trigger = (key: ActionKey) => {
    switch (key) {
      case "copy":
        if (textToCopy && typeof navigator !== "undefined") navigator.clipboard?.writeText(textToCopy);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
        onCopy?.();
        break;
      case "regen": onRegenerate?.(); break;
      case "edit": onEdit?.(); break;
      case "share": onShare?.(); break;
      case "speak": onSpeak?.(); break;
      case "like":
        setFeedback((f) => (f === "like" ? null : "like"));
        onLike?.();
        break;
      case "dislike":
        setFeedback((f) => (f === "dislike" ? null : "dislike"));
        onDislike?.();
        break;
    }
  };

  return (
    <div
      style={{
        display: "inline-flex",
        gap: 4,
        padding: 4,
        background: "var(--bg-2)",
        border: "1px solid var(--edge)",
        borderRadius: 10,
        fontFamily: "var(--font-mono)",
      }}
      role="toolbar"
      aria-label="Message actions"
    >
      {ACTIONS.map((a) => {
        const liked = feedback === "like" && a.key === "like";
        const disliked = feedback === "dislike" && a.key === "dislike";
        const showCopied = a.key === "copy" && copied;
        const active = liked || disliked || showCopied;
        return (
          <button
            key={a.key}
            type="button"
            onClick={() => trigger(a.key)}
            title={showCopied ? "Copied" : a.label}
            aria-label={a.label}
            aria-pressed={a.key === "like" ? feedback === "like" : a.key === "dislike" ? feedback === "dislike" : undefined}
            style={{
              width: 30,
              height: 30,
              borderRadius: 6,
              border: active ? `1px solid ${accent}` : "1px solid transparent",
              background: active ? "var(--bg-3)" : "transparent",
              color: active ? accent : "var(--text-3)",
              cursor: "pointer",
              fontSize: 12,
              display: "grid",
              placeItems: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.color = "var(--text)";
                e.currentTarget.style.background = "var(--bg-3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.color = "var(--text-3)";
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            {showCopied ? "✓" : a.glyph}
          </button>
        );
      })}
    </div>
  );
}
