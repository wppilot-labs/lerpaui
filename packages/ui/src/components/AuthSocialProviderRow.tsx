"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "../lib/cn";

export interface AuthSocialProviderRowProps {
  className?: string;
  title?: string;
  description?: string;
  providers?: Array<"google" | "github" | "apple" | "microsoft" | "x">;
  layout?: "row" | "stack";
}

const PROVIDER_META: Record<string, { label: string; icon: React.ReactNode; bg: string; text: string; border: string }> = {
  google: {
    label: "Continue with Google",
    bg: "bg-white",
    text: "text-zinc-900",
    border: "border-zinc-300",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.1A6.5 6.5 0 0 1 5.5 12c0-.73.12-1.44.34-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.83z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
      </svg>
    ),
  },
  github: {
    label: "Continue with GitHub",
    bg: "bg-zinc-900",
    text: "text-white",
    border: "border-zinc-700",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.9.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.71.08-.69.08-.69 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.19a11 11 0 0 1 5.78 0c2.2-1.5 3.17-1.19 3.17-1.19.63 1.58.24 2.75.12 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14V22.34c0 .31.21.67.79.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
      </svg>
    ),
  },
  apple: {
    label: "Continue with Apple",
    bg: "bg-black",
    text: "text-white",
    border: "border-zinc-800",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M16.43 12.45c-.02-2.27 1.85-3.36 1.93-3.42-1.05-1.54-2.7-1.75-3.28-1.78-1.4-.14-2.72.82-3.43.82-.72 0-1.81-.8-2.98-.78-1.53.02-2.94.89-3.73 2.26-1.59 2.76-.41 6.84 1.14 9.08.76 1.1 1.66 2.33 2.83 2.29 1.14-.05 1.57-.74 2.95-.74 1.37 0 1.76.74 2.96.71 1.22-.02 1.99-1.11 2.74-2.22.86-1.27 1.21-2.51 1.23-2.58-.03-.01-2.36-.91-2.39-3.6zM14.21 5.6c.62-.76 1.04-1.81.92-2.86-.9.04-1.99.6-2.63 1.35-.58.67-1.08 1.74-.94 2.76 1 .08 2.03-.51 2.65-1.25z" />
      </svg>
    ),
  },
  microsoft: {
    label: "Continue with Microsoft",
    bg: "bg-white",
    text: "text-zinc-900",
    border: "border-zinc-300",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5">
        <path fill="#F25022" d="M2 2h9.5v9.5H2z" />
        <path fill="#7FBA00" d="M12.5 2H22v9.5h-9.5z" />
        <path fill="#00A4EF" d="M2 12.5h9.5V22H2z" />
        <path fill="#FFB900" d="M12.5 12.5H22V22h-9.5z" />
      </svg>
    ),
  },
  x: {
    label: "Continue with X",
    bg: "bg-black",
    text: "text-white",
    border: "border-zinc-800",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 fill-current">
        <path d="M18.244 2H21l-6.522 7.456L22 22h-6.844l-4.74-6.196L4.8 22H2l7.06-8.07L2 2h7.013l4.29 5.677L18.245 2zm-1.2 18h1.83L7.05 4H5.103l11.94 16z" />
      </svg>
    ),
  },
};

export function AuthSocialProviderRow({
  className,
  title = "Sign in to continue",
  description = "Use your existing account to access your workspace instantly.",
  providers = ["google", "github", "apple"],
  layout = "stack",
}: AuthSocialProviderRowProps) {
  const reduced = useReducedMotion();
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full bg-background px-6 py-16 md:py-24",
        className,
      )}
    >
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="text-center">
          <h2 id={headingId} className="text-2xl font-black tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>

        <div className={cn("mt-6", layout === "row" ? "flex flex-wrap items-center justify-center gap-2" : "space-y-3")}>
          {providers.map((p) => {
            const meta = PROVIDER_META[p];
            if (!meta) return null;
            return (
              <button
                key={p}
                type="button"
                className={cn(
                  "inline-flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold shadow-sm transition-all hover:brightness-95 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  meta.bg,
                  meta.text,
                  meta.border,
                  layout === "row" ? "h-12 w-12 p-0" : "w-full",
                )}
                aria-label={meta.label}
              >
                {meta.icon}
                {layout === "stack" && <span>{meta.label}</span>}
              </button>
            );
          })}
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <a
          href="/"
          className="block w-full rounded-xl border border-border bg-card/60 py-3 text-center text-sm font-semibold text-foreground transition-colors hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          Use email instead
        </a>
      </motion.div>
    </section>
  );
}

export default AuthSocialProviderRow;
