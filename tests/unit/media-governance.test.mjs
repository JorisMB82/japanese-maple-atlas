import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { ROOT, PROFILES, render } from '../../scripts/process-media.mjs';
import { validateAsset } from '../../scripts/validate-media.mjs';
import {
  decodeRaster,
  detectRasterMime,
  encodeRaster,
  fitDimensions,
  hasRasterPrivacyMetadata,
  renderRasterProfiles
} from '../../lib/raster-media.mjs';

const sideDirectory = path.join(ROOT, 'atlas-repository/reference-standards/media');
const sidecars = fs.readdirSync(sideDirectory)
  .filter(file => /^RC-\d{3}\.media\.json$/.test(file))
  .sort()
  .map(file => JSON.parse(fs.readFileSync(path.join(sideDirectory, file), 'utf8')));
const sha = value => crypto.createHash('sha256').update(value).digest('hex');

function pixels(width, height) {
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      data.set([x * 40 + 20, y * 80 + 30, 120, 255], index);
    }
  }
  return { width, height, data };
}

function withExifOrientation(jpeg, orientation) {
  const tiff = Buffer.alloc(26);
  tiff.write('II', 0, 'ascii');
  tiff.writeUInt16LE(42, 2);
  tiff.writeUInt32LE(8, 4);
  tiff.writeUInt16LE(1, 8);
  tiff.writeUInt16LE(0x0112, 10);
  tiff.writeUInt16LE(3, 12);
  tiff.writeUInt32LE(1, 14);
  tiff.writeUInt16LE(orientation, 18);
  tiff.writeUInt32LE(0, 22);
  const payload = Buffer.concat([Buffer.from('Exif\0\0', 'binary'), tiff]);
  const segment = Buffer.alloc(payload.length + 4);
  segment.writeUInt16BE(0xffe1, 0);
  segment.writeUInt16BE(payload.length + 2, 2);
  payload.copy(segment, 4);
  return Buffer.concat([jpeg.subarray(0, 2), segment, jpeg.subarray(2)]);
}

function writeGovernedPhotographFixture(root) {
  const originalImage = pixels(4, 2);
  const encoded = encodeRaster(originalImage, 'image/jpeg');
  const original = withExifOrientation(encoded, 6);
  const sourcePath = path.join(root, 'atlas-repository/media-sources/rc-999/source.jpg');
  fs.mkdirSync(path.dirname(sourcePath), { recursive:true });
  fs.writeFileSync(sourcePath, original);

  const profiles = renderRasterProfiles(original, PROFILES);
  const derivatives = Object.entries(profiles).map(([profile, output]) => {
    const relativePath = `/media/derivatives/rc-999/${profile}.jpg`;
    const target = path.join(root, relativePath.replace(/^\//, ''));
    fs.mkdirSync(path.dirname(target), { recursive:true });
    fs.writeFileSync(target, output.bytes);
    return {
      profile,
      path: relativePath,
      width: output.width,
      height: output.height,
      mimeType: output.mimeType,
      sha256: sha(output.bytes),
      derivedFrom: 'MED-RC-999-HABIT-001'
    };
  });

  return {
    original,
    profiles,
    asset: {
      id: 'MED-RC-999-HABIT-001',
      cultivarId: 'RC-999',
      mediaType: 'photograph',
      role: 'primary-habit',
      subject: 'whole-plant-habit',
      season: 'autumn',
      status: 'approved',
      assetPath: derivatives.find(item => item.profile === 'display').path,
      thumbnailPath: derivatives.find(item => item.profile === 'thumb').path,
      altText: 'Governed test photograph of an identified Japanese maple specimen.',
      caption: 'Governed photograph test fixture.',
      creator: 'Test photographer',
      contributor: 'Test contributor',
      rightsHolder: 'Test rights holder',
      licence: 'CC0 test fixture',
      source: {
        path: '/atlas-repository/media-sources/rc-999/source.jpg',
        sha256: sha(original),
        preservation: 'private original retained'
      },
      identification: {
        specimenIdentity: 'labelled accession TEST-999',
        confidence: 'high',
        editorialStatus: 'reviewed'
      },
      privacy: {
        exifRetained: false,
        gpsRetained: false,
        locationGranularity: 'institution only'
      },
      evidentiaryStatus: 'supporting-evidence',
      focalPoint: { x:0.5, y:0.5 },
      derivatives,
      approvalHistory: [{ status:'approved', date:'2026-07-27', authority:'test' }]
    }
  };
}

test('five pilot sidecars preserve governed Atlas illustration treatment', () => {
  assert.equal(sidecars.length, 5);
  for (const sidecar of sidecars) {
    const asset = sidecar.assets[0];
    assert.equal(sidecar.status, 'approved');
    assert.equal(sidecar.contractVersion, 'media-v2');
    assert.equal(asset.status, 'approved');
    assert.equal(asset.privacy.gpsRetained, false);
    assert.equal(asset.evidentiaryStatus, 'illustrative-not-evidence');
    assert.match(asset.syntheticLabel, /not an observed specimen/i);
    assert.deepEqual(asset.derivatives.map(item => item.profile), Object.keys(PROFILES));
  }
});

test('SVG derivative rendering remains deterministic and profile-labelled', () => {
  const svg = '<svg viewBox="0 0 10 10"></svg>';
  assert.equal(render(svg, 'thumb', 320, 231), render(svg, 'thumb', 320, 231));
  assert.match(render(svg, 'display', 960, 693), /data-atlas-profile="display"/);
});

test('JPEG EXIF orientation is applied before deterministic no-upscale rendering', () => {
  const jpeg = encodeRaster(pixels(4, 2), 'image/jpeg');
  const oriented = withExifOrientation(jpeg, 6);
  assert.equal(detectRasterMime(oriented), 'image/jpeg');
  assert.equal(hasRasterPrivacyMetadata(oriented), true);
  const decoded = decodeRaster(oriented);
  assert.deepEqual([decoded.width, decoded.height, decoded.sourceOrientation], [2, 4, 6]);
  const profiles = renderRasterProfiles(oriented, PROFILES);
  for (const output of Object.values(profiles)) {
    assert.deepEqual([output.width, output.height], [2, 4]);
    assert.equal(output.mimeType, 'image/jpeg');
    assert.equal(hasRasterPrivacyMetadata(output.bytes, output.mimeType), false);
  }
});

test('PNG rendering is deterministic and dimensions never upscale', () => {
  const png = encodeRaster(pixels(8, 4), 'image/png');
  assert.equal(detectRasterMime(png), 'image/png');
  assert.equal(hasRasterPrivacyMetadata(png), false);
  assert.deepEqual(fitDimensions(8, 4, 320, 231), { width:8, height:4, scale:1 });
  assert.deepEqual(fitDimensions(800, 400, 320, 231), { width:320, height:160, scale:0.4 });
  const first = renderRasterProfiles(png, PROFILES);
  const second = renderRasterProfiles(png, PROFILES);
  for (const profile of Object.keys(PROFILES)) assert.equal(first[profile].bytes.equals(second[profile].bytes), true);
});

test('governed photographs validate without a synthetic label and reject rights or privacy defects', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-raster-unit-'));
  try {
    const fixture = writeGovernedPhotographFixture(root);
    assert.deepEqual(validateAsset(fixture.asset, { root }), []);
    const invalid = structuredClone(fixture.asset);
    invalid.rightsHolder = '';
    invalid.privacy.gpsRetained = true;
    invalid.derivatives[0].sha256 = '0'.repeat(64);
    const errors = validateAsset(invalid, { root });
    assert.ok(errors.some(error => error.includes('rightsHolder must be non-empty')));
    assert.ok(errors.some(error => error.includes('precise GPS')));
    assert.ok(errors.some(error => error.includes('invalid derivative checksum')));
  } finally {
    fs.rmSync(root, { recursive:true, force:true });
  }
});

test('RC-001 through RC-020 coverage remains explicit', () => {
  const plan = JSON.parse(fs.readFileSync(path.join(ROOT, 'atlas-repository/media-coverage.json'), 'utf8'));
  assert.equal(plan.records.length, 20);
  assert.deepEqual(plan.records.slice(0,5).map(row => row.releaseMinimum), Array(5).fill('met'));
  assert.ok(plan.records.slice(5).every(row => row.releaseMinimum === 'gap' && row.gap));
});
