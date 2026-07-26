import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from '../helpers/repository-fixture.mjs';
import { syntheticReferenceStandard, syntheticSupport } from '../helpers/synthetic-reference-standard.mjs';

function run(args) {
  return spawnSync(process.execPath, ['scripts/compile-atlas.mjs', ...args], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, CI: 'true' } });
}

function prepareCohort({ malformed = false } = {}) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'jma-rc006-'));
  const inputDir = path.join(temp, 'reference-standards');
  const sourceDir = path.join(temp, 'sources');
  const mediaDir = path.join(temp, 'media');
  fs.mkdirSync(inputDir, { recursive: true });
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.mkdirSync(mediaDir, { recursive: true });
  for (let number = 1; number <= 5; number += 1) {
    const id = `RC-${String(number).padStart(3, '0')}`;
    fs.copyFileSync(path.join(ROOT, 'atlas-repository', 'reference-standards', `${id}.md`), path.join(inputDir, `${id}.md`));
    fs.copyFileSync(path.join(ROOT, 'atlas-repository', 'reference-standards', 'sources', `${id}.sources.json`), path.join(sourceDir, `${id}.sources.json`));
    fs.copyFileSync(path.join(ROOT, 'atlas-repository', 'reference-standards', 'media', `${id}.media.json`), path.join(mediaDir, `${id}.media.json`));
  }
  const id = 'RC-006';
  let markdown = syntheticReferenceStandard(id);
  if (malformed) markdown = markdown.replace('**Compiler profile:** canonical-rc-v1  \n', '');
  fs.writeFileSync(path.join(inputDir, `${id}.md`), markdown);
  const support = syntheticSupport(id, ROOT);
  fs.writeFileSync(path.join(sourceDir, `${id}.sources.json`), `${JSON.stringify(support.provenance, null, 2)}\n`);
  fs.writeFileSync(path.join(mediaDir, `${id}.media.json`), `${JSON.stringify(support.media, null, 2)}\n`);
  return { temp, inputDir, sourceDir, mediaDir };
}

test('a conforming RC-006 preflights and dry-runs without compiler source changes', () => {
  const cohort = prepareCohort();
  try {
    const args = ['--dry-run', '--input-dir', cohort.inputDir, '--source-dir', cohort.sourceDir, '--media-dir', cohort.mediaDir];
    const result = run(args);
    assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
    assert.match(result.stdout, /Approved Reference Standards: 6/);
    assert.match(result.stdout, /PASS  RC-006 — canonical/);
    assert.match(result.stdout, /Repository objects: 268/);
  } finally {
    fs.rmSync(cohort.temp, { recursive: true, force: true });
  }
});

test('malformed RC-006 fails preflight without changing the approved repository', () => {
  const cohort = prepareCohort({ malformed: true });
  const manifestPath = path.join(ROOT, 'atlas-repository', 'manifest.json');
  const before = fs.readFileSync(manifestPath, 'utf8');
  try {
    const result = run(['--preflight', '--input-dir', cohort.inputDir, '--source-dir', cohort.sourceDir, '--media-dir', cohort.mediaDir]);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /missing canonical metadata/);
    assert.equal(fs.readFileSync(manifestPath, 'utf8'), before);
  } finally {
    fs.rmSync(cohort.temp, { recursive: true, force: true });
  }
});

test('synthetic scale validation passes for 20, 25 and 150 records', { timeout: 120000 }, () => {
  const result = spawnSync(process.execPath, ['scripts/scale-test-compiler.mjs'], { cwd: ROOT, encoding: 'utf8', env: { ...process.env, CI: 'true' } });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS  20 records/);
  assert.match(result.stdout, /PASS  25 records/);
  assert.match(result.stdout, /PASS  150 records/);
  const report = JSON.parse(fs.readFileSync(path.join(ROOT, 'quality-reports', 'compiler-scale.json'), 'utf8'));
  assert.deepEqual(report.targets.map(item => item.targetRecords), [20, 25, 150]);
  assert.ok(report.targets.every(item => item.uniqueObjectIds && item.searchRecords === item.targetRecords));
});
