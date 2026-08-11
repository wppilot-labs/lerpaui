# Using Lerpa UI with Claude Code

Let Claude Code browse, search, and install Lerpa components for you via the [`@lerpa/mcp-server`](https://www.npmjs.com/package/@lerpa/mcp-server) MCP server.

## 1. Register the MCP server (once)

```bash
claude mcp add lerpa -- npx -y @lerpa/mcp-server
```

Add `--scope user` to make it available in every project, or run it inside a repo for project scope.

## 2. Restart Claude Code

Five tools become available: `list_components`, `get_component`, `search_components`, `list_categories`, and `get_registry_stats`.

## 3. Prompt patterns that work well

**Discover, then build:**

> Search lerpa for pricing cards, show me the options, then add the best one to `app/pricing/page.tsx` with our real plan data.

**Build a whole section:**

> Use lerpa to build a landing page: a SaaS hero, a feature bento grid, a testimonial marquee, and a footer. Wire them into `app/page.tsx`.

**Stay token-aware:**

> List lerpa components in the `charts` category and just give me the names — then fetch only the one I pick.

Claude pulls the component **source** into your project — you own and edit it like your own code.

## 4. Make sure the styles are in place

Lerpa components rely on Tailwind v4 design tokens. The fastest path is to let Claude run:

```bash
npx lerpa-cli init --yes
```

This scaffolds the `@theme` + `:root` token block into your global CSS and creates the `cn` helper at `@/lib/utils`. Without it, components render unstyled.

## 5. Optional: add a CLAUDE.md hint

Drop this into your project's `CLAUDE.md` so Claude reaches for Lerpa first:

```markdown
## UI components

This project uses Lerpa UI (lerpa MCP server). When asked to build UI:

1. `search_components` / `list_components` to find a match before writing custom UI.
2. `get_component` to fetch the source, then install it under `@/components/ui` or `@/components/blocks`.
3. Keep the design-token classes (`bg-bg`, `text-text`, `text-accent`) — don't replace them with hard-coded colors.
```

## Troubleshooting

- **Tools don't appear** — run `claude mcp list` to confirm `lerpa` is registered, then fully restart Claude Code.
- **Components unstyled** — run `npx lerpa-cli doctor`; it verifies the token block exists in your CSS.
- **`cn` import fails** — your project may alias utils differently; `lerpa-cli init` honors `--utils <alias>`.
