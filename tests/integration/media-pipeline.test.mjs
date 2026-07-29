import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { ROOT } from '../helpers/repository-fixture.mjs';
import { PROFILES, buildMedia } from '../../scripts/process-media.mjs';
import { validateMediaRepository } from '../../scripts/validate-media.mjs';
import { encodeRaster, hasRasterPrivacyMetadata, renderRasterProfiles } from '../../lib/raster-media.mjs';

const run = (script,args=[]) => spawnSync(process.execPath,[script,...args],{cwd:ROOT,encoding:'utf8'});
const sha = value => crypto.createHash('sha256').update(value).digest('hex');

function rasterFixture() {
  const width = 640;
  const height = 480;
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4;
      data[index] = Math.round(255 * x / width);
      data[index + 1] = Math.round(255 * y / height);
      data[index + 2] = 96;
      data[index + 3] = 255;
    }
  }
  return encodeRaster({ width, height, data }, 'image/jpeg');
}

test('media pipeline generates and verifies twenty deterministic illustration derivatives', () => {
  const generated = run('scripts/process-media.mjs');
  assert.equal(generated.status,0,generated.stderr);
  const checked = run('scripts/process-media.mjs',['--check']);
  assert.equal(checked.status,0,checked.stderr);
  const manifest = JSON.parse(fs.readFileSync(path.join(ROOT,'public/media/derivatives/manifest.json'),'utf8'));
  assert.equal(manifest.version, 'media-pipeline-v2.2');
  assert.equal(manifest.derivativeCount,20);
  assert.deepEqual(manifest.publicationClasses, ['reference-standard']);
  assert.equal(new Set(manifest.entries.map(entry => entry.sha256)).size,20);
  assert.ok(manifest.entries.every(entry => entry.mimeType === 'image/svg+xml'));
  assert.ok(manifest.entries.every(entry => entry.publicationClass === 'reference-standard'));
});

test('media governance validator passes the five-record illustration cohort and RC-020 plan', () => {
  const result = run('scripts/validate-media.mjs');
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,/5 Reference Standard assets; 0 Catalogue assets; 20 derivatives; 20-record RC coverage plan/);
});

test('governed JPEG photograph generates deterministic private-source derivatives and passes validation', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'atlas-raster-integration-'));
  try {
    const sideDirectory = path.join(root, 'atlas-repository/reference-standards/media');
    const sourcePath = path.join(root, 'atlas-repository/media-sources/rc-999/habit.jpg');
    fs.mkdirSync(sideDirectory, { recursive:true });
    fs.mkdirSync(path.dirname(sourcePath), { recursive:true });
    const source = rasterFixture();
    fs.writeFileSync(sourcePath, source);
    const rendered = renderRasterProfiles(source, PROFILES);
    const derivatives = Object.entries(rendered).map(([profile, output]) => ({
      profile,
      path:`/media/derivatives/rc-999/${profile}.jpg`,
      width:output.width,
      height:output.height,
      mimeType:output.mimeType,
      sha256:sha(output.bytes),
      derivedFrom:'MED-RC-999-HABIT-001'
    }));
    const asset = {
      id:'MED-RC-999-HABIT-001',
      cultivarId:'RC-999',
      mediaType:'photograph',
      role:'primary-habit',
      subject:'whole-plant-habit',
      season:'autumn',
      status:'approved',
      assetPath:derivatives.find(item => item.profile === 'display').path,
      thumbnailPath:derivatives.find(item => item.profile === 'thumb').path,
      altText:'Governed integration-test photograph of a Japanese maple specimen.',
      caption:'Governed photograph fixture.',
      creator:'Test photographer',
      contributor:'Test contributor',
      rightsHolder:'Test rights holder',
      licence:'CC0 test fixture',
      source:{
        path:'/atlas-repository/media-sources/rc-999/habit.jpg',
        sha256:sha(source),
        preservation:'private original retained'
      },
      identification:{
        specimenIdentity:'labelled accession TEST-999',
        confidence:'high',
        editorialStatus:'reviewed'
      },
      privacy:{ exifRetained:false, gpsRetained:false, locationGranularity:'institution only' },
      evidentiaryStatus:'supporting-evidence',
      focalPoint:{ x:0.5, y:0.5 },
      derivatives,
      approvalHistory:[{ status:'approved', date:'2026-07-27', authority:'integration test' }]
    };
    fs.writeFileSync(path.join(sideDirectory,'RC-999.media.json'),`${JSON.stringify({recordId:'RC-999',status:'approved',contractVersion:'media-v2.1',assets:[asset]},null,2)}\n`);

    const generated = buildMedia({ root, sideDirectory, manifestDirectory:path.join(root,'public/media/derivatives') });
    assert.equal(generated.derivativeCount,4);
    assert.deepEqual(generated.publicationClasses, ['reference-standard']);
    const checked = buildMedia({ check:true, root, sideDirectory, manifestDirectory:path.join(root,'public/media/derivatives') });
    assert.deepEqual(checked, generated);
    const validation = validateMediaRepository({ root, sideDirectory, requireCoverage:false });
    assert.deepEqual(validation.errors, []);
    for (const derivative of derivatives) {
      const bytes = fs.readFileSync(path.join(root, derivative.path.replace(/^\//,'')));
      assert.equal(hasRasterPrivacyMetadata(bytes, derivative.mimeType), false);
      assert.ok(derivative.width <= 640 && derivative.height <= 480);
    }
  } finally {
    fs.rmSync(root, { recursive:true, force:true });
  }
});
