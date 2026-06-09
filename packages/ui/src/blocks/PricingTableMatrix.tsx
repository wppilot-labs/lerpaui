"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Check, Minus, Sparkles } from "lucide-react";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { SectionHeader } from "../components/SectionHeader";
import { usePrefersReducedMotion } from "../animation/hooks";
import { cn } from "../lib/cn";

export type FeatureCell = boolean | string | "included" | "—";

export interface PricingMatrixTier {
  id: string;
  name: string;
  /** Short positioning sentence shown under the tier name. */
  pitch?: string;
  /** Monthly price string (already formatted). */
  price: string;
  /** Suffix appended to the price line, e.g. "/ month". */
  priceSuffix?: string;
  /** Highlight this column as the recommended plan. */
  highlight?: boolean;
  cta?: { label: string; onClick?: () => void; href?: string };
}

export interface PricingFeatureRow {
  /** Section label that visually groups consecutive rows. */
  group: string;
  /** Feature name shown in the leftmost column. */
  label: string;
  /** Per-tier cell values keyed by `PricingMatrixTier.id`. */
  cells: Record<string, FeatureCell>;
}

export interface PricingTableMatrixProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  tiers?: PricingMatrixTier[];
  rows?: PricingFeatureRow[];
  className?: string;
}

const DEFAULT_TIERS: PricingMatrixTier[] = [
  {
    id: "starter",
    name: "Starter",
    pitch: "Everything indies need to ship.",
    price: "$0",
    priceSuffix: "/ forever",
    cta: { label: "Start free" },
  },
  {
    id: "team",
    name: "Team",
    pitch: "For small product teams.",
    price: "$29",
    priceSuffix: "/ user / mo",
    highlight: true,
    cta: { label: "Start 14-day trial" },
  },
  {
    id: "scale",
    name: "Scale",
    pitch: "Power features for growth.",
    price: "$79",
    priceSuffix: "/ user / mo",
    cta: { label: "Talk to sales" },
  },
];

const DEFAULT_ROWS: PricingFeatureRow[] = [
  { group: "Workspaces", label: "Projects", cells: { starter: "3", team: "Unlimited", scale: "Unlimited" } },
  { group: "Workspaces", label: "Seats included", cells: { starter: "1", team: "10", scale: "Unlimited" } },
  { group: "Workspaces", label: "Custom roles", cells: { starter: false, team: true, scale: true } },
  { group: "Collaboration", label: "Live cursors", cells: { starter: true, team: true, scale: true } },
  { group: "Collaboration", label: "Audit history", cells: { starter: "7 days", team: "90 days", scale: "Unlimited" } },
  { group: "Collaboration", label: "Branching", cells: { starter: false, team: true, scale: true } },
  { group: "Security", label: "SSO / SAML", cells: { starter: false, team: false, scale: true } },
  { group: "Security", label: "SOC 2 report", cells: { starter: false, team: true, scale: true } },
  { group: "Security", label: "Custom data residency", cells: { starter: false, team: false, scale: true } },
  { group: "Support", label: "Email support", cells: { starter: true, team: true, scale: true } },
  { group: "Support", label: "Dedicated CSM", cells: { starter: false, team: false, scale: true } },
];

function renderCell(value: FeatureCell): React.ReactNode {
  if (value === true || value === "included") {
    return <Check className="h-4 w-4 text-emerald-500" aria-label="Included" />;
  }
  if (value === false || value === "—") {
    return <Minus className="h-4 w-4 text-muted-foreground/50" aria-label="Not included" />;
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

export function PricingTableMatrix({
  eyebrow = "Compare plans",
  title = "One price card, every detail laid out.",
  description = "We hide nothing in fine print. Stack the plans side-by-side and pick the one your team will actually use.",
  tiers = DEFAULT_TIERS,
  rows = DEFAULT_ROWS,
  className,
}: PricingTableMatrixProps) {
  const reduced = usePrefersReducedMotion();
  const safeTiers = tiers.length ? tiers : DEFAULT_TIERS;
  const safeRows = rows.length ? rows : DEFAULT_ROWS;

  // Group consecutive rows by group label
  const grouped = React.useMemo(() => {
    const out: Array<{ group: string; rows: PricingFeatureRow[] }> = [];
    for (const row of safeRows) {
      const tail = out[out.length - 1];
      if (tail && tail.group === row.group) tail.rows.push(row);
      else out.push({ group: row.group, rows: [row] });
    }
    return out;
  }, [safeRows]);

  return (
    <section className={cn("relative w-full bg-background py-20 sm:py-28", className)}>
      <Container>
        <SectionHeader
          align="center"
          tag={eyebrow}
          title={title}
          description={description}
        />

        {/* Mobile: stacked tier cards */}
        <div className="space-y-4 lg:hidden">
          {safeTiers.map((tier, idx) => (
            <motion.div
              key={tier.id}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: reduced ? 0 : idx * 0.05 }}
              className={cn(
                "rounded-2xl border bg-card p-6 text-card-foreground",
                tier.highlight ? "border-[var(--accent,theme(colors.primary))] shadow-lg" : "border-border"
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                  {tier.pitch ? <p className="mt-1 text-xs text-muted-foreground">{tier.pitch}</p> : null}
                </div>
                {tier.highlight ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Sparkles className="h-3 w-3" aria-hidden /> Popular
                  </span>
                ) : null}
              </div>
              <p className="mb-5 text-3xl font-extrabold text-foreground">
                {tier.price}
                {tier.priceSuffix ? (
                  <span className="ml-1 text-sm font-medium text-muted-foreground">{tier.priceSuffix}</span>
                ) : null}
              </p>
              <Button
                variant={tier.highlight ? "default" : "outline"}
                className="w-full"
                onClick={tier.cta?.onClick}
                aria-label={`${tier.cta?.label ?? "Choose"} ${tier.name}`}
              >
                {tier.cta?.label ?? "Choose plan"}
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Desktop: matrix table */}
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-card lg:block">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-border">
                  <th scope="col" className="w-1/3 px-6 py-6 align-bottom text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Features
                  </th>
                  {safeTiers.map((tier) => (
                    <th
                      key={tier.id}
                      scope="col"
                      className={cn(
                        "px-6 py-6 align-bottom",
                        tier.highlight && "bg-primary/[0.04]"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-foreground">{tier.name}</h3>
                        {tier.highlight ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                            <Sparkles className="h-3 w-3" aria-hidden /> Popular
                          </span>
                        ) : null}
                      </div>
                      {tier.pitch ? (
                        <p className="mt-1 text-xs text-muted-foreground">{tier.pitch}</p>
                      ) : null}
                      <p className="mt-3 text-2xl font-extrabold text-foreground">
                        {tier.price}
                        {tier.priceSuffix ? (
                          <span className="ml-1 text-xs font-medium text-muted-foreground">{tier.priceSuffix}</span>
                        ) : null}
                      </p>
                      <Button
                        size="sm"
                        variant={tier.highlight ? "default" : "outline"}
                        className="mt-4 w-full"
                        onClick={tier.cta?.onClick}
                      >
                        {tier.cta?.label ?? "Choose plan"}
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grouped.map((g, gi) => (
                  <React.Fragment key={g.group}>
                    <tr className="border-t border-border bg-muted/30">
                      <td
                        colSpan={1 + safeTiers.length}
                        className="px-6 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground"
                      >
                        {g.group}
                      </td>
                    </tr>
                    {g.rows.map((row, ri) => (
                      <motion.tr
                        key={`${gi}-${ri}-${row.label}`}
                        initial={reduced ? false : { opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true, margin: "-20px" }}
                        transition={{ duration: 0.35, delay: reduced ? 0 : (gi * 0.04 + ri * 0.02) }}
                        className="border-t border-border/60"
                      >
                        <th scope="row" className="px-6 py-3 text-sm font-medium text-foreground">
                          {row.label}
                        </th>
                        {safeTiers.map((tier) => (
                          <td
                            key={tier.id}
                            className={cn("px-6 py-3", tier.highlight && "bg-primary/[0.04]")}
                          >
                            {renderCell(row.cells[tier.id] ?? false)}
                          </td>
                        ))}
                      </motion.tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default PricingTableMatrix;
