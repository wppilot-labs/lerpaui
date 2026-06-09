"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, Shield, Zap } from "lucide-react";
import { cn } from "../lib/cn";

export interface AuthLoginSplitImageProps {
  className?: string;
  brandName?: string;
  tagline?: string;
}

export function AuthLoginSplitImage({
  className,
  brandName = "Lerpa UI",
  tagline = "Ship at the speed of thought.",
}: AuthLoginSplitImageProps) {
  const reduced = useReducedMotion();
  const [showPass, setShowPass] = useState(false);
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "relative w-full overflow-hidden rounded-3xl border border-border/50 bg-background",
        className,
      )}
    >
      <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center px-8 py-16 sm:px-12 md:py-24">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto w-full max-w-md"
          >
            <h2 id={headingId} className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to your {brandName} workspace.
            </p>

            <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email
                </label>
                <div className="relative">
                  <Mail aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-border bg-card/60 py-3 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <Lock aria-hidden className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="login-password"
                    type={showPass ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-border bg-card/60 py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input type="checkbox" className="rounded border-border accent-primary" />
                  Remember me
                </label>
                <a href="/" className="font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Sign in
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
              </button>

              <p className="text-center text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <a href="/" className="font-semibold text-primary hover:underline">Sign up</a>
              </p>
            </form>
          </motion.div>
        </div>

        <div className="relative hidden overflow-hidden lg:block">
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.75_0.2_280/0.4),transparent_70%)]" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-primary/30 via-fuchsia-500/20 to-cyan-500/20" />
          <div aria-hidden className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "32px 32px" }} />

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-10 flex h-full flex-col justify-between p-12 text-foreground"
          >
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {brandName}
            </div>
            <div>
              <h3 className="max-w-md text-balance text-4xl font-black leading-tight">{tagline}</h3>
              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { icon: Shield, label: "SOC 2 Type II" },
                  { icon: Zap, label: "240ms p50" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                    <Icon className="h-5 w-5 text-foreground/80" aria-hidden />
                    <div className="mt-2 text-sm font-semibold">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AuthLoginSplitImage;
