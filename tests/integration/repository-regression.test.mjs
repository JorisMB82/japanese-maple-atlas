import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, repositoryFixture } from '../helpers/repository-fixture.mjs';

const fixture = repositoryFixture();
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

test('repository manifest preserves Sprint 9 governed invariants', () => {
  assert.equal(fixture.manifest.repositoryVersion, '0.9.0');
  assert.equal(fixture.manifest.compiler.version, '1.2.0');
  assert.equal(fixture.manifest.objectTotal, 235);
  assert.deepEqual(fixture.manifest.objectCounts, {
    cultivars: 5,
    assertions: 110,
    evidence: 35,
    sources: 5,
    taxa: 2,
    relationships: 26,
    relationshipTypes: 10,
    media: 5,
    contributors: 2,
    submissions: 5,
    editorialWorkflows: 5,
    editorialReviews: 25
  });
  assert.equal(fixture.manifest.graph.nodes, 7);
  assert.equal(fixture.manifest.graph.edges, 26);
});

test('object index covers every first-class repository object exactly once', () => {
  assert.equal(fixture.objectIndex.objectCount, 235);
  assert.equal(fixture.objectIndex.objects.length, 235);
  const ids = fixture.objectIndex.objects.map(item => item.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const item of fixture.objectIndex.objects) {
    const file = path.join(ROOT, item.path);
    assert.equal(fs.existsSync(file), true, `${item.path} should exist`);
    assert.equal(sha256(fs.readFileSync(file)), item.sha256, `${item.path} should match its indexed hash`);
  }
});

test('repository hash is reproducible from the sorted object index', () => {
  const calculated = sha256(fixture.objectIndex.objects
    .slice()
    .sort((a, b) => a.path.localeCompare(b.path))
    .map(item => `${item.path}:${item.sha256}`)
    .join('\n'));
  assert.equal(calculated, fixture.manifest.repositoryHash);
  assert.equal(calculated, fixture.hashes.repositoryHash);
});

test('input and generated hash registries match files on disk', () => {
  for (const [relative, expected] of Object.entries(fixture.hashes.inputs)) {
    assert.equal(sha256(fs.readFileSync(path.join(ROOT, relative))), expected, `${relative} input hash`);
  }
  for (const [relative, expected] of Object.entries(fixture.hashes.generated)) {
    assert.equal(sha256(fs.readFileSync(path.join(ROOT, relative))), expected, `${relative} generated hash`);
  }
});

test('cultivar, assertion, evidence and source references remain closed', () => {
  const cultivarIds = new Set(fixture.cultivars.map(item => item.id));
  const taxonIds = new Set(fixture.taxa.map(item => item.id));
  const assertionIds = new Set(fixture.assertions.map(item => item.id));
  const evidenceIds = new Set(fixture.evidence.map(item => item.id));
  const sourceIds = new Set(fixture.sources.map(item => item.id));
  const relationshipIds = new Set(fixture.relationships.map(item => item.id));
  const mediaIds = new Set(fixture.media.map(item => item.id));

  for (const cultivar of fixture.cultivars) {
    assert.equal(taxonIds.has(cultivar.taxonId), true);
    assert.equal(cultivar.assertionIds.length, 22);
    assert.ok(cultivar.assertionIds.every(id => assertionIds.has(id)));
    assert.ok(cultivar.relationshipIds.every(id => relationshipIds.has(id)));
    assert.ok(cultivar.mediaIds.every(id => mediaIds.has(id)));
  }
  for (const assertion of fixture.assertions) {
    assert.equal(cultivarIds.has(assertion.subjectId), true);
    assert.ok(assertion.evidenceIds.every(id => evidenceIds.has(id)));
  }
  for (const evidence of fixture.evidence) {
    assert.equal(sourceIds.has(evidence.sourceId), true);
    assert.ok(evidence.assertionIds.every(id => assertionIds.has(id)));
  }
});

test('editorial workflow baseline remains complete and frozen', () => {
  assert.equal(fixture.contributors.length, 2);
  assert.equal(fixture.submissions.length, 5);
  assert.equal(fixture.editorialWorkflows.length, 5);
  assert.equal(fixture.editorialReviews.length, 25);
  for (const workflow of fixture.editorialWorkflows) {
    assert.equal(workflow.status, 'frozen');
    assert.equal(workflow.currentStage, 'freeze');
    assert.equal(workflow.stages.length, 12);
    assert.ok(workflow.stages.every(stage => stage.status === 'complete'));
    assert.equal(workflow.reviewIds.length, 5);
  }
});

test('search and graph indexes cover the five frozen cultivar records', () => {
  const cultivarIds = fixture.cultivars.map(item => item.id).sort();
  assert.deepEqual(fixture.searchIndex.records.map(item => item.id).sort(), cultivarIds);
  assert.deepEqual(fixture.graph.nodes.filter(node => node.nodeType === 'cultivar').map(node => node.id).sort(), cultivarIds);
  assert.equal(fixture.graph.edges.length, fixture.relationships.length);
});
