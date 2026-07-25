import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const gates = JSON.parse(fs.readFileSync(path.join(ROOT, 'quality', 'quality-gates.json'), 'utf8'));
const reportDirectory = path.join(ROOT, 'quality-reports');
fs.mkdirSync(reportDirectory, { recursive: true });

const args = [
  '--test',
  '--experimental-test-coverage',
  `--test-coverage-lines=${gates.coverage.lines}`,
  `--test-coverage-functions=${gates.coverage.functions}`,
  `--test-coverage-branches=${gates.coverage.branches}`,
  'tests/unit'
];
const result = spawnSync(process.execPath, args, { cwd: ROOT, encoding: 'utf8', env: { ...process.env, CI: process.env.CI || 'true' } });
const output = `${result.stdout || ''}${result.stderr || ''}`;
fs.writeFileSync(path.join(reportDirectory, 'coverage.txt'), output);
process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');
if (result.error) {
  console.error(result.error.stack || result.error.message);
  process.exit(1);
}
process.exit(result.status ?? 1);
