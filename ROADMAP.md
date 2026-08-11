# Lerpa UI roadmap

This roadmap describes repository-controlled work. npm publication, website deployment, and third-party client validation are separate release gates.

## 0.3.0 release candidate

- [x] Deterministic registry generation with SHA-256 integrity.
- [x] Strict validation of all 1,328 items, dependency graphs, install paths, file conflicts, and generated imports.
- [x] CLI multi-add, dry-run, safe backups, traversal rejection, structured listing/search, strict doctor, and `set` theme alias.
- [x] CLI built-artifact integration tests.
- [x] MCP pagination, filters, categories, exact stats, argument validation, and five-tool stdio surface.
- [x] Real MCP stdio integration test.
- [x] Fail-closed UI smoke/axe baseline and targeted regressions for progress, focus, video, and local storage behavior.
- [x] Production dependency audit with patched MCP transitive dependencies.
- [ ] Publish `lerpa-cli@0.3.0` and `@lerpa/mcp-server@0.3.0` after release approval.
- [ ] Update and deploy the separate website so version, counts, commands, accessibility language, and `llms.txt` match this repository.

## Next hardening

- [ ] Compile-test every installable item in generated dependency-closure fixtures, not only resolve its relative imports.
- [ ] Add Linux, macOS, and Windows CLI matrices for npm, pnpm, Yarn, and Bun.
- [ ] Add browser visual-regression coverage for a curated representative set.
- [ ] Run manual keyboard and screen-reader reviews for high-use primitives and blocks.
- [ ] Expand catalog metadata from 1,189 entries to every registry id.
- [ ] Define performance budgets for animation-heavy and chart-heavy components.

## Product work

- [ ] Theme Studio backed by the actual managed token schema.
- [ ] Block Composer that exports a dependency-resolved page without fabricated backend behavior.
- [ ] Curated, install-tested starter applications.
- [ ] Versioned migration notes for major React, Tailwind, Framer Motion, Radix, and Recharts changes.

## 1.0 criteria

- [ ] Stable, documented CLI and registry contracts.
- [ ] Published packages and website all report one verified version and one set of counts.
- [ ] Cross-platform package-manager evidence is green.
- [ ] Representative browser, device, accessibility, and visual evidence is recorded.
- [ ] Security reporting, release ownership, rollback, and incident procedures are exercised.
