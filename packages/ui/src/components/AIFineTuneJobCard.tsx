"use client";

import React, { useEffect, useState } from "react";

export interface AIFineTuneJobCardProps {
  jobId?: string;
  baseModel?: string;
  datasetName?: string;
  epoch?: number;
  totalEpochs?: number;
  defaultLoss?: number;
  status?: "queued" | "running" | "succeeded" | "failed";
  accent?: string;
}

export function AIFineTuneJobCard({
  jobId = "ft_4213",
  baseModel = "claude-haiku-4-5",
  datasetName = "support-tickets-q1.jsonl",
  epoch = 3,
  totalEpochs = 5,
  defaultLoss = 0.82,
  status = "running",
  accent = "var(--accent)",
}: AIFineTuneJobCardProps) {
  const [loss, setLoss] = useState(defaultLoss);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (status !== "running") return;
    const id = window.setInterval(() => {
      setLoss((l) => Math.max(0.04, l * 0.98 + (Math.random() - 0.5) * 0.04));
      setTick((t) => t + 1);
    }, 800);
    return () => window.clearInterval(id);
  }, [status]);

  const progress = (epoch / totalEpochs) * 100;
  const statusColor = status === "running" ? "var(--cyan)" : status === "succeeded" ? accent : status === "failed" ? "var(--pink)" : "var(--text-3)";

  return (
    <article
      style={{
        width: "100%",
        maxWidth: 420,
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
      aria-label={`Fine-tune job ${jobId}`}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-3)" }}>
            <span style={{ color: statusColor }}>●</span> {jobId} · {status}
          </div>
          <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500, marginTop: 2 }}>{baseModel}</div>
        </div>
        <div style={{ fontFamily: "var(--font-sans)", fontSize: 22, fontWeight: 500, color: accent, letterSpacing: "-0.02em" }}>
          {loss.toFixed(3)}
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", marginLeft: 4 }}>loss</span>
        </div>
      </div>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", display: "flex", justifyContent: "space-between" }}>
        <span>{datasetName}</span>
        <span>epoch {epoch}/{totalEpochs}</span>
      </div>
      <div style={{ height: 4, background: "var(--bg-4)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ width: `${progress}%`, height: "100%", background: accent, boxShadow: `0 0 8px ${accent}`, transition: "width 0.4s" }} />
      </div>

      {/* mini loss spark */}
      <svg viewBox="0 0 100 26" width="100%" height={26} preserveAspectRatio="none" aria-hidden="true">
        <path
          d={`M0 22 ${Array.from({ length: 24 }).map((_, i) => `L${i * 4} ${20 - i * 0.4 + Math.sin((tick + i) * 0.5) * 2}`).join(" ")}`}
          stroke={accent}
          strokeWidth={1.5}
          fill="none"
          style={{ filter: `drop-shadow(0 0 3px ${accent})` }}
        />
      </svg>
    </article>
  );
}
