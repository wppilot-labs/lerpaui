"use client";

import React, { useState } from "react";
import { Camera, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface ProfileEditFormSectionProps {
  className?: string;
}

export function ProfileEditFormSection({ className }: ProfileEditFormSectionProps) {
  const [saved, setSaved] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form
      onSubmit={submit}
      className={cn(
        "w-full max-w-lg rounded-2xl border border-border/50 bg-card/60 p-5 font-sans text-foreground shadow-xl backdrop-blur-xl",
        className,
      )}
    >
      <h3 className="text-base font-bold">Edit profile</h3>
      <p className="mb-4 text-sm text-muted-foreground/55">Update your personal details and public info.</p>

      <div className="mb-4 flex items-center gap-3">
        <div className="relative">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-violet-500 text-lg font-bold text-primary-foreground">
            AL
          </span>
          <button
            type="button"
            aria-label="Change avatar"
            className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border/50 bg-card text-muted-foreground transition-colors hover:text-foreground"
          >
            <Camera className="h-3.5 w-3.5" />
          </button>
        </div>
        <div>
          <div className="text-sm font-semibold">Ava Lindqvist</div>
          <div className="text-xs text-muted-foreground/50">PNG or JPG, max 2MB</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="pe-first" className="mb-1 block text-xs font-medium text-muted-foreground/80">
            First name
          </label>
          <input
            id="pe-first"
            type="text"
            defaultValue="Ava"
            className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="pe-last" className="mb-1 block text-xs font-medium text-muted-foreground/80">
            Last name
          </label>
          <input
            id="pe-last"
            type="text"
            defaultValue="Lindqvist"
            className="w-full rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-3">
        <label htmlFor="pe-bio" className="mb-1 block text-xs font-medium text-muted-foreground/80">
          Bio
        </label>
        <textarea
          id="pe-bio"
          rows={2}
          defaultValue="Product designer focused on calm, accessible interfaces."
          className="w-full resize-none rounded-xl border border-foreground/[0.06] bg-foreground/[0.03] px-3 py-2 text-sm focus:border-primary/40 focus:outline-none"
        />
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-foreground/[0.06] pt-4">
        <button
          type="button"
          className="rounded-xl border border-border/50 px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-foreground/[0.04]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:brightness-110"
        >
          {saved ? (
            <>
              <Check className="h-4 w-4" /> Saved
            </>
          ) : (
            "Save changes"
          )}
        </button>
      </div>
    </form>
  );
}
