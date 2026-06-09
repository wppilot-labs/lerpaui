"use client";

import React, { useState } from "react";
import { StickyNote, Check } from "lucide-react";
import { cn } from "../lib/cn";

const MAX = 200;

export interface CartOrderNotesBoxProps {
  className?: string;
}

export function CartOrderNotesBox({ className }: CartOrderNotesBoxProps) {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const remaining = MAX - note.length;

  return (
    <div
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <label
        htmlFor="order-notes"
        className="flex items-center gap-1.5 text-sm font-semibold"
      >
        <StickyNote className="h-4 w-4 text-primary" />
        Order notes
      </label>
      <p className="mt-0.5 text-xs text-muted-foreground/55">
        Add delivery instructions or a gift message (optional)
      </p>

      <textarea
        id="order-notes"
        value={note}
        maxLength={MAX}
        onChange={(e) => {
          setNote(e.target.value);
          setSaved(false);
        }}
        rows={3}
        placeholder="e.g. Leave at the back door. Please don't ring the bell."
        className="mt-3 w-full resize-none rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-xs leading-snug text-foreground placeholder:text-muted-foreground/40 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
      />

      <div className="mt-2 flex items-center justify-between">
        <span
          className={cn(
            "text-xs",
            remaining < 20 ? "text-amber-400" : "text-muted-foreground/45",
          )}
        >
          {remaining} characters left
        </span>
        <button
          type="button"
          onClick={() => setSaved(true)}
          disabled={!note.trim() || saved}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
            saved
              ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
              : "bg-primary text-primary-foreground hover:brightness-110 disabled:opacity-40",
          )}
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Saved
            </>
          ) : (
            "Save note"
          )}
        </button>
      </div>
    </div>
  );
}
