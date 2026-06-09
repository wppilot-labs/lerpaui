"use client";

import React, { useState } from "react";
import { Send, Check } from "lucide-react";
import { cn } from "../lib/cn";

export interface ContactFormSectionProps {
  className?: string;
}

export function ContactFormSection({ className }: ContactFormSectionProps) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    window.setTimeout(() => setSent(false), 2500);
  };

  return (
    <section
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground",
        className,
      )}
    >
      <h2 className="text-base font-bold">Get in touch</h2>
      <p className="mt-1 text-sm text-muted-foreground/65">
        We usually reply within one business day.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="cf-name" className="mb-1.5 block text-sm font-medium text-foreground/80">
              Name
            </label>
            <input
              id="cf-name"
              type="text"
              required
              placeholder="Jane Cooper"
              className="w-full rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
            />
          </div>
          <div>
            <label htmlFor="cf-email" className="mb-1.5 block text-sm font-medium text-foreground/80">
              Email
            </label>
            <input
              id="cf-email"
              type="email"
              required
              placeholder="jane@company.com"
              className="w-full rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        <div>
          <label htmlFor="cf-subject" className="mb-1.5 block text-sm font-medium text-foreground/80">
            Subject
          </label>
          <input
            id="cf-subject"
            type="text"
            placeholder="How can we help?"
            className="w-full rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div>
          <label htmlFor="cf-message" className="mb-1.5 block text-sm font-medium text-foreground/80">
            Message
          </label>
          <textarea
            id="cf-message"
            required
            rows={4}
            placeholder="Tell us a bit more…"
            className="w-full resize-none rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <button
          type="submit"
          className={cn(
            "flex w-full items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
            sent
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-primary text-primary-foreground hover:brightness-110",
          )}
        >
          {sent ? (
            <>
              <Check className="w-4 h-4" />
              Message sent
            </>
          ) : (
            <>
              Send message
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </section>
  );
}
