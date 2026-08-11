import * as fs from 'fs';
import * as path from 'path';

const PACKAGE_ROOT = path.join(__dirname, '..');
const ITEMS_DIR = path.join(PACKAGE_ROOT, 'items');
const UI_ROOT = path.join(PACKAGE_ROOT, '..', 'ui', 'src');

function kebab(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function kebabPath(value: string): string {
  const parsed = path.posix.parse(value);
  return path.posix.join(parsed.dir, `${kebab(parsed.name)}${parsed.ext}`);
}

function transformSource(source: string): string {
  return source
    .replace(/^\uFEFF/, '')
    .replace(/from\s+(['"])\.\.\/lib\/cn\1/g, 'from "@/lib/utils"')
    .replace(/from\s+(['"])\.\.\/animation\/hooks\1/g, 'from "./use-animation-hooks"')
    .replace(
      /from\s+(['"])\.\/([A-Z][A-Za-z0-9]*)\1/g,
      (_full, quote: string, name: string) => `from ${quote}./${kebab(name)}${quote}`
    );
}

function buildSourceIndex(): Map<string, string[]> {
  const result = new Map<string, string[]>();
  for (const directoryName of ['components', 'blocks']) {
    const directory = path.join(UI_ROOT, directoryName);
    for (const filename of fs
      .readdirSync(directory)
      .filter((name) => /\.tsx?$/.test(name) && !name.includes('.test.'))
      .sort()) {
      const extension = path.extname(filename);
      const base = filename.slice(0, -extension.length);
      for (const key of [filename.toLowerCase(), `${kebab(base)}${extension}`]) {
        const matches = result.get(key) ?? [];
        matches.push(path.join(directory, filename));
        result.set(key, matches);
      }
    }
  }
  return result;
}

const sourceIndex = buildSourceIndex();

function findSource(installPath: string): string | null {
  const matches = sourceIndex.get(path.posix.basename(installPath).toLowerCase());
  if (!matches?.length) return null;
  const preferred = installPath.includes('/blocks/') ? 'blocks' : 'components';
  return (
    matches.find((candidate) => candidate.includes(`${path.sep}${preferred}${path.sep}`)) ??
    matches[0]
  );
}

interface ItemFile {
  path: string;
  content: string;
}

interface Item {
  name: string;
  files: ItemFile[];
}

const requested = process.argv.slice(2).filter((argument) => argument !== '--');

if (!requested.length) {
  console.error('Pass one or more registry item ids to sync.');
  process.exit(1);
}

for (const itemName of [...new Set(requested)]) {
  if (!/^[a-z0-9-]+$/.test(itemName)) {
    throw new Error(`Invalid item id: ${itemName}`);
  }
  const itemPath = path.join(ITEMS_DIR, `${itemName}.json`);
  if (!fs.existsSync(itemPath)) throw new Error(`Registry item not found: ${itemName}`);

  const item = JSON.parse(fs.readFileSync(itemPath, 'utf-8')) as Item;
  let synced = 0;
  for (const file of item.files ?? []) {
    const sourcePath = findSource(file.path);
    if (!sourcePath) continue;
    file.path = kebabPath(file.path);
    file.content = transformSource(fs.readFileSync(sourcePath, 'utf-8'));
    synced++;
  }
  if (!synced) throw new Error(`${itemName} has no matching packages/ui source file.`);

  fs.writeFileSync(itemPath, `${JSON.stringify(item, null, 2)}\n`, 'utf-8');
  console.log(`Synced ${itemName}: ${synced} source file(s).`);
}
