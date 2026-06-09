"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Check, Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthRegisterCenterCardProps {
  className?: string;
  brandName?: string;
}

const PASSWORD_REQUIREMENTS = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "One number" },
  { test: (p: string) => /[^A-Za-z0-9]/.test(p), label: "One special character" },
];

export function AuthRegisterCenterCard({
  className,
  brandName = "Lerpa UI",
}: AuthRegisterCenterCardProps) {
  const reduced = useReducedMotion();
  const [password, setPassword] = useState("");
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden bg-background px-6 py-16 md:py-24",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.2_270/0.18),transparent_60%)]" />

      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mx-auto w-full max-w-md rounded-2xl border border-border bg-card/80 p-8 shadow-sm backdrop-blur-xl transition-shadow hover:shadow-md"
      >
        <div className="text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden />
            {brandName}
          </div>
          <h2 id={headingId} className="mt-4 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Start your free 14-day trial. No credit card required.
          </p>
        </div>

        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="reg-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Full name
            </label>
            <div className="relative">
              <User aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="reg-name"
                type="text"
                required
                placeholder="Jane Cooper"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <div className="relative">
              <Mail aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="reg-email"
                type="email"
                required
                placeholder="jane@company.com"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <div className="relative">
              <Lock aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="reg-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              />
            </div>
            <ul className="mt-3 space-y-1.5">
              {PASSWORD_REQUIREMENTS.map((req, i) => {
                const passed = req.test(password);
                return (
                  <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-full border",
                        passed ? "border-emerald-500 bg-emerald-500 text-white" : "border-border",
                      )}
                    >
                      {passed && <Check className="h-3 w-3" aria-hidden />}
                    </span>
                    <span className={passed ? "text-foreground" : ""}>{req.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <button
            type="submit"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          >
            Create account
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
          </button>

          <p className="text-center text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <a href="/" className="font-semibold text-primary hover:underline">Terms</a> and{" "}
            <a href="/" className="font-semibold text-primary hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </motion.div>
    </section>
  );
}

export default AuthRegisterCenterCard;
