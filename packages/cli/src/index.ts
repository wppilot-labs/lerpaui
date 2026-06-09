import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import * as child_process from "child_process";
import prompts from "prompts";
import pc from "picocolors";
import ora from "ora";

const program = new Command();
const CONFIG_FILE = "lerpa.json";
const VERSION = "0.2.2";

interface Config {
  style: string;
  tailwind: { css: string };
  aliases: { components: string; utils: string };
  packageManager: "npm" | "pnpm" | "yarn" | "bun";
}

// ---------------------------------------------------------------------------
// Tailwind v4 token scaffold. Lerpa components use both the "Lunch" tokens
// (bg-bg, text-text, text-accent) and shadcn-compat utilities (bg-primary,
// text-foreground, border-input). In Tailwind v4 these only generate if the
// --color-* are declared via @theme. Without this block a fresh install
// renders unstyled — the #1 onboarding gap. init writes it into globals CSS.
// ---------------------------------------------------------------------------
const TOKENS_START = "/* lerpa-ui:tokens:start (managed by lerpa-cli — edit values in :root) */";
const TOKENS_END = "/* lerpa-ui:tokens:end */";

const LERPA_BASE_CSS = `@theme inline {
  --color-bg: var(--bg);
  --color-bg-2: var(--bg-2);
  --color-bg-3: var(--bg-3);
  --color-bg-4: var(--bg-4);
  --color-edge: var(--edge);
  --color-edge-2: var(--edge-2);
  --color-edge-3: var(--edge-3);
  --color-text: var(--text);
  --color-text-2: var(--text-2);
  --color-text-3: var(--text-3);
  --color-text-4: var(--text-4);
  --color-text-5: var(--text-5);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-accent-d: var(--accent-d);
  --color-pink: var(--pink);
  --color-amber: var(--amber);
  --color-cyan: var(--cyan);
  --color-violet: var(--violet);
  --color-mint: var(--mint);
  --color-red: var(--red);

  /* shadcn-compatible aliases — point at Lunch tokens */
  --color-background: var(--bg);
  --color-foreground: var(--text);
  --color-primary: var(--accent);
  --color-primary-foreground: var(--bg);
  --color-secondary: var(--bg-3);
  --color-secondary-foreground: var(--text);
  --color-muted: var(--bg-3);
  --color-muted-foreground: var(--text-3);
  --color-accent-foreground: var(--bg);
  --color-border: var(--edge);
  --color-input: var(--edge-2);
  --color-ring: var(--accent);
  --color-card: var(--bg-2);
  --color-card-foreground: var(--text);
  --color-popover: var(--bg-2);
  --color-popover-foreground: var(--text);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --font-sans: var(--font-geist-sans, "Geist"), "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono, "Geist Mono"), ui-monospace, monospace;
}

:root {
  --bg: oklch(0.10 0.012 285);
  --bg-2: oklch(0.15 0.018 285);
  --bg-3: oklch(0.20 0.020 285);
  --bg-4: oklch(0.25 0.022 285);
  --edge: oklch(1 0 0 / 0.07);
  --edge-2: oklch(1 0 0 / 0.14);
  --edge-3: oklch(1 0 0 / 0.22);
  --text: oklch(0.95 0.005 300);
  --text-2: oklch(0.78 0.012 290);
  --text-3: oklch(0.55 0.015 290);
  --text-4: oklch(0.35 0.015 290);
  --text-5: oklch(0.25 0.012 290);
  --accent: oklch(0.93 0.18 124);
  --accent-glow: oklch(0.93 0.18 124 / 0.55);
  --accent-soft: oklch(0.93 0.18 124 / 0.14);
  --accent-d: oklch(0.78 0.18 124);
  --pink: oklch(0.65 0.24 7);
  --amber: oklch(0.85 0.16 78);
  --cyan: oklch(0.85 0.13 213);
  --violet: oklch(0.72 0.16 290);
  --mint: oklch(0.78 0.14 158);
  --red: oklch(0.65 0.22 25);
  --destructive: oklch(0.62 0.23 25);
  --destructive-foreground: oklch(0.98 0.01 25);
  --radius: 0.875rem;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
}`;

// Theme presets = oklch overrides for the base tokens. Applied as a managed
// :root block (replaced, never appended) so re-running theme can't duplicate.
const THEME_START = "/* lerpa-ui:theme:start (managed by lerpa-cli) */";
const THEME_END = "/* lerpa-ui:theme:end */";

const THEME_PRESETS: Record<string, string> = {
  lime: `  --bg: oklch(0.11 0.012 285); --bg-2: oklch(0.155 0.016 285); --bg-3: oklch(0.205 0.018 285); --bg-4: oklch(0.255 0.02 285);
  --text: oklch(0.96 0.005 300); --text-2: oklch(0.78 0.012 290); --text-3: oklch(0.56 0.014 290); --text-4: oklch(0.40 0.014 290); --text-5: oklch(0.30 0.012 290);
  --edge: oklch(1 0 0 / 0.07); --edge-2: oklch(1 0 0 / 0.14); --edge-3: oklch(1 0 0 / 0.22);
  --accent: oklch(0.93 0.18 124); --accent-glow: oklch(0.93 0.18 124 / 0.55); --accent-soft: oklch(0.93 0.18 124 / 0.14); --accent-d: oklch(0.78 0.18 124);`,
  mono: `  --bg: oklch(0.12 0 0); --bg-2: oklch(0.16 0 0); --bg-3: oklch(0.21 0 0); --bg-4: oklch(0.26 0 0);
  --text: oklch(0.97 0 0); --text-2: oklch(0.78 0 0); --text-3: oklch(0.56 0 0); --text-4: oklch(0.40 0 0); --text-5: oklch(0.30 0 0);
  --edge: oklch(1 0 0 / 0.08); --edge-2: oklch(1 0 0 / 0.15); --edge-3: oklch(1 0 0 / 0.24);
  --accent: oklch(0.95 0 0); --accent-glow: oklch(0.95 0 0 / 0.40); --accent-soft: oklch(0.95 0 0 / 0.12); --accent-d: oklch(0.75 0 0);`,
  ocean: `  --bg: oklch(0.12 0.035 245); --bg-2: oklch(0.16 0.04 243); --bg-3: oklch(0.21 0.045 242); --bg-4: oklch(0.26 0.048 241);
  --text: oklch(0.95 0.012 235); --text-2: oklch(0.79 0.02 232); --text-3: oklch(0.57 0.03 230); --text-4: oklch(0.41 0.03 228); --text-5: oklch(0.31 0.025 226);
  --edge: oklch(1 0 0 / 0.08); --edge-2: oklch(1 0 0 / 0.15); --edge-3: oklch(1 0 0 / 0.23);
  --accent: oklch(0.80 0.13 222); --accent-glow: oklch(0.80 0.13 222 / 0.55); --accent-soft: oklch(0.80 0.13 222 / 0.15); --accent-d: oklch(0.64 0.12 224);`,
  grape: `  --bg: oklch(0.12 0.03 300); --bg-2: oklch(0.16 0.035 300); --bg-3: oklch(0.21 0.04 300); --bg-4: oklch(0.26 0.042 300);
  --text: oklch(0.96 0.012 300); --text-2: oklch(0.79 0.02 298); --text-3: oklch(0.57 0.03 296); --text-4: oklch(0.41 0.03 294); --text-5: oklch(0.31 0.025 292);
  --edge: oklch(1 0 0 / 0.08); --edge-2: oklch(1 0 0 / 0.15); --edge-3: oklch(1 0 0 / 0.23);
  --accent: oklch(0.70 0.18 295); --accent-glow: oklch(0.70 0.18 295 / 0.55); --accent-soft: oklch(0.70 0.18 295 / 0.15); --accent-d: oklch(0.55 0.18 295);`,
  ember: `  --bg: oklch(0.13 0.03 22); --bg-2: oklch(0.17 0.035 22); --bg-3: oklch(0.22 0.038 22); --bg-4: oklch(0.27 0.04 22);
  --text: oklch(0.96 0.015 30); --text-2: oklch(0.80 0.022 28); --text-3: oklch(0.58 0.028 26); --text-4: oklch(0.42 0.028 24); --text-5: oklch(0.32 0.024 22);
  --edge: oklch(1 0 0 / 0.08); --edge-2: oklch(1 0 0 / 0.15); --edge-3: oklch(1 0 0 / 0.23);
  --accent: oklch(0.66 0.22 20); --accent-glow: oklch(0.66 0.22 20 / 0.55); --accent-soft: oklch(0.66 0.22 20 / 0.15); --accent-d: oklch(0.52 0.21 18);`,
  gold: `  --bg: oklch(0.13 0.018 80); --bg-2: oklch(0.17 0.022 80); --bg-3: oklch(0.22 0.024 80); --bg-4: oklch(0.27 0.026 80);
  --text: oklch(0.96 0.015 90); --text-2: oklch(0.80 0.02 85); --text-3: oklch(0.58 0.024 82); --text-4: oklch(0.42 0.024 80); --text-5: oklch(0.32 0.02 78);
  --edge: oklch(1 0 0 / 0.08); --edge-2: oklch(1 0 0 / 0.15); --edge-3: oklch(1 0 0 / 0.23);
  --accent: oklch(0.84 0.15 85); --accent-glow: oklch(0.84 0.15 85 / 0.55); --accent-soft: oklch(0.84 0.15 85 / 0.15); --accent-d: oklch(0.68 0.15 82);`,
  paper: `  --bg: oklch(0.99 0.003 95); --bg-2: oklch(0.975 0.004 95); --bg-3: oklch(0.95 0.005 95); --bg-4: oklch(0.91 0.006 95);
  --text: oklch(0.22 0.01 285); --text-2: oklch(0.40 0.012 285); --text-3: oklch(0.52 0.012 285); --text-4: oklch(0.64 0.01 285); --text-5: oklch(0.72 0.008 285);
  --edge: oklch(0 0 0 / 0.09); --edge-2: oklch(0 0 0 / 0.14); --edge-3: oklch(0 0 0 / 0.20);
  --accent: oklch(0.52 0.20 275); --accent-glow: oklch(0.52 0.20 275 / 0.40); --accent-soft: oklch(0.52 0.20 275 / 0.12); --accent-d: oklch(0.42 0.20 275);`,
};

// ---------------------------------------------------------------------------
// Registry resolution.
// ---------------------------------------------------------------------------
function getLocalRegistryPath(): string | null {
  const candidates = [
    path.join(__dirname, "../registry/registry.json"),
    path.join(process.cwd(), "packages/registry/generated/registry.json"),
    path.join(__dirname, "../../../registry/generated/registry.json"),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- registry items are dynamic shadcn JSON
function loadRegistry(): any[] {
  const localPath = getLocalRegistryPath();
  if (localPath) {
    try {
      return JSON.parse(fs.readFileSync(localPath, "utf-8"));
    } catch {
      console.warn(pc.yellow(`⚠️  Failed to read registry at ${localPath}.`));
    }
  }
  console.error(pc.red("❌ Registry not found. Reinstall lerpa-cli or run the registry build."));
  return [];
}

function getConfig(): Config | null {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(configPath, "utf-8"));
  } catch {
    return null;
  }
}

function detectPackageManager(): Config["packageManager"] {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb"))) return "bun";
  return "npm";
}

function getInstallCommand(pm: string, deps: string[]): string {
  const depStr = deps.join(" ");
  switch (pm) {
    case "pnpm": return `pnpm add ${depStr}`;
    case "yarn": return `yarn add ${depStr}`;
    case "bun": return `bun add ${depStr}`;
    default: return `npm install ${depStr}`;
  }
}

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function backupFile(targetPath: string) {
  if (fs.existsSync(targetPath)) {
    fs.copyFileSync(targetPath, `${targetPath}.bak`);
    console.log(pc.gray(`📁 Backup: ${targetPath}.bak`));
  }
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Strip // and /* */ comments so tsconfig.json (which allows them) parses.
function parseJsonc(text: string): unknown {
  const stripped = text
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\/[^\n\r]*|\/\*[\s\S]*?\*\/)/g, (m, c) => (c ? "" : m));
  return JSON.parse(stripped);
}

function readTsconfigPaths(): Record<string, string[]> | null {
  for (const f of ["tsconfig.json", "jsconfig.json"]) {
    const p = path.join(process.cwd(), f);
    if (!fs.existsSync(p)) continue;
    try {
      const json = parseJsonc(fs.readFileSync(p, "utf-8")) as {
        compilerOptions?: { paths?: Record<string, string[]> };
      };
      if (json.compilerOptions?.paths) return json.compilerOptions.paths;
    } catch {
      /* ignore */
    }
  }
  return null;
}

// Resolve an import alias (e.g. "@/components") to a real on-disk directory
// (e.g. "src/components"), honoring tsconfig "paths", then falling back to a
// src/ layout heuristic. Fixes installs landing in the wrong folder.
function aliasToDir(alias: string): string {
  const paths = readTsconfigPaths();
  if (paths) {
    for (const [key, targets] of Object.entries(paths)) {
      const keyPrefix = key.replace(/\*$/, "");
      if (alias.startsWith(keyPrefix) && targets?.length) {
        const target = targets[0].replace(/\*$/, "").replace(/^\.\//, "");
        return path.normalize(path.join(target, alias.slice(keyPrefix.length)));
      }
    }
  }
  let rel = alias.replace(/^[@~]\//, "");
  if (fs.existsSync(path.join(process.cwd(), "src")) && !rel.startsWith("src" + path.sep) && !rel.startsWith("src/")) {
    rel = path.join("src", rel);
  }
  return rel;
}

// ---------------------------------------------------------------------------
program
  .name("lerpa")
  .description("Lerpa UI registry CLI — copy-paste animated React components & blocks")
  .version(VERSION);

// INIT --------------------------------------------------------------------
program
  .command("init")
  .description("Initialize Lerpa UI: writes config, the cn helper, and Tailwind v4 tokens")
  .option("-y, --yes", "Non-interactive: accept detected/flagged defaults (CI-friendly)", false)
  .option("--css <path>", "Path to your global CSS file")
  .option("--components <alias>", "Import alias for components", "@/components")
  .option("--utils <alias>", "Import alias for the cn helper", "@/lib/utils")
  .option("--pm <manager>", "Package manager (npm|pnpm|yarn|bun)")
  .option("--no-tokens", "Skip writing the Tailwind v4 token block into your CSS")
  .action(async (opts) => {
    console.log(pc.cyan("\n🚀 Lerpa UI init\n"));

    const configPath = path.join(process.cwd(), CONFIG_FILE);
    if (fs.existsSync(configPath) && !opts.yes) {
      const ow = await prompts({ type: "confirm", name: "value", message: `${CONFIG_FILE} exists. Overwrite?`, initial: false });
      if (!ow.value) return console.log(pc.yellow("Aborted."));
    }

    const detectedPm = detectPackageManager();
    const defaultCss = fs.existsSync("src/app/globals.css")
      ? "src/app/globals.css"
      : fs.existsSync("app/globals.css")
      ? "app/globals.css"
      : fs.existsSync("src")
      ? "src/index.css"
      : "styles/globals.css";

    let answers: { packageManager: string; cssPath: string; componentsAlias: string; utilsAlias: string };
    if (opts.yes) {
      answers = {
        packageManager: opts.pm || detectedPm,
        cssPath: opts.css || defaultCss,
        componentsAlias: opts.components,
        utilsAlias: opts.utils,
      };
    } else {
      const a = await prompts([
        { type: "select", name: "packageManager", message: "Package manager?",
          choices: ["pnpm", "npm", "yarn", "bun"].map((v) => ({ title: v, value: v })),
          initial: Math.max(0, ["pnpm", "npm", "yarn", "bun"].indexOf(opts.pm || detectedPm)) },
        { type: "text", name: "cssPath", message: "Global CSS file?", initial: opts.css || defaultCss },
        { type: "text", name: "componentsAlias", message: "Components import alias?", initial: opts.components },
        { type: "text", name: "utilsAlias", message: "cn helper import alias?", initial: opts.utils },
      ]);
      if (!a.packageManager || !a.cssPath || !a.componentsAlias || !a.utilsAlias) {
        return console.log(pc.red("❌ Cancelled — missing inputs."));
      }
      answers = a;
    }

    const config: Config = {
      style: "default",
      tailwind: { css: answers.cssPath },
      aliases: { components: answers.componentsAlias, utils: answers.utilsAlias },
      packageManager: answers.packageManager as Config["packageManager"],
    };
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), "utf-8");
    console.log(pc.green(`✔ Wrote ${pc.bold(CONFIG_FILE)}`));

    // cn helper
    const targetUtilsPath = path.join(process.cwd(), aliasToDir(answers.utilsAlias) + ".ts");
    if (!fs.existsSync(targetUtilsPath)) {
      ensureDirectoryExists(targetUtilsPath);
      fs.writeFileSync(targetUtilsPath,
        `import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n`, "utf-8");
      console.log(pc.green(`✔ Wrote cn helper → ${pc.bold(path.relative(process.cwd(), targetUtilsPath))}`));
    }

    // Tailwind v4 tokens
    if (opts.tokens) {
      const cssPath = path.join(process.cwd(), answers.cssPath);
      let css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, "utf-8") : "";
      const hasImport = /@import\s+["']tailwindcss|@tailwind\s+base/.test(css);
      const block = `${TOKENS_START}\n${LERPA_BASE_CSS}\n${TOKENS_END}`;
      if (css.includes(TOKENS_START)) {
        css = css.replace(new RegExp(escapeRegExp(TOKENS_START) + "[\\s\\S]*?" + escapeRegExp(TOKENS_END)), block);
      } else {
        css = (hasImport ? "" : '@import "tailwindcss";\n\n') + block + "\n\n" + css;
      }
      ensureDirectoryExists(cssPath);
      fs.writeFileSync(cssPath, css, "utf-8");
      console.log(pc.green(`✔ Wrote Tailwind v4 tokens → ${pc.bold(answers.cssPath)}`));
    } else {
      console.log(pc.yellow("• Skipped CSS tokens (--no-tokens). Components may render unstyled."));
    }

    console.log(pc.cyan(`\n🎉 Ready. Try ${pc.bold("lerpa add button")} (or ${pc.bold("lerpa theme ocean")}).\n`));
  });

// ADD ---------------------------------------------------------------------
program
  .command("add <name>")
  .description("Add a component/block and its dependencies into your project")
  .option("-y, --yes", "Skip confirmation prompts", false)
  .action(async (name, options) => {
    const config = getConfig();
    if (!config) {
      console.error(pc.red("❌ Not initialized. Run 'lerpa init' first."));
      process.exit(1);
    }
    const registry = loadRegistry();
    const root = registry.find((x) => x.name === name);
    if (!root) {
      console.error(pc.red(`❌ "${name}" not found in registry.`));
      process.exit(1);
    }

    // Resolve the full set in-process: files + npm deps across all
    // registryDependencies, deduped. No child processes, no per-dep installs.
    const seen = new Set<string>();
    const npmDeps = new Set<string>();
    const files: Array<{ owner: string; file: { path: string; content: string; type?: string } }> = [];
    const resolve = (n: string) => {
      if (seen.has(n)) return;
      seen.add(n);
      const it = registry.find((x) => x.name === n);
      if (!it) { console.warn(pc.yellow(`⚠️  registry dependency "${n}" missing — skipped.`)); return; }
      (it.dependencies || []).forEach((d: string) => npmDeps.add(d));
      (it.files || []).forEach((f: { path: string; content: string; type?: string }) => files.push({ owner: it.name, file: f }));
      (it.registryDependencies || []).forEach((rd: string) => resolve(rd));
    };
    resolve(name);

    const extra = [...seen].filter((n) => n !== name);
    console.log(pc.cyan(`\n📦 ${pc.bold(name)} [${root.type}] — ${files.length} file(s)${extra.length ? `, ${extra.length} registry dep(s): ${extra.join(", ")}` : ""}`));

    if (!options.yes) {
      const c = await prompts({ type: "confirm", name: "value", message: `Install into your project?`, initial: true });
      if (!c.value) return console.log(pc.yellow("Cancelled."));
    }

    // One batched npm install for ALL collected deps — errors surfaced.
    if (npmDeps.size) {
      const deps = [...npmDeps];
      const spinner = ora(`Installing ${deps.length} npm dep(s): ${deps.join(", ")}`).start();
      try {
        child_process.execSync(getInstallCommand(config.packageManager, deps), { stdio: "pipe" });
        spinner.succeed(pc.green(`Installed ${deps.length} dependency(ies) via ${config.packageManager}`));
      } catch (e) {
        spinner.fail(pc.red("npm dependency install failed:"));
        console.error(pc.gray((e as { stderr?: Buffer; message?: string }).stderr?.toString() || (e as Error).message));
        process.exit(1);
      }
    }

    const compBase = aliasToDir(config.aliases.components);
    let wrote = 0;
    const writtenPaths = new Set<string>();
    for (const { file } of files) {
      const fileBase = path.basename(file.path);
      const isUi = file.path.includes("components/ui/");
      const isBlock = file.path.includes("components/blocks/");
      const rel = isUi ? path.join(compBase, "ui", fileBase)
        : isBlock ? path.join(compBase, "blocks", fileBase)
        : path.join(compBase, fileBase);
      if (writtenPaths.has(rel)) continue; // shared file (e.g. hooks) already written
      writtenPaths.add(rel);

      let content = file.content;
      if (config.aliases.utils !== "@/lib/utils") content = content.replaceAll("@/lib/utils", config.aliases.utils);
      if (config.aliases.components !== "@/components") content = content.replaceAll("@/components", config.aliases.components);

      const targetPath = path.join(process.cwd(), rel);
      if (fs.existsSync(targetPath)) {
        if (fs.readFileSync(targetPath, "utf-8") === content) continue; // identical, skip silently
        if (!options.yes) {
          const ow = await prompts({ type: "confirm", name: "value", message: `Overwrite ${pc.bold(rel)}?`, initial: true });
          if (!ow.value) { console.log(pc.yellow(`Skipped ${rel}`)); continue; }
        }
        backupFile(targetPath);
      }
      ensureDirectoryExists(targetPath);
      fs.writeFileSync(targetPath, content, "utf-8");
      console.log(pc.green(`✔ ${rel}`));
      wrote++;
    }

    console.log(pc.green(`\n🎉 Added ${pc.bold(name)} (${wrote} file(s) written).\n`));
  });

// LIST --------------------------------------------------------------------
program
  .command("list")
  .description("List all registry components and blocks")
  .option("--json", "Output as JSON", false)
  .action((opts) => {
    const registry = loadRegistry();
    if (opts.json) { console.log(JSON.stringify(registry.map((x) => ({ name: x.name, type: x.type })), null, 2)); return; }
    const uis = registry.filter((x) => x.type === "registry:ui");
    const blocks = registry.filter((x) => x.type === "registry:block");
    console.log(pc.cyan(`\n✨ UI components (${uis.length}):`));
    uis.forEach((x) => console.log(`  - ${pc.green(x.name)}`));
    console.log(pc.cyan(`\n✨ Blocks (${blocks.length}):`));
    blocks.forEach((x) => console.log(`  - ${pc.blue(x.name)}${x.registryDependencies ? pc.gray(` [needs: ${x.registryDependencies.join(", ")}]`) : ""}`));
    console.log("");
  });

// SEARCH ------------------------------------------------------------------
program
  .command("search [query]")
  .description("Search the registry by name")
  .action((query) => {
    const registry = loadRegistry();
    const matches = registry.filter((x) => !query || x.name.toLowerCase().includes(query.toLowerCase()));
    console.log(pc.cyan(`\n🔍 ${matches.length} match(es):`));
    matches.forEach((x) => console.log(`  [${x.type === "registry:ui" ? pc.green("UI") : pc.blue("Block")}] ${x.name}`));
    console.log("");
  });

// THEME -------------------------------------------------------------------
program
  .command("theme [name]")
  .description(`Apply a color theme (replaces the managed block). Presets: ${Object.keys(THEME_PRESETS).join(", ")}`)
  .option("-y, --yes", "Non-interactive", false)
  .action(async (name, opts) => {
    const config = getConfig();
    if (!config) { console.error(pc.red("❌ Run 'lerpa init' first.")); process.exit(1); }
    const cssPath = path.join(process.cwd(), config.tailwind.css);
    if (!fs.existsSync(cssPath)) { console.error(pc.red(`❌ CSS file not found: ${config.tailwind.css}`)); process.exit(1); }

    let theme = name;
    if (!theme && !opts.yes) {
      const r = await prompts({ type: "select", name: "theme", message: "Theme?", choices: Object.keys(THEME_PRESETS).map((v) => ({ title: v, value: v })) });
      theme = r.theme;
    }
    if (!theme) return;
    if (!THEME_PRESETS[theme]) { console.error(pc.red(`❌ Unknown theme "${theme}". Options: ${Object.keys(THEME_PRESETS).join(", ")}`)); process.exit(1); }

    let css = fs.readFileSync(cssPath, "utf-8");
    const block = `${THEME_START}\n:root {\n${THEME_PRESETS[theme]}\n}\n${THEME_END}`;
    if (css.includes(THEME_START)) {
      css = css.replace(new RegExp(escapeRegExp(THEME_START) + "[\\s\\S]*?" + escapeRegExp(THEME_END)), block);
      console.log(pc.gray("• Replaced existing theme block."));
    } else {
      css = css.trimEnd() + "\n\n" + block + "\n";
    }
    fs.writeFileSync(cssPath, css, "utf-8");
    console.log(pc.green(`\n✔ Applied theme "${pc.bold(theme)}" → ${config.tailwind.css}\n`));
  });

// DOCTOR ------------------------------------------------------------------
program
  .command("doctor")
  .description("Validate workspace configuration")
  .action(() => {
    console.log(pc.cyan("\n👨‍⚕️ Lerpa doctor\n"));
    const config = getConfig();
    if (!config) { console.error(pc.red("❌ No lerpa.json. Run 'lerpa init'.")); process.exit(1); }
    console.log(`[PASS] lerpa.json — pm: ${config.packageManager}, css: ${config.tailwind.css}`);
    const cssPath = path.join(process.cwd(), config.tailwind.css);
    console.log(fs.existsSync(cssPath) ? `[PASS] CSS file exists.` : `[WARN] CSS file missing: ${config.tailwind.css}`);
    const tokensOk = fs.existsSync(cssPath) && fs.readFileSync(cssPath, "utf-8").includes(TOKENS_START);
    console.log(tokensOk ? `[PASS] Tailwind v4 tokens present.` : `[WARN] Tokens missing — run 'lerpa init' (components may be unstyled).`);
    console.log(pc.green(`\n✔ Done.\n`));
  });

// INFO --------------------------------------------------------------------
program
  .command("info")
  .description("Show CLI + project metadata")
  .action(() => {
    console.log(pc.cyan("\n🔥 Lerpa UI CLI"));
    console.log(`   Version    : ${pc.bold(VERSION)}`);
    console.log(`   License    : MIT`);
    console.log(`   Repository : https://github.com/cuibit-labs/lerpaui`);
    console.log(`   Docs       : https://lerpaui.com`);
    const config = getConfig();
    if (config) {
      console.log(pc.green("\n✔ Project config:"));
      console.log(`   components : ${config.aliases.components}`);
      console.log(`   utils      : ${config.aliases.utils}`);
      console.log(`   css        : ${config.tailwind.css}`);
      console.log(`   pm         : ${config.packageManager}`);
    }
    console.log("");
  });

program.parse(process.argv);
