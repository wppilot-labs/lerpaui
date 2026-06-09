"use client";

import React from "react";
import { MessageCircle, Mail } from "lucide-react";
import { cn } from "../lib/cn";

export interface FaqContactCtaProps {
  className?: string;
}

export function FaqContactCta({ className }: FaqContactCtaProps) {
  return (
    <section
      className={cn(
        "w-full max-w-md bg-card/45 backdrop-blur-xl border border-border/50 p-6 rounded-2xl shadow-xl font-sans text-foreground text-center",
        className,
      )}
    >
      <div className="mx-auto mb-4 h-11 w-11 rounded-full bg-primary/15 flex items-center justify-center">
        <MessageCircle className="w-5 h-5 text-primary" />
      </div>
      <h2 className="text-base font-bold">Still have questions?</h2>
      <p className="mt-1.5 text-sm text-muted-foreground/70 leading-relaxed">
        Can&apos;t find the answer you&apos;re looking for? Our support team is
        happy to help you get set up.
      </p>
      <div className="mt-5 flex flex-col sm:flex-row gap-2 justify-center">
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
        >
          <MessageCircle className="w-4 h-4" />
          Start a chat
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-foreground/[0.08] bg-foreground/[0.02] px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-foreground/[0.05]"
        >
          <Mail className="w-4 h-4 text-muted-foreground/70" />
          Email us
        </button>
      </div>
    </section>
  );
}
