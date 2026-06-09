/**
 * copy-registry.js
 *
 * Copies the generated registry into packages/cli/registry/registry.json so
 * that the published `lerpa-cli` tarball is self-contained. Runs as the
 * second half of `pnpm run build` in the CLI package.
 *
 * Idempotent: skips silently when the source registry is missing (e.g. when
 * a developer types `pnpm run build` in the CLI package without first
 * running the registry build).
 */
const fs = require("fs");
const path = require("path");

const SRC = path.resolve(
  __dirname,
  "../../registry/generated/registry.json"
);
const DEST_DIR = path.resolve(__dirname, "../registry");
const DEST = path.join(DEST_DIR, "registry.json");

function main() {
  if (!fs.existsSync(SRC)) {
    console.warn(
      `[lerpa-cli] Skipping registry copy: source not found at ${SRC}.\n` +
        "                 Run `pnpm --filter @lerpa/registry run build` first."
    );
    return;
  }

  fs.mkdirSync(DEST_DIR, { recursive: true });
  fs.copyFileSync(SRC, DEST);
  const sizeKb = (fs.statSync(DEST).size / 1024).toFixed(1);
  console.log(
    `[lerpa-cli] Bundled registry copied to ${path.relative(process.cwd(), DEST)} (${sizeKb} KB).`
  );
}

main();
