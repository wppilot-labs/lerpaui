"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Boxes, Layers, Sparkles, Workflow, type LucideIcon } from "lucide-react";
import { Container } from "../components/Container";
import { SectionHeader } from "../components/SectionHeader";
import { usePrefersReducedMotion } from "../animation/hooks";
import { cn } from "../lib/cn";

export interface SpotlightFeature {
  id: string;
  /** Tab label. */
  label: string;
  /** Optional short tag shown above the tab list. */
  tag?: string;
  /** Tab icon. Defaults to a generic dot. */
  icon?: LucideIcon;
  title: string;
  description: string;
  /** Bullet list shown inside the active panel. */
  bullets?: string[];
  /** Optional preview slot. Defaults to a stylized mock. */
  preview?: React.ReactNode;
  /** Accent color override (any CSS color or oklch token). */
  accent?: string;
}

export interface FeatureSpotlightSwitcherProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  features?: SpotlightFeature[];
  /** Initial active tab id. Falls back to first feature. */
  defaultId?: string;
  className?: string;
}

const DEFAULT_FEATURES: SpotlightFeature[] = [
  {
    id: "compose",
    label: "Compose",
    icon: Layers,
    title: "Compose entire pages from typed blocks.",
    description:
      "Every block ships with a strong Props interface and sensible defaults. Drop one into your route, override the props, and you're done.",
    bullets: [
      "30+ production-ready blocks",
      "Sensible defaults render out of the box",
      "Override anything via typed props",
    ],
    accent: "oklch(0.7 0.18 280)",
  },
  {
    id: "motion",
    label: "Motion",
    icon: Sparkles,
    title: "Motion that respects every user.",
    description:
      "Framer Motion sequences are gated by prefers-reduced-motion automatically. You don't have to think about it.",
    bullets: [
      "Reduced-motion gates baked in",
      "Spring-tuned easings out of the box",
      "Lazy-loaded animation primitives",
    ],
    accent: "oklch(0.75 0.15 200)",
  },
  {
    id: "tokens",
    label: "Tokens",
    icon: Boxes,
    title: "Tailwind v4 tokens, one source of truth.",
    description:
      "Theme everything from one CSS-first @theme block. The registry transforms your imports automatically when components are copied out.",
    bullets: [
      "Single CSS-first token block",
      "OKLCH color, fluid type, generous radii",
      "Registry-compatible import rewrites",
    ],
    accent: "oklch(0.78 0.16 340)",
  },
  {
    id: "workflow",
    label: "Workflow",
    icon: Workflow,
    title: "A copy-paste workflow that grows up.",
    description:
      "Start with copy-paste source. When you outgrow it, wire up the CLI and pull a curated subset. Same code either way.",
    bullets: [
      "Copy source straight into your repo",
      "CLI install for curated subsets",
      "Zero runtime dependency on us",
    ],
    accent: "oklch(0.74 0.17 60)",
  },
];

function MockPreview({ accent, label }: { accent: string; label: string }) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-card p-5"
      style={
        {
          background: `linear-gradient(160deg, color-mix(in oklch, ${accent} 14%, var(--card, white)) 0%, var(--card, white) 100%)`,
        } as React.CSSProperties
      }
    >
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-3 text-[10px] font-mono text-muted-foreground">{label}.preview</span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2 space-y-2">
          <div className="h-3 w-3/4 rounded bg-muted/70" />
          <div className="h-3 w-2/3 rounded bg-muted/60" />
          <div className="mt-2 h-20 rounded-lg" style={{ background: accent, opacity: 0.18 }} />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-10 rounded-md bg-muted/50" />
            <div className="h-10 rounded-md bg-muted/50" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-24 rounded-lg" style={{ background: accent, opacity: 0.22 }} />
          <div className="h-3 w-full rounded bg-muted/60" />
          <div className="h-3 w-5/6 rounded bg-muted/40" />
          <div className="h-3 w-2/3 rounded bg-muted/40" />
        </div>
      </div>
    </div>
  );
}

export function FeatureSpotlightSwitcher({
  eyebrow = "What you get",
  title = "Built for the way modern teams actually ship.",
  description = "Four pillars under every block. Click through them to see what changes.",
  features = DEFAULT_FEATURES,
  defaultId,
  className,
}: FeatureSpotlightSwitcherProps) {
  const reduced = usePrefersReducedMotion();
  const safe = features.length ? features : DEFAULT_FEATURES;
  const [activeId, setActiveId] = React.useState<string>(defaultId ?? safe[0]!.id);
  const active = safe.find((f) => f.id === activeId) ?? safe[0]!;

  // keyboard nav delegated to tabs (each tab is focusable)
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft" && e.key !== "Home" && e.key !== "End") return;
    e.preventDefault();
    const idx = safe.findIndex((f) => f.id === activeId);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % safe.length;
    if (e.key === "ArrowLeft") next = (idx - 1 + safe.length) % safe.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = safe.length - 1;
    const nextFeature = safe[next];
    if (!nextFeature) return;
    setActiveId(nextFeature.id);
    const btn = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next];
    btn?.focus();
  };

  const accent = active.accent ?? "var(--accent, oklch(0.7 0.18 280))";

  return (
    <section className={cn("relative w-full bg-background py-20 sm:py-28", className)}>
      <Container>
        <SectionHeader align="center" tag={eyebrow} title={title} description={description} />

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Tab list */}
          <div
            ref={listRef}
            role="tablist"
            aria-orientation="vertical"
            className="lg:col-span-4 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
          >
            {safe.map((f) => {
              const isActive = f.id === activeId;
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  id={`spotlight-tab-${f.id}`}
                  aria-selected={isActive}
                  aria-controls={`spotlight-panel-${f.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveId(f.id)}
                  onKeyDown={onTabKeyDown}
                  className={cn(
                    "group relative inline-flex shrink-0 items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                    isActive
                      ? "border-transparent bg-card shadow-md"
                      : "border-border bg-card/40 hover:border-border/70 hover:bg-card"
                  )}
                  style={
                    isActive
                      ? ({ boxShadow: `0 0 0 1px ${accent}33, 0 8px 24px ${accent}22` } as React.CSSProperties)
                      : undefined
                  }
                >
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      background: isActive ? accent : "var(--muted, oklch(0.96 0 0))",
                      color: isActive ? "white" : "var(--muted-foreground)",
                    }}
                    aria-hidden
                  >
                    {Icon ? <Icon className="h-4 w-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span className="min-w-0">
                    <span className={cn("block text-sm font-bold", isActive ? "text-foreground" : "text-foreground/80")}>
                      {f.label}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">{f.title}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active panel */}
          <div
            id={`spotlight-panel-${active.id}`}
            role="tabpanel"
            aria-labelledby={`spotlight-tab-${active.id}`}
            className="lg:col-span-8"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-1 gap-6 rounded-2xl border border-border bg-card p-6 text-card-foreground sm:grid-cols-2 sm:p-8"
              >
                <div className="flex flex-col justify-center gap-4">
                  {active.tag ? (
                    <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      {active.tag}
                    </span>
                  ) : null}
                  <h3 className="text-balance text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
                    {active.title}
                  </h3>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    {active.description}
                  </p>
                  {active.bullets?.length ? (
                    <ul className="mt-1 space-y-2">
                      {active.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                          <span
                            aria-hidden
                            className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                            style={{ background: accent }}
                          />
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
                <div className="min-h-[280px] sm:min-h-[320px]">
                  {active.preview ?? <MockPreview accent={accent} label={active.label.toLowerCase()} />}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FeatureSpotlightSwitcher;
