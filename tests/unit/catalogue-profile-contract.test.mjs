import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  compileCatalogueProfile,
  isPublishedCatalogueRecord,
  stableCatalogueSlug,
  validateCatalogueProfile,
  validateIdentityRegistry
} from '../../lib/catalogue-profile-compiler.mjs';

const ROOT = path.resolve(import.meta.dirname, '../..');
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'atlas-repository/schemas/catalogue-profile.schema.json'), 'utf8'));
const fixture = JSON.parse(fs.readFileSync(path.join(ROOT, 'tests/fixtures/catalogue-profiles/CUL-000011.json'), 'utf8'));
const canonicalRegistry = JSON.parse(fs.readFileSync(path.join(ROOT, 'atlas-repository/catalogue-profiles/contract/cultivar-identity-registry.json'), 'utf8'));
const clone = value => structuredClone(value);
const assignedRegistry = () => {
  const registry = clone(canonicalRegistry);
  const entry = registry.entries.find(item => item.cultivarId === 'CUL-000011');
  Object.assign(entry, {
    state: 'assigned-catalogue',
    assignedWorkingName: fixture.acceptedWorkingName,
    assignmentDecision: 'TEST-ASSIGNMENT-001'
  });
  return registry;
};
const reservedRegistry = () => {
  const registry = clone(canonicalRegistry);
  const entry = registry.entries.find(item => item.cultivarId === 'CUL-000011');
  Object.assign(entry, {
    state: 'reserved-catalogue-slot',
    assignedWorkingName: null,
    assignmentDecision: null
  });
  delete entry.batchId;
  delete entry.preliminaryRisk;
  return registry;
};

function messages(result) {
  return result.errors.join('\n');
}

test('approved identity registry preserves deterministic RC mappings and owner-approved Catalogue assignments', () => {
  const result = validateIdentityRegistry(canonicalRegistry);
  assert.equal(result.valid, true, messages(result));
  assert.equal(result.byId.get('CUL-000001').referenceStandardId, 'RC-001');
  assert.equal(result.byId.get('CUL-000011').state, 'assigned-catalogue');
  assert.equal(result.byId.get('CUL-000011').assignedWorkingName, 'Orange Dream');
  assert.equal(result.byId.get('CUL-000025').state, 'assigned-catalogue');
  assert.equal(result.byId.get('CUL-000025').assignedWorkingName, 'Red Pygmy');
});

test('Catalogue profile validates and compiles through a stable cultivar identity', () => {
  const result = validateCatalogueProfile(fixture, schema, assignedRegistry(), { taxonIds: new Set(['TAX-APAL']) });
  assert.equal(result.valid, true, messages(result));
  const compiled = compileCatalogueProfile(fixture, { path: 'tests/fixtures/catalogue-profiles/CUL-000011.json', sha256: 'a'.repeat(64) });
  assert.equal(compiled.id, 'CUL-000011');
  assert.equal(compiled.cultivarId, 'CUL-000011');
  assert.equal(compiled.publicationClass, 'catalogue-profile');
  assert.equal(compiled.referenceStandard, null);
  assert.equal(compiled.catalogueProfile.batchId, 'C-001');
  assert.equal(compiled.mediaState, 'governed-gap');
  assert.deepEqual(compiled.sourceIds, ['SRC-CUL-000011-01']);
});

test('public Catalogue discovery includes only published compiled records', () => {
  const published = compileCatalogueProfile(fixture);
  assert.equal(isPublishedCatalogueRecord(published), true);
  const reviewReadyProfile = clone(fixture);
  reviewReadyProfile.catalogueState = 'review-ready';
  reviewReadyProfile.review.approvalState = 'editorial-approved';
  reviewReadyProfile.publishedAt = null;
  const reviewReady = compileCatalogueProfile(reviewReadyProfile);
  assert.equal(isPublishedCatalogueRecord(reviewReady), false);
  assert.equal(isPublishedCatalogueRecord({ publicationClass: 'reference-standard' }), false);
});

test('Catalogue slug is deterministic and diacritic-insensitive', () => {
  assert.equal(stableCatalogueSlug('Ōgon—nishiki'), 'ogon-nishiki');
});

test('reserved identity blocks real Catalogue publication until owner assignment', () => {
  const result = validateCatalogueProfile(fixture, schema, reservedRegistry(), { taxonIds: new Set(['TAX-APAL']) });
  assert.equal(result.valid, false);
  assert.match(messages(result), /not assigned for Catalogue publication/);
});

test('duplicate, high-risk and unresolved media states cannot pass routine publication', () => {
  const profile = clone(fixture);
  profile.duplicateCheck.result = 'probable-duplicate';
  profile.riskLevel = 'high';
  profile.riskReasons = ['Synthetic risk'];
  profile.media.state = 'candidate-under-review';
  profile.media.governedGap = null;
  const result = validateCatalogueProfile(profile, schema, assignedRegistry(), { taxonIds: new Set(['TAX-APAL']) });
  assert.equal(result.valid, false);
  assert.match(messages(result), /duplicate check must resolve as unique/);
  assert.match(messages(result), /high-risk profile cannot use routine approval or publication/);
  assert.match(messages(result), /high-risk profile cannot be batch-approved/);
  assert.match(messages(result), /unresolved media state cannot be published/);
});

test('semantic validator rejects cross-identity sources, unknown taxa and invalid publication dates', () => {
  const profile = clone(fixture);
  profile.sources[0].id = 'SRC-CUL-000012-01';
  profile.taxonId = 'TAX-UNKNOWN';
  profile.catalogueState = 'approved';
  const result = validateCatalogueProfile(profile, schema, assignedRegistry(), { taxonIds: new Set(['TAX-APAL']) });
  assert.equal(result.valid, false);
  assert.match(messages(result), /non-published profile must keep publishedAt null/);
  assert.match(messages(result), /source SRC-CUL-000012-01 is not scoped/);
  assert.match(messages(result), /unknown taxon TAX-UNKNOWN/);
});

test('approved-primary media requires a primary asset and visual-complete state', () => {
  const profile = clone(fixture);
  profile.media = {
    state: 'approved-primary',
    primaryMediaId: null,
    candidateMediaIds: [],
    governedGap: profile.media.governedGap,
    visualComplete: false,
    identityBasis: 'documented'
  };
  const result = validateCatalogueProfile(profile, schema, assignedRegistry(), { taxonIds: new Set(['TAX-APAL']) });
  assert.equal(result.valid, false);
  assert.match(messages(result), /requires primaryMediaId/);
  assert.match(messages(result), /cannot include governedGap/);
  assert.match(messages(result), /must set visualComplete true/);
});

test('referenceStandardId is allowed only after promotion', () => {
  const profile = clone(fixture);
  profile.referenceStandardId = 'RC-011';
  const result = validateCatalogueProfile(profile, schema, assignedRegistry(), { taxonIds: new Set(['TAX-APAL']) });
  assert.equal(result.valid, false);
  assert.match(messages(result), /requires promoted status/);
});
