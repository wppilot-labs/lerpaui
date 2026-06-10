# Changelog

All notable changes to Lerpa UI will be documented in this file.

Versions below refer to the published packages: [`lerpa-cli`](https://www.npmjs.com/package/lerpa-cli) and [`@lerpa/mcp-server`](https://www.npmjs.com/package/@lerpa/mcp-server). The component/block source and the registry are versioned with the repository itself.

## [cli 0.2.4] - 2026-06-10

### Fixed

- Added missing `"use client"` directives to interactive blocks and registry items so they work out of the box in Next.js App Router projects.
- Re-bundled the registry into the CLI with the `"use client"` fixes.

## [cli 0.2.1] - 2026-06-09

### Fixed

- `init` now scaffolds the `--destructive` / `--destructive-foreground` token pair, so destructive button/badge variants render correctly.
- Bundled block-local helpers and declared their npm dependencies so all registry items install cleanly.
- Bundled helpers now import from `@/lib/utils` (matching the scaffolded `cn` helper) instead of `@/lib/cn`.

## [cli 0.2.0 · mcp-server 0.2.x] - 2026-06-09

### Added

- `@lerpa/mcp-server` — Model Context Protocol server exposing the registry to AI agents (Claude Code, Cursor, Windsurf, Continue, Cline, Zed) with `list_components`, `get_component`, and `search_components` tools. Registry data is bundled, so `npx -y @lerpa/mcp-server` works standalone.

### Fixed

- Registry item filenames normalized to kebab-case.
- Component catalog bundled into the MCP server package.

## [cli 0.1.1] - 2026-06-09

### Added

- `init` writes the Tailwind v4 design-token scaffold (`@theme` + `:root`) into your global CSS so components render styled on first paint.
- `src/`-aware path resolution: `init` and `add` honor `tsconfig.json` path aliases and `src/` layouts.

### Fixed

- `theme` command replaces its managed CSS block instead of appending, so it is safe to re-run.

## [0.1.0] - 2026-05-21

### Added

- Monorepo structure using `pnpm` workspaces.
- Shared ESLint, TypeScript, and Prettier configurations.
- Design tokens containing color variables, spacing configurations, radius templates, and shadow designs.
- Component and block library (`packages/ui`): animated, accessibility-tested React components built on Tailwind CSS v4, Framer Motion, and Radix UI.
- shadcn-compatible registry compiler (`packages/registry`) generating installable JSON items with embedded source.
- `lerpa-cli` package foundations: `init`, `add`, `list`, `search`, `theme`, `doctor`, `info`.
