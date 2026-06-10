# @lerpa/mcp-server

[![npm](https://img.shields.io/npm/v/%40lerpa%2Fmcp-server?logo=npm&color=cb3837)](https://www.npmjs.com/package/@lerpa/mcp-server)
[![MIT License](https://img.shields.io/badge/License-MIT-22c55e.svg)](https://github.com/cuibit-labs/lerpaui/blob/main/LICENSE.md)

Model Context Protocol (MCP) server that exposes the [Lerpa UI](https://github.com/cuibit-labs/lerpaui) registry — 1,318 shadcn-compatible components and blocks — to AI coding agents: **Claude Code, Cursor, Windsurf, Continue, Cline, Zed**.

The registry data (including full component source) is bundled into the package, so it runs standalone via `npx` — no checkout, no network calls at runtime.

## Setup

**Claude Code** — one command:

```bash
claude mcp add lerpa -- npx -y @lerpa/mcp-server
```

**Cursor / Windsurf / Continue / Cline / Zed** — add to your MCP config (e.g. `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "lerpa": { "command": "npx", "args": ["-y", "@lerpa/mcp-server"] }
  }
}
```

Restart your agent. Three tools become available.

## Tools

| Tool | Description |
| --- | --- |
| `list_components(category?)` | List components, optionally filtered by category (`ai`, `buttons`, `cards`, `charts`, `forms`, `creative`, `feedback`, `navigation`, `tables`, `calendars`, `account`, `ecommerce`, `auth`, `blog`, `dashboard`, `docs`). |
| `get_component(id)` | Full registry item for one component, including embedded `files[].content` source code. |
| `search_components(query)` | Fuzzy search by name and description across all registry items. |

Then just ask your agent:

> *"Use lerpa to build a pricing section with three tiers."*
> *"Search lerpa for a magnetic button and add it to my navbar."*

## Development (monorepo)

```bash
pnpm --filter @lerpa/mcp-server build      # tsc + bundles registry data into the package
pnpm --filter @lerpa/mcp-server typecheck
node packages/mcp-server/dist/index.js     # stdio MCP server
```

`build` runs `tsc`, then `scripts/copy-registry.cjs` copies `registry.json` (aggregated registry with embedded source) and `component-catalog.json` (descriptions/categories) from `packages/registry/generated/` into this package. At runtime the server reads the bundled files first and falls back to monorepo paths during local development.

To test against a local build instead of npm:

```bash
claude mcp add lerpa -- node /absolute/path/to/packages/mcp-server/dist/index.js
```

## Requirements

Node.js ≥ 20.

## License

MIT © [Cuibit Labs](https://cuibit.com) — see [LICENSE](https://github.com/cuibit-labs/lerpaui/blob/main/LICENSE.md).
