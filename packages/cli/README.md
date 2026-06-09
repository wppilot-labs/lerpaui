# lerpa-cli

Copy-paste components and blocks from the [Lerpa UI](https://github.com/lerpa-ui/lerpa)
registry into any React + Tailwind project.

## Quick start

```bash
# Initialize the project (creates lerpa.json + components/ui/cn.ts)
pnpm dlx lerpa-cli init

# Add a component
pnpm dlx lerpa-cli add shiny-glow-button

# Add a block (e.g. a hero section)
pnpm dlx lerpa-cli add hero-saas-simple

# Update everything you have installed
pnpm dlx lerpa-cli update

# List what is available
pnpm dlx lerpa-cli list
```

The CLI ships with a bundled copy of the registry, so it works offline as
long as the package is installed.

## Where it puts files

By default, components are written to `components/ui/` and blocks to
`components/blocks/`. Override the targets in `lerpa.json`:

```json
{
  "style": "default",
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "app/globals.css"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "packageManager": "pnpm"
}
```

## Commands

| Command                            | Description                                     |
| ---------------------------------- | ----------------------------------------------- |
| `lerpa-cli init`                | Create `lerpa.json` and the `cn` helper.     |
| `lerpa-cli add <name>`          | Install a component or block + its npm deps.   |
| `lerpa-cli update [name]`       | Re-install one or all installed items.         |
| `lerpa-cli list`                | Print every item available in the registry.    |
| `lerpa-cli remove <name>`       | Delete an installed component file.            |

## License

MIT © Lerpa UI contributors.
