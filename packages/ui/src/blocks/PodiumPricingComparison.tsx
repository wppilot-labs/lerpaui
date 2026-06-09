'use client';

import * as React from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from 'framer-motion';
import { ArrowRight, Check, ChevronDown, Minus, Sparkles, X } from 'lucide-react';

import { usePrefersReducedMotion } from '../animation/hooks';
import { cn } from '../lib/cn';

export interface PodiumPricingTier {
  id: string;
  name: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency?: string;
  features: { label: string; included: boolean; emphasize?: boolean }[];
  cta: { label: string; href?: string; onClick?: () => void };
  recommended?: boolean;
}

export interface PodiumPricingComparisonProps
  extends React.HTMLAttributes<HTMLElement> {
  eyebrow?: string;
  title?: string;
  description?: string;
  tiers?: PodiumPricingTier[];
  defaultBilling?: 'monthly' | 'yearly';
  showCompareTable?: boolean;
  className?: string;
}

type Billing = 'monthly' | 'yearly';

const yearly = (m: number) => Math.round(m * 12 * 0.8);
const feat = (label: string, included = true, emphasize = false) => ({ label, included, emphasize });

const DEFAULT_TIERS: PodiumPricingTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For solo builders shipping their first product.',
    monthlyPrice: 19,
    yearlyPrice: yearly(19),
    features: [
      feat('3 active projects'),
      feat('10 GB asset storage'),
      feat('Community Discord access'),
      feat('Basic analytics dashboard'),
      feat('Priority email support', false),
      feat('Custom domains', false),
      feat('SSO & SAML', false),
    ],
    cta: { label: 'Start free trial', href: '#starter' },
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams that need speed and polish.',
    monthlyPrice: 49,
    yearlyPrice: yearly(49),
    recommended: true,
    features: [
      feat('Unlimited projects', true, true),
      feat('250 GB asset storage'),
      feat('Advanced analytics & cohorts', true, true),
      feat('Priority email & chat support'),
      feat('Custom domains + SSL'),
      feat('Team collaboration (10 seats)'),
      feat('SSO & SAML', false),
    ],
    cta: { label: 'Upgrade to Pro', href: '#pro' },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large orgs with custom security and scale needs.',
    monthlyPrice: 149,
    yearlyPrice: yearly(149),
    features: [
      feat('Everything in Pro'),
      feat('Unlimited storage'),
      feat('Dedicated success manager', true, true),
      feat('99.99% uptime SLA', true, true),
      feat('SSO, SAML & audit logs'),
      feat('Custom contracts & invoicing'),
      feat('On-prem deployment option'),
    ],
    cta: { label: 'Talk to sales', href: '#enterprise' },
  },
];

// Counter ramp: rAF ease-out from previous price to next (~420ms).
const RAMP_DURATION_MS = 420;

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useAnimatedPrice(target: number, instant: boolean): number {
  const [value, setValue] = React.useState<number>(target);
  const fromRef = React.useRef<number>(target);
  const rafRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (instant) {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      fromRef.current = target;
      setValue(target);
      return;
    }

    const from = fromRef.current;
    const to = target;
    if (from === to) return;

    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / RAMP_DURATION_MS);
      const eased = easeOutCubic(t);
      const next = from + (to - from) * eased;
      setValue(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
        rafRef.current = null;
      }
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      fromRef.current = target;
    };
  }, [target, instant]);

  return value;
}

function formatPrice(n: number): string {
  return Math.round(n).toLocaleString();
}

interface BillingToggleProps {
  value: Billing;
  onChange: (next: Billing) => void;
  reduced: boolean;
}

const BillingToggle = React.memo(function BillingToggle({ value, onChange, reduced }: BillingToggleProps) {
  const isYearly = value === 'yearly';
  const transition: Transition = reduced
    ? { duration: 0 }
    : { type: 'spring', stiffness: 420, damping: 32 };
  const labelCls = (active: boolean) =>
    cn(
      'relative z-10 inline-flex h-8 items-center justify-center rounded-full px-4 transition-colors',
      active ? 'text-primary-foreground' : 'text-foreground/70',
    );

  return (
    <div role="group" aria-label="Billing period" className="inline-flex items-center gap-3 rounded-full border border-border bg-card/60 p-1 shadow-sm backdrop-blur">
      <button
        type="button"
        role="switch"
        aria-checked={isYearly}
        aria-label={`Billing period, currently ${value}. Toggle to switch.`}
        onClick={() => onChange(isYearly ? 'monthly' : 'yearly')}
        className="relative flex items-center gap-2 rounded-full px-1 py-1 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span className={labelCls(!isYearly)}>Monthly</span>
        <span className={labelCls(isYearly)}>
          Yearly
          <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">-20%</span>
        </span>
        <motion.span
          aria-hidden
          layout
          transition={transition}
          className={cn('absolute inset-y-1 z-0 rounded-full bg-primary', isYearly ? 'right-1 left-[50%]' : 'left-1 right-[50%]')}
        />
      </button>
    </div>
  );
});

interface TierCardProps {
  tier: PodiumPricingTier;
  billing: Billing;
  reduced: boolean;
}

const TierCard = React.memo(function TierCard({ tier, billing, reduced }: TierCardProps) {
  const target = billing === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice;
  const animated = useAnimatedPrice(target, reduced);
  const currency = tier.currency ?? '$';
  const period = billing === 'yearly' ? '/year' : '/month';
  const isRecommended = !!tier.recommended;
  const headingId = `tier-${tier.id}`;
  const isAnchor = !!tier.cta.href;

  // Podium tilt: at lg+, mid tier is scaled, lifted, and slightly rotateX'd in 3D space.
  // On mobile, recommended gets a thick left-border accent only (no scale).
  const cardCls = cn(
    'group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 sm:p-7 text-card-foreground shadow-sm transition-colors',
    isRecommended
      ? 'border-primary/50 lg:[transform-style:preserve-3d] lg:[transform:perspective(1200px)_rotateX(2.5deg)_translateY(-12px)_scale(1.08)] lg:shadow-[0_24px_60px_-24px_var(--tw-shadow-color)] lg:shadow-primary/40 border-l-4 border-l-primary lg:border-l lg:border-l-primary/50'
      : 'border-border hover:border-foreground/20',
  );

  return (
    <article aria-labelledby={headingId} className={cardCls}>
      {isRecommended ? (
        <>
          <span
            aria-hidden
            className={cn(
              'pointer-events-none absolute -inset-px rounded-2xl ring-1 ring-primary/40',
              !reduced && 'lg:shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--color-primary)_55%,transparent)]',
            )}
          />
          <span
            aria-label="Recommended plan"
            className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground shadow"
          >
            <Sparkles aria-hidden className="size-3" />
            Recommended
          </span>
        </>
      ) : null}

      <header className="mb-5">
        <h3 id={headingId} className="text-lg font-semibold text-foreground">{tier.name}</h3>
        {tier.description ? (
          <p className="mt-1.5 text-sm text-foreground/65">{tier.description}</p>
        ) : null}
      </header>

      <div className="mb-6 flex items-baseline gap-1">
        <span className="text-2xl font-semibold text-foreground/80">{currency}</span>
        <span
          className="text-5xl font-bold tracking-tight text-foreground tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {formatPrice(animated)}
        </span>
        <span className="ml-1 text-sm text-foreground/55">{period}</span>
      </div>

      <ul className="mb-6 flex-1 space-y-2.5">
        {tier.features.map((feature, i) => (
          <li
            key={`${tier.id}-feat-${i}`}
            className={cn(
              'flex items-start gap-2.5 text-sm',
              feature.included ? 'text-foreground/85' : 'text-foreground/40 line-through decoration-foreground/20',
              feature.emphasize && feature.included && 'font-medium text-foreground',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-full',
                feature.included
                  ? isRecommended ? 'bg-primary/15 text-primary' : 'bg-foreground/10 text-foreground/80'
                  : 'bg-foreground/5 text-foreground/30',
              )}
            >
              {feature.included ? <Check className="size-3" /> : <X className="size-3" />}
            </span>
            <span>{feature.label}</span>
          </li>
        ))}
      </ul>

      <TierCTA tier={tier} isAnchor={isAnchor} isRecommended={isRecommended} />
    </article>
  );
});

interface TierCTAProps {
  tier: PodiumPricingTier;
  isAnchor: boolean;
  isRecommended: boolean;
}

function TierCTA({ tier, isAnchor, isRecommended }: TierCTAProps) {
  const baseCls = cn(
    'inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    isRecommended ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'border border-border bg-background text-foreground hover:bg-foreground/5',
  );
  const content = (<><span>{tier.cta.label}</span><ArrowRight aria-hidden className="size-4" /></>);

  return isAnchor ? (
    <a href={tier.cta.href} onClick={tier.cta.onClick} className={baseCls}>{content}</a>
  ) : (
    <button type="button" onClick={tier.cta.onClick} className={baseCls}>{content}</button>
  );
}

interface CompareTableProps {
  tiers: PodiumPricingTier[];
  billing: Billing;
}

const CompareTable = React.memo(function CompareTable({ tiers, billing }: CompareTableProps) {
  // Union of feature labels across tiers, preserving first-seen order.
  const rows = React.useMemo(() => {
    const seen = new Set<string>();
    tiers.forEach((tier) => tier.features.forEach((f) => seen.add(f.label)));
    return Array.from(seen);
  }, [tiers]);

  const renderCell = (tier: PodiumPricingTier, label: string) => {
    const f = tier.features.find((x) => x.label === label);
    if (!f) {
      return (
        <span className="inline-flex items-center gap-1.5 text-foreground/30">
          <Minus aria-hidden className="size-4" />
          <span className="sr-only">Not applicable</span>
        </span>
      );
    }
    return f.included ? (
      <span className="inline-flex items-center gap-1.5 text-foreground">
        <Check aria-hidden className={cn('size-4', tier.recommended ? 'text-primary' : 'text-foreground/70')} />
        <span className="sr-only">Included</span>
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-foreground/40">
        <Minus aria-hidden className="size-4" />
        <span className="sr-only">Not included</span>
      </span>
    );
  };

  return (
    <div className="relative overflow-x-auto rounded-2xl border border-border bg-card/40 shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead className="bg-card/80 backdrop-blur">
          <tr>
            <th scope="col" className="sticky left-0 z-10 w-56 bg-card/95 px-4 py-3 text-left font-semibold text-foreground">Feature</th>
            {tiers.map((tier) => (
              <th
                key={tier.id}
                scope="col"
                className={cn('px-4 py-3 text-left font-semibold text-foreground', tier.recommended && 'text-primary')}
              >
                <div className="flex flex-col">
                  <span>{tier.name}</span>
                  <span className="text-xs font-normal text-foreground/55">
                    {tier.currency ?? '$'}
                    {billing === 'yearly' ? tier.yearlyPrice : tier.monthlyPrice}
                    {billing === 'yearly' ? '/yr' : '/mo'}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((label, idx) => (
            <tr key={label} className={cn('border-t border-border/60', idx % 2 === 1 && 'bg-foreground/[0.02]')}>
              <th scope="row" className="sticky left-0 z-10 w-56 bg-card/95 px-4 py-3 text-left font-medium text-foreground/85">
                {label}
              </th>
              {tiers.map((tier) => (
                <td
                  key={`${tier.id}-${label}`}
                  className={cn('px-4 py-3 text-foreground/80', tier.recommended && 'bg-primary/[0.04]')}
                >
                  {renderCell(tier, label)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export function PodiumPricingComparison({
  eyebrow = 'Pricing',
  title = 'Pick the plan that scales with you',
  description = 'Simple, transparent pricing. Switch plans or cancel anytime.',
  tiers = DEFAULT_TIERS,
  defaultBilling = 'monthly',
  showCompareTable = true,
  className,
  ...rest
}: PodiumPricingComparisonProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const motionReduced = useReducedMotion();
  const reduced = prefersReducedMotion || !!motionReduced;
  const [billing, setBilling] = React.useState<Billing>(defaultBilling);
  const [compareOpen, setCompareOpen] = React.useState(false);

  // Re-order so recommended sits in the middle visually on lg+.
  const orderedTiers = React.useMemo(() => {
    if (tiers.length !== 3) return tiers;
    const recIdx = tiers.findIndex((t) => t.recommended);
    if (recIdx === -1 || recIdx === 1) return tiers;
    const next = [...tiers];
    const [rec] = next.splice(recIdx, 1);
    if (rec) next.splice(1, 0, rec);
    return next;
  }, [tiers]);

  const tierCards = React.useMemo(
    () => orderedTiers.map((tier) => (
      <TierCard key={tier.id} tier={tier} billing={billing} reduced={reduced} />
    )),
    [orderedTiers, billing, reduced],
  );

  return (
    <section
      aria-labelledby="podium-pricing-title"
      className={cn('relative isolate w-full bg-background py-16 text-foreground sm:py-20 lg:py-24', className)}
      {...rest}
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {eyebrow ? (
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium uppercase tracking-wide text-foreground/70">
              <Sparkles aria-hidden className="size-3 text-primary" />
              {eyebrow}
            </span>
          ) : null}
          <h2 id="podium-pricing-title" className="max-w-2xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-xl text-pretty text-base text-foreground/65 sm:text-lg">{description}</p>
          ) : null}
          <div className="mt-7">
            <BillingToggle value={billing} onChange={setBilling} reduced={reduced} />
          </div>
        </div>

        <div className="mt-12 lg:mt-20">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-stretch lg:gap-6 lg:[perspective:1400px]">
            {/* On sm: recommended (index 1) spans both columns; on lg sits centered with elevation. */}
            {tierCards.map((node, i) => (
              <div
                key={(orderedTiers[i] ?? { id: `slot-${i}` }).id}
                className={cn('flex', i === 1 && 'sm:col-span-2 lg:col-span-1 lg:z-10')}
              >
                {node}
              </div>
            ))}
          </div>
        </div>

        {showCompareTable ? (
          <div className="mt-14 flex flex-col items-center">
            <button
              type="button"
              aria-expanded={compareOpen}
              aria-controls="podium-compare-table"
              onClick={() => setCompareOpen((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {compareOpen ? 'Hide comparison' : 'Compare features'}
              <ChevronDown aria-hidden className={cn('size-4 transition-transform', compareOpen && 'rotate-180')} />
            </button>

            <AnimatePresence initial={false}>
              {compareOpen ? (
                <motion.div
                  id="podium-compare-table"
                  key="compare-table"
                  initial={reduced ? false : { opacity: 0, height: 0 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={
                    reduced
                      ? { duration: 0 }
                      : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
                  }
                  className="mt-6 w-full overflow-hidden"
                >
                  <CompareTable tiers={orderedTiers} billing={billing} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default PodiumPricingComparison;
