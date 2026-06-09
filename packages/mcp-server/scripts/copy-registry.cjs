/**
 * copy-registry.js
 *
 * Bundles the generated registry data INTO this package so the published
 * tarball is self-contained and runnable via `npx @lerpa/mcp-server`
 * outside the monorepo. Runs as the second half of `pnpm run build`.
 *
 * Copies:
 *   packages/registry/generated/registry.json     -> registry/registry.json
 *   apps/docs/src/data/component-catalog.json      -> registry/component-catalog.json
 *
 * Idempotent: warns and skips a missing source (e.g. the registry hasn't been
 * built yet) rather than failing the build. At runtime src/index.ts falls back
 * to monorepo paths, so a missing bundle only matters for the published package.
 */
const fs = require("fs");
const path = require("path");

const DEST_DIR = path.resolve(__dirname, "../registry");

const COPIES = [
  {
    label: "registry",
    src: path.resolve(__dirname, "../../registry/generated/registry.json"),
    dest: path.join(DEST_DIR, "registry.json"),
    hint: "Run `pnpm --filter @lerpa/registry run build` first.",
  },
  {
    label: "catalog",
    src: path.resolve(__dirname, "../../../apps/docs/src/data/component-catalog.json"),
    dest: path.join(DEST_DIR, "component-catalog.json"),
    hint: "Expected apps/docs/src/data/component-catalog.json.",
  },
];

function main() {
  fs.mkdirSync(DEST_DIR, { recursive: true });
  for (const { label, src, dest, hint } of COPIES) {
    if (!fs.existsSync(src)) {
      console.warn(`[lerpa-mcp] Skipping ${label} copy: source not found at ${src}.\n                 ${hint}`);
      continue;
    }
    fs.copyFileSync(src, dest);
    const sizeKb = (fs.statSync(dest).size / 1024).toFixed(1);
    console.log(`[lerpa-mcp] Bundled ${label} -> ${path.relative(process.cwd(), dest)} (${sizeKb} KB).`);
  }
}

main();
