"use client";

import React, { useState } from "react";
import { Briefcase, Paperclip, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface JobApplicationFormSectionProps {
  className?: string;
}

export function JobApplicationFormSection({ className }: JobApplicationFormSectionProps) {
  const [resume, setResume] = useState<string | null>("alex-rivera-cv.pdf");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className={cn("w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-5 rounded-2xl shadow-xl font-sans text-foreground text-left", className)}>
      <div className="flex items-center gap-2 mb-1">
        <Briefcase className="w-5 h-5 text-primary" />
        <h3 className="text-base font-bold">Apply: Senior Frontend Engineer</h3>
      </div>
      <p className="text-sm text-muted-foreground/60 mb-4">Remote · Full-time</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="ja-name" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Full name</label>
            <input id="ja-name" type="text" required placeholder="Alex Rivera" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="ja-email" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Email</label>
            <input id="ja-email" type="email" required placeholder="alex@mail.com" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
          </div>
        </div>

        <div>
          <label htmlFor="ja-portfolio" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Portfolio / LinkedIn</label>
          <input id="ja-portfolio" type="url" placeholder="https://" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary/50 focus:outline-none" />
        </div>

        <div>
          <span className="block text-xs font-semibold text-muted-foreground/70 mb-1">Resume</span>
          <label className="flex items-center gap-2 rounded-lg border border-dashed border-foreground/[0.12] px-3 py-3 cursor-pointer hover:bg-foreground/[0.02] transition-colors">
            <Paperclip className="w-4 h-4 text-muted-foreground/55" />
            <span className={cn("text-sm truncate", resume ? "text-foreground" : "text-muted-foreground/50")}>
              {resume ?? "Attach PDF resume"}
            </span>
            <input type="file" accept=".pdf" className="sr-only" onChange={(e) => setResume(e.target.files?.[0]?.name ?? resume)} aria-label="Upload resume" />
          </label>
        </div>

        <div>
          <label htmlFor="ja-cover" className="block text-xs font-semibold text-muted-foreground/70 mb-1">Cover note</label>
          <textarea id="ja-cover" rows={2} placeholder="Why are you a great fit?" className="w-full bg-foreground/[0.03] border border-foreground/[0.08] rounded-lg px-3 py-2.5 text-sm resize-none focus:ring-1 focus:ring-primary/50 focus:outline-none" />
        </div>

        <button
          type="submit"
          disabled={sent}
          className="w-full py-2.5 bg-primary hover:brightness-110 disabled:opacity-80 text-primary-foreground text-sm font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all"
        >
          {sent ? (
            <>
              <Check className="w-4 h-4" /> Application submitted
            </>
          ) : (
            "Submit application"
          )}
        </button>
      </form>
    </div>
  );
}
