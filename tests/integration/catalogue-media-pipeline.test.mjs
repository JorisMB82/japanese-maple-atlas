import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import pngModule from 'pngjs';
import { PROFILES, buildMedia } from '../../scripts/process-media.mjs';
import { validateMediaRepository } from '../../scripts/validate-media.mjs';
import { renderRasterProfiles } from '../../lib/raster-media.mjs';
import { ROOT } from '../helpers/repository-fixture.mjs';

const { PNG } = pngModule;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function sourcePng() {
  const width = 48;
  const height = 36;
  const data = Buffer.alloc(width * height * 4);
  for (let index = 0; index < width * height; index += 1) {
    data[index * 4] = 82;
    data[index * 4 + 1] = 126;
    data[index * 4 + 2] = 67;
    data[index * 4 + 3] = 255;
  }
  return PNG.sync.write({ width, height, data });
}

function catalogueAsset(number, role, sourceBytes) {
  const id = `MED-CUL-000011-${String(number).padStart(3, '0')}`;
  const rendered = renderRasterProfiles(sourceBytes, PROFILES);
  const base = `/media/derivatives/catalogue/cul-000011/${id.toLowerCase()}`;
  return {
    id,
    cultivarId: 'CUL-000011',
    mediaType: 'photograph',
    role,
    isPrimary: role === 'habit-primary',
    status: 'approved',
    assetPath: `${base}-display.png`,
    thumbnailPath: `${base}-thumb.png`,
    altText: `Synthetic Visual-First test photograph showing ${role}.`,
    caption: `Synthetic ${role} pipeline fixture.`,
    creator: 'Japanese Maple Atlas test suite',
    rightsHolder: 'Japanese Maple Atlas test suite',
    rightsBasis: 'contributor-owned',
    licence: 'Test fixture permission',
    licenceUrl: null,
    sourceUrl: `https://example.org/catalogue-media/${number}`,
    sourceItemId: `fixture-${number}`,
    attributionText: 'Japanese Maple Atlas test suite.',
    source: {
      path: `/atlas-repository/media-sources/catalogue/cul-000011/source-${number}.png`,
      sha256: sha256(sourceBytes),
      preservation: 'Synthetic original retained for integration testing.'
    },
    identity: {
      confidence: number === 1 ? 'documented' : 'source-asserted',
      identificationBasis: 'Synthetic integration fixture assigned to the test cultivar.',
      limitations: 'This is not a real botanical observation.',
      publicQualification: number === 1
        ? 'Synthetic documented test identity.'
        : 'Source-identified; not independently authenticated by the Japanese Maple Atlas.'
    },
    privacy: {
      status: 'not-sensitive',
      exifRetained: false,
      gpsRetained: false,
      locationGranularity: 'not applicable'
    },
    derivatives: Object.entries(rendered).map(([profile, output]) => ({
      profile,
      path: `${base}-${profile}.png`,
      width: output.width,
      height: output.height,
      mimeType: output.mimeType,
      sha256: sha256(output.bytes),
      derivedFrom: id
    })),
    approvalHistory: [{ status: 'approved', date: '2026-07-29', authority: 'Test authority', note: 'Synthetic integration fixture.' }]
  };
}

test('Catalogue media sidecars generate deterministic derivatives and validate', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-catalogue-media-'));
  const referenceSideDirectory = path.join(root, 'atlas-repository/reference-standards/media');
  const catalogueSideDirectory = path.join(root, 'atlas-repository/catalogue-profiles/media');
  const sourceDirectory = path.join(root, 'atlas-repository/media-sources/catalogue/cul-000011');
  const manifestDirectory = path.join(root, 'public/media/derivatives');
  fs.mkdirSync(referenceSideDirectory, { recursive: true });
  fs.mkdirSync(catalogueSideDirectory, { recursive: true });
  fs.mkdirSync(sourceDirectory, { recursive: true });

  const bytes = sourcePng();
  for (let number = 1; number <= 3; number += 1) fs.writeFileSync(path.join(sourceDirectory, `source-${number}.png`), bytes);
  const sidecar = {
    schemaVersion: '1.0.0',
    cultivarId: 'CUL-000011',
    publicationClass: 'catalogue-profile',
    status: 'approved',
    assets: [
      catalogueAsset(1, 'habit-primary', bytes),
      catalogueAsset(2, 'foliage-detail', bytes),
      catalogueAsset(3, 'seasonal-diagnostic', bytes)
    ],
    roleException: null,
    review: { reviewedBy: 'Test reviewer', reviewedAt: '2026-07-29T03:00:00Z', notes: 'Synthetic complete gallery.' }
  };
  fs.writeFileSync(path.join(catalogueSideDirectory, 'CUL-000011.media.json'), `${JSON.stringify(sidecar, null, 2)}\n`);

  const manifest = buildMedia({ root, sideDirectory:referenceSideDirectory, catalogueSideDirectory, manifestDirectory });
  assert.equal(manifest.derivativeCount, 12);
  assert.deepEqual(manifest.publicationClasses, ['catalogue-profile']);
  assert.equal(manifest.entries.every(entry => entry.publicationClass === 'catalogue-profile'), true);
  assert.equal(fs.existsSync(path.join(root, 'public/media/derivatives/catalogue/cul-000011/med-cul-000011-001-display.png')), true);
  assert.equal(fs.existsSync(path.join(root, 'media/derivatives/catalogue/cul-000011/med-cul-000011-001-display.png')), false);

  const validation = validateMediaRepository({
    root,
    sideDirectory: referenceSideDirectory,
    catalogueSideDirectory,
    catalogueSchemaPath: path.join(ROOT, 'atlas-repository/schemas/catalogue-media.schema.json'),
    coveragePlan: path.join(ROOT, 'atlas-repository/media-coverage.json'),
    requireCoverage: false
  });
  assert.deepEqual(validation.errors, []);
  assert.equal(validation.referenceAssets, 0);
  assert.equal(validation.catalogueAssets, 3);
  assert.equal(validation.derivatives, 12);

  const checked = buildMedia({ check:true, root, sideDirectory:referenceSideDirectory, catalogueSideDirectory, manifestDirectory });
  assert.equal(checked.derivativeCount, 12);
  fs.rmSync(root, { recursive: true, force: true });
});
