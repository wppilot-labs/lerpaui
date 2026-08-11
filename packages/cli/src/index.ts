#!/usr/bin/env node

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';
import pc from 'picocolors';
import ora from 'ora';
import execa from 'execa';

const program = new Command();
const CONFIG_FILE = 'lerpa.json';
// Read the version from package.json at runtime so it can never drift from
// the published version (dist/index.js sits one level below the package root).
const VERSION: string = (() => {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
    ) as { version?: string };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
})();

const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const;
type PackageManager = (typeof PACKAGE_MANAGERS)[number];

interface Config {
  style: string;
  tailwind: { css: string };
  aliases: { components: string; utils: string };
  packageManager: PackageManager;
}

interface RegistryFile {
  path: string;
  content: string;
  type?: string;
}

interface RegistryItem {
  name: string;
  type: 'registry:ui' | 'registry:block';
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryFile[];
}

// ---------------------------------------------------------------------------
// Tailwind v4 token scaffold. Lerpa components use both the Lerpa tokens
// (bg-bg, text-text, text-accent) and shadcn-compat utilities (bg-primary,
// text-foreground, border-input). In Tailwind v4 these only generate if the
// --color-* are declared via @theme. Without this block a fresh install
// renders unstyled — the #1 onboarding gap. init writes it into globals CSS.
// ---------------------------------------------------------------------------
const TOKENS_START = '/* lerpa-ui:tokens:start (managed by lerpa-cli — edit values in :root) */';
const TOKENS_END = '/* lerpa-ui:tokens:end */';

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

  /* shadcn-compatible aliases — point at Lerpa tokens */
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

html {
  position: relative;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
}`;

// Theme presets = oklch overrides for the base tokens. Applied as a managed
// :root block (replaced, never appended) so re-running theme can't duplicate.
const THEME_START = '/* lerpa-ui:theme:start (managed by lerpa-cli) */';
const THEME_END = '/* lerpa-ui:theme:end */';

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
    path.join(__dirname, '../registry/registry.json'),
    path.join(process.cwd(), 'packages/registry/generated/registry.json'),
    path.join(__dirname, '../../../registry/generated/registry.json'),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

function fatal(message: string): never {
  console.error(pc.red(`❌ ${message}`));
  process.exit(1);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function loadRegistry(): RegistryItem[] {
  const localPath = getLocalRegistryPath();
  if (localPath) {
    try {
      const parsed: unknown = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
      if (!Array.isArray(parsed)) throw new Error('root value must be an array');
      for (const [index, item] of parsed.entries()) {
        if (
          !isRecord(item) ||
          typeof item.name !== 'string' ||
          (item.type !== 'registry:ui' && item.type !== 'registry:block') ||
          !Array.isArray(item.files)
        ) {
          throw new Error(`invalid item at index ${index}`);
        }
      }
      return parsed as RegistryItem[];
    } catch (error) {
      fatal(
        `Failed to read registry at ${localPath}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
  return fatal('Registry not found. Reinstall lerpa-cli or run the registry build.');
}

function getConfig(): Config | null {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  if (!fs.existsSync(configPath)) return null;
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (!isRecord(parsed)) throw new Error('root value must be an object');
    const tailwind = parsed.tailwind;
    const aliases = parsed.aliases;
    if (
      typeof parsed.style !== 'string' ||
      !isRecord(tailwind) ||
      typeof tailwind.css !== 'string' ||
      !tailwind.css.trim() ||
      !isRecord(aliases) ||
      typeof aliases.components !== 'string' ||
      !aliases.components.trim() ||
      typeof aliases.utils !== 'string' ||
      !aliases.utils.trim() ||
      !PACKAGE_MANAGERS.includes(parsed.packageManager as PackageManager)
    ) {
      throw new Error('missing or invalid style, tailwind.css, aliases, or packageManager');
    }
    return parsed as unknown as Config;
  } catch (error) {
    throw new Error(
      `Invalid ${CONFIG_FILE}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function requireConfig(): Config {
  try {
    return getConfig() ?? fatal(`Not initialized. Run 'lerpa init' first.`);
  } catch (error) {
    return fatal(error instanceof Error ? error.message : String(error));
  }
}

function detectPackageManager(): PackageManager {
  const cwd = process.cwd();
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock'))) return 'yarn';
  if (fs.existsSync(path.join(cwd, 'bun.lockb'))) return 'bun';
  return 'npm';
}

function getInstallInvocation(pm: PackageManager, deps: string[]) {
  const safePackage = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/;
  const invalid = deps.find((dependency) => !safePackage.test(dependency));
  if (invalid) throw new Error(`Unsafe npm dependency name: ${invalid}`);
  return {
    command: pm,
    args: pm === 'npm' ? ['install', ...deps] : ['add', ...deps],
  };
}

function installDependencies(pm: PackageManager, deps: string[]): void {
  if (!deps.length) return;
  const invocation = getInstallInvocation(pm, deps);
  execa.sync(invocation.command, invocation.args, {
    cwd: process.cwd(),
    stdio: 'pipe',
    preferLocal: true,
  });
}

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function backupFile(targetPath: string) {
  if (fs.existsSync(targetPath)) {
    let backupPath = `${targetPath}.bak`;
    let suffix = 1;
    while (fs.existsSync(backupPath)) {
      backupPath = `${targetPath}.bak.${suffix++}`;
    }
    fs.copyFileSync(targetPath, backupPath);
    console.log(pc.gray(`📁 Backup: ${backupPath}`));
  }
}

function resolveInsideProject(relativePath: string, label: string): string {
  if (!relativePath.trim() || path.isAbsolute(relativePath)) {
    throw new Error(`${label} must be a non-empty relative path`);
  }
  const root = path.resolve(process.cwd());
  const resolved = path.resolve(root, relativePath);
  const rel = path.relative(root, resolved);
  if (rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    throw new Error(`${label} resolves outside the project: ${relativePath}`);
  }
  return resolved;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Strip // and /* */ comments so tsconfig.json (which allows them) parses.
function parseJsonc(text: string): unknown {
  const stripped = text
    .replace(/^\uFEFF/, '')
    .replace(/\\"|"(?:\\"|[^"])*"|(\/\/[^\n\r]*|\/\*[\s\S]*?\*\/)/g, (m, c) => (c ? '' : m))
    .replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(stripped);
}

function readTsconfigPaths(): Record<string, string[]> | null {
  for (const f of ['tsconfig.json', 'jsconfig.json']) {
    const p = path.join(process.cwd(), f);
    if (!fs.existsSync(p)) continue;
    try {
      const json = parseJsonc(fs.readFileSync(p, 'utf-8')) as {
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
  const segments = alias.replace(/\\/g, '/').split('/');
  if (!alias.trim() || path.isAbsolute(alias) || segments.includes('..')) {
    throw new Error(`Import alias must resolve inside the project: ${alias}`);
  }
  const paths = readTsconfigPaths();
  if (paths) {
    for (const [key, targets] of Object.entries(paths)) {
      const keyPrefix = key.replace(/\*$/, '');
      if (alias.startsWith(keyPrefix) && targets?.length) {
        const target = targets[0].replace(/\*$/, '').replace(/^\.\//, '');
        return path.normalize(path.join(target, alias.slice(keyPrefix.length)));
      }
    }
  }
  let rel = alias.replace(/^[@~]\//, '');
  if (
    fs.existsSync(path.join(process.cwd(), 'src')) &&
    !rel.startsWith('src' + path.sep) &&
    !rel.startsWith('src/')
  ) {
    rel = path.join('src', rel);
  }
  return path.normalize(rel);
}

function parseTypeFilter(value: string | undefined): 'registry:ui' | 'registry:block' | null {
  if (!value || value === 'all') return null;
  if (value === 'ui' || value === 'component') return 'registry:ui';
  if (value === 'block') return 'registry:block';
  return fatal(`Unknown type "${value}". Use all, ui, or block.`);
}

function parseLimit(value: string | undefined, fallback: number, max: number): number {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > max) {
    return fatal(`Limit must be an integer between 1 and ${max}.`);
  }
  return parsed;
}

// ---------------------------------------------------------------------------
program
  .name('lerpa')
  .description('Lerpa UI registry CLI — copy-paste animated React components & blocks')
  .version(VERSION);

// INIT --------------------------------------------------------------------
program
  .command('init')
  .description('Initialize Lerpa UI: writes config, the cn helper, and Tailwind v4 tokens')
  .option('-y, --yes', 'Non-interactive: accept detected/flagged defaults (CI-friendly)', false)
  .option('--css <path>', 'Path to your global CSS file')
  .option('--components <alias>', 'Import alias for components', '@/components')
  .option('--utils <alias>', 'Import alias for the cn helper', '@/lib/utils')
  .option('--pm <manager>', 'Package manager (npm|pnpm|yarn|bun)')
  .option('--no-tokens', 'Skip writing the Tailwind v4 token block into your CSS')
  .option('--no-install', 'Skip installing clsx and tailwind-merge')
  .option('--force', 'Replace an existing lerpa.json after creating a backup', false)
  .action(async (opts) => {
    console.log(pc.cyan('\n🚀 Lerpa UI init\n'));

    const configPath = path.join(process.cwd(), CONFIG_FILE);
    if (opts.pm && !PACKAGE_MANAGERS.includes(opts.pm as PackageManager)) {
      fatal(`Unknown package manager "${opts.pm}". Use ${PACKAGE_MANAGERS.join(', ')}.`);
    }

    if (fs.existsSync(configPath) && !opts.force) {
      if (opts.yes) {
        fatal(`${CONFIG_FILE} already exists. Re-run with --force to replace it.`);
      }
      const ow = await prompts({
        type: 'confirm',
        name: 'value',
        message: `${CONFIG_FILE} exists. Overwrite with a backup?`,
        initial: false,
      });
      if (!ow.value) return console.log(pc.yellow('Aborted.'));
    }

    const detectedPm = detectPackageManager();
    const defaultCss = fs.existsSync('src/app/globals.css')
      ? 'src/app/globals.css'
      : fs.existsSync('app/globals.css')
        ? 'app/globals.css'
        : fs.existsSync('src')
          ? 'src/index.css'
          : 'styles/globals.css';

    let answers: {
      packageManager: PackageManager;
      cssPath: string;
      componentsAlias: string;
      utilsAlias: string;
    };
    if (opts.yes) {
      answers = {
        packageManager: (opts.pm || detectedPm) as PackageManager,
        cssPath: opts.css || defaultCss,
        componentsAlias: opts.components,
        utilsAlias: opts.utils,
      };
    } else {
      const a = await prompts([
        {
          type: 'select',
          name: 'packageManager',
          message: 'Package manager?',
          choices: ['pnpm', 'npm', 'yarn', 'bun'].map((v) => ({ title: v, value: v })),
          initial: Math.max(0, ['pnpm', 'npm', 'yarn', 'bun'].indexOf(opts.pm || detectedPm)),
        },
        {
          type: 'text',
          name: 'cssPath',
          message: 'Global CSS file?',
          initial: opts.css || defaultCss,
        },
        {
          type: 'text',
          name: 'componentsAlias',
          message: 'Components import alias?',
          initial: opts.components,
        },
        {
          type: 'text',
          name: 'utilsAlias',
          message: 'cn helper import alias?',
          initial: opts.utils,
        },
      ]);
      if (!a.packageManager || !a.cssPath || !a.componentsAlias || !a.utilsAlias) {
        return console.log(pc.red('❌ Cancelled — missing inputs.'));
      }
      answers = a as typeof answers;
    }

    if (!PACKAGE_MANAGERS.includes(answers.packageManager)) {
      fatal(`Unknown package manager "${answers.packageManager}".`);
    }

    let targetUtilsPath: string;
    let cssPath: string;
    try {
      targetUtilsPath = resolveInsideProject(`${aliasToDir(answers.utilsAlias)}.ts`, 'Utils alias');
      cssPath = resolveInsideProject(answers.cssPath, 'Global CSS path');
    } catch (error) {
      fatal(error instanceof Error ? error.message : String(error));
    }

    const config: Config = {
      style: 'default',
      tailwind: { css: answers.cssPath },
      aliases: { components: answers.componentsAlias, utils: answers.utilsAlias },
      packageManager: answers.packageManager,
    };
    if (fs.existsSync(configPath)) backupFile(configPath);
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
    console.log(pc.green(`✔ Wrote ${pc.bold(CONFIG_FILE)}`));

    // cn helper
    if (!fs.existsSync(targetUtilsPath)) {
      ensureDirectoryExists(targetUtilsPath);
      fs.writeFileSync(
        targetUtilsPath,
        `import { clsx, type ClassValue } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}\n`,
        'utf-8'
      );
      console.log(
        pc.green(`✔ Wrote cn helper → ${pc.bold(path.relative(process.cwd(), targetUtilsPath))}`)
      );
    }

    // Tailwind v4 tokens
    if (opts.tokens) {
      let css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf-8') : '';
      const hasImport = /@import\s+["']tailwindcss|@tailwind\s+base/.test(css);
      const block = `${TOKENS_START}\n${LERPA_BASE_CSS}\n${TOKENS_END}`;
      if (css.includes(TOKENS_START)) {
        css = css.replace(
          new RegExp(escapeRegExp(TOKENS_START) + '[\\s\\S]*?' + escapeRegExp(TOKENS_END)),
          block
        );
      } else {
        css = (hasImport ? '' : '@import "tailwindcss";\n\n') + block + '\n\n' + css;
      }
      ensureDirectoryExists(cssPath);
      fs.writeFileSync(cssPath, css, 'utf-8');
      console.log(pc.green(`✔ Wrote Tailwind v4 tokens → ${pc.bold(answers.cssPath)}`));
    } else {
      console.log(pc.yellow('• Skipped CSS tokens (--no-tokens). Components may render unstyled.'));
    }

    if (opts.install) {
      const deps = ['clsx', 'tailwind-merge'];
      const spinner = ora(`Installing ${deps.join(' and ')}`).start();
      try {
        installDependencies(answers.packageManager, deps);
        spinner.succeed(pc.green(`Installed ${deps.join(' and ')} via ${answers.packageManager}`));
      } catch (error) {
        spinner.fail(pc.red('Required helper dependencies failed to install.'));
        fatal(error instanceof Error ? error.message : String(error));
      }
    } else {
      console.log(pc.yellow('• Skipped clsx and tailwind-merge installation (--no-install).'));
    }

    console.log(
      pc.cyan(
        `\n🎉 Ready. Try ${pc.bold('lerpa add button')} (or ${pc.bold('lerpa theme ocean')}).\n`
      )
    );
  });

// ADD ---------------------------------------------------------------------
program
  .command('add <names...>')
  .description('Add one or more components/blocks and their dependencies')
  .option('-y, --yes', 'Skip confirmation prompts', false)
  .option('--force', 'Overwrite changed files after creating backups', false)
  .option('--dry-run', 'Show files and dependencies without changing the project', false)
  .option('--no-install', 'Write source without installing npm dependencies')
  .action(async (names: string[], options) => {
    const config = requireConfig();
    const registry = loadRegistry();
    const byName = new Map(registry.map((item) => [item.name, item]));
    const requested = [...new Set(names)];
    const invalidName = requested.find((name) => !/^[a-z0-9-]+$/.test(name));
    if (invalidName) fatal(`Invalid component id "${invalidName}".`);
    const missing = requested.filter((name) => !byName.has(name));
    if (missing.length) fatal(`Not found in registry: ${missing.join(', ')}`);

    // Resolve the full set in-process: files + npm deps across all
    // registryDependencies, deduped. No child processes, no per-dep installs.
    const seen = new Set<string>();
    const npmDeps = new Set<string>(['clsx', 'tailwind-merge']);
    const files: Array<{ owner: string; file: RegistryFile }> = [];
    const resolve = (n: string) => {
      if (seen.has(n)) return;
      seen.add(n);
      const item = byName.get(n);
      if (!item) fatal(`Registry dependency "${n}" is missing.`);
      (item.dependencies || []).forEach((dependency) => npmDeps.add(dependency));
      (item.files || []).forEach((file) => files.push({ owner: item.name, file }));
      (item.registryDependencies || []).forEach((dependency) => resolve(dependency));
    };
    requested.forEach(resolve);

    const extra = [...seen].filter((name) => !requested.includes(name));
    console.log(
      pc.cyan(
        `\n📦 ${requested.map((name) => pc.bold(name)).join(', ')} — ${files.length} resolved file(s)` +
          `${extra.length ? `, ${extra.length} registry dep(s): ${extra.join(', ')}` : ''}`
      )
    );

    if (!options.yes && !options.dryRun) {
      const c = await prompts({
        type: 'confirm',
        name: 'value',
        message: `Install into your project?`,
        initial: true,
      });
      if (!c.value) return console.log(pc.yellow('Cancelled.'));
    }

    const compBase = aliasToDir(config.aliases.components);
    const planned = new Map<
      string,
      {
        owner: string;
        relativePath: string;
        targetPath: string;
        content: string;
        status: 'create' | 'unchanged' | 'overwrite';
      }
    >();
    for (const { owner, file } of files) {
      const fileBase = path.basename(file.path);
      const isUi = file.path.includes('components/ui/');
      const isBlock = file.path.includes('components/blocks/');
      const rel = isUi
        ? path.join(compBase, 'ui', fileBase)
        : isBlock
          ? path.join(compBase, 'blocks', fileBase)
          : path.join(compBase, fileBase);

      let content = file.content;
      if (config.aliases.utils !== '@/lib/utils')
        content = content.replaceAll('@/lib/utils', config.aliases.utils);
      if (config.aliases.components !== '@/components')
        content = content.replaceAll('@/components', config.aliases.components);

      let targetPath: string;
      try {
        targetPath = resolveInsideProject(rel, `Install path for ${owner}`);
      } catch (error) {
        fatal(error instanceof Error ? error.message : String(error));
      }
      const existing = planned.get(targetPath);
      if (existing) {
        if (existing.content !== content) {
          fatal(
            `Registry items ${existing.owner} and ${owner} resolve to conflicting file ${rel}.`
          );
        }
        continue;
      }
      const status = !fs.existsSync(targetPath)
        ? 'create'
        : fs.readFileSync(targetPath, 'utf-8') === content
          ? 'unchanged'
          : 'overwrite';
      planned.set(targetPath, { owner, relativePath: rel, targetPath, content, status });
    }

    const deps = [...npmDeps].sort();
    if (options.dryRun) {
      console.log(pc.cyan(`\nDependencies (${deps.length}): ${deps.join(', ')}`));
      for (const entry of planned.values()) {
        const color =
          entry.status === 'create' ? pc.green : entry.status === 'unchanged' ? pc.gray : pc.yellow;
        console.log(`  ${color(entry.status.toUpperCase().padEnd(9))} ${entry.relativePath}`);
      }
      console.log(pc.green(`\n✔ Dry run complete. No files or dependencies changed.\n`));
      return;
    }

    const approved: typeof planned extends Map<string, infer V> ? V[] : never = [];
    for (const entry of planned.values()) {
      if (entry.status === 'unchanged') continue;
      if (entry.status === 'overwrite' && !options.force) {
        if (options.yes) {
          fatal(
            `${entry.relativePath} has local changes. Re-run with --force to overwrite it with a backup.`
          );
        }
        const answer = await prompts({
          type: 'confirm',
          name: 'value',
          message: `Overwrite ${pc.bold(entry.relativePath)} with a backup?`,
          initial: false,
        });
        if (!answer.value) {
          console.log(pc.yellow(`Skipped ${entry.relativePath}`));
          continue;
        }
      }
      approved.push(entry);
    }

    if (options.install) {
      const spinner = ora(`Installing ${deps.length} npm dep(s): ${deps.join(', ')}`).start();
      try {
        installDependencies(config.packageManager, deps);
        spinner.succeed(
          pc.green(`Installed ${deps.length} dependency(ies) via ${config.packageManager}`)
        );
      } catch (error) {
        spinner.fail(pc.red('npm dependency install failed'));
        fatal(error instanceof Error ? error.message : String(error));
      }
    } else {
      console.log(pc.yellow('• Skipped npm dependency installation (--no-install).'));
    }

    for (const entry of approved) {
      if (entry.status === 'overwrite') backupFile(entry.targetPath);
      ensureDirectoryExists(entry.targetPath);
      fs.writeFileSync(entry.targetPath, entry.content, 'utf-8');
      console.log(pc.green(`✔ ${entry.relativePath}`));
    }

    const unchanged = [...planned.values()].filter((entry) => entry.status === 'unchanged').length;
    console.log(
      pc.green(
        `\n🎉 Added ${requested.map((name) => pc.bold(name)).join(', ')} ` +
          `(${approved.length} written, ${unchanged} unchanged).\n`
      )
    );
  });

// LIST --------------------------------------------------------------------
program
  .command('list')
  .description('List all registry components and blocks')
  .option('--json', 'Output as JSON', false)
  .option('--type <type>', 'Filter by all, ui, or block', 'all')
  .option('--limit <number>', 'Maximum results (default: all)')
  .action((opts) => {
    const registry = loadRegistry();
    const type = parseTypeFilter(opts.type);
    const limit = parseLimit(opts.limit, registry.length, registry.length);
    const filtered = registry.filter((item) => !type || item.type === type).slice(0, limit);
    if (opts.json) {
      console.log(
        JSON.stringify(
          filtered.map((item) => ({
            name: item.name,
            type: item.type,
            registryDependencies: item.registryDependencies ?? [],
          })),
          null,
          2
        )
      );
      return;
    }
    const uis = filtered.filter((item) => item.type === 'registry:ui');
    const blocks = filtered.filter((item) => item.type === 'registry:block');
    console.log(pc.cyan(`\n✨ UI components (${uis.length}):`));
    uis.forEach((x) => console.log(`  - ${pc.green(x.name)}`));
    console.log(pc.cyan(`\n✨ Blocks (${blocks.length}):`));
    blocks.forEach((x) =>
      console.log(
        `  - ${pc.blue(x.name)}${x.registryDependencies ? pc.gray(` [needs: ${x.registryDependencies.join(', ')}]`) : ''}`
      )
    );
    console.log('');
  });

// SEARCH ------------------------------------------------------------------
program
  .command('search [query]')
  .description('Search the registry by component or block name')
  .option('--json', 'Output as JSON', false)
  .option('--type <type>', 'Filter by all, ui, or block', 'all')
  .option('--limit <number>', 'Maximum results', '50')
  .action((query: string | undefined, opts) => {
    const registry = loadRegistry();
    const type = parseTypeFilter(opts.type);
    const limit = parseLimit(opts.limit, 50, 500);
    const normalized = query?.trim().toLowerCase();
    const matches = registry
      .filter(
        (item) =>
          (!type || item.type === type) &&
          (!normalized || item.name.toLowerCase().includes(normalized))
      )
      .slice(0, limit);
    if (opts.json) {
      console.log(
        JSON.stringify(
          matches.map((item) => ({ name: item.name, type: item.type })),
          null,
          2
        )
      );
      return;
    }
    console.log(pc.cyan(`\n🔍 ${matches.length} match(es):`));
    matches.forEach((x) =>
      console.log(`  [${x.type === 'registry:ui' ? pc.green('UI') : pc.blue('Block')}] ${x.name}`)
    );
    console.log('');
  });

// THEME -------------------------------------------------------------------
program
  .command('theme [name]')
  .alias('set')
  .description(
    `Apply a color theme (replaces the managed block). Presets: ${Object.keys(THEME_PRESETS).join(', ')}`
  )
  .option('-y, --yes', 'Non-interactive', false)
  .action(async (name, opts) => {
    const config = requireConfig();
    let cssPath: string;
    try {
      cssPath = resolveInsideProject(config.tailwind.css, 'Global CSS path');
    } catch (error) {
      fatal(error instanceof Error ? error.message : String(error));
    }
    if (!fs.existsSync(cssPath)) {
      console.error(pc.red(`❌ CSS file not found: ${config.tailwind.css}`));
      process.exit(1);
    }

    let theme = name;
    if (!theme && !opts.yes) {
      const r = await prompts({
        type: 'select',
        name: 'theme',
        message: 'Theme?',
        choices: Object.keys(THEME_PRESETS).map((v) => ({ title: v, value: v })),
      });
      theme = r.theme;
    }
    if (!theme) return;
    if (!THEME_PRESETS[theme]) {
      console.error(
        pc.red(`❌ Unknown theme "${theme}". Options: ${Object.keys(THEME_PRESETS).join(', ')}`)
      );
      process.exit(1);
    }

    let css = fs.readFileSync(cssPath, 'utf-8');
    const block = `${THEME_START}\n:root {\n${THEME_PRESETS[theme]}\n}\n${THEME_END}`;
    if (css.includes(THEME_START)) {
      css = css.replace(
        new RegExp(escapeRegExp(THEME_START) + '[\\s\\S]*?' + escapeRegExp(THEME_END)),
        block
      );
      console.log(pc.gray('• Replaced existing theme block.'));
    } else {
      css = css.trimEnd() + '\n\n' + block + '\n';
    }
    fs.writeFileSync(cssPath, css, 'utf-8');
    console.log(pc.green(`\n✔ Applied theme "${pc.bold(theme)}" → ${config.tailwind.css}\n`));
  });

// DOCTOR ------------------------------------------------------------------
program
  .command('doctor')
  .description('Validate workspace configuration')
  .option('--strict', 'Exit non-zero for warnings (recommended in CI)', false)
  .option('--json', 'Output machine-readable results', false)
  .action((opts) => {
    type Check = { status: 'pass' | 'warn' | 'fail'; check: string; message: string };
    const checks: Check[] = [];
    const add = (status: Check['status'], check: string, message: string) =>
      checks.push({ status, check, message });

    let config: Config | null = null;
    try {
      config = getConfig();
      if (!config) add('fail', 'config', `No ${CONFIG_FILE}. Run 'lerpa init'.`);
      else add('pass', 'config', `${CONFIG_FILE} is valid (${config.packageManager}).`);
    } catch (error) {
      add('fail', 'config', error instanceof Error ? error.message : String(error));
    }

    if (config) {
      try {
        const cssPath = resolveInsideProject(config.tailwind.css, 'Global CSS path');
        if (!fs.existsSync(cssPath)) {
          add('warn', 'css', `CSS file is missing: ${config.tailwind.css}`);
        } else {
          add('pass', 'css', `CSS file exists: ${config.tailwind.css}`);
          const css = fs.readFileSync(cssPath, 'utf-8');
          add(
            css.includes(TOKENS_START) && css.includes(TOKENS_END) ? 'pass' : 'warn',
            'tokens',
            css.includes(TOKENS_START) && css.includes(TOKENS_END)
              ? 'Managed Tailwind v4 tokens are present.'
              : 'Managed tokens are missing; run `lerpa init --force` or add them manually.'
          );
        }
      } catch (error) {
        add('fail', 'css', error instanceof Error ? error.message : String(error));
      }

      try {
        const utilsPath = resolveInsideProject(
          `${aliasToDir(config.aliases.utils)}.ts`,
          'Utils alias'
        );
        add(
          fs.existsSync(utilsPath) ? 'pass' : 'warn',
          'utils',
          fs.existsSync(utilsPath)
            ? `cn helper exists: ${path.relative(process.cwd(), utilsPath)}`
            : `cn helper is missing: ${path.relative(process.cwd(), utilsPath)}`
        );
      } catch (error) {
        add('fail', 'utils', error instanceof Error ? error.message : String(error));
      }

      try {
        const componentsPath = resolveInsideProject(
          aliasToDir(config.aliases.components),
          'Components alias'
        );
        add(
          'pass',
          'components',
          `Components resolve inside the project: ${path.relative(process.cwd(), componentsPath)}`
        );
      } catch (error) {
        add('fail', 'components', error instanceof Error ? error.message : String(error));
      }

      const packagePath = path.join(process.cwd(), 'package.json');
      if (!fs.existsSync(packagePath)) {
        add('warn', 'dependencies', 'package.json is missing; dependencies cannot be verified.');
      } else {
        try {
          const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8')) as {
            dependencies?: Record<string, string>;
            devDependencies?: Record<string, string>;
          };
          const declared = { ...packageJson.devDependencies, ...packageJson.dependencies };
          const missing = ['clsx', 'tailwind-merge'].filter((name) => !declared[name]);
          add(
            missing.length ? 'warn' : 'pass',
            'dependencies',
            missing.length
              ? `Missing helper dependencies: ${missing.join(', ')}`
              : 'Required helper dependencies are declared.'
          );
        } catch (error) {
          add('fail', 'dependencies', `Invalid package.json: ${String(error)}`);
        }
      }
    }

    const hasFail = checks.some((check) => check.status === 'fail');
    const hasWarn = checks.some((check) => check.status === 'warn');
    const ok = !hasFail && (!opts.strict || !hasWarn);
    if (opts.json) {
      console.log(JSON.stringify({ ok, strict: Boolean(opts.strict), checks }, null, 2));
    } else {
      console.log(pc.cyan('\n🩺 Lerpa doctor\n'));
      for (const check of checks) {
        const label = check.status.toUpperCase().padEnd(4);
        const paint =
          check.status === 'pass' ? pc.green : check.status === 'warn' ? pc.yellow : pc.red;
        console.log(`${paint(`[${label}]`)} ${check.message}`);
      }
      console.log(
        ok ? pc.green('\n✔ Workspace is ready.\n') : pc.red('\n✖ Workspace needs attention.\n')
      );
    }
    if (!ok) process.exitCode = 1;
  });

// INFO --------------------------------------------------------------------
program
  .command('info')
  .description('Show CLI + project metadata')
  .action(() => {
    console.log(pc.cyan('\n🔥 Lerpa UI CLI'));
    console.log(`   Version    : ${pc.bold(VERSION)}`);
    console.log(`   License    : MIT`);
    console.log(`   Repository : https://github.com/wppilot-labs/lerpaui`);
    console.log(`   Docs       : https://lerpaui.com`);
    let config: Config | null = null;
    try {
      config = getConfig();
    } catch (error) {
      console.log(pc.yellow(`\n⚠ ${error instanceof Error ? error.message : String(error)}`));
    }
    if (config) {
      console.log(pc.green('\n✔ Project config:'));
      console.log(`   components : ${config.aliases.components}`);
      console.log(`   utils      : ${config.aliases.utils}`);
      console.log(`   css        : ${config.tailwind.css}`);
      console.log(`   pm         : ${config.packageManager}`);
    }
    console.log('');
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(pc.red(`❌ ${error instanceof Error ? error.message : String(error)}`));
  process.exitCode = 1;
});
