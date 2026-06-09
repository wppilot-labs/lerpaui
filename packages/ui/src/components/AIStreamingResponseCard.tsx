"use client";

import React, { useEffect, useRef, useState } from "react";
import { useShouldAnimate } from "../animation/hooks";

export interface AIStreamingResponseCardProps {
  content?: string;
  charsPerSecond?: number;
  accent?: string;
  model?: string;
  autostart?: boolean;
  loop?: boolean;
  showStats?: boolean;
}

const DEFAULT_CONTENT =
  "Lerpa UI ships 1235 token-aligned components. Each file is owned by your repo — no node_modules mystery, no runtime CSS. Themes swap by flipping a single data attribute. Motion respects prefers-reduced-motion out of the box.";

export function AIStreamingResponseCard({
  content = DEFAULT_CONTENT,
  charsPerSecond = 60,
  accent = "var(--accent)",
  model = "claude-opus-4-7",
  autostart = true,
  loop = true,
  showStats = true,
}: AIStreamingResponseCardProps) {
  const [shown, setShown] = useState("");
  const [tokens, setTokens] = useState(0);
  const [streaming, setStreaming] = useState(autostart);
  const startedAt = useRef<number | null>(null);
  const cancelled = useRef(false);
  const [containerRef, shouldAnimate] = useShouldAnimate<HTMLDivElement>();

  useEffect(() => {
    cancelled.current = false;
    if (!streaming || !shouldAnimate) {
      if (!shouldAnimate) setShown(content);
      return;
    }

    let i = 0;
    setShown("");
    setTokens(0);
    startedAt.current = performance.now();
    const intervalMs = Math.max(8, 1000 / charsPerSecond);

    const id = window.setInterval(() => {
      if (cancelled.current) return;
      i += 1;
      setShown(content.slice(0, i));
      if (i % 4 === 0) setTokens((t) => t + 1);
      if (i >= content.length) {
        window.clearInterval(id);
        setStreaming(false);
        if (loop) {
          window.setTimeout(() => {
            if (!cancelled.current) setStreaming(true);
          }, 1400);
        }
      }
    }, intervalMs);

    return () => {
      cancelled.current = true;
      window.clearInterval(id);
    };
  }, [streaming, content, charsPerSecond, loop, shouldAnimate]);

  const elapsed = startedAt.current ? Math.max(0.1, (performance.now() - startedAt.current) / 1000) : 0;
  const tps = elapsed > 0 ? Math.round(tokens / elapsed) : 0;

  return (
    <div
      ref={containerRef}
      role="status"
      aria-live="polite"
      style={{
        width: "100%",
        maxWidth: 480,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        boxShadow: `0 30px 60px -20px rgba(0,0,0,0.4), 0 0 40px -16px ${accent}`,
      }}
    >
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid var(--edge)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--text-3)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: streaming ? accent : "var(--text-4)",
            boxShadow: streaming ? `0 0 8px ${accent}` : "none",
            animation: streaming ? "pulse-dot 1.4s ease-in-out infinite" : "none",
          }}
          aria-hidden="true"
        />
        <span style={{ color: "var(--text)", fontWeight: 500 }}>{model}</span>
        <span style={{ marginLeft: "auto", letterSpacing: "0.12em", textTransform: "uppercase", color: streaming ? accent : "var(--text-4)" }}>
          {streaming ? "streaming" : "done"}
        </span>
      </div>

      <div style={{ padding: 18, fontSize: 14, lineHeight: 1.6, color: "var(--text)", minHeight: 130 }}>
        {shown}
        {streaming ? (
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              width: 7,
              height: 16,
              marginLeft: 4,
              background: accent,
              verticalAlign: -3,
              boxShadow: `0 0 8px ${accent}`,
              animation: "cursor-blink 1.05s steps(2) infinite",
            }}
          />
        ) : null}
      </div>

      {showStats ? (
        <div
          style={{
            padding: "10px 14px",
            borderTop: "1px solid var(--edge)",
            display: "flex",
            gap: 18,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-3)",
            background: "var(--bg)",
          }}
        >
          <span><span style={{ color: accent }}>●</span> {shown.length} chars</span>
          <span>{tokens} tokens</span>
          <span style={{ marginLeft: "auto", color: streaming ? accent : "var(--text-3)" }}>{tps} tok/s</span>
        </div>
      ) : null}
    </div>
  );
}
