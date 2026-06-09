"use client";

import React, { useCallback, useState } from "react";

export interface DropFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export interface FileDropInputProps {
  accent?: string;
  maxFiles?: number;
  hint?: string;
  defaultFiles?: DropFile[];
}

const DEFAULT_FILES: DropFile[] = [
  { id: "f1", name: "logo-final.svg", size: 14_322, type: "image/svg+xml" },
  { id: "f2", name: "brand-guidelines.pdf", size: 482_113, type: "application/pdf" },
];

function fmtSize(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function iconFor(type: string): string {
  if (type.startsWith("image/")) return "▣";
  if (type.includes("pdf")) return "▤";
  if (type.includes("zip") || type.includes("archive")) return "▥";
  if (type.startsWith("video/")) return "▶";
  if (type.startsWith("audio/")) return "♪";
  return "▦";
}

export function FileDropInput({
  accent = "var(--accent)",
  maxFiles = 5,
  hint = "PNG, JPG, SVG, PDF up to 10 MB",
  defaultFiles = DEFAULT_FILES,
}: FileDropInputProps) {
  const [files, setFiles] = useState<DropFile[]>(defaultFiles);
  const [hover, setHover] = useState(false);

  const addList = useCallback(
    (list: FileList | null) => {
      if (!list) return;
      const next: DropFile[] = [];
      const remaining = Math.max(0, maxFiles - files.length);
      const arr = Array.from(list).slice(0, remaining);
      arr.forEach((f, i) => {
        next.push({
          id: `${Date.now()}-${i}`,
          name: f.name,
          size: f.size,
          type: f.type,
        });
      });
      if (next.length) setFiles((prev) => [...prev, ...next]);
    },
    [files.length, maxFiles],
  );

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setHover(false);
    addList(e.dataTransfer.files);
  };

  const remove = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  return (
    <div style={{ width: "100%", maxWidth: 380, fontFamily: "var(--font-sans)" }}>
      <label
        htmlFor="file-drop-input"
        onDragOver={(e) => {
          e.preventDefault();
          setHover(true);
        }}
        onDragLeave={() => setHover(false)}
        onDrop={onDrop}
        style={{
          display: "block",
          padding: "22px 18px",
          background: hover ? `color-mix(in srgb, ${accent} 14%, var(--bg-2))` : "var(--bg-2)",
          border: `1.5px dashed ${hover ? accent : "var(--edge-2)"}`,
          borderRadius: 12,
          cursor: "pointer",
          textAlign: "center",
          transition: "all 0.18s ease",
          boxShadow: hover ? `0 0 0 4px color-mix(in srgb, ${accent} 14%, transparent)` : "none",
        }}
      >
        <input
          id="file-drop-input"
          type="file"
          multiple
          onChange={(e) => addList(e.target.files)}
          style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}
        />
        <div
          aria-hidden="true"
          style={{
            width: 48,
            height: 48,
            margin: "0 auto 10px",
            borderRadius: 12,
            background: `color-mix(in srgb, ${accent} 18%, transparent)`,
            border: `1px solid ${accent}`,
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-mono)",
            fontSize: 22,
            color: accent,
            boxShadow: hover ? `0 0 20px -4px ${accent}` : "none",
            transform: hover ? "translateY(-2px)" : "none",
            transition: "all 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          ⇪
        </div>
        <div style={{ fontSize: 13.5, color: "var(--text)", fontWeight: 500 }}>
          {hover ? "Release to upload" : "Drop files or click to browse"}
        </div>
        <div style={{ marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>{hint}</div>
      </label>
      {files.length > 0 ? (
        <ul
          style={{
            margin: "12px 0 0",
            padding: 0,
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {files.map((f, idx) => (
            <li
              key={f.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                background: "var(--bg-2)",
                border: "1px solid var(--edge)",
                borderRadius: 8,
                animation: `ai-fade-up 0.32s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 40}ms both`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: "var(--bg-3)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: accent,
                  flexShrink: 0,
                }}
              >
                {iconFor(f.type)}
              </span>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 12.5, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.name}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--text-3)" }}>{fmtSize(f.size)}</div>
              </div>
              <button
                type="button"
                onClick={() => remove(f.id)}
                aria-label={`Remove ${f.name}`}
                style={{
                  width: 24,
                  height: 24,
                  display: "grid",
                  placeItems: "center",
                  background: "transparent",
                  border: "1px solid var(--edge)",
                  borderRadius: 5,
                  color: "var(--text-3)",
                  cursor: "pointer",
                  fontSize: 12,
                  lineHeight: 1,
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--pink)";
                  e.currentTarget.style.color = "var(--pink)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--edge)";
                  e.currentTarget.style.color = "var(--text-3)";
                }}
              >
                ×
              </button>
            </li>
          ))}
          <li
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10.5,
              color: "var(--text-3)",
              textAlign: "right",
            }}
          >
            {files.length} / {maxFiles}
          </li>
        </ul>
      ) : null}
    </div>
  );
}
