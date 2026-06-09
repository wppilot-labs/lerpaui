"use client";

import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Upload, FileSpreadsheet, ArrowRight, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface DataTableImportModalProps {
  className?: string;
}

type Step = 0 | 1 | 2;

const STEPS = ["Upload", "Map columns", "Review"] as const;

const SAMPLE_SOURCE_COLUMNS = ["full_name", "email_addr", "company", "signup_date"];
const DESTINATION_FIELDS = ["— Skip —", "Name", "Email", "Company", "Created at", "Phone"];
const DEFAULT_MAPPING: Record<string, string> = {
  full_name: "Name",
  email_addr: "Email",
  company: "Company",
  signup_date: "Created at",
};

const ACCEPTED = ".csv, .tsv, .xlsx";

export function DataTableImportModal({ className }: DataTableImportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<Step>(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mapping, setMapping] = useState<Record<string, string>>(DEFAULT_MAPPING);
  const reducedMotion = useReducedMotion();

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstFocusRef = useRef<HTMLButtonElement>(null);

  const titleId = useId();
  const descId = useId();

  const reset = () => {
    setStep(0);
    setFileName(null);
    setMapping(DEFAULT_MAPPING);
    setIsDragging(false);
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

  const handleFile = (f: File | null) => {
    if (f) setFileName(f.name);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    handleFile(f);
  };

  const canNext = step === 0 ? !!fileName : step === 1 ? true : true;
  const mappedCount = Object.values(mapping).filter((v) => v !== "— Skip —").length;

  return (
    <div className={cn("flex flex-col items-center gap-3 font-sans", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-primary hover:brightness-110 text-primary-foreground font-semibold text-sm rounded-xl shadow-lg active:scale-95 transition-all inline-flex items-center gap-2"
      >
        <Upload className="w-4 h-4" aria-hidden="true" />
        Import data
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
              className="relative w-full max-w-2xl bg-card border border-border p-6 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              <div className="mb-2">
                <h2 id={titleId} className="text-lg font-semibold text-foreground">
                  Import data
                </h2>
                <p id={descId} className="text-sm text-muted-foreground">
                  Bring rows into your table in three quick steps.
                </p>
              </div>

              <ol
                className="flex items-center gap-2 mt-5 mb-6"
                aria-label="Progress"
              >
                {STEPS.map((label, i) => {
                  const active = i === step;
                  const complete = i < step;
                  return (
                    <li key={label} className="flex-1 flex items-center gap-2">
                      <div
                        className={cn(
                          "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold border transition-colors",
                          complete
                            ? "bg-primary text-primary-foreground border-primary"
                            : active
                              ? "bg-primary/10 text-primary border-primary/40"
                              : "bg-muted text-muted-foreground border-border"
                        )}
                        aria-current={active ? "step" : undefined}
                      >
                        {complete ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : i + 1}
                      </div>
                      <span
                        className={cn(
                          "text-xs font-medium hidden sm:inline",
                          active ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {label}
                      </span>
                      {i < STEPS.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-px",
                            i < step ? "bg-primary" : "bg-border"
                          )}
                          aria-hidden="true"
                        />
                      )}
                    </li>
                  );
                })}
              </ol>

              <div className="min-h-[260px]">
                {step === 0 && (
                  <div>
                    <label
                      htmlFor="dt-import-file"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={onDrop}
                      className={cn(
                        "block rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors",
                        isDragging
                          ? "border-primary bg-primary/[0.06]"
                          : "border-border bg-background/40 hover:bg-muted/40"
                      )}
                    >
                      <div className="mx-auto h-12 w-12 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary mb-3">
                        <Upload className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        Drag and drop a file, or <span className="text-primary">browse</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Accepted formats: {ACCEPTED} (up to 25 MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        id="dt-import-file"
                        type="file"
                        accept={ACCEPTED}
                        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                        className="sr-only"
                      />
                    </label>

                    {fileName && (
                      <div className="mt-3 flex items-center gap-3 rounded-lg border border-border bg-muted/40 p-3">
                        <FileSpreadsheet className="w-5 h-5 text-primary" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
                          <p className="text-xs text-muted-foreground">Ready to map columns</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFileName(null)}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Match each column from your file to a destination field.
                    </p>
                    <div className="overflow-hidden rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/60 text-left">
                          <tr>
                            <th className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Source column
                            </th>
                            <th className="px-3 py-2 w-8" aria-hidden="true"></th>
                            <th className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                              Destination field
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {SAMPLE_SOURCE_COLUMNS.map((col) => (
                            <tr key={col} className="border-t border-border">
                              <td className="px-3 py-2 font-mono text-xs text-foreground">{col}</td>
                              <td className="px-1 py-2 text-muted-foreground">
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                              </td>
                              <td className="px-3 py-2">
                                <label className="sr-only" htmlFor={`map-${col}`}>
                                  Map {col} to destination field
                                </label>
                                <select
                                  id={`map-${col}`}
                                  value={mapping[col] ?? "— Skip —"}
                                  onChange={(e) =>
                                    setMapping((m) => ({ ...m, [col]: e.target.value }))
                                  }
                                  className="w-full px-2 py-1.5 bg-background border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/60"
                                >
                                  {DESTINATION_FIELDS.map((f) => (
                                    <option key={f} value={f}>
                                      {f}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-lg border border-border bg-background/40 p-3">
                        <p className="text-xs text-muted-foreground">File</p>
                        <p className="text-sm font-medium text-foreground truncate">{fileName ?? "—"}</p>
                      </div>
                      <div className="rounded-lg border border-border bg-background/40 p-3">
                        <p className="text-xs text-muted-foreground">Rows detected</p>
                        <p className="text-sm font-medium text-foreground tabular-nums">1,284</p>
                      </div>
                      <div className="rounded-lg border border-border bg-background/40 p-3">
                        <p className="text-xs text-muted-foreground">Columns mapped</p>
                        <p className="text-sm font-medium text-foreground tabular-nums">
                          {mappedCount} / {SAMPLE_SOURCE_COLUMNS.length}
                        </p>
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-muted/30 p-3">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Ready to import
                      </p>
                      <p className="text-sm text-foreground">
                        We&apos;ll import 1,284 rows into your table. Duplicate emails will be skipped.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-6">
                <button
                  ref={firstFocusRef}
                  type="button"
                  onClick={step === 0 ? close : () => setStep(((step - 1) as Step))}
                  className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm font-semibold rounded-lg transition-colors"
                >
                  {step === 0 ? "Cancel" : "Back"}
                </button>
                {step < 2 ? (
                  <button
                    type="button"
                    disabled={!canNext}
                    onClick={() => setStep(((step + 1) as Step))}
                    className="flex-1 py-2 bg-primary hover:brightness-110 text-primary-foreground text-sm font-semibold rounded-lg shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={close}
                    className="flex-1 py-2 bg-primary hover:brightness-110 text-primary-foreground text-sm font-semibold rounded-lg shadow-sm transition-all"
                  >
                    Import 1,284 rows
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
