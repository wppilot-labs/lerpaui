"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  GraduationCap,
  ChevronDown,
  BookOpen,
  Layers,
  Code2,
  Palette,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface NavbarMegamenuEducationProps {
  className?: string;
}

const COURSE_GROUPS = [
  {
    heading: "By topic",
    items: [
      { icon: Code2, label: "Frontend foundations", desc: "HTML, CSS, semantics" },
      { icon: Palette, label: "Design systems", desc: "Tokens to components" },
      { icon: Layers, label: "Animation", desc: "Motion that respects users" },
      { icon: BookOpen, label: "Accessibility", desc: "Practical WCAG patterns" },
    ],
  },
  {
    heading: "By level",
    items: [
      { icon: Sparkles, label: "Beginner", desc: "Start from zero" },
      { icon: Layers, label: "Intermediate", desc: "Real-world projects" },
      { icon: Code2, label: "Advanced", desc: "Architecture & scale" },
      { icon: GraduationCap, label: "Certification", desc: "Earn a certificate" },
    ],
  },
];

const LINKS = ["Courses", "Library", "Instructors", "Pricing"] as const;

export function NavbarMegamenuEducation({
  className,
}: NavbarMegamenuEducationProps) {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <nav
      aria-label="Education primary"
      ref={containerRef}
      className={cn(
        "relative w-full rounded-2xl border border-border/60 bg-card/60 px-5 py-3 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow">
            <GraduationCap className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Klassroom
          </span>
        </a>

        <ul role="menubar" className="hidden items-center gap-1 md:flex">
          <li>
            <button
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]",
                open
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              Courses
              <ChevronDown
                className={cn(
                  "h-3.5 w-3.5 transition-transform",
                  open && "rotate-180",
                )}
                aria-hidden
              />
            </button>
          </li>
          {LINKS.slice(1).map((l) => (
            <li key={l}>
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
            Sign in
          </a>
          <a
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow transition hover:brightness-110"
          >
            Get started
          </a>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            className="absolute left-0 right-0 top-[calc(100%+10px)] mx-2 overflow-hidden rounded-2xl border bg-card shadow-xl"
          >
            <div className="grid gap-8 p-6 md:grid-cols-[1fr_1fr_0.8fr]">
              {COURSE_GROUPS.map((g) => (
                <div key={g.heading}>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {g.heading}
                  </div>
                  <ul className="mt-3 grid gap-1">
                    {g.items.map((it) => (
                      <li key={it.label}>
                        <a
                          href="/"
                          className="group flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                        >
                          <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                            <it.icon className="h-4 w-4" aria-hidden />
                          </span>
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-foreground">
                              {it.label}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {it.desc}
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="flex flex-col justify-between rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-card p-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3 w-3" aria-hidden />
                    New
                  </div>
                  <div className="mt-3 font-semibold text-foreground">
                    Frontend Architect track
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    32 hours · 4 capstones · Live mentorship
                  </p>
                </div>
                <a
                  href="/"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Browse track
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default NavbarMegamenuEducation;
