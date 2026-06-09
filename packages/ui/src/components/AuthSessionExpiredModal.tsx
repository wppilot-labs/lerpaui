"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Lock, LogIn } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthSessionExpiredModalProps {
  className?: string;
}

const COUNTDOWN_SECONDS = 30;

export function AuthSessionExpiredModal({ className }: AuthSessionExpiredModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const reducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const primaryRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  const descId = useId();

  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsLeft(COUNTDOWN_SECONDS);

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
    const t = window.setTimeout(() => primaryRef.current?.focus(), 60);

    const interval = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(t);
      window.clearInterval(interval);
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

  const progress = ((COUNTDOWN_SECONDS - secondsLeft) / COUNTDOWN_SECONDS) * 100;

  return (
    <div className={cn("flex flex-col items-center gap-3 font-sans", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary hover:brightness-110 text-primary-foreground font-semibold text-sm rounded-xl shadow-lg active:scale-95 transition-all"
      >
        Show session expired
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
              className="relative w-full max-w-sm bg-card border border-border p-6 rounded-2xl shadow-2xl text-center"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mb-4">
                <Lock className="w-7 h-7" aria-hidden="true" />
              </div>

              <h2 id={titleId} className="text-lg font-semibold text-foreground mb-1.5">
                Session expired
              </h2>
              <p id={descId} className="text-sm text-muted-foreground leading-relaxed mb-5">
                For your security, you&apos;ve been signed out due to inactivity.
              </p>

              <div className="mb-5" aria-live="polite" aria-atomic="true">
                <p className="text-xs text-muted-foreground mb-2">
                  Redirecting to sign in in{" "}
                  <span className="font-semibold text-foreground tabular-nums">{secondsLeft}s</span>
                </p>
                <div
                  className="h-1.5 w-full rounded-full bg-muted overflow-hidden"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={COUNTDOWN_SECONDS}
                  aria-valuenow={COUNTDOWN_SECONDS - secondsLeft}
                >
                  <motion.div
                    className="h-full bg-primary"
                    initial={false}
                    animate={{ width: `${progress}%` }}
                    transition={
                      reducedMotion
                        ? { duration: 0 }
                        : { duration: 0.6, ease: "linear" }
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  ref={primaryRef}
                  type="button"
                  onClick={close}
                  className="w-full py-2 bg-primary hover:brightness-110 text-primary-foreground text-sm font-semibold rounded-lg shadow-sm transition-all inline-flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" aria-hidden="true" />
                  Sign in again
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="w-full py-2 bg-transparent hover:bg-muted text-muted-foreground hover:text-foreground text-sm font-medium rounded-lg transition-colors"
                >
                  Stay here
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
