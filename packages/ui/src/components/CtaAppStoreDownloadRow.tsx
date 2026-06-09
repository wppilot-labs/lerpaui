"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Apple, Smartphone, QrCode } from "lucide-react";
import { cn } from "../lib/cn";

export interface CtaAppStoreDownloadRowProps {
  className?: string;
  appleHref?: string;
  androidHref?: string;
}

export function CtaAppStoreDownloadRow({
  className,
  appleHref = "#apple",
  androidHref = "#android",
}: CtaAppStoreDownloadRowProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      aria-label="Download the app"
      className={cn(
        "w-full rounded-3xl border bg-card px-6 py-16 shadow-sm transition-shadow hover:shadow-md md:py-20",
        className
      )}
    >
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-[1fr_auto]">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <Smartphone className="h-3 w-3" aria-hidden /> Mobile launch · v1.0
          </span>

          <h2 className="mt-4 text-balance text-3xl font-black leading-tight tracking-tight text-foreground sm:text-4xl">
            Carry your workflow in your pocket
          </h2>
          <p className="mt-3 max-w-lg text-pretty text-base text-muted-foreground">
            Push notifications, offline-first sync, biometric login. Built natively for both platforms.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={appleHref}
              className="group inline-flex items-center gap-3 rounded-xl border bg-foreground px-4 py-3 text-background transition-all hover:brightness-95"
              aria-label="Download on the App Store"
            >
              <Apple className="h-7 w-7" aria-hidden />
              <span className="flex flex-col leading-tight text-left">
                <span className="text-[10px] uppercase tracking-wider opacity-70">Download on the</span>
                <span className="text-base font-semibold">App Store</span>
              </span>
            </a>
            <a
              href={androidHref}
              className="group inline-flex items-center gap-3 rounded-xl border bg-foreground px-4 py-3 text-background transition-all hover:brightness-95"
              aria-label="Get it on Google Play"
            >
              <PlayBadge />
              <span className="flex flex-col leading-tight text-left">
                <span className="text-[10px] uppercase tracking-wider opacity-70">Get it on</span>
                <span className="text-base font-semibold">Google Play</span>
              </span>
            </a>
          </div>

          <p className="mt-4 text-[11px] text-muted-foreground">
            iOS 16+ · Android 12+ · 38 MB
          </p>
        </motion.div>

        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col items-center rounded-2xl border bg-muted/20 p-5"
        >
          <div className="grid h-32 w-32 place-items-center rounded-xl bg-card p-3">
            <QrCode className="h-full w-full text-foreground" strokeWidth={1.5} aria-hidden />
          </div>
          <p className="mt-3 text-center text-xs font-medium text-foreground">Scan to download</p>
          <p className="text-center text-[10px] text-muted-foreground">Works on both stores</p>
        </motion.div>
      </div>
    </section>
  );
}

function PlayBadge() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden fill="currentColor">
      <path d="M3.6 2.2a2 2 0 0 0-1 1.7v16.2a2 2 0 0 0 1 1.7l9.4-9.8L3.6 2.2zm10.7 11.2 2.8 2.9-9.7 5.4 6.9-8.3zm6.8-3.9-3.2-1.8-3.1 3.2 3.1 3.3 3.2-1.8a2 2 0 0 0 0-3zm-9.9-6.1 9.7 5.4-2.8 2.9-6.9-8.3z" />
    </svg>
  );
}

export default CtaAppStoreDownloadRow;
