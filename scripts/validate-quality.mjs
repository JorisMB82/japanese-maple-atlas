import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const gates = readJson(path.join(ROOT, 'quality', 'quality-gates.json'));
const packageJson = readJson(path.join(ROOT, 'package.json'));
const lock = readJson(path.join(ROOT, 'package-lock.json'));
const manifest = readJson(path.join(ROOT, 'atlas-repository', 'manifest.json'));
const catalogueDirectory = path.join(ROOT, 'atlas-repository', 'catalogue-profiles');
const identityRegistry = readJson(path.join(catalogueDirectory, 'contract', 'cultivar-identity-registry.json'));
const catalogueFiles = fs.readdirSync(catalogueDirectory).filter(file => /^CUL-\d{6}\.json$/.test(file)).sort();
const catalogueInputs = catalogueFiles.map(file => readJson(path.join(catalogueDirectory, file)));
const publishedCatalogueProfiles = catalogueInputs.filter(profile => profile.catalogueState === 'published');
const nonPublicCatalogueProfiles = catalogueInputs.filter(profile => profile.catalogueState !== 'published');
const failures = [];
const checks = [];
const check = (condition, label, detail = '') => {
  if (condition) checks.push(`PASS  ${label}`);
  else failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
};
const exists = relative => fs.existsSync(path.join(ROOT, relative));
const routeCandidates = route => {
  const clean = route === '/' ? '' : route.replace(/^\//, '').replace(/\/$/, '');
  return route === '/'
    ? [path.join(ROOT, 'out', 'index.html')]
    : [path.join(ROOT, 'out', `${clean}.html`), path.join(ROOT, 'out', clean, 'index.html')];
};

check(packageJson.version === gates.applicationVersion, 'application version matches governed quality configuration', packageJson.version);
check(lock.version === packageJson.version && lock.packages?.['']?.version === packageJson.version, 'package lock is synchronised', `${lock.version}/${lock.packages?.['']?.version}`);
check(manifest.repositoryVersion === gates.repositoryVersion, 'repository data version matches governed quality configuration', manifest.repositoryVersion);
check(manifest.compiler.version === gates.compilerVersion, 'compiler version matches governed quality configuration', manifest.compiler.version);
check(manifest.compiler.atomicPublication === true, 'compiler publication is transactional');
check(manifest.contract?.profile === 'canonical-rc-v1', 'canonical RC contract is active');
check(manifest.objectTotal === gates.repositoryInvariants.objectTotal, 'repository object total is stable', manifest.objectTotal);
check(manifest.objectCounts.cultivars === gates.repositoryInvariants.cultivars, 'Reference Standard cultivar count is stable');
check(publishedCatalogueProfiles.length === gates.repositoryInvariants.catalogueProfiles, 'published Catalogue Profile count matches governed quality configuration', publishedCatalogueProfiles.length);
check(identityRegistry.entries?.length === gates.repositoryInvariants.stableCultivarIdentities, 'stable cultivar identity inventory matches governed quality configuration', identityRegistry.entries?.length);
check(identityRegistry.status === 'approved' && identityRegistry.identityFamily === 'CUL-######', 'approved stable cultivar identity contract is active');
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
  'tests/unit/atlas-explorer.test.mjs',
  'tests/unit/reference-standard-contract.test.mjs',
  'tests/unit/catalogue-profile-contract.test.mjs',
  'tests/unit/catalogue-discovery.test.mjs',
  'tests/integration/repository-regression.test.mjs',
  'tests/integration/compiler-determinism.test.mjs',
  'tests/integration/compiler-scaling.test.mjs',
  'tests/integration/schema-conformance.test.mjs',
  'tests/integration/catalogue-profile-pipeline.test.mjs',
  'tests/regression/static-export.test.mjs',
  'scripts/validate-schemas.mjs',
  'scripts/validate-catalogue-profiles.mjs',
  'scripts/compile-catalogue-profiles.mjs',
  'scripts/scale-test-compiler.mjs',
  'scripts/validate-explorer.mjs',
  'scripts/run-coverage.mjs',
  'scripts/generate-release-manifest.mjs',
  '.github/workflows/repository-validation.yml',
  '.github/workflows/release-readiness.yml',
  'docs/QA-001_Testing-and-Quality-Infrastructure_v1.0.md',
  'docs/EXPLORER-001_Interactive-Atlas-Explorer_v1.0.md',
  'docs/DR-ENGINEERING-002_Catalogue-MVP-Data-Path.md',
  'docs/DR-ENGINEERING-003_Non-Public-Catalogue-Discovery-Boundary.md',
  'SPRINT-9.5.md',
  'SPRINT-10.md',
  'SPRINT-11.md',
  'docs/ROADMAP-002_Post-Sprint-10_RC-020-Visual-Atlas-Roadmap_v1.0.md',
  'docs/ROADMAP-002A_Two-Speed-Catalogue-and-Reference-Standard-Addendum_v1.0_APPROVED.md',
  'docs/COMPILER-002_Scalable-Reference-Standard-Ingestion_v1.0.md',
  'docs/DR-011-001_Canonical-RC-Contract-and-Legacy-Adapters.md'
]) check(exists(file), `required quality file ${file}`);

const workflow = exists('.github/workflows/repository-validation.yml') ? fs.readFileSync(path.join(ROOT, '.github/workflows/repository-validation.yml'), 'utf8') : '';
for (const command of ['npm ci', 'validate:reference-standards', 'validate:catalogue', 'compile:catalogue:check', 'validate:scale', 'validate:schemas', 'validate:explorer', 'test:coverage', 'test:regression', 'validate:quality']) check(workflow.includes(command), `CI includes ${command}`);
const releaseWorkflow = exists('.github/workflows/release-readiness.yml') ? fs.readFileSync(path.join(ROOT, '.github/workflows/release-readiness.yml'), 'utf8') : '';
for (const token of ['workflow_dispatch', 'refs/tags/v', 'verify', 'release:manifest', 'upload-artifact', 'gh release create']) check(releaseWorkflow.includes(token), `release workflow includes ${token}`);

for (const file of gates.releaseFiles) check(exists(file), `release file ${file} exists`);
for (const profile of catalogueInputs) {
  check(profile.publicationClass === 'catalogue-profile', `Catalogue input ${profile.cultivarId} declares its publication class`);
  if (profile.catalogueState === 'published') {
    check(profile.review?.approvalState === 'batch-approved', `published Catalogue input ${profile.cultivarId} has batch approval`);
    check(Boolean(profile.publishedAt), `published Catalogue input ${profile.cultivarId} records publication time`);
  } else {
    check(profile.publishedAt === null, `non-public Catalogue input ${profile.cultivarId} keeps publishedAt null`);
  }
}
for (const temporary of [
  'scripts/finalize-sprint9.py',
  'scripts/finalize-sprint95.py',
  'scripts/finalize-sprint10.mjs',
  '.github/workflows/sprint-9-5-finalize.yml',
  '.github/workflows/sprint-9-5-lock-sync.yml',
  '.github/workflows/sprint-10-lock-sync.yml'
]) check(!exists(temporary), `temporary file removed: ${temporary}`);

const scaleReportPath = path.join(ROOT, 'quality-reports', 'compiler-scale.json');
check(fs.existsSync(scaleReportPath), 'compiler scale report exists', 'run npm run validate:scale');
if (fs.existsSync(scaleReportPath)) {
  const scale = readJson(scaleReportPath);
  const targets = scale.targets?.map(item => item.targetRecords) || [];
  check(JSON.stringify(targets) === JSON.stringify(gates.compilerScaleTargets), 'compiler scale targets pass', targets.join(', '));
  check(scale.targets.every(item => item.uniqueObjectIds && item.searchRecords === item.targetRecords), 'compiler scale integrity checks pass');
}

const outputExists = exists('out');
check(outputExists, 'production static export exists', 'run npm run build before npm run validate:quality');
if (outputExists) {
  const requiredRoutes = [
    ...gates.requiredRoutes,
    ...publishedCatalogueProfiles.map(profile => `/cultivars/${profile.slug}`)
  ];
  for (const route of requiredRoutes) check(routeCandidates(route).some(file => fs.existsSync(file)), `static route ${route} exists`);
  for (const profile of nonPublicCatalogueProfiles) {
    const route = `/cultivars/${profile.slug}`;
    check(routeCandidates(route).every(file => !fs.existsSync(file)), `non-public Catalogue input ${profile.cultivarId} has no static route`);
  }
}

console.log('Japanese Maple Atlas — two-speed quality infrastructure validation');
for (const line of checks) console.log(line);
if (failures.length) {
  console.error(`\nErrors: ${failures.length}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('\nErrors: 0');
console.log('Quality infrastructure validation: PASS');
