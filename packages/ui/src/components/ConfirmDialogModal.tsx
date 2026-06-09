"use client";

import React, { useEffect, useState } from "react";

export interface ConfirmDialogModalProps {
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  accent?: string;
  defaultOpen?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ConfirmDialogModal({
  title = "Delete workspace?",
  description = "All projects, environments, and integrations will be permanently removed. This action cannot be undone.",
  confirmLabel = "Delete workspace",
  cancelLabel = "Cancel",
  destructive = true,
  accent = "var(--accent)",
  defaultOpen = true,
  onConfirm,
  onCancel,
}: ConfirmDialogModalProps) {
  const [open, setOpen] = useState(defaultOpen);
  const tone = destructive ? "var(--pink)" : accent;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          height: 34,
          padding: "0 14px",
          background: "var(--bg-3)",
          color: "var(--text)",
          border: "1px solid var(--edge-2)",
          borderRadius: 8,
          fontFamily: "var(--font-sans)",
          fontSize: 12.5,
          fontWeight: 500,
          cursor: "pointer",
        }}
      >
        Reopen dialog
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 380,
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: -20,
          background:
            "radial-gradient(circle at 50% 30%, color-mix(in srgb, var(--pink) 18%, transparent), transparent 70%)",
          pointerEvents: "none",
          borderRadius: 30,
          opacity: 0.7,
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "relative",
          background: "var(--bg-2)",
          border: "1px solid var(--edge-2)",
          borderRadius: 14,
          padding: 20,
          boxShadow: `0 30px 60px -20px rgba(0,0,0,0.6), 0 0 40px -16px ${tone}`,
          animation: "ai-fade-up 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span
            aria-hidden="true"
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: `color-mix(in srgb, ${tone} 18%, transparent)`,
              border: `1px solid ${tone}`,
              color: tone,
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-mono)",
              fontSize: 18,
              fontWeight: 700,
              flexShrink: 0,
              boxShadow: `0 0 16px -4px ${tone}`,
            }}
          >
            {destructive ? "⚠" : "?"}
          </span>
          <h3 id="confirm-title" style={{ margin: 0, fontSize: 15.5, color: "var(--text)", fontWeight: 600 }}>
            {title}
          </h3>
        </div>
        <p
          id="confirm-desc"
          style={{
            margin: "0 0 16px",
            fontSize: 13,
            color: "var(--text-2)",
            lineHeight: 1.55,
          }}
        >
          {description}
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onCancel?.();
            }}
            style={{
              height: 34,
              padding: "0 14px",
              background: "transparent",
              color: "var(--text-2)",
              border: "1px solid var(--edge-2)",
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--text-3)";
              e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--edge-2)";
              e.currentTarget.style.color = "var(--text-2)";
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onConfirm?.();
            }}
            // eslint-disable-next-line jsx-a11y/no-autofocus -- intentional: focus default confirm button in modal dialog
            autoFocus
            style={{
              height: 34,
              padding: "0 14px",
              background: tone,
              color: "var(--bg)",
              border: 0,
              borderRadius: 8,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              boxShadow: `0 0 16px -4px ${tone}`,
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {confirmLabel}
          </button>
        </div>
        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: "1px solid var(--edge)",
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: "var(--text-4)",
            letterSpacing: "0.06em",
          }}
        >
          Press Esc to cancel
        </div>
      </div>
    </div>
  );
}
