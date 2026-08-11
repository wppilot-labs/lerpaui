# Using Lerpa UI in a Next.js project

From `create-next-app` to an animated landing page with Tailwind CSS v4. Lerpa items support React 18/19; verify the selected components against the exact Next.js version used by your application.

## 1. Create the app (skip if you have one)

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir
cd my-app
```

## 2. Initialize Lerpa

```bash
npx lerpa-cli init --yes
```

What it does:

- Detects `src/app/globals.css` (or `app/globals.css`) and injects the **Tailwind v4 design tokens** (`@theme` + `:root`) — components render styled on first paint.
- Creates the `cn` helper at `src/lib/utils.ts`, honoring your `tsconfig.json` `@/*` alias.
- Writes `lerpa.json` with your detected package manager.

## 3. Add components

```bash
npx lerpa-cli add hero-saas-simple
npx lerpa-cli add button
npx lerpa-cli add dashboard-revenue-overview
```

Files land in `src/components/blocks/` (blocks) and `src/components/ui/` (components). npm dependencies (`framer-motion`, `lucide-react`, …) are installed in one batched run.

## 4. Use them

```tsx
// src/app/page.tsx
import HeroSaasSimple from '@/components/blocks/hero-saas-simple';
import { DashboardRevenueOverview } from '@/components/ui/dashboard-revenue-overview';

export default function Home() {
  return (
    <main>
      <HeroSaasSimple />
      <section className="mx-auto max-w-5xl px-6 py-16">
        <DashboardRevenueOverview />
      </section>
    </main>
  );
}
```

Interactive components already carry `"use client"`, so they work in the App Router without wrapping. Server components can import and render them directly.

## 5. Theme it (optional)

```bash
npx lerpa-cli theme ocean   # lime | mono | ocean | grape | ember | gold | paper
```

Themes are CSS-variable overrides in a managed block — re-run any time, no component changes needed.

## Notes & gotchas

- **Tailwind v3 projects**: Lerpa targets Tailwind **v4** (`@theme` syntax). Upgrade first: `npx @tailwindcss/upgrade`.
- **Fonts**: tokens default to `--font-geist-sans` (what `create-next-app` sets up). Different font? Edit `--font-sans` in the token block.
- **Verifying setup**: `npx lerpa-cli doctor` checks the config and token block.
- **shadcn users**: Lerpa drops into the same `@/components/ui` + `@/lib/utils` layout — see the [shadcn recipe](./shadcn.md).
