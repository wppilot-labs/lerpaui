"use client";

import { useState } from "react";
import { Undo2 } from "lucide-react";
import { cn } from "../lib/cn";

const REASONS = [
  "Wrong size or fit",
  "Damaged or defective",
  "Not as described",
  "Arrived too late",
  "Changed my mind",
];

const RESOLUTIONS = ["Refund", "Replacement", "Store credit"];

export interface CustomerReturnRequestFormProps {
  className?: string;
}

export function CustomerReturnRequestForm({ className }: CustomerReturnRequestFormProps) {
  const [resolution, setResolution] = useState("Refund");

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn("w-full max-w-md bg-card backdrop-blur-xl border border-border p-5 rounded-2xl shadow-sm font-sans text-foreground", className)}
    >
      <div className="mb-1 flex items-center gap-2">
        <Undo2 className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold">Request a return</h3>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">Order #1042 · Delivered May 28, 2026</p>

      <div className="space-y-4">
        <div>
          <label htmlFor="rr-item" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Item
          </label>
          <select
            id="rr-item"
            className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            <option className="bg-card">Wool Runner — Natural Black, M</option>
            <option className="bg-card">Cotton Tee — White, L</option>
            <option className="bg-card">Canvas Tote — Sand</option>
          </select>
        </div>

        <div>
          <label htmlFor="rr-reason" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Reason for return
          </label>
          <select
            id="rr-reason"
            className="w-full rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
          >
            {REASONS.map((r) => (
              <option key={r} className="bg-card">
                {r}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className="mb-1.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Preferred resolution
          </legend>
          <div className="flex gap-2">
            {RESOLUTIONS.map((r) => {
              const active = resolution === r;
              return (
                <label
                  key={r}
                  className={cn(
                    "flex-1 cursor-pointer rounded-xl border py-2.5 text-center text-sm font-semibold transition-colors",
                    active
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border bg-foreground/[0.02] text-muted-foreground hover:bg-foreground/[0.04]"
                  )}
                >
                  <input
                    type="radio"
                    name="resolution"
                    value={r}
                    checked={active}
                    onChange={() => setResolution(r)}
                    className="sr-only"
                  />
                  {r}
                </label>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="rr-notes" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Additional details (optional)
          </label>
          <textarea
            id="rr-notes"
            rows={2}
            placeholder="Tell us more about the issue…"
            className="w-full resize-none rounded-xl border border-border bg-foreground/[0.03] px-3 py-2.5 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground transition-all hover:brightness-110"
      >
        Submit return request
      </button>
    </form>
  );
}
