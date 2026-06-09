# @lerpa/mcp-server

Model Context Protocol (MCP) server that exposes the Lerpa UI registry to AI coding agents (Claude Code, Cursor, v0, Continue, Cline, Zed).

## Status

**Active** — `@modelcontextprotocol/sdk` is installed and `pnpm --filter @lerpa/mcp-server build` emits `dist/index.js`. Rebuild after editing `src/`:

```bash
pnpm --filter @lerpa/mcp-server build
```

## What it exposes

Three read-only tools backed by `packages/registry/generated/manifest.json` and `apps/docs/src/data/component-catalog.json`:

| Tool | Description |
| --- | --- |
| `list_components(category?)` | Returns components filtered by category (`ai`, `buttons`, `cards`, `forms`, `creative`, `feedback`, `navigation`, `tables`, `calendars`, `ecommerce`, `dashboard`, `auth`, `account`, `docs`, `blog`). |
| `get_component(id)` | Returns the full registry item JSON for a single component, including embedded `files[].content` source code (copy-pasteable). |
| `search_components(query)` | Fuzzy search by name + description across all registry items. |

## Configure in Claude Code

Build first, then register the server. Easiest is the CLI:

```bash
pnpm --filter @lerpa/mcp-server build
claude mcp add lerpa --scope user -- node /absolute/path/to/packages/mcp-server/dist/index.js
```

Or add a project-scoped `.mcp.json` at your repo root:

```json
{
  "mcpServers": {
    "lerpa": {
      "command": "node",
      "args": ["/absolute/path/to/packages/mcp-server/dist/index.js"]
    }
  }
}
```

Restart Claude Code; the three tools above become callable.

## Configure in Cursor

`~/.cursor/mcp.json` — point at the built `dist/index.js` (works today, from inside this monorepo):

```json
{
  "mcpServers": {
    "lerpa": {
      "command": "node",
      "args": ["/absolute/path/to/packages/mcp-server/dist/index.js"]
    }
  }
}
```

> The registry data is bundled into the package, so `npx -y @lerpa/mcp-server` works as soon as it is published to npm. Until the first `npm publish`, use the `node …/dist/index.js` form above.

## Configure in Continue / Cline / Zed

Same shape — point `command`/`args` to `node /absolute/path/to/packages/mcp-server/dist/index.js` for local use (or the published `lerpa-mcp` binary once available).

## Publishing

The package is self-contained. `pnpm --filter @lerpa/mcp-server build` runs `tsc` then `scripts/copy-registry.cjs`, which bundles `registry/registry.json` (the aggregated registry with embedded source) and `registry/component-catalog.json` into the package. At runtime `src/index.ts` reads those bundled files, falling back to monorepo paths during local dev. `files` ships `dist` + `registry`; `prepublishOnly` rebuilds the registry first; `publishConfig.access` is `public`.

To publish (verified self-contained outside the monorepo — `npm pack` tarball ≈ 1.3 MB):

```bash
cd packages/mcp-server
npm publish        # prepublishOnly rebuilds the registry + bundles, then publishes
```

After the first publish, any MCP client can use `npx -y @lerpa/mcp-server`.

## Data sources

Resolved bundled-first, with monorepo fallback for local development:

- Aggregated registry (names, types, embedded source): `registry/registry.json` ← `../registry/generated/registry.json`
- Component descriptions / categories: `registry/component-catalog.json` ← `../../apps/docs/src/data/component-catalog.json`

## Development

```bash
pnpm --filter @lerpa/mcp-server typecheck
pnpm --filter @lerpa/mcp-server build
node packages/mcp-server/dist/index.js   # stdio MCP server
```
