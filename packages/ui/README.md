# @lerpa/ui

Private authored source for Lerpa UI components, blocks, hooks, animations, and tokens. Consumers do not install this package; the registry compiler turns selected files into copy-paste item payloads.

## Layout

```text
src/
  components/  Primitives and composed UI components
  blocks/      Page and product sections
  hooks/       Shared React hooks
  animation/   Framer Motion presets and reduced-motion helpers
  tokens/      CSS variable tokens
  lib/         Small utilities such as cn()
  test/        Vitest/jsdom setup
  __smoke__/   Public-export render and axe baseline
```

## Conventions

- Support React 18 and 19 and Tailwind CSS v4.
- Prefer token-backed classes and CSS variables over product-specific colors.
- Use semantic controls, labels, keyboard interaction, focus indicators, and stable ARIA relationships.
- Respect reduced-motion preferences for non-essential motion.
- Keep browser/network side effects opt-in; demo assets must not be fetched by default.
- Interactive files intended for Next.js App Router include `"use client"`.
- Target-relative Framer Motion scroll components require `html { position: relative; }`; `lerpa init` adds this rule to its managed base CSS.

## Verification

```bash
pnpm --filter @lerpa/ui lint
pnpm --filter @lerpa/ui typecheck
pnpm --filter @lerpa/ui test
```

The broad smoke test enumerates public component exports. Components that render without props are checked with axe. Primitives or composites that require context/props must remain in an explicit reviewed baseline; new render failures, axe timeouts, and axe violations fail the gate. This automated coverage complements rather than replaces manual screen-reader, browser, device, and visual testing.

## Adding or changing an item

1. Edit the `.tsx` source under `src/components` or `src/blocks`.
2. Add or update its metadata in `packages/registry/items`.
3. Add focused behavior tests for meaningful interaction or regressions.
4. Run `pnpm registry:build` and `pnpm registry:validate`.
5. Run `pnpm check` from the repository root.

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for the full workflow.
