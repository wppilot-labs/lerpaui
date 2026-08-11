import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const CLI_PATH = fileURLToPath(new URL('../dist/index.js', import.meta.url));
const PRODUCT_OPERATION_COMPONENTS = [
  'api-key-field',
  'async-action-button',
  'conflict-resolution-panel',
  'connection-status-banner',
  'data-refresh-control',
  'destructive-confirmation-field',
  'filter-chip-group',
  'query-state-panel',
  'upload-queue',
  'validation-summary',
];

let workspace;

function runCli(args, expectedStatus = 0) {
  const result = spawnSync(process.execPath, [CLI_PATH, ...args], {
    cwd: workspace,
    encoding: 'utf8',
    env: { ...process.env, NO_COLOR: '1' },
    maxBuffer: 20 * 1024 * 1024,
  });
  assert.ifError(result.error);
  assert.equal(
    result.status,
    expectedStatus,
    `lerpa ${args.join(' ')}\nstdout:\n${result.stdout}\nstderr:\n${result.stderr}`
  );
  return result;
}

function writeFixture() {
  mkdirSync(join(workspace, 'src', 'app'), { recursive: true });
  writeFileSync(
    join(workspace, 'package.json'),
    JSON.stringify({
      name: 'lerpa-cli-fixture',
      private: true,
      dependencies: { clsx: '^2.1.1', 'tailwind-merge': '^3.0.0' },
    })
  );
  writeFileSync(
    join(workspace, 'tsconfig.json'),
    `{
      // JSONC and a trailing comma are both valid here.
      "compilerOptions": {
        "baseUrl": ".",
        "paths": { "@/*": ["./src/*"], },
      },
    }`
  );
}

function initFixture() {
  writeFixture();
  runCli(['init', '--yes', '--no-install', '--pm', 'pnpm', '--css', 'src/app/globals.css']);
}

beforeEach(() => {
  workspace = mkdtempSync(join(tmpdir(), 'lerpa-cli-test-'));
});

afterEach(() => {
  const resolved = resolve(workspace);
  assert.equal(basename(resolved).startsWith('lerpa-cli-test-'), true);
  rmSync(resolved, { recursive: true, force: true });
});

describe('lerpa CLI', () => {
  test('reports the package version and canonical repository', () => {
    assert.match(readFileSync(CLI_PATH, 'utf8'), /^#!\/usr\/bin\/env node/);
    assert.equal(runCli(['--version']).stdout.trim(), '0.3.0');
    assert.match(runCli(['info']).stdout, /github\.com\/wppilot-labs\/lerpaui/);
  });

  test('lists and searches with machine-readable filters', () => {
    const blocks = JSON.parse(runCli(['list', '--type', 'block', '--limit', '3', '--json']).stdout);
    assert.equal(blocks.length, 3);
    assert.equal(
      blocks.every((item) => item.type === 'registry:block'),
      true
    );

    const buttons = JSON.parse(runCli(['search', 'button', '--limit', '5', '--json']).stdout);
    assert.equal(buttons.length > 0 && buttons.length <= 5, true);
    assert.equal(
      buttons.every((item) => item.name.includes('button')),
      true
    );
  });

  test('initializes JSONC aliases, applies the set alias, and passes strict doctor', () => {
    initFixture();
    assert.equal(existsSync(join(workspace, 'lerpa.json')), true);
    assert.equal(existsSync(join(workspace, 'src', 'lib', 'utils.ts')), true);
    assert.match(
      readFileSync(join(workspace, 'src', 'app', 'globals.css'), 'utf8'),
      /lerpa-ui:tokens:start/
    );
    assert.match(
      readFileSync(join(workspace, 'src', 'app', 'globals.css'), 'utf8'),
      /html\s*\{\s*position:\s*relative;/
    );

    runCli(['set', 'ocean', '--yes']);
    assert.match(
      readFileSync(join(workspace, 'src', 'app', 'globals.css'), 'utf8'),
      /lerpa-ui:theme:start/
    );

    const report = JSON.parse(runCli(['doctor', '--strict', '--json']).stdout);
    assert.equal(report.ok, true);
    assert.equal(
      report.checks.every((check) => check.status === 'pass'),
      true
    );
  });

  test('supports multi-add, dry-run, changed-file refusal, and recoverable force overwrite', () => {
    initFixture();
    const buttonPath = join(workspace, 'src', 'components', 'ui', 'button.tsx');

    assert.match(
      runCli(['add', 'button', '--yes', '--dry-run', '--no-install']).stdout,
      /Dry run complete/
    );
    assert.equal(existsSync(buttonPath), false);

    runCli(['add', 'button', 'spinner', '--yes', '--no-install']);
    assert.equal(existsSync(buttonPath), true);
    assert.equal(existsSync(join(workspace, 'src', 'components', 'ui', 'spinner.tsx')), true);

    writeFileSync(buttonPath, '// local change\n');
    const refused = runCli(['add', 'button', '--yes', '--no-install'], 1);
    assert.match(refused.stderr, /local changes.*--force/i);
    assert.equal(readFileSync(buttonPath, 'utf8'), '// local change\n');

    runCli(['add', 'button', '--yes', '--force', '--no-install']);
    assert.notEqual(readFileSync(buttonPath, 'utf8'), '// local change\n');
    assert.equal(readFileSync(`${buttonPath}.bak`, 'utf8'), '// local change\n');
  });

  test('installs every product-operations component from the bundled registry', () => {
    initFixture();
    runCli(['add', ...PRODUCT_OPERATION_COMPONENTS, '--yes', '--no-install']);

    for (const component of PRODUCT_OPERATION_COMPONENTS) {
      const componentPath = join(workspace, 'src', 'components', 'ui', `${component}.tsx`);
      assert.equal(existsSync(componentPath), true, `${component} was not installed`);
      assert.match(readFileSync(componentPath, 'utf8'), /export\s+(?:function|const)\s+/);
    }
  });

  test('rejects install aliases that escape the project', () => {
    initFixture();
    const outsideName = `lerpa-cli-outside-${basename(workspace)}`;
    const configPath = join(workspace, 'lerpa.json');
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    config.aliases.components = `../${outsideName}`;
    writeFileSync(configPath, JSON.stringify(config));

    const result = runCli(['add', 'button', '--yes', '--dry-run', '--no-install'], 1);
    assert.match(result.stderr, /inside the project|outside the project/i);
    assert.equal(existsSync(join(dirname(workspace), outsideName)), false);
  });
});
