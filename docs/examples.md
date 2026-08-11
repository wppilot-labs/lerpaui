# Real-world examples — 10 popular components

Copy-paste usage for ten of the most-installed Lerpa items. Every snippet matches the actual component props — install first, then drop the code in.

All examples assume you ran `npx lerpa-cli init` (tokens + `cn` helper). Install each item with `npx lerpa-cli add <name>` or `npx shadcn add https://lerpaui.com/r/<name>.json`.

---

## 1. `button` — primitive with variants + loading state

```bash
npx lerpa-cli add button
```

```tsx
import { Button } from '@/components/ui/button';

export function Actions({ saving }: { saving: boolean }) {
  return (
    <div className="flex gap-3">
      <Button loading={saving} loadingLabel="Saving…">
        Save changes
      </Button>
      <Button variant="outline">Preview</Button>
      <Button variant="destructive" size="sm">
        Delete
      </Button>
      <Button variant="link" asChild>
        <a href="/docs">Read the docs</a>
      </Button>
    </div>
  );
}
```

Variants: `default` · `destructive` · `outline` · `secondary` · `ghost` · `link`. Sizes: `default` · `sm` · `lg` · `icon`. The `spinner` registry dependency installs automatically for the `loading` state.

## 2. `magnetic-button` — cursor-follow CTA

```bash
npx lerpa-cli add magnetic-button
```

```tsx
'use client';

import { MagneticButton } from '@/components/ui/magnetic-button';

export function NavbarCta() {
  return (
    <MagneticButton strength={14} onClick={() => location.assign('/signup')}>
      Start free trial
    </MagneticButton>
  );
}
```

`strength` controls how far the button leans toward the cursor (default `10`). Falls back to a static button when `prefers-reduced-motion` is set.

## 3. `shiny-glow-button` — animated sheen + icon slot

```bash
npx lerpa-cli add shiny-glow-button
```

```tsx
'use client';

import ShinyGlowButton from '@/components/ui/shiny-glow-button';
import { Sparkles } from 'lucide-react';

export function UpgradeCta() {
  return (
    <ShinyGlowButton
      icon={<Sparkles className="size-4" />}
      onClick={() => location.assign('/checkout')}
    >
      Upgrade to Pro
    </ShinyGlowButton>
  );
}
```

## 4. `spotlight-card` — cursor-tracked glow card

```bash
npx lerpa-cli add spotlight-card
```

```tsx
import { SpotlightCard } from '@/components/ui/spotlight-card';

export function FeatureCard() {
  return (
    <SpotlightCard className="max-w-sm p-8" glowColor="rgba(34, 197, 94, 0.15)" glowSize={400}>
      <h3 className="text-lg font-semibold text-text">Edge caching</h3>
      <p className="mt-2 text-sm text-text-3">Responses served from 30+ regions, automatically.</p>
    </SpotlightCard>
  );
}
```

`glowColor` accepts any CSS color; `showBorderGlow={false}` disables the border highlight.

## 5. `aurora-shader` — animated hero background

```bash
npx lerpa-cli add aurora-shader
```

```tsx
import { AuroraShader } from '@/components/ui/aurora-shader';

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden py-32">
      <AuroraShader className="absolute inset-0 -z-10" />
      <h1 className="text-center text-5xl font-bold text-text">Ship interfaces that move.</h1>
    </section>
  );
}
```

The `shader-canvas` registry dependency installs automatically.

## 6. `ai-chat-interface` — full chat surface (block)

```bash
npx lerpa-cli add ai-chat-interface
```

```tsx
'use client';

import { useState } from 'react';
import { AIChatInterface, type AIChatMessage } from '@/components/blocks/ai-chat-interface';

export function SupportChat() {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    { id: '1', role: 'assistant', content: 'Hi! How can I help today?' },
  ]);

  return (
    <AIChatInterface
      agentName="Support"
      model="claude-sonnet-4-6"
      messages={messages}
      status="idle"
      height={560}
      placeholder="Describe your issue…"
      onSend={(text) =>
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', content: text }])
      }
    />
  );
}
```

Messages support `streaming` and `toolCall` fields for agent UIs.

## 7. `hero-saas-simple` — landing hero (block)

```bash
npx lerpa-cli add hero-saas-simple
```

```tsx
import HeroSaasSimple from '@/components/blocks/hero-saas-simple';

export default function Home() {
  return <HeroSaasSimple />;
}
```

Blocks ship with production copy/layout you edit in place — the file is yours after install.

## 8. `dashboard-revenue-overview` — animated KPI + chart panel

```bash
npx lerpa-cli add dashboard-revenue-overview
```

```tsx
import { DashboardRevenueOverview } from '@/components/ui/dashboard-revenue-overview';

export function RevenuePage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <DashboardRevenueOverview />
    </section>
  );
}
```

## 9. `testimonial-marquee-quotes` — infinite social-proof marquee

```bash
npx lerpa-cli add testimonial-marquee-quotes
```

```tsx
import { TestimonialMarqueeQuotes } from '@/components/ui/testimonial-marquee-quotes';

const quotes = [
  {
    id: '1',
    quote: 'Cut our launch time in half.',
    name: 'Mara Chen',
    role: 'CTO',
    company: 'Driftly',
    rating: 5,
  },
  {
    id: '2',
    quote: 'The animations sold our investors.',
    name: 'Tomás Rivera',
    role: 'Founder',
    company: 'Loopwise',
    rating: 5,
  },
];

export function SocialProof() {
  return (
    <TestimonialMarqueeQuotes
      eyebrow="Loved by teams"
      title="What customers say"
      quotes={quotes}
      speed={28}
      pauseOnHover
    />
  );
}
```

## 10. `double-border-pricing-card` — laser-border pricing tier

```bash
npx lerpa-cli add double-border-pricing-card
```

```tsx
'use client';

import { DoubleBorderPricingCard } from '@/components/ui/double-border-pricing-card';

export function ProTier({ isAnnual }: { isAnnual: boolean }) {
  return (
    <DoubleBorderPricingCard
      planName="Pro"
      priceMonthly={29}
      priceAnnually={290}
      isAnnual={isAnnual}
      badgeText="Most popular"
      description="For teams shipping to production."
      features={['Unlimited projects', 'Priority support', 'Custom themes', 'SSO']}
      ctaText="Start 14-day trial"
      onCtaClick={() => location.assign('/signup?plan=pro')}
    />
  );
}
```

---

**Browse all 1,328 registry items:** `npx lerpa-cli list`, the [gallery](https://lerpaui.com/gallery/components), or ask your AI agent over [MCP](./recipes/claude-code.md).
