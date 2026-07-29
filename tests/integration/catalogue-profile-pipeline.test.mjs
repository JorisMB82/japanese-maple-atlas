import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { compileCatalogueDirectory } from '../../lib/catalogue-profile-compiler.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const schemaPath = path.join(ROOT, 'atlas-repository/schemas/catalogue-profile.schema.json');
const fixture = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/catalogue-profiles/CUL-000011.json'), 'utf8'));
const canonicalRegistry = JSON.parse(fs.readFileSync(path.join(ROOT, 'atlas-repository/catalogue-profiles/contract/cultivar-identity-registry.json'), 'utf8'));
const clone = value => structuredClone(value);

function writeAssignedRegistry(root, assignments) {
  const registry = clone(canonicalRegistry);
  for (const [cultivarId, name] of Object.entries(assignments)) {
    const entry = registry.entries.find(item => item.cultivarId === cultivarId);
    Object.assign(entry, { state: 'assigned-catalogue', assignedWorkingName: name, assignmentDecision: 'TEST-ASSIGNMENT-001' });
  }
  const target = path.join(root, 'registry.json');
  fs.writeFileSync(target, `${JSON.stringify(registry, null, 2)}\n`);
  return target;
}

test('generic Catalogue directory compiles a synthetic governed-gap profile', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-catalogue-'));
  const inputDir = path.join(root, 'catalogue-profiles');
  fs.mkdirSync(inputDir, { recursive: true });
  fs.writeFileSync(path.join(inputDir, 'CUL-000011.json'), `${JSON.stringify(fixture, null, 2)}\n`);
  const registryPath = writeAssignedRegistry(root, { 'CUL-000011': fixture.acceptedWorkingName });
  const result = compileCatalogueDirectory({ inputDir, schemaPath, registryPath, taxonIds: new Set(['TAX-APAL']) });
  assert.equal(result.records.length, 1);
  assert.equal(result.diagnostics[0].status, 'pass');
  assert.equal(result.records[0].catalogueProfile.path.endsWith('CUL-000011.json'), true);
  fs.rmSync(root, { recursive: true, force: true });
});

test('compiler detects duplicate slugs across Catalogue identities', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-catalogue-'));
  const inputDir = path.join(root, 'catalogue-profiles');
  fs.mkdirSync(inputDir, { recursive: true });
  const second = clone(fixture);
  second.cultivarId = 'CUL-000012';
  second.programmeSlot = '012';
  second.sources[0].id = 'SRC-CUL-000012-01';
  fs.writeFileSync(path.join(inputDir, 'CUL-000011.json'), `${JSON.stringify(fixture, null, 2)}\n`);
  fs.writeFileSync(path.join(inputDir, 'CUL-000012.json'), `${JSON.stringify(second, null, 2)}\n`);
  const registryPath = writeAssignedRegistry(root, {
    'CUL-000011': fixture.acceptedWorkingName,
    'CUL-000012': second.acceptedWorkingName
  });
  assert.throws(
    () => compileCatalogueDirectory({ inputDir, schemaPath, registryPath, taxonIds: new Set(['TAX-APAL']) }),
    /duplicate slug synthetic-amber-fan/
  );
  fs.rmSync(root, { recursive: true, force: true });
});

test('canonical Catalogue directory compiles published C-001 and non-public C-002 editorial candidates', () => {
  const inputDir = path.join(ROOT, 'atlas-repository/catalogue-profiles');
  const registryPath = path.join(inputDir, 'contract/cultivar-identity-registry.json');
  const result = compileCatalogueDirectory({ inputDir, schemaPath, registryPath, taxonIds: new Set(['TAX-APAL', 'TAX-ASHI']) });
  const expectedIds = Array.from({ length: 10 }, (_, index) => `CUL-${String(index + 11).padStart(6, '0')}`);
  const c001 = result.records.filter(record => Number(record.cultivarId.slice(-6)) <= 15);
  const c002 = result.records.filter(record => Number(record.cultivarId.slice(-6)) >= 16);

  assert.deepEqual(result.records.map(record => record.cultivarId), expectedIds);
  assert.deepEqual(result.diagnostics.map(item => item.status), expectedIds.map(() => 'pass'));

  assert.equal(c001.length, 5);
  assert.equal(c001.every(record => record.catalogueProfile.state === 'published'), true);
  assert.equal(c001.every(record => Boolean(record.catalogueProfile.publishedAt)), true);
  assert.equal(c001.every(record => record.catalogueProfile.review.approvalState === 'batch-approved'), true);
  assert.equal(c001.every(record => record.mediaState === 'governed-gap'), true);

  assert.equal(c002.length, 5);
  assert.equal(c002.every(record => record.catalogueProfile.state === 'review-ready'), true);
  assert.equal(c002.every(record => record.catalogueProfile.publishedAt === null), true);
  assert.equal(c002.every(record => record.catalogueProfile.review.approvalState === 'editorial-approved'), true);
  assert.equal(c002.every(record => record.mediaState === 'candidate-under-review'), true);
});
