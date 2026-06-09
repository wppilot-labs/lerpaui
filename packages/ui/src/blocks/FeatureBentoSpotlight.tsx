"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Activity,
  Boxes,
  GaugeCircle,
  Layers,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { usePrefersReducedMotion } from "../animation/hooks";
import { cn } from "../lib/cn";

export interface BentoFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  span?: "sm" | "md" | "lg";
}

export interface FeatureBentoSpotlightProps
  extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  features?: BentoFeature[];
  className?: string;
}

const DEFAULT_FEATURES: BentoFeature[] = [
  {
    id: "f-1",
    title: "Composable primitives",
    description:
      "380 components engineered as drop-in primitives. Compose without fighting opinionated wrappers.",
    icon: Boxes,
    span: "lg",
  },
  {
    id: "f-2",
    title: "Reduced-motion ready",
    description:
      "Every animation gates on prefers-reduced-motion. Zero retrofits.",
    icon: Activity,
    span: "sm",
  },
  {
    id: "f-3",
    title: "Type-safe by default",
    description:
      "TypeScript 5.7 strict mode across the registry. Inference where it counts.",
    icon: ShieldCheck,
    span: "sm",
  },
  {
    id: "f-4",
    title: "Design tokens, not magic",
    description:
      "Tailwind v4 CSS-first config. Themeable from a single source of truth.",
    icon: Layers,
    span: "md",
  },
  {
    id: "f-5",
    title: "Workflow-first install",
    description:
      "shadcn-compatible registry. Copy source into your repo, own the diff.",
    icon: Workflow,
    span: "md",
  },
  {
    id: "f-6",
    title: "Performance budget",
    description:
      "Code-split blocks. Lazy-loaded gallery. Static export friendly.",
    icon: GaugeCircle,
    span: "sm",
  },
];

interface SpotlightCardProps {
  feature: BentoFeature;
  reduced: boolean;
}

const SPAN_CLASSES: Record<NonNullable<BentoFeature["span"]>, string> = {
  sm: "md:col-span-2",
  md: "md:col-span-3",
  lg: "md:col-span-4",
};

function SpotlightCard({ feature, reduced }: SpotlightCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const Icon = feature.icon;

  const handleMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    },
    []
  );

  const handleLeave = React.useCallback(() => setPos(null), []);

  return (
    <motion.div
      ref={ref}
      onMouseMove={reduced ? undefined : handleMove}
      onMouseLeave={handleLeave}
      whileHover={reduced ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "group relative col-span-1 overflow-hidden rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm transition-shadow hover:shadow-lg",
        feature.span ? SPAN_CLASSES[feature.span] : "md:col-span-2"
      )}
    >
      {pos && !reduced ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-100 transition-opacity"
          style={{
            background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, oklch(0.7 0.18 280 / 0.18), transparent 70%)`,
          }}
        />
      ) : null}

      <div className="relative">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background/60 text-primary">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="mt-4 text-lg font-semibold text-foreground">
          {feature.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

export function FeatureBentoSpotlight({
  eyebrow = "Why teams choose Lerpa UI",
  title = "A foundation that scales with your product.",
  description = "Primitives, patterns, and motion language that don't lock you in. Built for engineers who care about the diff.",
  features = DEFAULT_FEATURES,
  className,
  ...rest
}: FeatureBentoSpotlightProps) {
  const prefersHook = usePrefersReducedMotion();
  const fmReduced = useReducedMotion();
  const reduced = prefersHook || Boolean(fmReduced);
  const headingId = React.useId();
  const items = features.length ? features : DEFAULT_FEATURES;

  return (
    <section
      {...rest}
      aria-labelledby={headingId}
      className={cn("relative w-full bg-background py-20 sm:py-28", className)}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          {eyebrow ? (
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-pretty text-base text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6">
          {items.map((feature) => (
            <SpotlightCard
              key={feature.id}
              feature={feature}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeatureBentoSpotlight;
