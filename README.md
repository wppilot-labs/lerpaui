<div align="center">

# Lerpa UI

Copy-paste React components and blocks with a shadcn-compatible registry.

**1,109 UI items · 219 blocks · 1,328 total registry items**

[![MIT License](https://img.shields.io/badge/License-MIT-22c55e.svg)](LICENSE.md)
[![React 18/19](https://img.shields.io/badge/React-18%20%7C%2019-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn compatible](https://img.shields.io/badge/shadcn-compatible-000000)](https://ui.shadcn.com)
[![GitHub stars](https://img.shields.io/github/stars/wppilot-labs/lerpaui?style=social)](https://github.com/wppilot-labs/lerpaui)

[![npm lerpa-cli](https://img.shields.io/npm/v/lerpa-cli?logo=npm&label=lerpa-cli&color=cb3837)](https://www.npmjs.com/package/lerpa-cli)
[![npm @lerpa/mcp-server](https://img.shields.io/npm/v/%40lerpa%2Fmcp-server?logo=npm&label=%40lerpa/mcp-server&color=cb3837)](https://www.npmjs.com/package/@lerpa/mcp-server)

[Website](https://lerpaui.com) · [Components](https://lerpaui.com/gallery/components) · [Blocks](https://lerpaui.com/gallery/blocks) · [Registry](https://lerpaui.com/r) · [MCP](#use-with-ai-coding-agents)

</div>

Lerpa UI installs component source into your project. You can inspect, edit, and own that source; there is no Lerpa runtime package in the finished application. Installed components can still depend on libraries such as React, Radix UI, Framer Motion, Recharts, and Lucide.

The repository is organized around four packages:

- `@lerpa/ui`: private authored React source.
- `@lerpa/registry`: private deterministic registry compiler and validator.
- `lerpa-cli`: published project initializer and source installer.
- `@lerpa/mcp-server`: published read-only registry server for AI agents.

The repository currently identifies the next release as **0.3.0**. That version is a release candidate until its packages are published; a green local build does not update npm or deploy the website.

## What is verified

- The generated manifest contains exactly **1,328** items: **1,109 UI** and **219 blocks**.
- Registry validation checks schemas, unique names and files, safe install paths, dependency cycles, dependency-closure conflicts, relative import resolution, and a SHA-256 digest.
- The UI smoke gate enumerates **457 public component exports**. No-props components must render and pass axe; context-dependent exports must match a reviewed 65-item baseline. Dedicated interaction tests cover core primitives and repaired regressions.
- CLI and MCP tests execute built artifacts. MCP verification includes a real stdio protocol session.
- The production dependency audit runs in CI.

These checks are strong automated evidence, but they are not a claim that every component has had manual screen-reader, browser-matrix, device, performance, or visual-regression testing.

## Quick start

Initialize a React + Tailwind CSS v4 project:

```bash
npx lerpa-cli init
```

This writes `lerpa.json`, a `cn` helper, managed Tailwind v4 tokens, and installs `clsx` plus `tailwind-merge` unless `--no-install` is supplied.

Add one or several items:

```bash
npx lerpa-cli add button
npx lerpa-cli add button spinner pricing-table-matrix
```

Preview a change without writing or installing anything:

```bash
npx lerpa-cli add button --dry-run --no-install
```

The public registry is also compatible with the shadcn CLI:

```bash
npx shadcn add https://lerpaui.com/r/button.json
```

## CLI reference

| Command          | Key behavior                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `init`           | Writes config, `cn`, and tokens. Supports `--yes`, `--force`, `--no-install`, `--no-tokens`, `--css`, `--components`, `--utils`, and `--pm`.               |
| `add <names...>` | Resolves multiple items, registry dependencies, and npm dependencies. Supports `--dry-run`, `--no-install`, `--yes`, and recoverable `--force` overwrites. |
| `theme [name]`   | Applies a managed theme: `lime`, `mono`, `ocean`, `grape`, `ember`, `gold`, or `paper`. Alias: `set`.                                                      |
| `list`           | Lists items with `--type`, `--limit`, and `--json` filters.                                                                                                |
| `search [query]` | Searches ids with `--type`, `--limit`, and `--json`.                                                                                                       |
| `doctor`         | Validates project configuration. `--strict` turns warnings into a non-zero exit; `--json` supports CI.                                                     |
| `info`           | Shows package and project metadata.                                                                                                                        |

Non-interactive mode never silently replaces a changed component. Use `--force` explicitly; the CLI creates `.bak`, `.bak.1`, and later backups before replacement. Absolute paths and traversal outside the target project are rejected.

See [packages/cli/README.md](packages/cli/README.md) for complete details.

## Use with AI coding agents

The read-only [`@lerpa/mcp-server`](https://www.npmjs.com/package/@lerpa/mcp-server) package bundles registry source and catalog metadata, so it does not need a checkout or network access after `npx` installs the package.

Claude Code:

```bash
claude mcp add lerpa -- npx -y @lerpa/mcp-server
```

Generic MCP configuration:

```json
{
  "mcpServers": {
    "lerpa": {
      "command": "npx",
      "args": ["-y", "@lerpa/mcp-server"]
    }
  }
}
```

The server exposes five tools:

| Tool                 | Purpose                                                                  |
| -------------------- | ------------------------------------------------------------------------ |
| `list_components`    | Paginated listing with optional category and type filters.               |
| `get_component`      | One item with dependencies, install metadata, and embedded source.       |
| `search_components`  | Ranked search over ids and available catalog metadata.                   |
| `list_categories`    | Derived category counts split by UI and block items.                     |
| `get_registry_stats` | Exact bundle totals, catalog coverage, version, and network requirement. |

See [packages/mcp-server/README.md](packages/mcp-server/README.md) for schemas and development commands.

## Registry model

Authored metadata lives in `packages/registry/items`. When an install file matches authored source in `packages/ui`, the UI source is canonical during the build. The compiler then:

- strips BOM markers and normalizes kebab-case filenames;
- bundles required local primitives and animation hooks;
- declares sibling registry dependencies;
- rejects conflicting dependency-closure files;
- emits deterministic `registry.json` and a SHA-256-backed manifest.

The generated catalog currently contains **1,189 metadata entries**, so some registry items use truthful id-derived fallback labels/categories in MCP responses.

## Repository structure

```text
packages/ui          Authored components, blocks, hooks, animation, and tokens
packages/registry    Registry item metadata, compiler, validator, and generated output
packages/cli         Offline-capable source installer
packages/mcp-server  Read-only stdio MCP server
docs/                Usage examples and integration recipes
```

## Local development

Requires Node.js 20 or newer and pnpm 10.

```bash
git clone https://github.com/wppilot-labs/lerpaui.git
cd lerpaui
pnpm install --frozen-lockfile
pnpm check
```

Useful gates:

```bash
pnpm registry:build
pnpm registry:validate
pnpm check
pnpm check:release
```

`check:release` also audits production dependencies and verifies that a clean checkout reproduces the committed generated artifacts.

## Compatibility with shadcn/ui

Lerpa follows the same copy-paste ownership model and emits shadcn-compatible item JSON. It can be used beside an existing shadcn setup, but Lerpa has its own token scaffold, larger animation-oriented catalog, CLI, and MCP server. Check each installed item's dependencies and source as you would any third-party code.

## Contributing and security

Read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md). Report ordinary bugs through [GitHub issues](https://github.com/wppilot-labs/lerpaui/issues); report vulnerabilities privately as described in the security policy.

## License

MIT. See [LICENSE.md](LICENSE.md).

<div align="center">
<sub>Built by <a href="https://cuibit.com">Cuibit Labs</a> · <a href="https://lerpaui.com">lerpaui.com</a> · <a href="https://github.com/wppilot-labs/lerpaui">GitHub</a></sub>
</div>
