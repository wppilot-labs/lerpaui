"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Gauge, Palette, ShieldCheck, Workflow } from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureTabsSimpleProps {
  className?: string;
}

const TABS = [
  {
    id: "performance",
    label: "Performance",
    icon: Gauge,
    headline: "Built for fast first paints",
    description:
      "Components ship with zero runtime CSS, lazy motion, and tree-shakeable exports so you keep your INP and LCP budgets.",
    bullets: [
      "Sub-50ms hydration on shared components",
      "Reduced-motion respected automatically",
      "Server-component-friendly by default",
    ],
  },
  {
    id: "theming",
    label: "Theming",
    icon: Palette,
    headline: "One token map, every surface",
    description:
      "Theme Studio exports a CSS variable set that every block consumes — change brand colors once and every screen updates.",
    bullets: [
      "OKLCH-based color tokens",
      "Light, dark, and custom presets",
      "Type, radius, and shadow primitives",
    ],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    icon: ShieldCheck,
    headline: "WCAG-AA out of the box",
    description:
      "Every interactive component ships with keyboard, screen reader, and reduced-motion behavior verified by axe-core tests.",
    bullets: [
      "Roving tabindex on tablists & menus",
      "Visible focus rings on every control",
      "Tested against axe-core in CI",
    ],
  },
  {
    id: "composition",
    label: "Composition",
    icon: Workflow,
    headline: "Compose, don't configure",
    description:
      "Small primitives compose into blocks. Drop a header, hero, pricing grid, and footer together without prop drilling.",
    bullets: [
      "Predictable, prop-light API",
      "asChild slots where it matters",
      "Strict TypeScript signatures",
    ],
  },
] as const;

export function FeatureTabsSimple({ className }: FeatureTabsSimpleProps) {
  const headingId = React.useId();
  const baseId = React.useId();
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = React.useState(0);
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const last = TABS.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = activeIndex === last ? 0 : activeIndex + 1;
    else if (event.key === "ArrowLeft") next = activeIndex === 0 ? last : activeIndex - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next !== null) {
      event.preventDefault();
      setActiveIndex(next);
      tabRefs.current[next]?.focus();
    }
  };

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "w-full max-w-3xl rounded-3xl border border-border/60 bg-card/40 p-8 text-foreground backdrop-blur-xl sm:p-10",
        className,
      )}
    >
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          What you get
        </p>
        <h2
          id={headingId}
          className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Engineered for teams that ship
        </h2>
      </header>

      <div
        role="tablist"
        aria-label="Feature highlights"
        className="relative mb-6 flex flex-wrap gap-1 rounded-2xl border border-border/60 bg-background/60 p-1"
      >
        {TABS.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeIndex === index;
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              id={tabId}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={handleKeyDown}
              className={cn(
                "relative inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive ? (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className="absolute inset-0 rounded-xl border border-border bg-card shadow-sm"
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 360, damping: 30 }
                  }
                  aria-hidden="true"
                />
              ) : null}
              <span className="relative flex items-center gap-2">
                <Icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {TABS.map((tab, index) => {
        const tabId = `${baseId}-tab-${tab.id}`;
        const panelId = `${baseId}-panel-${tab.id}`;
        const isActive = activeIndex === index;
        return (
          <div
            key={tab.id}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive}
            className="rounded-2xl border border-border/60 bg-background/60 p-6"
          >
            {isActive ? (
              <motion.div
                key={tab.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={
                  reduceMotion ? undefined : { duration: 0.25, ease: "easeOut" }
                }
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {tab.headline}
                </h3>
                <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                  {tab.description}
                </p>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {tab.bullets.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-start gap-2 text-sm text-foreground"
                    >
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-primary"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
