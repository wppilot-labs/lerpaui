#!/usr/bin/env node
/**
 * @lerpa/mcp-server
 *
 * Model Context Protocol server exposing the Lerpa UI registry to AI coding
 * agents (Claude Code, Cursor, v0, Continue, Cline, Zed).
 *
 * Status: ACTIVE. `@modelcontextprotocol/sdk` is installed; `pnpm --filter
 * @lerpa/mcp-server build` emits `dist/index.js`, runnable as a stdio MCP
 * server by any MCP client (Claude Code, Cursor, Continue, Cline, Zed).
 *
 * Tools exposed (read-only):
 *   - list_components(category?)  -> components filtered by category
 *   - get_component(id)            -> full registry item JSON with source
 *   - search_components(query)     -> fuzzy match on name + description
 *
 * Note: data is read from the monorepo registry (see paths below), so this
 * runs as-is from inside the repo. Publishing to npm for `npx` use additionally
 * requires bundling the registry JSON into the package — see README.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

// ---------------------------------------------------------------------------
// Resolve data sources relative to this file (ESM-safe).
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Data resolution: prefer the registry JSON bundled INTO this package by
// scripts/copy-registry.js (so the published package runs via `npx` outside the
// monorepo). Fall back to monorepo source paths for local development.
// dist/index.js -> packages/mcp-server
const PKG_ROOT = path.resolve(__dirname, "..");
// dist/index.js -> packages/mcp-server -> packages -> repo root
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..");

function firstExisting(...candidates: string[]): string | null {
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

// The aggregated registry array (every item with embedded source) is the single
// source of truth for list/get/search. component-catalog.json adds human
// descriptions + category tags.
const REGISTRY_JSON = firstExisting(
  path.join(PKG_ROOT, "registry", "registry.json"),
  path.join(REPO_ROOT, "packages", "registry", "generated", "registry.json"),
);
const CATALOG_JSON = firstExisting(
  path.join(PKG_ROOT, "registry", "component-catalog.json"),
  path.join(REPO_ROOT, "packages", "registry", "generated", "component-catalog.json"),
  path.join(REPO_ROOT, "apps", "docs", "src", "data", "component-catalog.json"),
);

// ---------------------------------------------------------------------------
// Types (loose — registry JSON is the source of truth).
// ---------------------------------------------------------------------------

interface RegistryItemFile {
  path: string;
  type?: string;
  content: string;
}

interface RegistryItem {
  name: string;
  type: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files: RegistryItemFile[];
  meta?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Lazy-loaded data (only read once per process).
// ---------------------------------------------------------------------------

let _items: RegistryItem[] | null = null;
let _catalog: Array<{ id: string; name: string; description?: string; category?: string }> | null =
  null;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function loadItems(): RegistryItem[] {
  if (!_items) {
    if (!REGISTRY_JSON) {
      throw new Error(
        "Lerpa UI registry data not found. From a monorepo checkout run " +
          "`pnpm --filter @lerpa/registry run build`; a published package " +
          "ships registry/registry.json (see scripts/copy-registry.js).",
      );
    }
    _items = readJson<RegistryItem[]>(REGISTRY_JSON);
  }
  return _items;
}

function loadCatalog(): NonNullable<typeof _catalog> {
  if (!_catalog) {
    try {
      if (!CATALOG_JSON) {
        _catalog = [];
        return _catalog;
      }
      // component-catalog.json is { categories: [...], components: [...] };
      // tolerate a bare array too.
      const raw = readJson<unknown>(CATALOG_JSON);
      const arr = Array.isArray(raw)
        ? raw
        : ((raw as { components?: unknown[] }).components ?? []);
      _catalog = arr as NonNullable<typeof _catalog>;
    } catch {
      _catalog = [];
    }
  }
  return _catalog;
}

function findItem(id: string): RegistryItem {
  const item = loadItems().find((it) => it.name === id);
  if (!item) {
    throw new Error(`Component not found: ${id}`);
  }
  return item;
}

// ---------------------------------------------------------------------------
// Tool implementations.
// ---------------------------------------------------------------------------

function tool_list_components(category?: string) {
  const catalog = loadCatalog();

  // Build a quick lookup from id -> catalog entry for category info.
  const catById = new Map(catalog.map((c) => [c.id ?? c.name, c]));

  let items = loadItems();
  if (category) {
    const cat = category.toLowerCase();
    items = items.filter((it) => {
      const entry = catById.get(it.name);
      if (entry?.category?.toLowerCase() === cat) return true;
      // Fallback: name-prefix heuristic (e.g. "ai-chat-stream" -> "ai")
      return it.name.toLowerCase().startsWith(`${cat}-`);
    });
  }

  return {
    total: items.length,
    category: category ?? "all",
    items: items.map((it) => ({
      id: it.name,
      type: it.type,
      install: `pnpm dlx lerpa-cli add ${it.name}`,
      registryUrl: `https://lerpaui.com/r/${it.name}`,
    })),
  };
}

function tool_get_component(id: string) {
  const item = findItem(id);
  return {
    id: item.name,
    type: item.type,
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    install: `pnpm dlx lerpa-cli add ${item.name}`,
    files: item.files.map((f) => ({
      path: f.path,
      type: f.type,
      source: f.content,
    })),
  };
}

function tool_search_components(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return { total: 0, results: [] };

  const catalog = loadCatalog();
  const catById = new Map(catalog.map((c) => [c.id ?? c.name, c]));

  const scored: Array<{ id: string; type: string; score: number; description?: string }> = [];
  for (const it of loadItems()) {
    const name = it.name.toLowerCase();
    const entry = catById.get(it.name);
    const desc = entry?.description?.toLowerCase() ?? "";

    let score = 0;
    if (name === q) score += 100;
    if (name.includes(q)) score += 50;
    if (name.startsWith(q)) score += 25;
    for (const token of q.split(/[\s-]+/).filter(Boolean)) {
      if (name.includes(token)) score += 5;
      if (desc.includes(token)) score += 3;
    }
    if (score > 0) {
      scored.push({ id: it.name, type: it.type, score, description: entry?.description });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return {
    total: scored.length,
    query,
    results: scored.slice(0, 50).map(({ score: _score, ...rest }) => rest),
  };
}

// ---------------------------------------------------------------------------
// MCP server wiring.
// ---------------------------------------------------------------------------

const TOOLS = [
  {
    name: "list_components",
    description:
      "List Lerpa UI components from the registry, optionally filtered by category " +
      "(ai, buttons, cards, forms, creative, feedback, navigation, tables, calendars, " +
      "ecommerce, dashboard, auth, account, docs, blog).",
    inputSchema: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Optional category slug to filter results.",
        },
      },
    },
  },
  {
    name: "get_component",
    description:
      "Get the full registry item JSON for a single component, including embedded " +
      "source code from `packages/registry/items/<id>.json`.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id: { type: "string", description: "Component id (registry name)." },
      },
    },
  },
  {
    name: "search_components",
    description:
      "Fuzzy search across all Lerpa UI registry items by name and description. Returns up to 50 matches.",
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: {
        query: { type: "string", description: "Free-text query." },
      },
    },
  },
];

async function main() {
  const server = new Server(
    { name: "@lerpa/mcp-server", version: "0.1.0" },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

  server.setRequestHandler(CallToolRequestSchema, async (request: {
    params: { name: string; arguments?: Record<string, unknown> };
  }) => {
    const { name, arguments: args = {} } = request.params;
    try {
      let result: unknown;
      switch (name) {
        case "list_components":
          result = tool_list_components(args.category as string | undefined);
          break;
        case "get_component":
          result = tool_get_component(args.id as string);
          break;
        case "search_components":
          result = tool_search_components(args.query as string);
          break;
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", text: `Error in ${name}: ${message}` }],
      };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  // eslint-disable-next-line no-console
  console.error("[lerpa-mcp] stdio server ready");
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("[lerpa-mcp] fatal:", err);
  process.exit(1);
});
