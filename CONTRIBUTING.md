# Contributing to Lerpa UI

Thank you for contributing. Please keep claims, generated output, tests, and source in sync.

## Before opening a change

1. Search existing issues and pull requests.
2. For a new visual item, explain the use case and provide a design reference.
3. Keep unrelated formatting or generated churn out of the change.
4. Never include secrets, private customer data, fabricated metrics, or unlicensed assets.

## Local setup

Requires Node.js 20 or newer and pnpm 10.

```bash
git clone https://github.com/wppilot-labs/lerpaui.git
cd lerpaui
pnpm install --frozen-lockfile
pnpm check
```

## Component expectations

- Put authored source in `packages/ui/src/components` or `packages/ui/src/blocks`.
- Use token-backed styles and document required third-party dependencies.
- Use semantic elements and standard keyboard interactions before custom ARIA.
- Add visible focus, stable labels/relationships, and reduced-motion behavior.
- Do not fetch demo media or external services by default.
- Add focused tests for meaningful interactions and fixed regressions.

Registry item JSON owns metadata. Matching UI source is canonical during the registry build, so do not hand-edit only `packages/registry/generated`.

## Verification

Run the full gate:

```bash
pnpm check
```

If source or item metadata changed, also regenerate and include the output:

```bash
pnpm registry:build
pnpm registry:validate
```

Before a release, run `pnpm check:release` from a clean working tree. It verifies generated output and audits production dependencies.

## Pull requests

Use a focused branch, explain behavior and tradeoffs, include screenshots or a clip for visual changes, and call out any manual or external validation still missing. A passing build is not evidence of npm publication or website deployment.
