import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');

function replaceExact(file, oldText, newText, label) {
  const target = path.join(ROOT, file);
  let text = fs.readFileSync(target, 'utf8');
  if (!text.includes(oldText)) throw new Error(`${label}: expected text was not found in ${file}`);
  text = text.replace(oldText, newText);
  fs.writeFileSync(target, text);
}

replaceExact(
  'tests/unit/media-governance.test.mjs',
  "    const target = path.join(root, relativePath.replace(/^\\//, ''));",
  "    const target = path.join(root, 'public', relativePath.replace(/^\\//, ''));",
  'unit raster public path'
);

replaceExact(
  'tests/integration/catalogue-profile-pipeline.test.mjs',
  "  assert.equal(c001.every(record => record.mediaState === 'governed-gap'), true);",
  "  assert.deepEqual(c001.map(record => [record.cultivarId, record.mediaState]), [\n    ['CUL-000011', 'approved-primary'],\n    ['CUL-000012', 'governed-gap'],\n    ['CUL-000013', 'approved-primary'],\n    ['CUL-000014', 'governed-gap'],\n    ['CUL-000015', 'governed-gap']\n  ]);",
  'Catalogue C-001 media-state baseline'
);

replaceExact(
  'tests/integration/media-pipeline.test.mjs',
  `test('media pipeline generates and verifies twenty deterministic illustration derivatives', () => {\n  const generated = run('scripts/process-media.mjs');\n  assert.equal(generated.status,0,generated.stderr);\n  const checked = run('scripts/process-media.mjs',['--check']);\n  assert.equal(checked.status,0,checked.stderr);\n  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT,'public/media/derivatives/manifest.json'),'utf8'));\n  assert.equal(manifest.version, 'media-pipeline-v2.2');\n  assert.equal(manifest.derivativeCount,20);\n  assert.deepEqual(manifest.publicationClasses, ['reference-standard']);\n  assert.equal(new Set(manifest.entries.map(entry => entry.sha256)).size,20);\n  assert.ok(manifest.entries.every(entry => entry.mimeType === 'image/svg+xml'));\n  assert.ok(manifest.entries.every(entry => entry.publicationClass === 'reference-standard'));\n});\n\ntest('media governance validator passes the five-record illustration cohort and RC-020 plan', () => {\n  const result = run('scripts/validate-media.mjs');\n  assert.equal(result.status,0,result.stderr);\n  assert.match(result.stdout,/5 Reference Standard assets; 0 Catalogue assets; 20 derivatives; 20-record RC coverage plan/);\n});`,
  `test('media pipeline generates and verifies Reference Standard and Catalogue derivatives', () => {\n  const generated = run('scripts/process-media.mjs');\n  assert.equal(generated.status,0,generated.stderr);\n  const checked = run('scripts/process-media.mjs',['--check']);\n  assert.equal(checked.status,0,checked.stderr);\n  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT,'public/media/derivatives/manifest.json'),'utf8'));\n  assert.equal(manifest.version, 'media-pipeline-v2.2');\n  assert.equal(manifest.derivativeCount,44);\n  assert.deepEqual([...manifest.publicationClasses].sort(), ['catalogue-profile','reference-standard']);\n  assert.equal(new Set(manifest.entries.map(entry => entry.sha256)).size,44);\n  assert.equal(manifest.entries.filter(entry => entry.mimeType === 'image/svg+xml').length,20);\n  assert.equal(manifest.entries.filter(entry => entry.mimeType === 'image/jpeg').length,24);\n  assert.deepEqual([...new Set(manifest.entries.map(entry => entry.publicationClass))].sort(), ['catalogue-profile','reference-standard']);\n});\n\ntest('media governance validator passes the governed Reference Standard and Catalogue cohorts', () => {\n  const result = run('scripts/validate-media.mjs');\n  assert.equal(result.status,0,result.stderr);\n  assert.match(result.stdout,/5 Reference Standard assets; 6 Catalogue assets; 44 derivatives; 20-record RC coverage plan/);\n});`,
  'media integration baseline'
);

replaceExact(
  'tests/integration/media-pipeline.test.mjs',
  "      const bytes = fs.readFileSync(path.join(root, derivative.path.replace(/^\\//,'')));",
  "      const bytes = fs.readFileSync(path.join(root, 'public', derivative.path.replace(/^\\//,'')));",
  'integration raster public path'
);

fs.rmSync(path.join(ROOT, 'scripts/patch-media-public-fixture.mjs'), { force:true });
console.log('Updated media unit and integration fixtures for static-public paths and the first six Catalogue assets.');
