import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { ROOT } from '../helpers/repository-fixture.mjs';
import { identityQualification, loadCatalogueMediaDirectory, validateCatalogueMediaSidecar } from '../../lib/catalogue-media.mjs';

const schemaPath = path.join(ROOT, 'atlas-repository/schemas/catalogue-media.schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
const clone = value => structuredClone(value);

function derivative(id, profile) {
  return {
    profile,
    path: `/media/derivatives/catalogue/cul-000011/${id.toLowerCase()}-${profile}.png`,
    width: 20,
    height: 20,
    mimeType: 'image/png',
    sha256: 'a'.repeat(64),
    derivedFrom: id
  };
}

function asset(number, role, confidence = 'source-asserted') {
  const id = `MED-CUL-000011-${String(number).padStart(3, '0')}`;
  return {
    id,
    cultivarId: 'CUL-000011',
    mediaType: 'photograph',
    role,
    isPrimary: role === 'habit-primary',
    status: 'approved',
    assetPath: `/media/derivatives/catalogue/cul-000011/${id.toLowerCase()}-display.png`,
    thumbnailPath: `/media/derivatives/catalogue/cul-000011/${id.toLowerCase()}-thumb.png`,
    altText: `Synthetic test photograph for ${role}.`,
    caption: `Synthetic ${role} Catalogue test image.`,
    creator: 'Test contributor',
    rightsHolder: 'Test contributor',
    rightsBasis: 'creative-commons',
    licence: 'CC BY 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/4.0/',
    sourceUrl: 'https://example.org/source',
    sourceItemId: `source-${number}`,
    attributionText: 'Test contributor, CC BY 4.0.',
    source: {
      path: `/atlas-repository/media-sources/catalogue/cul-000011/source-${number}.png`,
      sha256: 'b'.repeat(64),
      preservation: 'Original retained for governed test processing.'
    },
    identity: {
      confidence,
      identificationBasis: 'The source identifies the photographed plant as the named cultivar.',
      limitations: 'The Atlas has not independently authenticated the clone.',
      publicQualification: confidence === 'documented'
        ? 'Identity is tied to a documented test specimen.'
        : 'Source-identified; not independently authenticated by the Japanese Maple Atlas.'
    },
    privacy: {
      status: 'not-sensitive',
      exifRetained: false,
      gpsRetained: false,
      locationGranularity: 'institution only'
    },
    derivatives: ['thumb', 'card', 'display', 'archive'].map(profile => derivative(id, profile)),
    approvalHistory: [{ status: 'approved', date: '2026-07-29', authority: 'Test authority', note: 'Synthetic contract test.' }]
  };
}

function sidecar() {
  return {
    schemaVersion: '1.0.0',
    cultivarId: 'CUL-000011',
    publicationClass: 'catalogue-profile',
    status: 'approved',
    assets: [
      asset(1, 'habit-primary'),
      asset(2, 'foliage-detail', 'community-identified'),
      asset(3, 'seasonal-diagnostic', 'documented')
    ],
    roleException: null,
    review: { reviewedBy: 'Test reviewer', reviewedAt: '2026-07-29T03:00:00Z', notes: 'Synthetic complete gallery.' }
  };
}

test('complete three-role Catalogue gallery validates', () => {
  const result = validateCatalogueMediaSidecar(sidecar(), schema);
  assert.equal(result.valid, true, result.errors.join('\n'));
  assert.equal(result.primary.role, 'habit-primary');
  assert.deepEqual(result.missingRoles, []);
});

test('source-asserted and community identity require conspicuous qualification', () => {
  const candidate = sidecar();
  candidate.assets[0].identity.publicQualification = 'Source identified.';
  const result = validateCatalogueMediaSidecar(candidate, schema);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /independent-authentication qualification/);
  assert.match(identityQualification(sidecar().assets[0]), /not independently/i);
});

test('primary role and controlled role exceptions are enforced', () => {
  const wrongPrimary = sidecar();
  wrongPrimary.assets[0].isPrimary = false;
  wrongPrimary.assets[1].isPrimary = true;
  assert.match(validateCatalogueMediaSidecar(wrongPrimary, schema).errors.join('\n'), /primary item must use habit-primary/);

  const incomplete = sidecar();
  incomplete.assets = incomplete.assets.slice(0, 1);
  assert.match(validateCatalogueMediaSidecar(incomplete, schema).errors.join('\n'), /requires roleException/);
  incomplete.roleException = {
    missingRoles: ['foliage-detail', 'seasonal-diagnostic'],
    reason: 'Synthetic temporary role exception for contract testing.',
    reviewer: 'Test reviewer',
    approvedAt: '2026-07-29T03:00:00Z',
    backfillPriority: 'high',
    nextReviewAt: '2026-09-30'
  };
  assert.equal(validateCatalogueMediaSidecar(incomplete, schema).valid, true);
});

test('Catalogue media IDs and cultivar ownership cannot cross identities', () => {
  const candidate = clone(sidecar());
  candidate.assets[0].cultivarId = 'CUL-000012';
  const result = validateCatalogueMediaSidecar(candidate, schema);
  assert.equal(result.valid, false);
  assert.match(result.errors.join('\n'), /cultivarId must match sidecar/);
});

test('Catalogue media discovery accepts an empty directory without reading a schema fixture', () => {
  const result = loadCatalogueMediaDirectory({
    directory: path.join(os.tmpdir(), `atlas-missing-${Date.now()}`),
    schemaPath: path.join(os.tmpdir(), 'schema-does-not-exist.json')
  });
  assert.deepEqual(result.sidecars, []);
  assert.equal(result.byCultivarId.size, 0);
  assert.deepEqual(result.diagnostics, []);
});

test('Catalogue media discovery indexes a valid sidecar by stable cultivar identity', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-catalogue-media-unit-'));
  try {
    fs.writeFileSync(path.join(directory, 'CUL-000011.media.json'), `${JSON.stringify(sidecar(), null, 2)}\n`);
    const result = loadCatalogueMediaDirectory({ directory, schemaPath });
    assert.equal(result.sidecars.length, 1);
    assert.equal(result.byCultivarId.get('CUL-000011').assets.length, 3);
    assert.deepEqual(result.diagnostics[0].missingRoles, []);
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});

test('Catalogue media discovery rejects a filename that does not match its cultivar identity', () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-catalogue-media-name-'));
  try {
    fs.writeFileSync(path.join(directory, 'CUL-000012.media.json'), `${JSON.stringify(sidecar(), null, 2)}\n`);
    assert.throws(
      () => loadCatalogueMediaDirectory({ directory, schemaPath }),
      /filename must be CUL-000011\.media\.json/
    );
  } finally {
    fs.rmSync(directory, { recursive: true, force: true });
  }
});
