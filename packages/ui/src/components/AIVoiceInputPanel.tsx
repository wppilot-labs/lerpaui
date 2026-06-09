"use client";

import React, { useEffect, useState } from "react";

export interface AIVoiceInputPanelProps {
  accent?: string;
  defaultRecording?: boolean;
  transcript?: string;
}

export function AIVoiceInputPanel({
  accent = "var(--accent)",
  defaultRecording = true,
  transcript = "Build me a settings page with billing tabs and team management. Use the lime theme and keep the layout in two columns on desktop.",
}: AIVoiceInputPanelProps) {
  const [recording, setRecording] = useState(defaultRecording);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;
  const time = `${mins}:${secs < 10 ? "0" : ""}${secs}`;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 380,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        padding: 18,
        fontFamily: "var(--font-sans)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
      role="region"
      aria-label="Voice input"
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: recording ? accent : "var(--text-3)" }}>
          <span style={{ color: recording ? accent : "var(--text-3)" }}>{recording ? "●" : "○"}</span> {recording ? "recording" : "paused"}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{time}</span>
      </div>

      {/* waveform */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, height: 50 }} aria-hidden="true">
        {Array.from({ length: 32 }).map((_, i) => {
          const baseHeight = 8 + Math.abs(Math.sin(i * 0.7 + elapsed * 0.4) * 30);
          return (
            <span
              key={i}
              style={{
                width: 3,
                height: recording ? baseHeight : 4,
                background: accent,
                borderRadius: 2,
                boxShadow: recording ? `0 0 4px ${accent}` : "none",
                transition: "height 0.18s",
              }}
            />
          );
        })}
      </div>

      <div style={{ padding: "10px 12px", background: "var(--bg)", border: "1px solid var(--edge)", borderRadius: 8, fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-2)", lineHeight: 1.55, minHeight: 80 }}>
        {transcript}
        {recording ? <span style={{ display: "inline-block", width: 6, height: 12, marginLeft: 3, background: accent, verticalAlign: -1, animation: "cursor-blink 1.05s steps(2) infinite" }} aria-hidden="true" /> : null}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => setRecording((r) => !r)}
          style={{
            flex: 1,
            height: 36,
            background: recording ? "var(--pink)" : accent,
            color: "var(--bg)",
            border: 0,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            boxShadow: `0 0 14px -4px ${recording ? "var(--pink)" : accent}`,
          }}
        >
          {recording ? "■ Stop" : "● Record"}
        </button>
        <button
          type="button"
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
          Send →
        </button>
      </div>
    </div>
  );
}
