"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Star, ImagePlus, MessageSquare } from "lucide-react";
import { cn } from "../lib/cn";

export interface ReviewWriteModalProps {
  className?: string;
}

const MAX_BODY = 600;
const MAX_PHOTOS = 4;
const RATING_LABELS = ["Poor", "Fair", "Good", "Very good", "Excellent"];

export function ReviewWriteModal({ className }: ReviewWriteModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const reducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const titleId = useId();
  const descId = useId();
  const titleInputId = useId();
  const bodyId = useId();
  const ratingLabelId = useId();
  const counterId = useId();

  const reset = () => {
    setRating(0);
    setHoverRating(0);
    setTitle("");
    setBody("");
    setPhotos([]);
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
    const t = window.setTimeout(() => firstFocusRef.current?.focus(), 60);

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

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;
    const names = Array.from(files).slice(0, MAX_PHOTOS - photos.length).map((f) => f.name);
    setPhotos((p) => [...p, ...names].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (idx: number) => {
    setPhotos((p) => p.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !title.trim() || !body.trim()) return;
    close();
  };

  const displayRating = hoverRating || rating;
  const canSubmit = rating > 0 && title.trim().length > 0 && body.trim().length > 0;
  const remaining = MAX_BODY - body.length;

  return (
    <div className={cn("flex flex-col items-center gap-3 font-sans", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary hover:brightness-110 text-primary-foreground font-semibold text-sm rounded-xl shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
      >
        <MessageSquare className="w-4 h-4" aria-hidden="true" />
        Write a review
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

              <div className="mb-5">
                <h2 id={titleId} className="text-base font-semibold text-foreground mb-1">
                  Write a review
                </h2>
                <p id={descId} className="text-sm text-muted-foreground">
                  Share your honest experience to help other customers.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Rating */}
                <div>
                  <span id={ratingLabelId} className="block text-sm font-medium text-foreground mb-2">
                    Overall rating
                  </span>
                  <div
                    role="radiogroup"
                    tabIndex={0}
                    aria-labelledby={ratingLabelId}
                    aria-required="true"
                    className="inline-flex items-center gap-1"
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    {[1, 2, 3, 4, 5].map((n, i) => {
                      const filled = n <= displayRating;
                      const isFirst = i === 0;
                      return (
                        <button
                          key={n}
                          ref={isFirst ? firstFocusRef : undefined}
                          type="button"
                          role="radio"
                          aria-checked={rating === n}
                          aria-label={`${n} star${n === 1 ? "" : "s"} — ${RATING_LABELS[n - 1]}`}
                          onClick={() => setRating(n)}
                          onMouseEnter={() => setHoverRating(n)}
                          onFocus={() => setHoverRating(n)}
                          onBlur={() => setHoverRating(0)}
                          className="p-1 rounded-md hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors"
                        >
                          <Star
                            className={cn(
                              "w-7 h-7 transition-colors",
                              filled
                                ? "fill-amber-400 text-amber-400"
                                : "fill-none text-muted-foreground/50"
                            )}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                    <span
                      className="ml-2 text-sm text-muted-foreground"
                      aria-live="polite"
                    >
                      {displayRating > 0 ? RATING_LABELS[displayRating - 1] : "Tap to rate"}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1.5">
                  <label htmlFor={titleInputId} className="block text-sm font-medium text-foreground">
                    Review title
                  </label>
                  <input
                    id={titleInputId}
                    type="text"
                    required
                    maxLength={80}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                  />
                </div>

                {/* Body */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={bodyId} className="block text-sm font-medium text-foreground">
                      Your review
                    </label>
                    <span
                      id={counterId}
                      className={cn(
                        "text-xs tabular-nums",
                        remaining < 0
                          ? "text-destructive"
                          : remaining < 60
                            ? "text-amber-500"
                            : "text-muted-foreground"
                      )}
                      aria-live="polite"
                    >
                      {body.length} / {MAX_BODY}
                    </span>
                  </div>
                  <textarea
                    id={bodyId}
                    required
                    rows={5}
                    maxLength={MAX_BODY}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    aria-describedby={counterId}
                    placeholder="What did you like or dislike? How was the fit, quality, or service?"
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60 resize-none"
                  />
                </div>

                {/* Photos */}
                <div className="space-y-2">
                  <span className="block text-sm font-medium text-foreground">
                    Photos <span className="font-normal text-muted-foreground">(optional, up to {MAX_PHOTOS})</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {photos.map((p, i) => (
                      <span
                        key={`${p}-${i}`}
                        className="inline-flex items-center gap-1.5 max-w-[12rem] pl-2 pr-1 py-1 rounded-full border border-border bg-muted/50 text-xs text-foreground"
                      >
                        <ImagePlus className="w-3 h-3 text-muted-foreground flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{p}</span>
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          aria-label={`Remove ${p}`}
                          className="p-0.5 rounded-full hover:bg-background text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      </span>
                    ))}
                    {photos.length < MAX_PHOTOS && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ImagePlus className="w-3.5 h-3.5" aria-hidden="true" />
                        Add photo
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handlePhotos(e.target.files)}
                      className="sr-only"
                    />
                  </div>
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
                    disabled={!canSubmit}
                    className="flex-1 py-2 bg-primary hover:brightness-110 text-primary-foreground text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
                  >
                    Submit review
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
