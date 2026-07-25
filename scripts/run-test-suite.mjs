import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const suite = process.argv[2];
const allowedSuites = new Set(['unit', 'integration', 'regression']);
if (!allowedSuites.has(suite)) {
  console.error(`Usage: node scripts/run-test-suite.mjs <${[...allowedSuites].join('|')}>`);
  process.exit(1);
}

const directory = path.join(ROOT, 'tests', suite);
const files = fs.readdirSync(directory, { withFileTypes: true })
  .filter(entry => entry.isFile() && entry.name.endsWith('.test.mjs'))
  .map(entry => path.join('tests', suite, entry.name))
  .sort();
if (!files.length) {
  console.error(`No ${suite} test files found.`);
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--test', ...files], {
  cwd: ROOT,
  stdio: 'inherit',
  env: { ...process.env, CI: process.env.CI || 'true' }
});
if (result.error) {
  console.error(result.error.stack || result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
