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
function kebabPath(p: string): string {
  const slash = p.lastIndexOf("/");
  const dir = slash >= 0 ? p.slice(0, slash + 1) : "";
  const file = slash >= 0 ? p.slice(slash + 1) : p;
  const dot = file.lastIndexOf(".");
  const base = dot >= 0 ? file.slice(0, dot) : file;
  const ext = dot >= 0 ? file.slice(dot) : "";
  const kebab = base
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .toLowerCase();
  return dir + kebab + ext;
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
