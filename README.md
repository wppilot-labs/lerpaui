# Lerpa UI

**Free animated React components and blocks for building premium interfaces fast.**

Lerpa UI is an open-source React + Tailwind CSS component library with a shadcn-compatible registry. Browse polished components, copy the code, or install exactly what you need with the CLI.

[Website](https://lerpaui.com) · [Components](https://lerpaui.com/gallery/components) · [Blocks](https://lerpaui.com/gallery/blocks) · [Registry](https://lerpaui.com/r)

## Highlights

- **Copy-paste ownership**: install a component, keep the source, customize everything.
- **Production-ready blocks**: landing pages, pricing sections, dashboards, AI surfaces, ecommerce UI, forms, charts, navigation, and more.
- **Modern stack**: React 19, Next.js 16, Tailwind CSS v4, TypeScript, Framer Motion, Radix UI, and Lucide icons.
- **Accessible by default**: keyboard states, focus handling, color contrast, and reduced-motion support are first-class concerns.
- **shadcn-compatible registry**: install individual components without adopting a heavy package runtime.

## Install a Component

```bash
pnpm dlx lerpa-cli add button
```

Or install directly through the shadcn registry URL:

```bash
npx shadcn add https://lerpaui.com/r/button.json
```

## Explore the Library

- **Components**: `1234` source components and `1099` registry UI items.
- **Blocks**: `30` source blocks and `219` registry block items.
- **Gallery**: `1179` catalog entries across `16` categories.
- **Quality**: `86` test files with `471` assertions.

## Live Previews

Every catalog entry is wired into the docs gallery with an interactive demo and install command.

- **Component gallery**: https://lerpaui.com/gallery/components
- **Blocks gallery**: https://lerpaui.com/gallery/blocks
- **Category browser**: https://lerpaui.com/gallery

Use the live gallery as the source for launch screenshots, GIFs, and social previews so visuals stay aligned with the latest components.

## Categories

`ai` · `buttons` · `calendars` · `cards` · `charts` · `creative` · `feedback` · `forms` · `navigation` · `tables` · `account` · `ecommerce` · `auth` · `blog` · `dashboard` · `docs`

## Repository Structure

```txt
packages/ui       Source components, blocks, hooks, tokens, and animations
packages/registry shadcn-compatible registry compiler and generated items
packages/cli      Interactive installer CLI
```

## Development

```bash
git clone https://github.com/cuibit-labs/lerpaui.git
cd lerpaui
pnpm install
pnpm dev
```

## Quality Gates

```bash
pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build
pnpm run registry:validate
pnpm run registry:validate:coverage
```

## License

Lerpa UI is free and open-source under the [MIT License](LICENSE.md).

For contribution rules, read the [Contributing Guidelines](CONTRIBUTING.md).
