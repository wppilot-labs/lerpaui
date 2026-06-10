# @lerpa/registry

Compiles the Lerpa UI component/block source (`packages/ui`) into a **shadcn-compatible registry**: standalone JSON items with embedded source code that `lerpa-cli`, `npx shadcn add`, and the MCP server consume. This package is **private** — its output is bundled into the published packages and served at `https://lerpaui.com/r/<name>.json`.

## Scripts

```bash
pnpm --filter @lerpa/registry build      # compile items -> generated/
pnpm --filter @lerpa/registry validate   # schema + integrity checks (zod)
```

Or from the repo root: `pnpm registry:build` / `pnpm registry:validate`.

## Layout

```txt
items/        Source registry item JSON definitions
skills/       Agent skill definitions shipped with the registry
generated/    Build output (committed):
  registry.json            Aggregated registry with embedded source — bundled into lerpa-cli + MCP server
  manifest.json            Item index + stats (1,318 items: 1,099 ui + 219 blocks)
  component-catalog.json   Descriptions/categories snapshot for the MCP server + docs gallery
scripts/
  build-registry.ts        Compiler (see below)
  validate-registry.ts     Validator
```

## What the build does

Beyond aggregation, `build-registry.ts` makes every item install clean in a fresh project:

- **Kebab-case filenames** — install paths are normalized so case-sensitive filesystems (Linux) resolve sibling imports.
- **Helper bundling** — block-local primitives (e.g. a block importing `../components/StatCard`) are bundled transitively into the item's `files[]` and imports rewritten, so no item depends on unpublished source.
- **Sibling linking** — imports of other registry items become `registryDependencies`, so the CLI installs them alongside.
- **Alias normalization** — bundled helpers import `@/lib/utils` (what `lerpa init` scaffolds), and `"use client"` directives are preserved for Next.js App Router.

## Validation

`validate-registry.ts` checks every item definition in `items/` against a zod schema: kebab-case names that match the filename, item type is `registry:ui` or `registry:block`, and at least one file with non-empty content per item. CI runs it on every push.
