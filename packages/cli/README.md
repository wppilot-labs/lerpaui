# lerpa-cli

[![npm](https://img.shields.io/npm/v/lerpa-cli?logo=npm&color=cb3837)](https://www.npmjs.com/package/lerpa-cli)
[![MIT License](https://img.shields.io/badge/License-MIT-22c55e.svg)](https://github.com/cuibit-labs/lerpaui/blob/main/LICENSE.md)

Install copy-paste components and blocks from the [Lerpa UI](https://github.com/cuibit-labs/lerpaui) registry into any React + Tailwind CSS v4 project. You get the *source* — no runtime dependency on Lerpa.

The CLI ships with a bundled copy of the registry (1,318 items: 1,099 components + 219 blocks), so `add`, `list`, and `search` work offline.

## Quick start

```bash
# 1. Initialize once — writes lerpa.json, the cn helper, and Tailwind v4 design tokens
npx lerpa-cli init

# 2. Add a component or block
npx lerpa-cli add button
npx lerpa-cli add pricing-table
```

`init` scaffolds the `@theme` + `:root` token block into your global CSS so components render styled on first paint. It detects your package manager, `src/` layout, and `tsconfig.json` path aliases.

## Commands

| Command | What it does |
| --- | --- |
| `init` | Scaffold `lerpa.json`, the `cn` helper, and Tailwind v4 tokens. Flags: `--yes`, `--css <path>`, `--components <alias>`, `--utils <alias>`, `--pm <npm\|pnpm\|yarn\|bun>`, `--no-tokens`. |
| `add <name>` | Install a component/block plus all registry + npm dependencies in one batched install. `--yes` skips prompts. |
| `theme [name]` | Apply a color theme: `lime`, `mono`, `ocean`, `grape`, `ember`, `gold`, `paper`. Replaces a managed CSS block, so it is safe to re-run. |
| `list` | List every component and block (`--json` for machine output). |
| `search <query>` | Search the registry by name. |
| `doctor` | Verify the config and that the Tailwind v4 tokens are present. |
| `info` | Show CLI + project metadata. |

Every command accepts `--yes`, so it runs unattended in CI.

## Configuration (`lerpa.json`)

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

Components are written under `<components alias>/ui/` and blocks under `<components alias>/blocks/`. Aliases are resolved through your `tsconfig.json` `paths` (falling back to a `src/` heuristic), so files land where your imports expect them. Existing files are backed up to `*.bak` before being overwritten.

## Requirements

- Node.js ≥ 20
- Tailwind CSS v4 in the target project

## License

MIT © [Cuibit Labs](https://cuibit.com) — see [LICENSE](https://github.com/cuibit-labs/lerpaui/blob/main/LICENSE.md).
