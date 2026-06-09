"use client";

import React from "react";

export interface CardSkeletonShimmerProps {
  rows?: number;
  showAvatar?: boolean;
  showImage?: boolean;
  accent?: string;
}

export function CardSkeletonShimmer({
  rows = 3,
  showAvatar = true,
  showImage = true,
  accent = "var(--accent)",
}: CardSkeletonShimmerProps) {
  const bar = (w: string, h: number, delay: number) => (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: h / 2,
        background:
          "linear-gradient(90deg, var(--bg-3) 0%, var(--bg-4) 35%, var(--bg-3) 70%)",
        backgroundSize: "200% 100%",
        animation: `ai-shimmer 1.6s ease-in-out ${delay}ms infinite`,
      }}
      aria-hidden="true"
    />
  );

  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading"
      style={{
        width: "100%",
        maxWidth: 360,
        background: "var(--bg-2)",
        border: "1px solid var(--edge-2)",
        borderRadius: 14,
        overflow: "hidden",
        fontFamily: "var(--font-sans)",
        boxShadow: `0 20px 50px -20px rgba(0,0,0,0.4), 0 0 28px -18px ${accent}`,
      }}
    >
      {showImage ? (
        <div
          aria-hidden="true"
          style={{
            height: 140,
            background:
              "linear-gradient(90deg, var(--bg-3) 0%, var(--bg-4) 35%, var(--bg-3) 70%)",
            backgroundSize: "200% 100%",
            animation: "ai-shimmer 1.8s ease-in-out infinite",
          }}
        />
      ) : null}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
        {showAvatar ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              aria-hidden="true"
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--bg-3), var(--bg-4))",
                animation: "ai-shimmer 1.6s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
              {bar("60%", 10, 80)}
              {bar("38%", 8, 140)}
            </div>
          </div>
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: rows }).map((_, i) => (
            <React.Fragment key={i}>
              {bar(i === rows - 1 ? "62%" : "100%", 10, 100 + i * 70)}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          {bar("96px", 30, 320)}
          {bar("72px", 30, 380)}
        </div>
      </div>
    </div>
  );
}
