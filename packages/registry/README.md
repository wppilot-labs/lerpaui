# @lerpa/registry

Private compiler and validator for the Lerpa UI shadcn-compatible registry. Its output is bundled into `lerpa-cli` and `@lerpa/mcp-server` and can be served as `https://lerpaui.com/r/<name>.json` by the website deployment.

## Commands

```bash
pnpm --filter @lerpa/registry build
pnpm --filter @lerpa/registry build:verbose
pnpm --filter @lerpa/registry sync:sources -- <item-id> [item-id...]
pnpm --filter @lerpa/registry validate
```

Root aliases are `pnpm registry:build` and `pnpm registry:validate`.

## Layout

```text
items/        Authored item metadata and fallback source payloads
skills/       Agent skill descriptors
generated/    Committed deterministic output
  registry.json
  manifest.json
  component-catalog.json
  skills/
scripts/
  build-registry.ts
  validate-registry.ts
```

## Canonical source and build behavior

Registry JSON owns item ids, types, dependencies, registry dependencies, and standalone payloads. When an install file has a matching file in `packages/ui/src/components` or `packages/ui/src/blocks`, authored UI source is canonical and replaces the embedded fallback during compilation.

Use `sync:sources` when a reviewed UI fix should also replace the authored fallback payload for specific item ids. It is intentionally targeted and refuses to rewrite the entire registry without explicit ids.

The build then:

- sorts inputs and emits stable JSON;
- strips UTF-8 BOM markers;
- normalizes install filenames to kebab case;
- rewrites shared `cn` imports to `@/lib/utils`;
- bundles local component primitives and animation hooks transitively;
- declares sibling registry dependencies;
- augments npm dependencies required by bundled helpers;
- writes exact UI/block statistics and a SHA-256 digest into `manifest.json`.

The CLI and MCP builds depend explicitly on this registry build, preventing stale bundled data in parallel Turbo runs.

## Fail-closed validation

Validation covers both authored and generated data:

- strict Zod schemas and kebab-case ids;
- duplicate item, dependency, and file detection;
- safe relative install paths and safe npm names;
- missing/self/cyclic registry dependencies;
- dependency-closure file conflicts;
- resolution of relative imports across each full dependency closure;
- generated item/name/path parity;
- BOM-free generated source;
- manifest totals and SHA-256 integrity.

The current validated manifest contains 1,328 items: 1,109 UI items and 219 blocks.

Generated output is committed. After changing UI source or item metadata, run the build and validator, then include the generated diff in the same change.
