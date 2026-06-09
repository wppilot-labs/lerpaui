"use client";

import React, { useState } from "react";

export interface AIErrorRetryCardProps {
  errorCode?: string;
  errorMessage?: string;
  suggestion?: string;
  accent?: string;
  onRetry?: () => void;
  onReportBug?: () => void;
}

export function AIErrorRetryCard({
  errorCode = "RATE_LIMIT_EXCEEDED",
  errorMessage = "Model quota hit for the current minute. The next request will succeed in ~14 seconds.",
  suggestion = "Try lowering max_tokens, batching requests, or switching to a faster tier model.",
  accent = "var(--accent)",
  onRetry,
  onReportBug,
}: AIErrorRetryCardProps) {
  const [retrying, setRetrying] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleRetry = () => {
    if (retrying) return;
    setRetrying(true);
    setCountdown(3);
    const id = window.setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          window.clearInterval(id);
          setRetrying(false);
          onRetry?.();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <div
      role="alert"
      style={{
        width: "100%",
        maxWidth: 420,
        background: "var(--bg-2)",
        border: "1px solid var(--pink)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        boxShadow: "0 0 32px -12px var(--pink-glow, rgba(255,61,119,0.45))",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          aria-hidden="true"
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: "rgba(255,61,119,0.14)",
            border: "1px solid var(--pink)",
            display: "grid",
            placeItems: "center",
            color: "var(--pink)",
            fontFamily: "var(--font-mono)",
            fontSize: 18,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          !
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--pink)",
              marginBottom: 2,
            }}
          >
            error · {errorCode}
          </div>
          <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>Request failed</div>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)", lineHeight: 1.55 }}>{errorMessage}</p>

      {suggestion ? (
        <div
          style={{
            padding: "8px 12px",
            background: "var(--bg)",
            border: "1px solid var(--edge)",
            borderLeft: `3px solid ${accent}`,
            borderRadius: 6,
            fontSize: 12,
            color: "var(--text-2)",
            lineHeight: 1.5,
          }}
        >
          <span style={{ color: accent, fontWeight: 500 }}>→ </span>
          {suggestion}
        </div>
      ) : null}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={handleRetry}
          disabled={retrying}
          style={{
            flex: 1,
            height: 36,
            background: retrying ? "var(--bg-3)" : accent,
            color: retrying ? "var(--text-3)" : "var(--bg)",
            border: 0,
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            cursor: retrying ? "not-allowed" : "pointer",
            boxShadow: retrying ? "none" : `0 0 14px -4px ${accent}`,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <span aria-hidden="true">↻</span>
          {retrying ? `Retrying in ${countdown}s…` : "Retry now"}
        </button>
        <button
          type="button"
          onClick={onReportBug}
          style={{
            height: 36,
            padding: "0 14px",
            background: "transparent",
            color: "var(--text-3)",
            border: "1px solid var(--edge-2)",
            borderRadius: 8,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Report
        </button>
      </div>
    </div>
  );
}
