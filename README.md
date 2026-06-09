<div align="center">

# Lerpa UI

### Free, animated React components & blocks — copy the code, own it forever.

**1,099 components · 219 blocks · 1,318 shadcn-compatible registry items.**
Built for React 19, Next.js 16, Tailwind CSS v4, TypeScript, Framer Motion & Radix UI.

[![MIT License](https://img.shields.io/badge/License-MIT-22c55e.svg)](LICENSE.md)
[![React 19](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![shadcn compatible](https://img.shields.io/badge/shadcn-compatible-000000)](https://ui.shadcn.com)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-22c55e.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/cuibit-labs/lerpaui?style=social)](https://github.com/cuibit-labs/lerpaui)

[![npm lerpa-cli](https://img.shields.io/npm/v/lerpa-cli?logo=npm&label=lerpa-cli&color=cb3837)](https://www.npmjs.com/package/lerpa-cli)
[![npm @lerpa/mcp-server](https://img.shields.io/npm/v/%40lerpa%2Fmcp-server?logo=npm&label=%40lerpa%2Fmcp-server&color=cb3837)](https://www.npmjs.com/package/@lerpa/mcp-server)

[**Website**](https://lerpaui.com) · [**Components**](https://lerpaui.com/gallery/components) · [**Blocks**](https://lerpaui.com/gallery/blocks) · [**Registry**](https://lerpaui.com/r) · [**MCP for AI agents**](#-use-with-ai-coding-agents-mcp)

</div>

---

**Lerpa UI** is an open-source **React + Tailwind CSS component library** with a **shadcn-compatible registry**. Instead of installing a heavy runtime dependency, you install the *source* of each component straight into your project — then own, read, and customize it like code you wrote yourself. Browse polished, animated components in the gallery, copy the code, install one with the CLI, or let an **AI coding agent** pull components for you over **MCP**.

No lock-in. No black-box `node_modules` component. Just production-grade React you control.

**Jump to:** [Quick start](#-quick-start) · [CLI](#-cli-reference) · [MCP for AI agents](#-use-with-ai-coding-agents-mcp) · [What's inside](#-whats-inside) · [Lerpa vs shadcn/ui](#️-lerpa-ui-vs-shadcnui) · [FAQ](#-faq)

## ✨ Why Lerpa UI

- **🧩 Copy-paste ownership** — install a component, keep the source, change anything. No version churn, no peer-dependency conflicts.
- **🎬 Motion built in** — entrance, scroll, and gesture animations via Framer Motion, with `prefers-reduced-motion` fallbacks handled for you.
- **🏗️ Production-ready blocks** — full landing pages, pricing sections, dashboards, AI surfaces, ecommerce flows, auth screens, forms, charts, and navigation.
- **♿ Accessible by default** — keyboard interaction, focus management, color contrast, and reduced motion are first-class, axe-tested concerns.
- **🤖 AI-native** — a Model Context Protocol (MCP) server exposes the whole registry to Claude Code, Cursor, Windsurf, and more, plus `llms.txt` for agent discovery.
- **🎨 Token-driven theming** — every component is themed through CSS variables and design tokens (never inline styles), so one theme switch restyles everything.

## 🚀 Quick start

**1. Initialize once** — scaffolds the Tailwind v4 design tokens (`@theme` + `:root`) and the `cn` helper, so components render styled on first paint:

```bash
npx lerpa-cli init
```

**2. Add components** — every path delivers the same source you own:

```bash
# Lerpa CLI (recommended — resolves dependencies, respects your src/ layout + alias)
npx lerpa-cli add button

# …or via the shadcn-compatible registry
npx shadcn add https://lerpaui.com/r/button.json
```

Or **browse & copy** from the [component gallery](https://lerpaui.com/gallery/components) — preview live, copy with one click.

> Replace `button` with any id (e.g. `pricing-table`, `aurora-shader`, `dashboard-revenue-overview`). `registryDependencies` install automatically.

## 🧰 CLI reference

```bash
npx lerpa-cli <command>
```

| Command | What it does |
| --- | --- |
| `init` | Scaffold config + `cn` helper + Tailwind v4 tokens. Flags: `--yes`, `--css <path>`, `--components <alias>`, `--utils <alias>`, `--pm <npm\|pnpm\|yarn\|bun>`, `--no-tokens`. |
| `add <name>` | Install a component/block with all registry + npm dependencies (one batched install). `--yes` skips prompts. |
| `theme [name]` | Apply a color theme — `lime`, `mono`, `ocean`, `grape`, `ember`, `gold`, `paper`. Replaces a managed block, so it's safe to re-run. |
| `list` | List every component and block (`--json` for machine output). |
| `search <query>` | Search the registry by name. |
| `doctor` | Verify config and that the Tailwind v4 tokens are present. |
| `info` | Show CLI + project metadata. |

Every command accepts `--yes`, so it runs unattended in CI.

## 🤖 Use with AI coding agents (MCP)

Lerpa ships a **Model Context Protocol (MCP) server** — [`@lerpa/mcp-server`](https://www.npmjs.com/package/@lerpa/mcp-server) — so AI coding agents (**Claude Code, Cursor, Windsurf, Continue, Cline, Zed**) can browse and install Lerpa components for you. It runs via `npx`; no local checkout needed.

**Step 1 — register the server.**

Claude Code (one command):

```bash
claude mcp add lerpa -- npx -y @lerpa/mcp-server
```

Cursor / Windsurf / Continue / Cline / Zed — add to `mcp.json` (e.g. `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "lerpa": { "command": "npx", "args": ["-y", "@lerpa/mcp-server"] }
  }
}
```

**Step 2 — restart your agent.** Three tools become available:

| Tool | What it does |
| --- | --- |
| `list_components(category?)` | List components, optionally by category. |
| `get_component(id)` | Full registry item + source code for one component. |
| `search_components(query)` | Fuzzy search by name and description. |

**Step 3 — just ask.** For example:

> *"Use lerpa to build a pricing section with three tiers and a revenue chart."*
> *"Search lerpa for a magnetic button and add it."*

Your agent searches the registry, pulls the source, and writes it into your project — accessible, animated, and yours to edit.

## 📦 What's inside

- **Components** — `1,099` animated, accessible registry UI items.
- **Blocks** — `219` registry block items — full page sections.
- **Registry** — `1,318` total shadcn-compatible items with embedded source.
- **Gallery** — `1,179` catalog entries across `16` categories.
- **Tested** — `807` tests across `86` files (Vitest + vitest-axe).

## 🗂️ Categories

`ai` · `buttons` · `calendars` · `cards` · `charts` · `creative` · `feedback` · `forms` · `navigation` · `tables` · `account` · `ecommerce` · `auth` · `blog` · `dashboard` · `docs`

## 🧱 Tech stack

React 19 · Next.js 16 · Tailwind CSS v4 · TypeScript 5.7 · Framer Motion 12 · Radix UI · Lucide icons · Vitest. Distributed through a shadcn-compatible registry and an interactive CLI.

## 👀 Live previews

Every catalog entry is wired into the docs gallery with an interactive demo and a copy-ready install command:

- **Components** — https://lerpaui.com/gallery/components
- **Blocks** — https://lerpaui.com/gallery/blocks
- **All categories** — https://lerpaui.com/gallery

## 🏗️ Repository structure

```txt
packages/ui         Source components, blocks, hooks, design tokens, animations
packages/registry   shadcn-compatible registry compiler + generated items
packages/cli        Interactive installer CLI (lerpa-cli)
packages/mcp-server Model Context Protocol server (@lerpa/mcp-server)
```

## 🛠️ Local development

```bash
git clone https://github.com/cuibit-labs/lerpaui.git
cd lerpaui
pnpm install
pnpm build        # compiles the registry + packages
pnpm test         # Vitest + a11y checks
```

Requires Node ≥ 20 and pnpm 10.

## ✅ Quality gates

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run registry:validate
```

## ⚖️ Lerpa UI vs shadcn/ui

|  | Lerpa UI | shadcn/ui |
| --- | --- | --- |
| Install model | Copy-paste — you own the source | Copy-paste — you own the source |
| Catalog | **1,318 items** (1,099 components + 219 blocks) | ~50 primitives |
| Animation | **Framer Motion baked in**, reduced-motion safe | Not included |
| Page blocks | Hero, pricing, dashboards, ecommerce, AI surfaces… | Limited |
| Registry | **shadcn-compatible** — works with `npx shadcn add` | Native |
| CLI | **`lerpa-cli`** — first-party (shadcn CLI optional, not required) | shadcn CLI |
| AI / MCP | **First-class MCP server + `llms.txt`** | — |
| License | MIT, free | MIT, free |

Lerpa is **shadcn-compatible** — already using shadcn? Lerpa components drop straight into the same `components.json` / `@/components/ui` setup.

## ❓ FAQ

**Is Lerpa UI free?** Yes — MIT licensed, free for personal and commercial projects.

**Do I install a runtime package?** No. You install the *source* of each component into your project and own it outright — no runtime dependency on Lerpa, no version churn.

**Does it work outside Next.js (Vite, Remix, plain React)?** Yes. Components are standard React + Tailwind. `lerpa-cli init` reads your `tsconfig` paths and `src/` layout so files land in the right place in any setup.

**How is it different from shadcn/ui?** Same copy-paste philosophy and a shadcn-compatible registry, but a much larger catalog, motion baked in, full page blocks, and first-class AI/MCP tooling. See the table above.

**Can my AI assistant use it?** Yes — [`@lerpa/mcp-server`](https://www.npmjs.com/package/@lerpa/mcp-server) exposes the whole registry to Claude Code, Cursor, Windsurf, and more.

**How do I theme it?** Everything runs on CSS variables / design tokens. Run `lerpa-cli theme <name>` or edit the `:root` tokens — one change restyles every component.

## 🤝 Contributing

Contributions are welcome — read the [Contributing Guidelines](CONTRIBUTING.md) and our [Code of Conduct](CODE_OF_CONDUCT.md). Found a bug or want a component? [Open an issue](https://github.com/cuibit-labs/lerpaui/issues).

## 📄 License

Lerpa UI is free and open-source under the [MIT License](LICENSE.md). Use it in personal and commercial projects.

<div align="center">
<sub>Built by <a href="https://cuibit.com">Cuibit Labs</a> · <a href="https://lerpaui.com">lerpaui.com</a> · <a href="https://github.com/cuibit-labs/lerpaui">GitHub</a></sub>
</div>
