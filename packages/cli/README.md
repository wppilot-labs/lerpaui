# lerpa-cli

[![npm](https://img.shields.io/npm/v/lerpa-cli?logo=npm&color=cb3837)](https://www.npmjs.com/package/lerpa-cli)
[![MIT License](https://img.shields.io/badge/License-MIT-22c55e.svg)](https://github.com/wppilot-labs/lerpaui/blob/main/LICENSE.md)

Install copy-paste source from the [Lerpa UI](https://github.com/wppilot-labs/lerpaui) registry into a React + Tailwind CSS v4 project. The package bundles all 1,328 registry items, so listing, searching, resolving, and writing source do not require a runtime registry request.

## Quick start

```bash
npx lerpa-cli init
npx lerpa-cli add button
npx lerpa-cli add button spinner pricing-table-matrix
```

`init` writes:

- `lerpa.json`;
- the configured `cn` helper;
- a managed Tailwind v4 `@theme` and token block, including the document positioning context required by target-relative scroll effects;
- `clsx` and `tailwind-merge` dependencies, unless `--no-install` is used.

It understands JSONC `tsconfig.json` files, path mappings, and common `src/` layouts.

## Commands

### `init`

```bash
npx lerpa-cli init [--yes] [--force] [--no-install] [--no-tokens] \
  [--css <path>] [--components <alias>] [--utils <alias>] \
  [--pm npm|pnpm|yarn|bun]
```

An existing `lerpa.json` is not replaced in non-interactive mode unless `--force` is explicit. A backup is created before replacement.

### `add <names...>`

```bash
npx lerpa-cli add button spinner
npx lerpa-cli add pricing-table-matrix --dry-run --no-install
```

The command resolves the full registry dependency graph, de-duplicates files and npm packages, checks file conflicts, and installs npm dependencies once. Options:

- `--yes`: skip the confirmation prompt.
- `--dry-run`: show create/unchanged/overwrite plans without changes.
- `--no-install`: write source without running a package manager.
- `--force`: back up and replace locally changed files.

Without `--force`, an unattended add fails instead of overwriting local work.

### `theme [name]` / `set [name]`

Applies one managed CSS theme block. Available themes: `lime`, `mono`, `ocean`, `grape`, `ember`, `gold`, and `paper`. Re-running replaces that block rather than duplicating it.

### `list`

```bash
npx lerpa-cli list --type block --limit 20
npx lerpa-cli list --json
```

`--type` accepts `all`, `ui`, `component`, or `block`.

### `search [query]`

```bash
npx lerpa-cli search pricing --type block --limit 10 --json
```

### `doctor`

Checks config shape, safe CSS and alias resolution, token markers, the `cn` helper, and required dependencies.

```bash
npx lerpa-cli doctor --strict --json
```

`--strict` returns a non-zero exit for warnings as well as failures.

### `info`

Prints the CLI version, canonical repository, docs URL, and detected project config.

## Configuration

```json
{
  "style": "default",
  "tailwind": { "css": "src/app/globals.css" },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "packageManager": "pnpm"
}
```

UI files are written under `<components>/ui/`; blocks are written under `<components>/blocks/`. Absolute paths and `..` traversal are rejected. Dependency installation uses executable and argument arrays rather than interpolated shell commands.

## Development

```bash
pnpm --filter lerpa-cli build
pnpm --filter lerpa-cli test
pnpm --filter lerpa-cli typecheck
```

Tests execute the built CLI in isolated temporary projects, including JSONC aliases, dry runs, multi-add, backups, strict doctor output, and traversal rejection.

Requires Node.js 20 or newer.

MIT © [Cuibit Labs](https://cuibit.com). See [LICENSE.md](https://github.com/wppilot-labs/lerpaui/blob/main/LICENSE.md).
