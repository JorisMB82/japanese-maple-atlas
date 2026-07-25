import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const gates = readJson(path.join(ROOT, 'quality', 'quality-gates.json'));
const packageJson = readJson(path.join(ROOT, 'package.json'));
const lock = readJson(path.join(ROOT, 'package-lock.json'));
const manifest = readJson(path.join(ROOT, 'atlas-repository', 'manifest.json'));
const failures = [];
const checks = [];
const check = (condition, label, detail = '') => {
  if (condition) checks.push(`PASS  ${label}`);
  else failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
};
const exists = relative => fs.existsSync(path.join(ROOT, relative));

check(packageJson.version === gates.applicationVersion, 'application version matches governed quality configuration', packageJson.version);
check(lock.version === packageJson.version && lock.packages?.['']?.version === packageJson.version, 'package lock is synchronised', `${lock.version}/${lock.packages?.['']?.version}`);
check(manifest.repositoryVersion === gates.repositoryVersion, 'repository data version remains unchanged', manifest.repositoryVersion);
check(manifest.objectTotal === gates.repositoryInvariants.objectTotal, 'repository object total is stable', manifest.objectTotal);
check(manifest.objectCounts.cultivars === gates.repositoryInvariants.cultivars, 'cultivar count is stable');
check(manifest.objectCounts.assertions === gates.repositoryInvariants.assertions, 'assertion count is stable');
check(manifest.objectCounts.evidence === gates.repositoryInvariants.evidence, 'evidence count is stable');
check(manifest.objectCounts.relationships === gates.repositoryInvariants.relationships, 'relationship count is stable');
check(manifest.objectCounts.relationshipTypes === gates.repositoryInvariants.relationshipTypes, 'relationship type count is stable');
check(manifest.graph.nodes === gates.repositoryInvariants.graphNodes && manifest.graph.edges === gates.repositoryInvariants.graphEdges, 'graph inventory is stable');

for (const script of gates.requiredPackageScripts) check(Boolean(packageJson.scripts?.[script]), `package script ${script} exists`);
for (const file of [
  'tests/unit/search-engine.test.mjs',
  'tests/unit/knowledge-graph.test.mjs',
  'tests/unit/json-schema-validator.test.mjs',
  'tests/integration/repository-regression.test.mjs',
  'tests/integration/compiler-determinism.test.mjs',
  'tests/integration/schema-conformance.test.mjs',
  'tests/regression/static-export.test.mjs',
  'scripts/validate-schemas.mjs',
  'scripts/run-coverage.mjs',
  'scripts/generate-release-manifest.mjs',
  '.github/workflows/repository-validation.yml',
  '.github/workflows/release-readiness.yml',
  'docs/QA-001_Testing-and-Quality-Infrastructure_v1.0.md',
  'SPRINT-9.5.md'
]) check(exists(file), `required quality file ${file}`);

const workflow = exists('.github/workflows/repository-validation.yml') ? fs.readFileSync(path.join(ROOT, '.github/workflows/repository-validation.yml'), 'utf8') : '';
for (const command of ['npm ci', 'validate:schemas', 'test:coverage', 'test:regression', 'validate:quality']) check(workflow.includes(command), `CI includes ${command}`);
const releaseWorkflow = exists('.github/workflows/release-readiness.yml') ? fs.readFileSync(path.join(ROOT, '.github/workflows/release-readiness.yml'), 'utf8') : '';
for (const token of ['workflow_dispatch', 'refs/tags/v', 'release:manifest', 'upload-artifact', 'gh release create']) check(releaseWorkflow.includes(token), `release workflow includes ${token}`);

for (const file of gates.releaseFiles) check(exists(file), `release file ${file} exists`);
for (const temporary of [
  'scripts/finalize-sprint9.py',
  'scripts/finalize-sprint95.py',
  '.github/workflows/sprint-9-5-finalize.yml',
  '.github/workflows/sprint-9-5-lock-sync.yml'
]) check(!exists(temporary), `temporary file removed: ${temporary}`);

const outputExists = exists('out');
check(outputExists, 'production static export exists', 'run npm run build before npm run validate:quality');
if (outputExists) {
  for (const route of gates.requiredRoutes) {
    const clean = route === '/' ? '' : route.replace(/^\//, '').replace(/\/$/, '');
    const candidates = route === '/'
      ? [path.join(ROOT, 'out', 'index.html')]
      : [path.join(ROOT, 'out', `${clean}.html`), path.join(ROOT, 'out', clean, 'index.html')];
    check(candidates.some(file => fs.existsSync(file)), `static route ${route} exists`);
  }
}

console.log('Japanese Maple Atlas — Sprint 9.5 quality infrastructure validation');
for (const line of checks) console.log(line);
if (failures.length) {
  console.error(`\nErrors: ${failures.length}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('\nErrors: 0');
console.log('Quality infrastructure validation: PASS');
