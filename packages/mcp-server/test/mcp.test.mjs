import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

import {
  PACKAGE_VERSION,
  TOOLS,
  getComponent,
  getRegistryStats,
  listCategories,
  listComponents,
  searchComponents,
} from '../dist/index.js';

const SERVER_PATH = fileURLToPath(new URL('../dist/index.js', import.meta.url));

describe('Lerpa MCP server', () => {
  test('reports exact bundled registry statistics', () => {
    const stats = getRegistryStats();
    assert.equal(PACKAGE_VERSION, '0.3.0');
    assert.deepEqual(
      {
        totalItems: stats.totalItems,
        uiComponents: stats.uiComponents,
        blocks: stats.blocks,
        runtimeNetworkRequired: stats.runtimeNetworkRequired,
      },
      { totalItems: 1328, uiComponents: 1109, blocks: 219, runtimeNetworkRequired: false }
    );
    assert.equal(stats.catalogEntries > 0 && stats.catalogEntries <= stats.totalItems, true);
    assert.equal(listCategories().total > 0, true);
  });

  test('paginates, filters, and emits usable registry URLs', () => {
    const firstPage = listComponents();
    assert.equal(firstPage.returned, 100);
    assert.equal(firstPage.nextOffset, 100);
    assert.equal(
      firstPage.items.every((item) => item.registryUrl.endsWith(`${item.id}.json`)),
      true
    );

    const blocks = listComponents({ type: 'block', limit: 10, offset: 5 });
    assert.equal(blocks.returned, 10);
    assert.equal(blocks.offset, 5);
    assert.equal(
      blocks.items.every((item) => item.type === 'registry:block'),
      true
    );
  });

  test('returns component source and ranked search results', () => {
    const button = getComponent('button');
    assert.equal(button.id, 'button');
    assert.equal(button.files.length > 0, true);
    assert.match(button.files[0].source, /button/i);

    const conflictPanel = getComponent('conflict-resolution-panel');
    assert.equal(conflictPanel.id, 'conflict-resolution-panel');
    assert.match(conflictPanel.files[0].source, /ConflictResolutionPanel/);

    const results = searchComponents({ query: 'pricing', limit: 5 });
    assert.equal(results.returned > 0 && results.returned <= 5, true);
    assert.equal(
      results.results.some((item) => /pricing/i.test(`${item.id} ${item.description ?? ''}`)),
      true
    );

    const conflictResults = searchComponents({ query: 'conflict resolution', limit: 5 });
    assert.equal(
      conflictResults.results.some((item) => item.id === 'conflict-resolution-panel'),
      true
    );

    assert.throws(() => getComponent('../button'), /invalid format/i);
    assert.throws(() => searchComponents({ query: '' }), /cannot be empty/i);
    assert.throws(() => listComponents({ limit: 0 }), /between 1 and 250/i);
  });

  test('serves all five tools over a real stdio MCP session', { timeout: 20_000 }, async () => {
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [SERVER_PATH],
      stderr: 'pipe',
    });
    const client = new Client({ name: 'lerpa-mcp-test', version: '1.0.0' }, { capabilities: {} });

    try {
      await client.connect(transport);
      const listed = await client.listTools();
      assert.deepEqual(
        listed.tools.map((tool) => tool.name).sort(),
        TOOLS.map((tool) => tool.name).sort()
      );

      const response = await client.callTool({ name: 'get_registry_stats', arguments: {} });
      assert.notEqual(response.isError, true);
      assert.equal(response.content[0]?.type, 'text');
      const stats = JSON.parse(response.content[0].text);
      assert.equal(stats.totalItems, 1328);
      assert.equal(stats.version, '0.3.0');
    } finally {
      await client.close();
    }
  });
});
