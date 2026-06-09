"use client";

import React, { useState } from "react";

export interface UploadedFile {
  id: string;
  name: string;
  sizeKb: number;
  type: string;
  progress?: number;
}

export interface AIFileUploadDropzoneProps {
  files?: UploadedFile[];
  accent?: string;
  acceptHint?: string;
  maxSizeMb?: number;
}

const DEFAULT_FILES: UploadedFile[] = [
  { id: "f1", name: "design-system.pdf", sizeKb: 4_280,  type: "pdf",  progress: 100 },
  { id: "f2", name: "brand-guide.docx",  sizeKb: 1_140,  type: "docx", progress: 100 },
  { id: "f3", name: "screenshot.png",    sizeKb: 820,    type: "png",  progress: 62 },
];

export function AIFileUploadDropzone({
  files: defaultFiles = DEFAULT_FILES,
  accent = "var(--accent)",
  acceptHint = "PDF, DOCX, MD, PNG · up to 25 MB each",
  maxSizeMb = 25,
}: AIFileUploadDropzoneProps) {
  const [files, setFiles] = useState(defaultFiles);
  const [drag, setDrag] = useState(false);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 440,
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
      aria-label="File upload"
    >
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); }}
        style={{
          padding: 24,
          background: "var(--bg)",
          border: `2px dashed ${drag ? accent : "var(--edge-2)"}`,
          borderRadius: 12,
          textAlign: "center",
          transition: "border-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
          transform: drag ? "scale(1.01)" : "scale(1)",
          boxShadow: drag ? `0 0 26px -8px ${accent}` : "none",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            margin: "0 auto 10px",
            borderRadius: 10,
            background: "var(--accent-soft)",
            border: `1px solid ${accent}`,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 18,
            color: accent,
            boxShadow: `0 0 14px -4px ${accent}`,
            animation: drag ? "pulse-dot 0.8s ease-in-out infinite" : "ai-glow-pulse 2.4s ease-in-out infinite",
          }}
          aria-hidden="true"
        >
          ↥
        </div>
        <div style={{ fontSize: 13, color: "var(--text)" }}>
          Drop files or <span style={{ color: accent, textDecoration: "underline", cursor: "pointer" }}>browse</span>
        </div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", marginTop: 4 }}>{acceptHint}</div>
      </div>

      {files.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {files.map((f, idx) => (
            <div
              key={f.id}
              style={{
                padding: "8px 12px",
                background: "var(--bg)",
                border: "1px solid var(--edge)",
                borderRadius: 8,
                display: "flex",
                flexDirection: "column",
                gap: 4,
                animation: `ai-fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms both`,
                transition: "transform 0.18s ease, border-color 0.18s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateX(2px)"; e.currentTarget.style.borderColor = "var(--edge-2)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.borderColor = "var(--edge)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: 4, background: "var(--bg-3)", display: "grid", placeItems: "center", fontFamily: "var(--font-mono)", fontSize: 9, color: accent, fontWeight: 700, textTransform: "uppercase" }} aria-hidden="true">
                  {f.type}
                </span>
                <span style={{ flex: 1, fontSize: 12.5, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}>{f.sizeKb < 1000 ? `${f.sizeKb} KB` : `${(f.sizeKb / 1024).toFixed(1)} MB`}</span>
                <button type="button" onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))} aria-label={`Remove ${f.name}`} style={{ background: "transparent", border: 0, color: "var(--text-4)", cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 12 }}>✕</button>
              </div>
              {f.progress !== undefined && f.progress < 100 ? (
                <div style={{ height: 3, background: "var(--bg-4)", borderRadius: 2, overflow: "hidden", position: "relative" }}>
                  <div
                    style={{
                      width: `${f.progress}%`,
                      height: "100%",
                      background: accent,
                      transition: "width 0.3s ease",
                      transformOrigin: "left center",
                      animation: `ai-bar-grow 0.6s cubic-bezier(0.16, 1, 0.3, 1) both`,
                    }}
                  />
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)`,
                      backgroundSize: "200% 100%",
                      animation: "ai-shimmer 1.4s linear infinite",
                      mixBlendMode: "overlay",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-4)" }}>max {maxSizeMb} MB / file</div>
    </div>
  );
}
