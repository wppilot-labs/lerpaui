"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  BarChart3,
  Code2,
  LayoutDashboard,
  Smartphone,
  TrendingUp,
} from "lucide-react";
import { cn } from "../lib/cn";

export interface FeatureTabsProductPreviewProps {
  className?: string;
}

type PreviewKind = "dashboard" | "editor" | "mobile";

const TABS: {
  id: string;
  label: string;
  icon: typeof BarChart3;
  headline: string;
  description: string;
  preview: PreviewKind;
}[] = [
  {
    id: "dashboard",
    label: "Dashboards",
    icon: LayoutDashboard,
    headline: "Live data, beautifully composed",
    description:
      "Drop production-ready chart blocks into any dashboard. Loading states, empty states, and tooltips included.",
    preview: "dashboard",
  },
  {
    id: "editor",
    label: "Code editor",
    icon: Code2,
    headline: "Syntax-aware editor surfaces",
    description:
      "Code preview, diff, and toolbar primitives that match the polish of your favorite IDE.",
    preview: "editor",
  },
  {
    id: "mobile",
    label: "Mobile views",
    icon: Smartphone,
    headline: "Responsive down to the thumb",
    description:
      "Every block is responsive-first with touch targets, safe areas, and reduced-motion respected.",
    preview: "mobile",
  },
];

function DashboardPreview() {
  return (
    <div className="flex h-full flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Revenue
          </p>
          <p className="text-lg font-semibold text-foreground">$48,219</p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          <TrendingUp className="h-3 w-3" aria-hidden="true" />
          +12.4%
        </span>
      </div>
      <div className="flex-1 rounded-lg border border-border/60 bg-background/60 p-3">
        <div className="flex h-full items-end gap-1.5" aria-hidden="true">
          {[40, 62, 38, 70, 55, 82, 64, 90, 72, 95, 80, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary/80"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-[10px]">
        {[
          { label: "Active", value: "1,284" },
          { label: "New", value: "342" },
          { label: "Churn", value: "1.8%" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-md border border-border/60 bg-background/60 px-2 py-1.5"
          >
            <p className="text-muted-foreground">{kpi.label}</p>
            <p className="font-semibold text-foreground">{kpi.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EditorPreview() {
  const lines = [
    { tag: "import", text: 'import { Button } from "@/components/ui";' },
    { tag: "blank", text: "" },
    { tag: "fn", text: "export function CTA() {" },
    { tag: "ret", text: "  return (" },
    { tag: "el", text: '    <Button size="lg" variant="default">' },
    { tag: "el", text: "      Get started" },
    { tag: "el", text: "    </Button>" },
    { tag: "ret", text: "  );" },
    { tag: "fn", text: "}" },
  ];
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1.5 border-b border-border/60 bg-muted/30 px-3 py-2">
        <span className="h-2 w-2 rounded-full bg-red-400/70" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-amber-400/70" aria-hidden="true" />
        <span className="h-2 w-2 rounded-full bg-emerald-400/70" aria-hidden="true" />
        <span className="ml-2 font-mono text-[10px] text-muted-foreground">
          cta.tsx
        </span>
      </div>
      <pre className="flex-1 overflow-hidden p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
        {lines.map((line, i) => (
          <div key={i} className="flex">
            <span className="mr-3 w-4 select-none text-right text-muted-foreground/40">
              {i + 1}
            </span>
            <span
              className={cn(
                line.tag === "import" && "text-primary",
                line.tag === "fn" && "text-foreground",
                line.tag === "el" && "text-foreground/80",
              )}
            >
              {line.text || " "}
            </span>
          </div>
        ))}
      </pre>
    </div>
  );
}

function MobilePreview() {
  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="relative h-full max-h-[260px] w-[140px] rounded-[28px] border-4 border-border bg-background shadow-md">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-border"
        />
        <div className="flex h-full flex-col gap-2 p-3 pt-5">
          <div className="rounded-lg bg-primary/10 p-2">
            <p className="text-[9px] font-semibold text-primary">Welcome</p>
            <p className="text-[8px] text-muted-foreground">Sync complete</p>
          </div>
          <div className="space-y-1.5">
            {["Daily summary", "Inbox", "Schedule"].map((label) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md border border-border/60 bg-card px-2 py-1.5 text-[9px] text-foreground"
              >
                <span>{label}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-md bg-foreground/90 px-2 py-1.5 text-center text-[9px] font-medium text-background">
            Continue
          </div>
        </div>
      </div>
    </div>
  );
}

function Preview({ kind }: { kind: PreviewKind }) {
  if (kind === "dashboard") return <DashboardPreview />;
  if (kind === "editor") return <EditorPreview />;
  return <MobilePreview />;
}

export function FeatureTabsProductPreview({
  className,
}: FeatureTabsProductPreviewProps) {
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

  const active = TABS[activeIndex];
  const activeTabId = `${baseId}-tab-${active.id}`;
  const activePanelId = `${baseId}-panel-${active.id}`;

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "w-full max-w-4xl rounded-3xl border border-border/60 bg-card/40 p-8 text-foreground backdrop-blur-xl sm:p-10",
        className,
      )}
    >
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          See it in context
        </p>
        <h2
          id={headingId}
          className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          One library, every surface
        </h2>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <div
            role="tablist"
            aria-label="Product surface examples"
            aria-orientation="vertical"
            className="flex flex-col gap-2"
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
                    "group flex items-start gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive
                      ? "border-primary/60 bg-background"
                      : "border-border/60 bg-background/40 hover:border-border",
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                      isActive
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-border bg-muted/40 text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">
                      {tab.label}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {tab.headline}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {active.description}
          </p>
        </div>

        <div
          id={activePanelId}
          role="tabpanel"
          aria-labelledby={activeTabId}
          className="relative h-80 overflow-hidden rounded-2xl border border-border bg-background/80 shadow-inner"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(0.85_0.15_240/0.12),transparent_60%)]"
          />
          <motion.div
            key={active.id}
            initial={reduceMotion ? false : { opacity: 0, y: 6 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            transition={
              reduceMotion ? undefined : { duration: 0.3, ease: "easeOut" }
            }
            className="relative h-full"
          >
            <Preview kind={active.preview} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
