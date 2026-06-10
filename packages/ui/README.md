# @lerpa/ui

Source of truth for every Lerpa UI component and block. This package is **private** — it is not published to npm. Instead, the registry compiler (`packages/registry`) turns these files into shadcn-compatible registry items that users install via `lerpa-cli`, `npx shadcn add`, or an AI agent over MCP.

## Layout

```txt
src/
  components/   1,300+ animated, accessible React components (the registry's registry:ui items)
  blocks/       Full page sections — heroes, pricing, dashboards, CTAs (registry:block items)
  hooks/        Shared hooks (useCopyToClipboard, useDebouncedValue, useLocalStorage, …)
  animation/    Framer Motion presets, motion config, reduced-motion helpers
  tokens/       Design tokens (colors, spacing, radius, shadows) as CSS variables
  lib/          cn() and other tiny utilities
  test/         Vitest setup (jsdom + vitest-axe)
  __smoke__/    Generated render + a11y smoke tests for every component
```

## Conventions

- **Tailwind CSS v4 + design tokens** — components are styled exclusively through token-backed utilities (`bg-bg`, `text-text`, `text-accent`, plus shadcn-compatible aliases like `bg-primary`). No inline color values, so one theme switch restyles everything.
- **Motion built in** — entrance/scroll/gesture animations use Framer Motion with `prefers-reduced-motion` fallbacks (see `src/animation/reduced-motion.ts`).
- **Accessibility is tested** — every component is rendered and axe-checked in the smoke suite (807 tests across 86 files).
- **Client directives** — interactive components carry `"use client"` so they work in Next.js App Router out of the box.

## Scripts

```bash
pnpm --filter @lerpa/ui test        # Vitest + vitest-axe
pnpm --filter @lerpa/ui typecheck
pnpm --filter @lerpa/ui lint
```

## Adding a component

1. Add the `.tsx` file under `src/components/` (or `src/blocks/` for a page section), following the token + motion conventions above.
2. Rebuild the registry: `pnpm registry:build` (from the repo root).
3. Validate: `pnpm registry:validate`.
4. Run the test suite: `pnpm test`.

See the repo-root [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines.
