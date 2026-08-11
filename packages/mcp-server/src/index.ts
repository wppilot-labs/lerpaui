#!/usr/bin/env node
/**
 * Read-only Lerpa UI MCP server.
 *
 * The published package bundles the generated registry and catalog, so stdio
 * clients can browse source without a checkout or runtime network access.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PKG_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(__dirname, '..', '..', '..');

function readPackageVersion(): string {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, 'package.json'), 'utf-8')) as {
      version?: string;
    };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

export const PACKAGE_VERSION = readPackageVersion();

function firstExisting(...candidates: string[]): string | null {
  return candidates.find((candidate) => fs.existsSync(candidate)) ?? null;
}

const REGISTRY_JSON = firstExisting(
  path.join(PKG_ROOT, 'registry', 'registry.json'),
  path.join(REPO_ROOT, 'packages', 'registry', 'generated', 'registry.json')
);
const CATALOG_JSON = firstExisting(
  path.join(PKG_ROOT, 'registry', 'component-catalog.json'),
  path.join(REPO_ROOT, 'packages', 'registry', 'generated', 'component-catalog.json')
);

interface RegistryItemFile {
  path: string;
  type?: string;
  content: string;
}

interface RegistryItem {
  name: string;
  type: 'registry:ui' | 'registry:block';
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryItemFile[];
}

interface CatalogEntry {
  id: string;
  name: string;
  description?: string;
  category?: string;
}

let cachedItems: RegistryItem[] | null = null;
let cachedCatalog: CatalogEntry[] | null = null;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
}

function loadItems(): RegistryItem[] {
  if (!cachedItems) {
    if (!REGISTRY_JSON) {
      throw new Error(
        'Lerpa UI registry data not found. Run `pnpm registry:build` in a checkout ' +
          'or reinstall the published MCP package.'
      );
    }
    const items = readJson<unknown>(REGISTRY_JSON);
    if (!Array.isArray(items)) throw new Error('Lerpa registry root must be an array.');
    cachedItems = items as RegistryItem[];
  }
  return cachedItems;
}

function loadCatalog(): CatalogEntry[] {
  if (!cachedCatalog) {
    if (!CATALOG_JSON) return (cachedCatalog = []);
    try {
      const raw = readJson<unknown>(CATALOG_JSON);
      const entries = Array.isArray(raw)
        ? raw
        : ((raw as { components?: unknown[] }).components ?? []);
      cachedCatalog = Array.isArray(entries) ? (entries as CatalogEntry[]) : [];
    } catch {
      cachedCatalog = [];
    }
  }
  return cachedCatalog;
}

function catalogById(): Map<string, CatalogEntry> {
  return new Map(loadCatalog().map((entry) => [entry.id ?? entry.name, entry]));
}

function requireString(
  value: unknown,
  label: string,
  options: { optional?: boolean; max?: number; pattern?: RegExp } = {}
): string | undefined {
  if (value === undefined || value === null) {
    if (options.optional) return undefined;
    throw new Error(`${label} is required.`);
  }
  if (typeof value !== 'string') throw new Error(`${label} must be a string.`);
  const normalized = value.trim();
  if (!normalized && !options.optional) throw new Error(`${label} cannot be empty.`);
  if (options.max && normalized.length > options.max) {
    throw new Error(`${label} must be at most ${options.max} characters.`);
  }
  if (normalized && options.pattern && !options.pattern.test(normalized)) {
    throw new Error(`${label} has an invalid format.`);
  }
  return normalized || undefined;
}

function integerOption(
  value: unknown,
  label: string,
  fallback: number,
  min: number,
  max: number
): number {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${label} must be an integer between ${min} and ${max}.`);
  }
  return value;
}

function normalizeType(value: unknown): RegistryItem['type'] | undefined {
  const normalized = requireString(value, 'type', { optional: true, max: 20 });
  if (!normalized || normalized === 'all') return undefined;
  if (normalized === 'ui' || normalized === 'component') return 'registry:ui';
  if (normalized === 'block') return 'registry:block';
  throw new Error('type must be "all", "ui", or "block".');
}

function categoryFor(item: RegistryItem, lookup: Map<string, CatalogEntry>): string {
  const catalogCategory = lookup.get(item.name)?.category?.trim().toLowerCase();
  if (catalogCategory) return catalogCategory;
  return item.name.split('-')[0] || 'uncategorized';
}

function findItem(id: string): RegistryItem {
  const item = loadItems().find((candidate) => candidate.name === id);
  if (!item) throw new Error(`Component not found: ${id}`);
  return item;
}

export interface ListComponentsOptions {
  category?: unknown;
  type?: unknown;
  limit?: unknown;
  offset?: unknown;
}

export function listComponents(options: ListComponentsOptions = {}) {
  const category = requireString(options.category, 'category', {
    optional: true,
    max: 60,
    pattern: /^[a-z0-9-]+$/,
  })?.toLowerCase();
  const type = normalizeType(options.type);
  const limit = integerOption(options.limit, 'limit', 100, 1, 250);
  const offset = integerOption(options.offset, 'offset', 0, 0, 100_000);
  const lookup = catalogById();

  const filtered = loadItems().filter((item) => {
    if (type && item.type !== type) return false;
    if (!category) return true;
    const itemCategory = categoryFor(item, lookup);
    return itemCategory === category || item.name.startsWith(`${category}-`);
  });
  const page = filtered.slice(offset, offset + limit);
  const nextOffset = offset + page.length < filtered.length ? offset + page.length : null;

  return {
    total: filtered.length,
    returned: page.length,
    offset,
    limit,
    nextOffset,
    category: category ?? 'all',
    type: type ?? 'all',
    items: page.map((item) => {
      const entry = lookup.get(item.name);
      return {
        id: item.name,
        name: entry?.name ?? item.name,
        type: item.type,
        category: categoryFor(item, lookup),
        description: entry?.description,
        install: `npx -y lerpa-cli add ${item.name}`,
        registryUrl: `https://lerpaui.com/r/${item.name}.json`,
      };
    }),
  };
}

export function getComponent(idValue: unknown) {
  const id = requireString(idValue, 'id', {
    max: 120,
    pattern: /^[a-z0-9-]+$/,
  }) as string;
  const item = findItem(id);
  const entry = catalogById().get(item.name);
  return {
    id: item.name,
    name: entry?.name ?? item.name,
    description: entry?.description,
    category: entry?.category,
    type: item.type,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    install: `npx -y lerpa-cli add ${item.name}`,
    registryUrl: `https://lerpaui.com/r/${item.name}.json`,
    files: item.files.map((file) => ({
      path: file.path,
      type: file.type,
      source: file.content,
    })),
  };
}

export interface SearchComponentsOptions {
  query?: unknown;
  category?: unknown;
  type?: unknown;
  limit?: unknown;
}

export function searchComponents(options: SearchComponentsOptions) {
  const query = requireString(options.query, 'query', { max: 200 }) as string;
  const category = requireString(options.category, 'category', {
    optional: true,
    max: 60,
    pattern: /^[a-z0-9-]+$/,
  })?.toLowerCase();
  const type = normalizeType(options.type);
  const limit = integerOption(options.limit, 'limit', 50, 1, 100);
  const q = query.toLowerCase();
  const tokens = q
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 20);
  const lookup = catalogById();

  const scored: Array<{
    id: string;
    name: string;
    type: RegistryItem['type'];
    category: string;
    description?: string;
    score: number;
  }> = [];
  for (const item of loadItems()) {
    if (type && item.type !== type) continue;
    const entry = lookup.get(item.name);
    const itemCategory = categoryFor(item, lookup);
    if (category && itemCategory !== category && !item.name.startsWith(`${category}-`)) {
      continue;
    }
    const name = item.name.toLowerCase();
    const displayName = entry?.name?.toLowerCase() ?? '';
    const description = entry?.description?.toLowerCase() ?? '';
    let score = 0;
    if (name === q || displayName === q) score += 100;
    if (name.startsWith(q) || displayName.startsWith(q)) score += 40;
    if (name.includes(q) || displayName.includes(q)) score += 30;
    if (description.includes(q)) score += 15;
    for (const token of tokens) {
      if (name.includes(token) || displayName.includes(token)) score += 5;
      if (description.includes(token)) score += 3;
      if (itemCategory.includes(token)) score += 2;
    }
    if (score > 0) {
      scored.push({
        id: item.name,
        name: entry?.name ?? item.name,
        type: item.type,
        category: itemCategory,
        description: entry?.description,
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
  return {
    total: scored.length,
    returned: Math.min(scored.length, limit),
    query,
    results: scored.slice(0, limit).map(({ score: _score, ...result }) => result),
  };
}

export function listCategories() {
  const lookup = catalogById();
  const counts = new Map<string, { total: number; ui: number; blocks: number }>();
  for (const item of loadItems()) {
    const category = categoryFor(item, lookup);
    const current = counts.get(category) ?? { total: 0, ui: 0, blocks: 0 };
    current.total++;
    if (item.type === 'registry:ui') current.ui++;
    else current.blocks++;
    counts.set(category, current);
  }
  return {
    total: counts.size,
    categories: [...counts]
      .map(([id, count]) => ({ id, ...count }))
      .sort((a, b) => b.total - a.total || a.id.localeCompare(b.id)),
  };
}

export function getRegistryStats() {
  const items = loadItems();
  const catalog = loadCatalog();
  const ui = items.filter((item) => item.type === 'registry:ui').length;
  return {
    version: PACKAGE_VERSION,
    totalItems: items.length,
    uiComponents: ui,
    blocks: items.length - ui,
    catalogEntries: catalog.length,
    catalogCoveragePercent: Number(((catalog.length / items.length) * 100).toFixed(1)),
    categories: listCategories().total,
    runtimeNetworkRequired: false,
  };
}

export const TOOLS = [
  {
    name: 'list_components',
    description: 'List Lerpa UI registry items with pagination and optional category/type filters.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      properties: {
        category: { type: 'string', pattern: '^[a-z0-9-]+$' },
        type: { type: 'string', enum: ['all', 'ui', 'component', 'block'] },
        limit: { type: 'integer', minimum: 1, maximum: 250, default: 100 },
        offset: { type: 'integer', minimum: 0, default: 0 },
      },
    },
  },
  {
    name: 'get_component',
    description:
      'Get one registry item, including dependencies, metadata, install URL, and embedded source files.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['id'],
      properties: {
        id: { type: 'string', pattern: '^[a-z0-9-]+$', maxLength: 120 },
      },
    },
  },
  {
    name: 'search_components',
    description:
      'Ranked search over item ids, display names, categories, and catalog descriptions.',
    inputSchema: {
      type: 'object',
      additionalProperties: false,
      required: ['query'],
      properties: {
        query: { type: 'string', minLength: 1, maxLength: 200 },
        category: { type: 'string', pattern: '^[a-z0-9-]+$' },
        type: { type: 'string', enum: ['all', 'ui', 'component', 'block'] },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 50 },
      },
    },
  },
  {
    name: 'list_categories',
    description: 'List derived registry categories with UI/block counts.',
    inputSchema: { type: 'object', additionalProperties: false, properties: {} },
  },
  {
    name: 'get_registry_stats',
    description:
      'Return exact registry totals, catalog coverage, server version, and runtime network requirements.',
    inputSchema: { type: 'object', additionalProperties: false, properties: {} },
  },
] as const;

export function executeTool(name: string, args: Record<string, unknown> = {}) {
  switch (name) {
    case 'list_components':
      return listComponents(args);
    case 'get_component':
      return getComponent(args.id);
    case 'search_components':
      return searchComponents(args);
    case 'list_categories':
      return listCategories();
    case 'get_registry_stats':
      return getRegistryStats();
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export function createServer(): Server {
  const server = new Server(
    { name: '@lerpa/mcp-server', version: PACKAGE_VERSION },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: [...TOOLS] }));
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const name = request.params.name;
    const args = request.params.arguments ?? {};
    try {
      const result = executeTool(name, args);
      return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        isError: true,
        content: [{ type: 'text', text: `Error in ${name}: ${message}` }],
      };
    }
  });
  return server;
}

export async function main(): Promise<void> {
  const server = createServer();
  await server.connect(new StdioServerTransport());
  console.error(`[lerpa-mcp] stdio server ready (v${PACKAGE_VERSION})`);
}

const entryUrl = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : '';
if (entryUrl === import.meta.url) {
  main().catch((error) => {
    console.error('[lerpa-mcp] fatal:', error);
    process.exitCode = 1;
  });
}
