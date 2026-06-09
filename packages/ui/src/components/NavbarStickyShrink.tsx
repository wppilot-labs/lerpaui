"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "../lib/cn";

export interface NavbarStickyShrinkProps {
  className?: string;
  threshold?: number;
  brandName?: string;
  links?: string[];
  signInLabel?: string;
  ctaLabel?: string;
}

const DEFAULT_LINKS = ["Product", "Pricing", "Customers", "Docs", "Blog"];

export function NavbarStickyShrink({
  className,
  threshold = 60,
  brandName = "Crestline",
  links = DEFAULT_LINKS,
  signInLabel = "Sign in",
  ctaLabel = "Start free",
}: NavbarStickyShrinkProps) {
  const reduced = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <motion.nav
      aria-label="Primary"
      animate={
        reduced
          ? undefined
          : {
              paddingTop: scrolled ? 6 : 14,
              paddingBottom: scrolled ? 6 : 14,
            }
      }
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-4 z-40 mx-auto w-full max-w-5xl rounded-2xl border border-border/60 px-5 backdrop-blur-xl transition-all",
        scrolled
          ? "bg-background/90 shadow-lg shadow-black/5"
          : "bg-card/40 shadow-sm",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2.5">
          <motion.span
            animate={reduced ? undefined : { scale: scrolled ? 0.85 : 1 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
          </motion.span>
          <motion.span
            animate={reduced ? undefined : { fontSize: scrolled ? "13px" : "14px" }}
            transition={{ duration: 0.3 }}
            className="font-semibold tracking-tight text-foreground"
          >
            {brandName}
          </motion.span>
        </a>

        <ul role="menubar" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l} role="none">
              <a
                href="/"
                role="menuitem"
                className="inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition hover:bg-accent hover:text-foreground"
              >
                {l}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/"
            className="hidden text-sm font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
          >
            {signInLabel}
          </a>
          <motion.a
            href="/"
            animate={
              reduced
                ? undefined
                : { paddingTop: scrolled ? 6 : 10, paddingBottom: scrolled ? 6 : 10 }
            }
            transition={{ duration: 0.3 }}
            className="inline-flex items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
          >
            {ctaLabel}
          </motion.a>
        </div>
      </div>
    </motion.nav>
  );
}

export default NavbarStickyShrink;
