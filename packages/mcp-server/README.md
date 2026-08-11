# @lerpa/mcp-server

[![npm](https://img.shields.io/npm/v/%40lerpa%2Fmcp-server?logo=npm&color=cb3837)](https://www.npmjs.com/package/@lerpa/mcp-server)
[![MIT License](https://img.shields.io/badge/License-MIT-22c55e.svg)](https://github.com/wppilot-labs/lerpaui/blob/main/LICENSE.md)

A read-only Model Context Protocol server for the [Lerpa UI](https://github.com/wppilot-labs/lerpaui) registry. The package bundles 1,328 item definitions and their source, plus the available component catalog, so the stdio server requires no runtime network access.

## Setup

Claude Code:

```bash
claude mcp add lerpa -- npx -y @lerpa/mcp-server
```

Generic MCP config:

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

Restart the client after changing its config.

## Tools

| Tool                 | Input                                                          | Result                                                                        |
| -------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `list_components`    | Optional `category`, `type`, `limit` (1-250), `offset`         | Paginated item summaries, install commands, and `.json` registry URLs.        |
| `get_component`      | Required kebab-case `id`                                       | Metadata, dependencies, and every embedded source file.                       |
| `search_components`  | Required `query`; optional `category`, `type`, `limit` (1-100) | Ranked id/name/description/category results.                                  |
| `list_categories`    | None                                                           | Derived category totals split into UI and blocks.                             |
| `get_registry_stats` | None                                                           | Exact item totals, catalog coverage, server version, and network requirement. |

`type` accepts `all`, `ui`, `component`, or `block`. Listing defaults to 100 results and returns `nextOffset` until pagination is complete.

The generated catalog covers 1,189 of the 1,328 item ids. Items without catalog metadata remain discoverable and receive id-derived fallback categories; the server does not invent descriptions.

## Development

```bash
pnpm --filter @lerpa/mcp-server build
pnpm --filter @lerpa/mcp-server test
pnpm --filter @lerpa/mcp-server typecheck
node packages/mcp-server/dist/index.js
```

The test suite checks exported query functions and opens a real MCP stdio client session against the built server.

For a local client config, point the command at Node and pass the absolute path to `packages/mcp-server/dist/index.js` as its first argument.

Requires Node.js 20 or newer.

MIT © [Cuibit Labs](https://cuibit.com). See [LICENSE.md](https://github.com/wppilot-labs/lerpaui/blob/main/LICENSE.md).
