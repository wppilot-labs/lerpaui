# Contributing to Lerpa UI

Thank you for your interest in contributing to Lerpa UI! We are excited to build the best free, animated React UI library in the world together.

## How Can I Contribute?

1. **Reporting Bugs**: Open an issue detailing the steps to reproduce the issue, expected behavior, and screenshots if applicable.
2. **Requesting Components**: Check our Roadmap and open a feature request with design references and layout ideas.
3. **Submitting Pull Requests**:
   - Fork the repository.
   - Create a feature branch (`git checkout -b feature/amazing-block`).
   - Write clean, documented code complying with our Quality Standards and design tokens.
   - Run verification pipelines: `pnpm lint`, `pnpm typecheck`, `pnpm build`.
   - Submit a pull request to the main repository.

## Developing Locally

Ensure you have **Node.js v20+** and **pnpm v10+** installed.

```bash
# Clone and install dependencies
git clone https://github.com/cuibit-labs/lerpaui.git
cd lerpaui
pnpm install

# Build the workspace (compiles the registry, CLI, and MCP server)
pnpm build

# Run tests (Vitest + vitest-axe accessibility checks)
pnpm test

# Watch mode while editing the CLI or MCP server
pnpm dev
```

## Styling Guidelines

- Every component and block must adhere to our token presets (`packages/ui/src/tokens`).
- Use CSS variables for color values so theme-switching is seamlessly inherited.
- Keep interactive controls highly accessible (support standard keyboard navigation and aria attributes).
