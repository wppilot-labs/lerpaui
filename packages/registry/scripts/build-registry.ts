import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';

const PACKAGE_ROOT = path.join(__dirname, '..');
const ITEMS_DIR = path.join(PACKAGE_ROOT, 'items');
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'skills');
const MANIFEST_FILE = path.join(PACKAGE_ROOT, 'registry.json');
const OUTPUT_DIR = path.join(PACKAGE_ROOT, 'generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'registry.json');
const MANIFEST_OUTPUT = path.join(OUTPUT_DIR, 'manifest.json');
const SKILLS_OUTPUT_DIR = path.join(OUTPUT_DIR, 'skills');
const UI_SOURCE_DIRS = [
  path.join(PACKAGE_ROOT, '..', 'ui', 'src', 'blocks'),
  path.join(PACKAGE_ROOT, '..', 'ui', 'src', 'components'),
];
const VERBOSE = process.argv.includes('--verbose');

// Normalize an install file path's basename to kebab-case so the filename
// matches the (kebab) registry name and the already-kebab sibling imports.
// Fixes case-sensitive (Linux) module resolution. A content scan confirmed
// zero PascalCase relative sibling imports, so no import rewriting is needed.
function kebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function kebabPath(p: string): string {
  const slash = p.lastIndexOf('/');
  const dir = slash >= 0 ? p.slice(0, slash + 1) : '';
  const file = slash >= 0 ? p.slice(slash + 1) : p;
  const dot = file.lastIndexOf('.');
  const base = dot >= 0 ? file.slice(0, dot) : file;
  const ext = dot >= 0 ? file.slice(dot) : '';
  return dir + kebab(base) + ext;
}

function stripBom(src: string): string {
  return src.replace(/^\uFEFF/, '');
}

/**
 * The authored React source is canonical whenever a registry file has a
 * matching file in packages/ui. Registry JSON still owns install metadata and
 * standalone items, while this synchronization prevents fixes in packages/ui
 * from silently missing the CLI/MCP bundles.
 */
function buildUiSourceIndex(): Map<string, string[]> {
  const index = new Map<string, string[]>();
  for (const dir of UI_SOURCE_DIRS) {
    if (!fs.existsSync(dir)) continue;
    for (const file of fs
      .readdirSync(dir)
      .filter((name) => /\.tsx?$/.test(name) && !name.includes('.test.'))
      .sort()) {
      const ext = path.extname(file);
      const base = file.slice(0, -ext.length);
      const sourcePath = path.join(dir, file);
      for (const key of [file.toLowerCase(), `${kebab(base)}${ext}`]) {
        const matches = index.get(key) ?? [];
        matches.push(sourcePath);
        index.set(key, matches);
      }
    }
  }
  return index;
}

const UI_SOURCE_INDEX = buildUiSourceIndex();

function findUiSource(registryPath: string): string | null {
  const matches = UI_SOURCE_INDEX.get(path.posix.basename(registryPath).toLowerCase());
  if (!matches?.length) return null;
  const preferredDir = registryPath.includes('/blocks/') ? 'blocks' : 'components';
  return (
    matches.find((candidate) => candidate.includes(`${path.sep}${preferredDir}${path.sep}`)) ??
    matches[0]
  );
}

function transformUiSource(src: string): string {
  return stripBom(src)
    .replace(/from\s+(['"])\.\.\/lib\/cn\1/g, 'from "@/lib/utils"')
    .replace(/from\s+(['"])\.\.\/animation\/hooks\1/g, 'from "./use-animation-hooks"')
    .replace(
      /from\s+(['"])\.\/([A-Z][A-Za-z0-9]*)\1/g,
      (_full, quote: string, name: string) => `from ${quote}./${kebab(name)}${quote}`
    );
}

interface RegFile {
  path: string;
  type?: string;
  content?: string;
}
interface RegItem {
  name: string;
  type: string;
  files?: RegFile[];
  registryDependencies?: string[];
  dependencies?: string[];
}

// Bundled block-local helpers reference cn via the relative source path; rewrite
// to the shadcn alias so they resolve once copied into the consumer project.
function transformHelperContent(src: string): string {
  // The registry convention (and what `lerpa init` scaffolds + the CLI rewrites)
  // is @/lib/utils — NOT @/lib/cn. Map the helper's source cn import to it.
  return stripBom(src).replace(/from\s+(['"])\.\.?\/lib\/cn\1/g, 'from "@/lib/utils"');
}

// Make every item compile on install:
//  A. `../components/<Pascal>` / `./<Pascal>` references a block-local primitive
//     in packages/ui/src/components — bundle it (transitively) into files[] at
//     components/<dir>/<kebab>.tsx and rewrite the import to ./<kebab>.
//  B. `./<kebab>` references a sibling registry item — declare it in
//     registryDependencies so the CLI installs it alongside.
//  C. single-file items: force the filename to equal the registry id.
function linkAndBundle(items: RegItem[], itemNames: Set<string>): void {
  const UI_COMPONENTS_DIR = path.join(PACKAGE_ROOT, '..', 'ui', 'src', 'components');
  const ANIMATION_HOOKS_PATH = path.join(PACKAGE_ROOT, '..', 'ui', 'src', 'animation', 'hooks.ts');
  const COMPONENT_IMPORT = /from\s+(['"])(?:\.\.?\/)+(?:components\/)?([A-Z][A-Za-z0-9]*)\1/g;
  const SIBLING_IMPORT = /from\s+['"]\.\/([a-z0-9-]+)['"]/g;
  let bundled = 0,
    renamed = 0;

  for (const it of items) {
    if (!Array.isArray(it.files) || it.files.length === 0) continue;
    const installDir = it.files[0].path.includes('/blocks/') ? 'blocks' : 'ui';
    const byBase = new Map<string, RegFile>();
    for (const f of it.files)
      byBase.set(
        f.path
          .split('/')
          .pop()!
          .replace(/\.(tsx|ts)$/, ''),
        f
      );
    const regDeps = new Set<string>(it.registryDependencies ?? []);
    let didBundle = false;

    // A — bundle local helpers, transitively (Button -> Spinner, StatCard -> Card).
    const queue: RegFile[] = [...it.files];
    const needsAnimationHooks = queue.some(
      (file) =>
        typeof file.content === 'string' &&
        /from\s+["']\.\/use-animation-hooks["']/.test(file.content)
    );
    if (needsAnimationHooks && !byBase.has('use-animation-hooks')) {
      const hooksFile: RegFile = {
        path: `components/${installDir}/use-animation-hooks.ts`,
        type: it.type === 'registry:block' ? 'registry:block' : 'registry:ui',
        content: stripBom(fs.readFileSync(ANIMATION_HOOKS_PATH, 'utf-8')),
      };
      it.files.push(hooksFile);
      byBase.set('use-animation-hooks', hooksFile);
      queue.push(hooksFile);
      bundled++;
      didBundle = true;
    }
    while (queue.length) {
      const f = queue.shift()!;
      if (typeof f.content !== 'string') continue;
      f.content = f.content.replace(COMPONENT_IMPORT, (full, q: string, Pascal: string) => {
        const kb = kebab(Pascal);
        if (byBase.has(kb)) return `from ${q}./${kb}${q}`;
        const srcPath = path.join(UI_COMPONENTS_DIR, `${Pascal}.tsx`);
        if (!fs.existsSync(srcPath)) return full;
        const newFile: RegFile = {
          path: `components/${installDir}/${kb}.tsx`,
          type: it.type === 'registry:block' ? 'registry:block' : 'registry:ui',
          content: transformHelperContent(fs.readFileSync(srcPath, 'utf-8')),
        };
        it.files!.push(newFile);
        byBase.set(kb, newFile);
        queue.push(newFile);
        bundled++;
        didBundle = true;
        return `from ${q}./${kb}${q}`;
      });
    }

    // Augment npm deps for items that gained bundled helpers, so the CLI
    // installs everything the helpers import (e.g. class-variance-authority).
    if (didBundle) {
      const npm = new Set<string>(it.dependencies ?? []);
      for (const f of it.files) {
        if (typeof f.content !== 'string') continue;
        for (const m of f.content.matchAll(/from\s+["']([^"']+)["']/g)) {
          const p = m[1];
          if (p.startsWith('.') || p.startsWith('@/')) continue;
          const pkg = p.startsWith('@') ? p.split('/').slice(0, 2).join('/') : p.split('/')[0];
          if (pkg === 'react' || pkg === 'react-dom') continue;
          npm.add(pkg);
        }
      }
      it.dependencies = [...npm].sort();
    }

    // B — declare sibling registry items as dependencies.
    for (const f of it.files) {
      if (typeof f.content !== 'string') continue;
      for (const m of f.content.matchAll(SIBLING_IMPORT)) {
        const dep = m[1];
        if (!byBase.has(dep) && itemNames.has(dep) && dep !== it.name) regDeps.add(dep);
      }
    }
    if (regDeps.size) it.registryDependencies = [...regDeps].sort();

    // C — single-file items: filename must equal the id.
    if (it.files.length === 1) {
      const f = it.files[0];
      const slash = f.path.lastIndexOf('/');
      const dot = f.path.lastIndexOf('.');
      const want = `${f.path.slice(0, slash + 1)}${it.name}${f.path.slice(dot)}`;
      if (f.path !== want) {
        f.path = want;
        renamed++;
      }
    }
  }
  console.log(
    `🔗 Linked deps: bundled ${bundled} helper file(s), declared sibling deps, ${renamed} file(s) renamed to id.`
  );
}

function buildRegistry() {
  console.log('🚀 Starting registry build...');

  if (!fs.existsSync(ITEMS_DIR)) {
    console.error(`❌ Items directory not found at: ${ITEMS_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(ITEMS_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort();
  const registryItems: Record<string, unknown>[] = [];
  const itemIndex: Array<{ name: string; type: string }> = [];
  let sourceSynced = 0;
  let bomStripped = 0;

  for (const file of files) {
    const filePath = path.join(ITEMS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);
      if (Array.isArray(json.files)) {
        for (const f of json.files) {
          if (!f || typeof f.path !== 'string') continue;
          if (typeof f.content === 'string' && f.content.startsWith('\uFEFF')) {
            f.content = stripBom(f.content);
            bomStripped++;
          }
          const sourcePath = findUiSource(f.path);
          if (sourcePath) {
            f.content = transformUiSource(fs.readFileSync(sourcePath, 'utf-8'));
            sourceSynced++;
          }
          f.path = kebabPath(f.path);
        }
      }
      registryItems.push(json);
      itemIndex.push({ name: json.name, type: json.type });
      if (VERBOSE) console.log(`✅ Loaded ${json.name} (${json.type})`);
    } catch (error) {
      console.error(`❌ Error parsing ${file}:`, error);
      process.exit(1);
    }
  }

  // Resolve authored helper imports (bundle local primitives, declare sibling
  // deps) and align filenames with ids so every item compiles on install.
  linkAndBundle(registryItems as unknown as RegItem[], new Set(itemIndex.map((i) => i.name)));

  // Preserve existing consumers: keep the items-array shape at generated/registry.json.
  const registryJson = `${JSON.stringify(registryItems, null, 2)}\n`;
  fs.writeFileSync(OUTPUT_FILE, registryJson, 'utf-8');
  console.log(`\n🎉 Successfully aggregated ${registryItems.length} items into ${OUTPUT_FILE}`);
  console.log(
    `🔄 Refreshed ${sourceSynced} file(s) from packages/ui; stripped ${bomStripped} BOM marker(s).`
  );

  // shadcn-CLI v4 / AI-agent skills manifest pass.
  const skillFiles = fs.existsSync(SKILLS_DIR)
    ? fs
        .readdirSync(SKILLS_DIR)
        .filter((f) => f.endsWith('.json'))
        .sort()
    : [];

  const skills: Record<string, unknown>[] = [];
  for (const file of skillFiles) {
    try {
      const content = fs.readFileSync(path.join(SKILLS_DIR, file), 'utf-8');
      skills.push(JSON.parse(content));
    } catch (error) {
      console.error(`❌ Error parsing skill ${file}:`, error);
      process.exit(1);
    }
  }

  let baseManifest: Record<string, unknown> = {};
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      baseManifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8'));
    } catch (error) {
      console.error(`❌ Error parsing root manifest registry.json:`, error);
      process.exit(1);
    }
  }

  const uiCount = itemIndex.filter((i) => i.type === 'registry:ui').length;
  const blockCount = itemIndex.filter((i) => i.type === 'registry:block').length;
  const registrySha256 = createHash('sha256').update(registryJson).digest('hex');

  const fullManifest = {
    $schema: baseManifest.$schema ?? 'https://ui.shadcn.com/schema/registry.json',
    name: baseManifest.name ?? 'lerpa',
    homepage: baseManifest.homepage ?? 'https://lerpaui.com',
    aliases: baseManifest.aliases ?? {},
    registries: baseManifest.registries ?? [],
    stats: {
      totalItems: itemIndex.length,
      uiComponents: uiCount,
      blocks: blockCount,
    },
    items: itemIndex,
    skills: skills.length ? skills : (baseManifest.skills ?? []),
    integrity: {
      algorithm: 'sha256',
      registry: registrySha256,
    },
  };

  fs.writeFileSync(MANIFEST_OUTPUT, `${JSON.stringify(fullManifest, null, 2)}\n`, 'utf-8');
  console.log(
    `📜 Manifest written: ${MANIFEST_OUTPUT} (${itemIndex.length} items, ${skills.length} skill descriptor(s))`
  );

  // Copy skill descriptors into generated/skills/ for static-export consumers.
  if (skillFiles.length) {
    fs.rmSync(SKILLS_OUTPUT_DIR, { recursive: true, force: true });
    fs.mkdirSync(SKILLS_OUTPUT_DIR, { recursive: true });
    for (const file of skillFiles) {
      fs.copyFileSync(path.join(SKILLS_DIR, file), path.join(SKILLS_OUTPUT_DIR, file));
    }
    console.log(`🧠 Skills copied: ${SKILLS_OUTPUT_DIR}`);
  }

  // A full workspace may provide the editable docs catalog. The public source
  // checkout retains its validated, versioned snapshot in generated/ instead.
  const catalogSrc = path.join(
    PACKAGE_ROOT,
    '..',
    '..',
    'apps',
    'docs',
    'src',
    'data',
    'component-catalog.json'
  );
  const catalogOut = path.join(OUTPUT_DIR, 'component-catalog.json');
  if (fs.existsSync(catalogSrc)) {
    fs.copyFileSync(catalogSrc, catalogOut);
    console.log(`🗂️  Catalog snapshot: ${catalogOut}`);
  } else if (fs.existsSync(catalogOut)) {
    console.log(`🗂️  Catalog snapshot retained: ${catalogOut}`);
  } else {
    throw new Error(
      `Component catalog is missing. Expected ${catalogSrc} or the versioned snapshot ${catalogOut}.`
    );
  }
  console.log();
}

buildRegistry();
