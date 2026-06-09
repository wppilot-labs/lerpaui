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
  console.log();
}

buildRegistry();
