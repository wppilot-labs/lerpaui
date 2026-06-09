import React, { useState } from 'react';

import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { SectionHeader } from '../components/SectionHeader';
import { Container } from '../components/Container';
import { Check } from 'lucide-react';
import { cn } from '../lib/cn';

export interface PricingTier {
  name: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  actionLabel: string;
  popular?: boolean;
  ctaVariant?: 'default' | 'outline' | 'secondary';
}

export interface PricingSectionProps {
  tag?: string;
  title?: string;
  description?: string;
  tiers?: PricingTier[];
}

const defaultTiers: PricingTier[] = [
  {
    name: 'Starter',
    priceMonthly: 19,
    priceYearly: 15,
    description: 'Perfect for individual developers and side-hustle projects.',
    features: [
      'Up to 3 active websites',
      '5GB Edge caching storage',
      'Basic telemetry reports',
      'Community forum support',
      'Deploy hook integration',
    ],
    actionLabel: 'Start Trial',
    ctaVariant: 'outline',
  },
  {
    name: 'Pro',
    priceMonthly: 49,
    priceYearly: 39,
    description: 'The standard option for scaling startups and small teams.',
    features: [
      'Up to 15 active websites',
      '50GB Edge caching storage',
      'Advanced telemetries & alerts',
      'Priority email support (24h)',
      'Custom subdomain mapping',
      'Team collaborative spaces',
      'Automated nightly backups',
    ],
    actionLabel: 'Go Professional',
    popular: true,
    ctaVariant: 'default',
  },
  {
    name: 'Enterprise',
    priceMonthly: 199,
    priceYearly: 159,
    description: 'Comprehensive features for heavy traffic operations and compliance.',
    features: [
      'Unlimited active websites',
      '500GB Edge caching storage',
      'Custom telemetry streaming',
      '24/7 dedicated phone support',
      'White-labeled subdomains',
      'Enterprise-grade SSO & SAML',
      'SLA level guarantees',
    ],
    actionLabel: 'Contact Sales',
    ctaVariant: 'secondary',
  },
];

export function PricingSection({
  tag = 'Simple Pricing Plans',
  title = 'A Plan Made for Every Stage',
  description = 'Choose the subscription tier that best matches your traffic demands. Switch or cancel at any time.',
  tiers = defaultTiers,
}: PricingSectionProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="py-20 bg-background/50 border-y border-border">
      <Container>
        <div className="flex flex-col items-center mb-10">
          <SectionHeader tag={tag} title={title} description={description} align="center" className="mb-6" />

          {/* Toggle */}
          <div className="inline-flex items-center rounded-full bg-muted p-1 border border-border">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold transition-all',
                billingCycle === 'monthly' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                'rounded-full px-4 py-1.5 text-xs font-semibold transition-all flex items-center gap-1',
                billingCycle === 'yearly' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'
              )}
            >
              Annual Billing
              <span className="inline-block bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {tiers.map((tier) => {
            const price = billingCycle === 'monthly' ? tier.priceMonthly : tier.priceYearly;

            return (
              <Card
                key={tier.name}
                className={cn(
                  'flex flex-col justify-between relative overflow-hidden border border-border bg-card transition-all duration-300',
                  tier.popular && 'border-primary shadow-xl scale-[1.02] md:scale-105 z-10'
                )}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-bl-lg">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-8 flex-1 flex flex-col justify-between gap-6">
                  <div>
                    {/* Header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-foreground">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2 min-h-[40px] leading-relaxed">
                        {tier.description}
                      </p>
                    </div>

                    {/* Pricing */}
                    <div className="mb-6 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold text-foreground">${price}</span>
                      <span className="text-muted-foreground text-sm">/ month</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-3.5 mb-8">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/80">
                          <Check className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    variant={tier.ctaVariant}
                    className={cn(
                      'w-full py-6 font-semibold transition-all',
                      tier.popular && 'shadow-lg shadow-primary/20 hover:scale-[1.01]'
                    )}
                  >
                    {tier.actionLabel}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
