import * as fs from "fs";
import * as path from "path";

const PACKAGE_ROOT = path.join(__dirname, "..");
const ITEMS_DIR = path.join(PACKAGE_ROOT, "items");
const SKILLS_DIR = path.join(PACKAGE_ROOT, "skills");
const MANIFEST_FILE = path.join(PACKAGE_ROOT, "registry.json");
const OUTPUT_DIR = path.join(PACKAGE_ROOT, "generated");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "registry.json");
const MANIFEST_OUTPUT = path.join(OUTPUT_DIR, "manifest.json");
const SKILLS_OUTPUT_DIR = path.join(OUTPUT_DIR, "skills");

// Normalize an install file path's basename to kebab-case so the filename
// matches the (kebab) registry name and the already-kebab sibling imports.
// Fixes case-sensitive (Linux) module resolution. A content scan confirmed
// zero PascalCase relative sibling imports, so no import rewriting is needed.
function kebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
}

function kebabPath(p: string): string {
  const slash = p.lastIndexOf("/");
  const dir = slash >= 0 ? p.slice(0, slash + 1) : "";
  const file = slash >= 0 ? p.slice(slash + 1) : p;
  const dot = file.lastIndexOf(".");
  const base = dot >= 0 ? file.slice(0, dot) : file;
  const ext = dot >= 0 ? file.slice(dot) : "";
  return dir + kebab(base) + ext;
}

interface RegFile { path: string; type?: string; content?: string }
interface RegItem { name: string; type: string; files?: RegFile[]; registryDependencies?: string[]; dependencies?: string[] }

// Bundled block-local helpers reference cn via the relative source path; rewrite
// to the shadcn alias so they resolve once copied into the consumer project.
function transformHelperContent(src: string): string {
  // The registry convention (and what `lerpa init` scaffolds + the CLI rewrites)
  // is @/lib/utils — NOT @/lib/cn. Map the helper's source cn import to it.
  return src.replace(/from\s+(['"])\.\.?\/lib\/cn\1/g, 'from "@/lib/utils"');
}

// Make every item compile on install:
//  A. `../components/<Pascal>` / `./<Pascal>` references a block-local primitive
//     in packages/ui/src/components — bundle it (transitively) into files[] at
//     components/<dir>/<kebab>.tsx and rewrite the import to ./<kebab>.
//  B. `./<kebab>` references a sibling registry item — declare it in
//     registryDependencies so the CLI installs it alongside.
//  C. single-file items: force the filename to equal the registry id.
function linkAndBundle(items: RegItem[], itemNames: Set<string>): void {
  const UI_COMPONENTS_DIR = path.join(PACKAGE_ROOT, "..", "ui", "src", "components");
  const COMPONENT_IMPORT = /from\s+(['"])(?:\.\.?\/)+(?:components\/)?([A-Z][A-Za-z0-9]*)\1/g;
  const SIBLING_IMPORT = /from\s+['"]\.\/([a-z0-9-]+)['"]/g;
  let bundled = 0, renamed = 0;

  for (const it of items) {
    if (!Array.isArray(it.files) || it.files.length === 0) continue;
    const installDir = it.files[0].path.includes("/blocks/") ? "blocks" : "ui";
    const byBase = new Map<string, RegFile>();
    for (const f of it.files) byBase.set(f.path.split("/").pop()!.replace(/\.(tsx|ts)$/, ""), f);
    const regDeps = new Set<string>(it.registryDependencies ?? []);
    let didBundle = false;

    // A — bundle local helpers, transitively (Button -> Spinner, StatCard -> Card).
    const queue: RegFile[] = [...it.files];
    while (queue.length) {
      const f = queue.shift()!;
      if (typeof f.content !== "string") continue;
      f.content = f.content.replace(COMPONENT_IMPORT, (full, q: string, Pascal: string) => {
        const kb = kebab(Pascal);
        if (byBase.has(kb)) return `from ${q}./${kb}${q}`;
        const srcPath = path.join(UI_COMPONENTS_DIR, `${Pascal}.tsx`);
        if (!fs.existsSync(srcPath)) return full;
        const newFile: RegFile = {
          path: `components/${installDir}/${kb}.tsx`,
          type: it.type === "registry:block" ? "registry:block" : "registry:ui",
          content: transformHelperContent(fs.readFileSync(srcPath, "utf-8")),
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
        if (typeof f.content !== "string") continue;
        for (const m of f.content.matchAll(/from\s+["']([^"']+)["']/g)) {
          const p = m[1];
          if (p.startsWith(".") || p.startsWith("@/")) continue;
          const pkg = p.startsWith("@") ? p.split("/").slice(0, 2).join("/") : p.split("/")[0];
          if (pkg === "react" || pkg === "react-dom") continue;
          npm.add(pkg);
        }
      }
      it.dependencies = [...npm].sort();
    }

    // B — declare sibling registry items as dependencies.
    for (const f of it.files) {
      if (typeof f.content !== "string") continue;
      for (const m of f.content.matchAll(SIBLING_IMPORT)) {
        const dep = m[1];
        if (!byBase.has(dep) && itemNames.has(dep) && dep !== it.name) regDeps.add(dep);
      }
    }
    if (regDeps.size) it.registryDependencies = [...regDeps].sort();

    // C — single-file items: filename must equal the id.
    if (it.files.length === 1) {
      const f = it.files[0];
      const slash = f.path.lastIndexOf("/");
      const dot = f.path.lastIndexOf(".");
      const want = `${f.path.slice(0, slash + 1)}${it.name}${f.path.slice(dot)}`;
      if (f.path !== want) { f.path = want; renamed++; }
    }
  }
  console.log(`🔗 Linked deps: bundled ${bundled} helper file(s), declared sibling deps, ${renamed} file(s) renamed to id.`);
}

function buildRegistry() {
  console.log("🚀 Starting registry build...");

  if (!fs.existsSync(ITEMS_DIR)) {
    console.error(`❌ Items directory not found at: ${ITEMS_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const files = fs.readdirSync(ITEMS_DIR).filter(file => file.endsWith(".json"));
  const registryItems: Record<string, unknown>[] = [];
  const itemIndex: Array<{ name: string; type: string }> = [];

  for (const file of files) {
    const filePath = path.join(ITEMS_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const json = JSON.parse(content);
      if (Array.isArray(json.files)) {
        for (const f of json.files) {
          if (f && typeof f.path === "string") f.path = kebabPath(f.path);
        }
      }
      registryItems.push(json);
      itemIndex.push({ name: json.name, type: json.type });
      console.log(`✅ Loaded ${json.name} (${json.type})`);
    } catch (error) {
      console.error(`❌ Error parsing ${file}:`, error);
      process.exit(1);
    }
  }

  // Resolve authored helper imports (bundle local primitives, declare sibling
  // deps) and align filenames with ids so every item compiles on install.
  linkAndBundle(registryItems as unknown as RegItem[], new Set(itemIndex.map(i => i.name)));

  // Preserve existing consumers: keep the items-array shape at generated/registry.json.
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(registryItems, null, 2), "utf-8");
  console.log(
    `\n🎉 Successfully aggregated ${registryItems.length} items into ${OUTPUT_FILE}`,
  );

  // shadcn-CLI v4 / AI-agent skills manifest pass.
  const skillFiles = fs.existsSync(SKILLS_DIR)
    ? fs.readdirSync(SKILLS_DIR).filter(f => f.endsWith(".json"))
    : [];

  const skills: Record<string, unknown>[] = [];
  for (const file of skillFiles) {
    try {
      const content = fs.readFileSync(path.join(SKILLS_DIR, file), "utf-8");
      skills.push(JSON.parse(content));
    } catch (error) {
      console.error(`❌ Error parsing skill ${file}:`, error);
      process.exit(1);
    }
  }

  let baseManifest: Record<string, unknown> = {};
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      baseManifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf-8"));
    } catch (error) {
      console.error(`❌ Error parsing root manifest registry.json:`, error);
      process.exit(1);
    }
  }

  const uiCount = itemIndex.filter(i => i.type === "registry:ui").length;
  const blockCount = itemIndex.filter(i => i.type === "registry:block").length;

  const fullManifest = {
    $schema:
      baseManifest.$schema ?? "https://ui.shadcn.com/schema/registry.json",
    name: baseManifest.name ?? "lerpa",
    homepage: baseManifest.homepage ?? "https://lerpaui.com",
    aliases: baseManifest.aliases ?? {},
    registries: baseManifest.registries ?? [],
    stats: {
      totalItems: itemIndex.length,
      uiComponents: uiCount,
      blocks: blockCount,
    },
    items: itemIndex,
    skills: skills.length ? skills : (baseManifest.skills ?? []),
    generatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(MANIFEST_OUTPUT, JSON.stringify(fullManifest, null, 2), "utf-8");
  console.log(
    `📜 Manifest written: ${MANIFEST_OUTPUT} (${itemIndex.length} items, ${skills.length} skill descriptor(s))`,
  );

  // Copy skill descriptors into generated/skills/ for static-export consumers.
  if (skillFiles.length) {
    fs.rmSync(SKILLS_OUTPUT_DIR, { recursive: true, force: true });
    fs.mkdirSync(SKILLS_OUTPUT_DIR, { recursive: true });
    for (const file of skillFiles) {
      fs.copyFileSync(
        path.join(SKILLS_DIR, file),
        path.join(SKILLS_OUTPUT_DIR, file),
      );
    }
    console.log(`🧠 Skills copied: ${SKILLS_OUTPUT_DIR}`);
  }

  // Snapshot the curated component catalog (descriptions + categories) into
  // generated/ so the MCP server and fresh clones don't depend on apps/docs.
  // apps/docs remains the editable source; this is a build-time copy.
  const catalogSrc = path.join(PACKAGE_ROOT, "..", "..", "apps", "docs", "src", "data", "component-catalog.json");
  if (fs.existsSync(catalogSrc)) {
    const catalogOut = path.join(OUTPUT_DIR, "component-catalog.json");
    fs.copyFileSync(catalogSrc, catalogOut);
    console.log(`🗂️  Catalog snapshot: ${catalogOut}`);
  } else {
    console.warn(`⚠️  Catalog source not found at ${catalogSrc}; skipping snapshot (generated/component-catalog.json kept if present).`);
  }
  console.log();
}

buildRegistry();
