"use client";

import React, { useState } from 'react';

import { Check, Flame } from 'lucide-react';
import { cn } from '../lib/cn';

export type BillingCycle = 'monthly' | 'yearly';

export interface PricingPlan {
  id: string;
  name: string;
  /** Per-month price for monthly billing. */
  monthlyPrice: number;
  /** Per-month price for yearly billing (i.e. discounted rate). */
  yearlyPrice: number;
  desc: string;
  features: string[];
  badge: string;
  /** When true, the plan is visually highlighted as the recommended choice. */
  highlight?: boolean;
}

export interface PricingPlanSwitcherProps {
  className?: string;
  /** Pricing plans to render. */
  plans?: PricingPlan[];
  /** Initial billing cycle. */
  defaultBilling?: BillingCycle;
  /** Called when the user selects a plan. */
  onSelect?: (plan: PricingPlan, billing: BillingCycle) => void;
  /** Label on the call-to-action button. */
  ctaLabel?: string;
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 49,
    yearlyPrice: 39,
    desc: "For solo developers and small teams.",
    features: ["Full component library", "Schema-validated registry", "Next.js compatible"],
    badge: "Standard"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 99,
    yearlyPrice: 79,
    desc: "For organizations with custom needs.",
    features: ["Everything in Pro plus 3D meshes", "Dedicated CLI installer", "Priority support"],
    badge: "Popular",
    highlight: true
  }
];

export const PricingPlanSwitcher: React.FC<PricingPlanSwitcherProps> = ({
  className,
  plans = DEFAULT_PLANS,
  defaultBilling = 'monthly',
  onSelect,
  ctaLabel = "Select Plan",
}) => {
  const [billing, setBilling] = useState<BillingCycle>(defaultBilling);

  return (
    <div className={cn('w-full max-w-[480px] flex flex-col gap-6 select-none', className)}>
      {/* Mini swapper */}
      <div className="flex items-center p-1 border border-border/40 bg-card/65 backdrop-blur-md rounded-2xl w-48 mx-auto">
        <button
          type="button"
          onClick={() => setBilling('monthly')}
          className={cn('flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer',
            billing === 'monthly' ? 'bg-primary text-white border border-primary/25' : 'text-muted-foreground'
          )}
        >
          Monthly
        </button>
        <button
          type="button"
          onClick={() => setBilling('yearly')}
          className={cn('flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-xl cursor-pointer',
            billing === 'yearly' ? 'bg-primary text-white border border-primary/25' : 'text-muted-foreground'
          )}
        >
          Yearly
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map(pl => {
          const price = billing === 'monthly' ? pl.monthlyPrice : pl.yearlyPrice;
          return (
          <div 
            key={pl.id}
            className={cn(
              'p-5 rounded-2xl border border-border bg-card shadow-lg relative flex flex-col justify-between overflow-hidden',
              pl.highlight && 'border-primary/45 shadow-primary/5 bg-card/90'
            )}
          >
            {/* Border beam laser sweeps outline */}
            {pl.highlight && (
              <div className="absolute inset-0 border border-primary/30 rounded-2xl pointer-events-none" />
            )}

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className={cn('text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border',
                  pl.highlight ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/40 border-border text-muted-foreground'
                )}>
                  {pl.badge}
                </span>
                {pl.highlight && <Flame className="w-4.5 h-4.5 text-primary shrink-0" />}
              </div>

              <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wider mb-1">{pl.name}</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed mb-4">{pl.desc}</p>

              <div className="mb-4">
                <span className="text-3xl font-extrabold tracking-tight text-foreground font-mono">${price}</span>
                <span className="text-[10px] text-muted-foreground font-bold ml-1">/mo</span>
              </div>

              <div className="space-y-2 border-t border-border/40 pt-4 mb-5">
                {pl.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] text-muted-foreground font-semibold">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSelect?.(pl, billing)}
              className={cn('w-full py-2 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all cursor-pointer',
                pl.highlight ? 'bg-primary text-white border border-primary/25 hover:brightness-110' : 'bg-secondary text-muted-foreground border border-border/40 hover:bg-secondary/80'
              )}
            >
              {ctaLabel}
            </button>
          </div>
          );
        })}
      </div>
    </div>
  );
};
