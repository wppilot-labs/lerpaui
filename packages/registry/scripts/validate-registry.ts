import * as fs from 'fs';
import * as path from 'path';
import { createHash } from 'crypto';
import { z } from 'zod';

const PACKAGE_ROOT = path.join(__dirname, '..');
const ITEMS_DIR = path.join(PACKAGE_ROOT, 'items');
const GENERATED_REGISTRY = path.join(PACKAGE_ROOT, 'generated', 'registry.json');
const GENERATED_MANIFEST = path.join(PACKAGE_ROOT, 'generated', 'manifest.json');
const GENERATED_CATALOG = path.join(PACKAGE_ROOT, 'generated', 'component-catalog.json');
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'skills');
const GENERATED_SKILLS_DIR = path.join(PACKAGE_ROOT, 'generated', 'skills');

const SAFE_NPM_PACKAGE = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/;
const KEBAB_FILE = /^[a-z0-9-]+\.(?:ts|tsx)$/;

function isSafeRegistryPath(value: string): boolean {
  if (value.includes('\\') || path.posix.isAbsolute(value)) return false;
  const segments = value.split('/');
  if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
    return false;
  }
  return (
    (value.startsWith('components/ui/') || value.startsWith('components/blocks/')) &&
    /\.(?:ts|tsx)$/.test(value)
  );
}

const FileSchema = z
  .object({
    path: z.string().min(1).refine(isSafeRegistryPath, 'Unsafe registry file path'),
    content: z.string().min(1, 'File content cannot be empty'),
    type: z.enum([
      'registry:page',
      'registry:component',
      'registry:ui',
      'registry:block',
      'registry:hook',
      'registry:theme',
      'registry:file',
    ]),
  })
  .strict();

const RegistryItemSchema = z
  .object({
    name: z.string().regex(/^[a-z0-9-]+$/, 'Name must be kebab-case'),
    type: z.enum(['registry:ui', 'registry:block']),
    dependencies: z.array(z.string().regex(SAFE_NPM_PACKAGE)).optional(),
    registryDependencies: z.array(z.string().regex(/^[a-z0-9-]+$/)).optional(),
    files: z.array(FileSchema).min(1),
    cssVars: z
      .object({
        light: z.record(z.string()).optional(),
        dark: z.record(z.string()).optional(),
      })
      .optional(),
  })
  .strict();

type RegistryItem = z.infer<typeof RegistryItemSchema>;

const SkillSchema = z
  .object({
    $schema: z.string().url(),
    name: z.string().regex(/^[a-z0-9-]+$/),
    version: z.string().regex(/^\d+\.\d+\.\d+$/),
    homepage: z.string().url(),
    description: z.string().min(20),
    when_to_use: z.array(z.string().min(1)).min(1),
    when_not_to_use: z.array(z.string().min(1)).min(1),
    capabilities: z
      .array(
        z
          .object({
            id: z.string().min(1),
            label: z.string().min(1),
            description: z.string().min(1),
            type: z.enum(['registry:ui', 'registry:block']),
          })
          .strict()
      )
      .min(1),
    categories: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
    stack: z.record(z.string()),
    conventions: z.record(z.unknown()),
    install: z
      .object({
        cli: z.string().min(1),
        registryUrl: z.string().url(),
      })
      .strict(),
    examples: z
      .array(
        z
          .object({
            prompt: z.string().min(1),
            uses: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
          })
          .strict()
      )
      .min(1),
    discovery: z.record(z.string()),
  })
  .strict();

const CatalogSchema = z
  .object({
    categories: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
    components: z.array(
      z
        .object({
          id: z.string().regex(/^[a-z0-9-]+$/),
          name: z.string().min(1),
          category: z.string().regex(/^[a-z0-9-]+$/),
          cliCommand: z.string().min(1),
          description: z.string().min(1),
        })
        .strict()
    ),
  })
  .strict();

const errors: string[] = [];

function fail(message: string): void {
  errors.push(message);
}

function assertUnique(values: string[], label: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) fail(`${label} contains duplicate "${value}"`);
    seen.add(value);
  }
}

function loadAuthoredItems(): RegistryItem[] {
  if (!fs.existsSync(ITEMS_DIR)) {
    throw new Error(`Items directory not found: ${ITEMS_DIR}`);
  }

  const parsedItems: RegistryItem[] = [];
  const files = fs
    .readdirSync(ITEMS_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort();

  for (const file of files) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(ITEMS_DIR, file), 'utf-8'));
      const result = RegistryItemSchema.safeParse(raw);
      if (!result.success) {
        fail(`${file}: ${JSON.stringify(result.error.format())}`);
        continue;
      }

      const item = result.data;
      const expectedName = path.basename(file, '.json');
      if (item.name !== expectedName) {
        fail(`${file}: name is "${item.name}", expected "${expectedName}"`);
      }
      assertUnique(item.dependencies ?? [], `${item.name}.dependencies`);
      assertUnique(item.registryDependencies ?? [], `${item.name}.registryDependencies`);
      assertUnique(
        item.files.map((entry) => entry.path),
        `${item.name}.files`
      );
      parsedItems.push(item);
    } catch (error) {
      fail(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  assertUnique(
    parsedItems.map((item) => item.name),
    'Registry item names'
  );
  return parsedItems;
}

function validateDependencyGraph(items: RegistryItem[]): void {
  const byName = new Map(items.map((item) => [item.name, item]));
  for (const item of items) {
    for (const dependency of item.registryDependencies ?? []) {
      if (dependency === item.name) {
        fail(`${item.name}: registry dependency cannot reference itself`);
      } else if (!byName.has(dependency)) {
        fail(`${item.name}: missing registry dependency "${dependency}"`);
      }
    }
  }

  const state = new Map<string, 'visiting' | 'done'>();
  const visit = (name: string, trail: string[]): void => {
    if (state.get(name) === 'done') return;
    if (state.get(name) === 'visiting') {
      fail(`Registry dependency cycle: ${[...trail, name].join(' -> ')}`);
      return;
    }
    state.set(name, 'visiting');
    for (const dependency of byName.get(name)?.registryDependencies ?? []) {
      visit(dependency, [...trail, name]);
    }
    state.set(name, 'done');
  };

  for (const item of items) visit(item.name, []);
}

function validateGeneratedRegistry(authoredItems: RegistryItem[]): void {
  if (!fs.existsSync(GENERATED_REGISTRY) || !fs.existsSync(GENERATED_MANIFEST)) {
    fail('Generated registry artifacts are missing; run `pnpm registry:build`');
    return;
  }

  let generated: RegistryItem[];
  let manifest: {
    stats?: { totalItems?: number; uiComponents?: number; blocks?: number };
    items?: Array<{ name?: string; type?: string }>;
    skills?: unknown[];
    integrity?: { algorithm?: string; registry?: string };
  };
  const registryText = fs.readFileSync(GENERATED_REGISTRY, 'utf-8');

  try {
    const rawGenerated: unknown = JSON.parse(registryText);
    if (!Array.isArray(rawGenerated)) {
      fail('generated/registry.json must contain an array');
      return;
    }
    generated = [];
    for (const [index, rawItem] of rawGenerated.entries()) {
      const result = RegistryItemSchema.safeParse(rawItem);
      if (!result.success) {
        fail(`generated/registry.json item ${index}: ${JSON.stringify(result.error.format())}`);
      } else {
        generated.push(result.data);
      }
    }
    manifest = JSON.parse(fs.readFileSync(GENERATED_MANIFEST, 'utf-8'));
  } catch (error) {
    fail(
      `Generated artifact parse failure: ${error instanceof Error ? error.message : String(error)}`
    );
    return;
  }

  if (generated.length !== authoredItems.length) {
    fail(
      `Generated registry has ${generated.length} items; authored registry has ${authoredItems.length}`
    );
  }

  const generatedNames = generated.map((item) => item.name);
  assertUnique(generatedNames, 'Generated registry item names');
  const authoredByName = new Map(authoredItems.map((item) => [item.name, item]));
  for (const item of generated) {
    const authored = authoredByName.get(item.name);
    if (!authored) {
      fail(`Generated registry contains unknown item "${item.name}"`);
    } else if (authored.type !== item.type) {
      fail(`${item.name}: generated type ${item.type} differs from authored type ${authored.type}`);
    }
    assertUnique(item.dependencies ?? [], `${item.name}.generated.dependencies`);
    assertUnique(item.registryDependencies ?? [], `${item.name}.generated.registryDependencies`);
    assertUnique(
      item.files.map((file) => file.path),
      `${item.name}.generated.files`
    );
  }

  const byName = new Map(generated.map((item) => [item.name, item]));
  for (const item of generated) {
    for (const file of item.files ?? []) {
      if (!isSafeRegistryPath(file.path)) {
        fail(`${item.name}: generated unsafe path "${file.path}"`);
      }
      if (!KEBAB_FILE.test(path.posix.basename(file.path))) {
        fail(`${item.name}: generated filename is not kebab-case: "${file.path}"`);
      }
      if (file.content.startsWith('\uFEFF')) {
        fail(`${item.name}: generated file starts with a BOM: "${file.path}"`);
      }
    }

    const closure = new Set<string>();
    const available = new Map<string, string>();
    const collect = (name: string): void => {
      if (closure.has(name)) return;
      closure.add(name);
      const current = byName.get(name);
      if (!current) return;
      for (const file of current.files ?? []) {
        const existing = available.get(file.path);
        if (existing !== undefined && existing !== file.content) {
          fail(`${item.name}: dependency closure writes conflicting file "${file.path}"`);
        } else {
          available.set(file.path, file.content);
        }
      }
      for (const dependency of current.registryDependencies ?? []) collect(dependency);
    };
    collect(item.name);

    for (const [filePath, content] of available) {
      const importPattern = /(?:from\s+|import\s*(?:\(\s*)?)(["'])(\.{1,2}\/[^"']+)\1/g;
      for (const match of content.matchAll(importPattern)) {
        const specifier = match[2];
        const unresolved = path.posix.normalize(
          path.posix.join(path.posix.dirname(filePath), specifier)
        );
        const candidates = [
          unresolved,
          `${unresolved}.ts`,
          `${unresolved}.tsx`,
          path.posix.join(unresolved, 'index.ts'),
          path.posix.join(unresolved, 'index.tsx'),
        ];
        if (!candidates.some((candidate) => available.has(candidate))) {
          fail(`${item.name}: unresolved import "${specifier}" from "${filePath}"`);
        }
      }
    }
  }

  const uiCount = generated.filter((item) => item.type === 'registry:ui').length;
  const blockCount = generated.filter((item) => item.type === 'registry:block').length;
  if (
    manifest.stats?.totalItems !== generated.length ||
    manifest.stats?.uiComponents !== uiCount ||
    manifest.stats?.blocks !== blockCount
  ) {
    fail('Generated manifest stats do not match generated registry contents');
  }
  if (manifest.items?.length !== generated.length) {
    fail('Generated manifest item index does not match generated registry length');
  } else {
    const expectedIndex = generated.map((item) => ({ name: item.name, type: item.type }));
    if (JSON.stringify(manifest.items) !== JSON.stringify(expectedIndex)) {
      fail('Generated manifest item index does not match generated registry order/types');
    }
  }

  const actualHash = createHash('sha256').update(registryText).digest('hex');
  if (manifest.integrity?.algorithm !== 'sha256' || manifest.integrity.registry !== actualHash) {
    fail('Generated manifest SHA-256 does not match generated/registry.json');
  }

  validateCatalog(generatedNames);
  validateSkills(generatedNames, manifest);
}

function validateCatalog(registryNames: string[]): void {
  if (!fs.existsSync(GENERATED_CATALOG)) {
    fail('generated/component-catalog.json is missing');
    return;
  }
  try {
    const result = CatalogSchema.safeParse(JSON.parse(fs.readFileSync(GENERATED_CATALOG, 'utf-8')));
    if (!result.success) {
      fail(`Generated component catalog: ${JSON.stringify(result.error.format())}`);
      return;
    }
    const catalog = result.data;
    assertUnique(catalog.categories, 'Catalog categories');
    assertUnique(
      catalog.components.map((component) => component.id),
      'Catalog component ids'
    );
    const names = new Set(registryNames);
    const categories = new Set(catalog.categories);
    for (const component of catalog.components) {
      if (!names.has(component.id)) {
        fail(`Catalog references unknown registry item "${component.id}"`);
      }
      if (!categories.has(component.category)) {
        fail(`${component.id}: catalog category "${component.category}" is not declared`);
      }
      if (component.cliCommand !== `pnpm dlx lerpa-cli add ${component.id}`) {
        fail(`${component.id}: catalog cliCommand does not install its own id`);
      }
    }
  } catch (error) {
    fail(`Generated component catalog: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function validateSkills(registryNames: string[], manifest: { skills?: unknown[] }): void {
  if (!fs.existsSync(SKILLS_DIR)) return;
  const registrySet = new Set(registryNames);
  const skillFiles = fs
    .readdirSync(SKILLS_DIR)
    .filter((file) => file.endsWith('.json'))
    .sort();
  const parsedSkills: Array<z.infer<typeof SkillSchema>> = [];

  for (const file of skillFiles) {
    const authoredPath = path.join(SKILLS_DIR, file);
    const generatedPath = path.join(GENERATED_SKILLS_DIR, file);
    try {
      const authoredText = fs.readFileSync(authoredPath, 'utf-8');
      const result = SkillSchema.safeParse(JSON.parse(authoredText));
      if (!result.success) {
        fail(`${file}: ${JSON.stringify(result.error.format())}`);
        continue;
      }
      parsedSkills.push(result.data);
      assertUnique(result.data.categories, `${result.data.name}.categories`);
      for (const example of result.data.examples) {
        for (const itemName of example.uses) {
          if (!registrySet.has(itemName)) {
            fail(`${result.data.name}: example references unknown item "${itemName}"`);
          }
        }
      }
      if (!fs.existsSync(generatedPath)) {
        fail(`Generated skill is missing: ${file}`);
      } else if (fs.readFileSync(generatedPath, 'utf-8') !== authoredText) {
        fail(`Generated skill is stale: ${file}`);
      }
    } catch (error) {
      fail(`${file}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const manifestSkills = Array.isArray(manifest.skills) ? manifest.skills : [];
  const parsedManifestSkills = manifestSkills.map((skill) => SkillSchema.safeParse(skill));
  if (parsedManifestSkills.some((result) => !result.success)) {
    fail('Generated manifest contains an invalid skill descriptor');
  }
  if (manifestSkills.length !== parsedSkills.length) {
    fail('Generated manifest skills do not match authored skill count');
  } else if (
    JSON.stringify(parsedManifestSkills.map((result) => result.data)) !==
    JSON.stringify(parsedSkills)
  ) {
    fail('Generated manifest skills are stale');
  }
}

function main(): void {
  console.log('🔍 Validating authored and generated registry integrity...');
  try {
    const items = loadAuthoredItems();
    validateDependencyGraph(items);
    validateGeneratedRegistry(items);

    if (errors.length) {
      for (const error of errors) console.error(`❌ ${error}`);
      console.error(`\n🛑 Registry validation failed with ${errors.length} error(s).`);
      process.exit(1);
    }

    const uiCount = items.filter((item) => item.type === 'registry:ui').length;
    const blockCount = items.length - uiCount;
    console.log(
      `✅ ${items.length} items validated (${uiCount} UI, ${blockCount} blocks), including dependency graph, install paths, generated imports, catalog, skills, and SHA-256.`
    );
  } catch (error) {
    console.error(`❌ ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
