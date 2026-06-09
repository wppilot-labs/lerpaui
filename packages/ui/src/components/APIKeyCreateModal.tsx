"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Key, Copy, Check, Eye, EyeOff } from "lucide-react";
import { cn } from "../lib/cn";

export interface APIKeyCreateModalProps {
  className?: string;
}

type Scope = "read" | "write" | "admin";

const SCOPES: { id: Scope; label: string; description: string }[] = [
  { id: "read", label: "Read", description: "View resources and metadata" },
  { id: "write", label: "Write", description: "Create and update resources" },
  { id: "admin", label: "Admin", description: "Manage org settings and members" },
];

const EXPIRATIONS = [
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
  { value: "never", label: "Never" },
];

function generateKey() {
  const rand = () =>
    Array.from({ length: 32 }, () =>
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".charAt(
        Math.floor(Math.random() * 62)
      )
    ).join("");
  return `lui_live_${rand()}`;
}

export function APIKeyCreateModal({ className }: APIKeyCreateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [scopes, setScopes] = useState<Record<Scope, boolean>>({
    read: true,
    write: false,
    admin: false,
  });
  const [expiration, setExpiration] = useState("30");
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const doneBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const descId = useId();
  const nameId = useId();
  const expId = useId();
  const scopesLabelId = useId();

  const reset = () => {
    setName("");
    setScopes({ read: true, write: false, admin: false });
    setExpiration("30");
    setCreatedKey(null);
    setRevealed(false);
    setCopied(false);
  };

  const close = useCallback(() => {
    setIsOpen(false);
    reset();
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(focusableSelector);
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    const t = window.setTimeout(() => {
      if (createdKey) doneBtnRef.current?.focus();
      else nameInputRef.current?.focus();
    }, 60);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(t);
    };
  }, [isOpen, close, createdKey]);

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: { type: "spring" as const, duration: 0.4 },
      };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreatedKey(generateKey());
  };

  const handleCopy = async () => {
    if (!createdKey) return;
    try {
      await navigator.clipboard.writeText(createdKey);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const canCreate = name.trim().length > 0 && Object.values(scopes).some(Boolean);

  return (
    <div className={cn("flex flex-col items-center gap-3 font-sans", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary hover:brightness-110 text-primary-foreground font-semibold text-sm rounded-xl shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
      >
        <Key className="w-4 h-4" aria-hidden="true" />
        Create API key
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              aria-hidden="true"
            />

            <motion.div
              ref={panelRef}
              {...motionProps}
              className="relative w-full max-w-lg bg-card border border-border p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="flex gap-4 mb-5">
                <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center flex-shrink-0 text-primary">
                  <Key className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 pr-6">
                  <h2 id={titleId} className="text-base font-semibold text-foreground mb-1">
                    {createdKey ? "API key created" : "Create a new API key"}
                  </h2>
                  <p id={descId} className="text-sm text-muted-foreground leading-relaxed">
                    {createdKey
                      ? "Copy this key now. For your security, we won't show it again."
                      : "Name your key, choose scopes, and pick an expiration."}
                  </p>
                </div>
              </div>

              {!createdKey ? (
                <form onSubmit={handleCreate} className="space-y-5">
                  <div className="space-y-1.5">
                    <label htmlFor={nameId} className="block text-sm font-medium text-foreground">
                      Key name
                    </label>
                    <input
                      ref={nameInputRef}
                      id={nameId}
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Production server"
                      autoComplete="off"
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                    />
                  </div>

                  <fieldset className="space-y-2">
                    <legend id={scopesLabelId} className="block text-sm font-medium text-foreground mb-1">
                      Scopes
                    </legend>
                    <div className="space-y-1.5" aria-labelledby={scopesLabelId}>
                      {SCOPES.map((s) => (
                        <label
                          key={s.id}
                          aria-label={s.label}
                          className="flex items-start gap-3 p-2.5 rounded-lg border border-border bg-background/40 hover:bg-muted/40 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={scopes[s.id]}
                            onChange={(e) =>
                              setScopes((prev) => ({ ...prev, [s.id]: e.target.checked }))
                            }
                            className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/40"
                          />
                          <span className="flex-1">
                            <span className="block text-sm font-medium text-foreground">{s.label}</span>
                            <span className="block text-xs text-muted-foreground">{s.description}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="space-y-1.5">
                    <label htmlFor={expId} className="block text-sm font-medium text-foreground">
                      Expiration
                    </label>
                    <select
                      id={expId}
                      value={expiration}
                      onChange={(e) => setExpiration(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                    >
                      {EXPIRATIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={close}
                      className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-semibold rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!canCreate}
                      className="flex-1 py-2 bg-primary hover:brightness-110 text-primary-foreground text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
                    >
                      Create key
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-muted/40 p-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Secret key
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setRevealed((v) => !v)}
                          aria-label={revealed ? "Hide key" : "Reveal key"}
                          aria-pressed={revealed}
                          className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {revealed ? (
                            <EyeOff className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleCopy}
                          aria-label="Copy key to clipboard"
                          className="p-1.5 rounded-md hover:bg-background text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-emerald-500" aria-hidden="true" />
                          ) : (
                            <Copy className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </div>
                    <code
                      className="block font-mono text-xs text-foreground break-all select-all"
                      aria-live="polite"
                    >
                      {revealed ? createdKey : createdKey.replace(/./g, "•")}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Store this key in a secret manager. You won&apos;t be able to view it again.
                  </p>
                  <button
                    ref={doneBtnRef}
                    type="button"
                    onClick={close}
                    className="w-full py-2 bg-primary hover:brightness-110 text-primary-foreground text-sm font-semibold rounded-lg shadow-sm transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
