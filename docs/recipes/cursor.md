# Using Lerpa UI with Cursor

Give Cursor's agent direct access to all 1,318 Lerpa components and blocks via MCP.

## 1. Add the MCP server

Create or edit `~/.cursor/mcp.json` (global) or `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "lerpa": { "command": "npx", "args": ["-y", "@lerpa/mcp-server"] }
  }
}
```

Restart Cursor, then check **Settings → MCP** — `lerpa` should show three tools: `list_components`, `get_component`, `search_components`.

## 2. Initialize your project once

```bash
npx lerpa-cli init --yes
```

This writes the Tailwind v4 design tokens into your global CSS and creates the `cn` helper — components render styled immediately.

## 3. Prompt patterns that work well

In Agent mode:

> Search lerpa for a magnetic button. Fetch its source and add it to `src/components/ui`, then use it in the navbar CTA.

> Use lerpa to build my pricing page: fetch a pricing card component and lay out three tiers (Free / Pro / Team) with our real prices.

> List lerpa components in the `dashboard` category, then assemble a revenue overview page from them.

## 4. Optional: add a Cursor rule

Create `.cursor/rules/lerpa.mdc` so the agent prefers the registry over hand-rolling UI:

```markdown
---
description: Use Lerpa UI for new interface work
alwaysApply: true
---

When building UI, first search the lerpa MCP server for an existing component
or block. Install its source under `@/components/ui` (components) or
`@/components/blocks` (page sections). Keep the design-token classes
(`bg-bg`, `text-text`, `text-accent`) instead of hard-coded colors so theming
keeps working.
```

## Troubleshooting

- **MCP server not listed** — `npx -y @lerpa/mcp-server` requires Node ≥ 20 on your PATH; check Cursor's MCP logs.
- **Unstyled components** — run `npx lerpa-cli doctor`.
- **Want a different look?** — `npx lerpa-cli theme ocean` (or `lime`, `mono`, `grape`, `ember`, `gold`, `paper`).
