# Using Lerpa UI in a shadcn/ui project

Lerpa is **shadcn-compatible**: same copy-paste philosophy, same `@/components/ui` + `@/lib/utils` layout, and a registry that works with the shadcn CLI. If you already use shadcn/ui, Lerpa components drop straight in — no migration.

## Option A — install through the shadcn CLI

Every Lerpa item is served as a shadcn registry item at `https://lerpaui.com/r/<name>.json`:

```bash
npx shadcn add https://lerpaui.com/r/magnetic-button.json
npx shadcn add https://lerpaui.com/r/spotlight-card.json
```

`registryDependencies` resolve automatically, exactly like first-party shadcn items.

## Option B — install through lerpa-cli (recommended)

```bash
npx lerpa-cli init      # adds Lerpa's design tokens alongside your shadcn theme
npx lerpa-cli add aurora-shader
```

Why prefer it: one batched npm install for all dependencies, `tsconfig` path-alias awareness, offline bundled registry, and `doctor` to verify setup.

## How the styling models coexist

- Lerpa components use **both** shadcn-style utilities (`bg-primary`, `text-muted-foreground`, `border-input`) **and** Lerpa's own tokens (`bg-bg`, `text-text`, `text-accent`).
- `lerpa-cli init` writes a managed `@theme` block that maps **both sets** to the same CSS variables — your existing shadcn components keep working, and Lerpa components pick up the same palette.
- Your `components.json`, themes, and existing components are untouched. The Lerpa token block is clearly fenced with `/* lerpa-ui:tokens:start */ … end */` markers.

## Mixing components

```tsx
import { Button } from "@/components/ui/button";          // shadcn or lerpa — same path
import { SpotlightCard } from "@/components/ui/spotlight-card"; // lerpa

export function Plans() {
  return (
    <SpotlightCard className="p-8">
      <h3 className="text-lg font-semibold">Pro</h3>
      <p className="text-muted-foreground">For growing teams.</p>
      <Button className="mt-4">Upgrade</Button>
    </SpotlightCard>
  );
}
```

## What Lerpa adds on top of shadcn/ui

| | shadcn/ui | Lerpa UI |
| --- | --- | --- |
| Primitives (button, dialog, tabs…) | ✅ ~50 | ✅ included |
| Animated/creative components | — | ✅ Framer Motion, reduced-motion safe |
| Full page blocks (heroes, pricing, dashboards) | limited | ✅ 219 blocks |
| MCP server for AI agents | — | ✅ `@lerpa/mcp-server` |

Name collisions (e.g. `button`): installing Lerpa's version overwrites the file **after a confirmation prompt and a `.bak` backup** — or keep your shadcn primitive and install only Lerpa's animated components alongside it.
