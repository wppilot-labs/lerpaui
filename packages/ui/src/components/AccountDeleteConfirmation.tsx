"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, ShieldAlert, Trash2 } from "lucide-react";
import { cn } from "../lib/cn";

export interface AccountDeleteConfirmationProps {
  className?: string;
}

const CONFIRM_PHRASE = "DELETE";

export function AccountDeleteConfirmation({ className }: AccountDeleteConfirmationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const reducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const descId = useId();
  const inputId = useId();
  const helpId = useId();

  const isMatch = confirmText.trim() === CONFIRM_PHRASE;

  const close = useCallback(() => {
    setIsOpen(false);
    setConfirmText("");
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  // ESC, focus trap, body scroll lock, initial focus
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
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(t);
    };
  }, [isOpen, close]);

  const motionProps = reducedMotion
    ? { initial: false, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { opacity: 0, scale: 0.96, y: 8 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: { type: "spring" as const, duration: 0.4 },
      };

  return (
    <div className={cn("flex flex-col items-center gap-3 font-sans", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-destructive hover:brightness-110 text-destructive-foreground font-semibold text-sm rounded-xl shadow-lg active:scale-95 transition-all"
      >
        Delete account
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
              className="relative w-full max-w-md bg-card border border-border p-6 rounded-2xl shadow-2xl"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="flex gap-4">
                <div className="h-11 w-11 rounded-xl bg-destructive/10 border border-destructive/25 flex items-center justify-center flex-shrink-0 text-destructive">
                  <ShieldAlert className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1 pr-6">
                  <h2 id={titleId} className="text-base font-semibold text-foreground mb-1.5">
                    Delete your account
                  </h2>
                  <p id={descId} className="text-sm text-muted-foreground leading-relaxed">
                    This action is <span className="font-semibold text-foreground">permanent</span>. All projects,
                    billing history, API keys, and team memberships will be erased. This cannot be undone.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <label htmlFor={inputId} className="block text-sm font-medium text-foreground">
                  Type <span className="font-mono font-semibold text-destructive">{CONFIRM_PHRASE}</span> to confirm
                </label>
                <input
                  ref={inputRef}
                  id={inputId}
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  autoComplete="off"
                  aria-describedby={helpId}
                  aria-invalid={confirmText.length > 0 && !isMatch}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/40 focus:border-destructive/60"
                  placeholder={CONFIRM_PHRASE}
                />
                <p id={helpId} className="text-xs text-muted-foreground">
                  Case-sensitive. The button enables once the phrase matches exactly.
                </p>
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={close}
                  className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isMatch}
                  onClick={close}
                  className="flex-1 py-2 bg-destructive hover:brightness-110 text-destructive-foreground text-sm font-semibold rounded-lg shadow-sm transition-all inline-flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  Delete account
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
