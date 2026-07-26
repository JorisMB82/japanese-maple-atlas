import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  ROOT,
  buildRecord,
  collectInputs,
  loadCompilerGovernance,
  writeOutputsAtomically
} from '../../scripts/compile-atlas.mjs';
import { syntheticReferenceStandard, syntheticSupport } from '../helpers/synthetic-reference-standard.mjs';

const governance = loadCompilerGovernance();

test('canonical RC-006 parses without a cultivar-specific compiler branch', () => {
  const id = 'RC-006';
  const record = buildRecord(path.join(ROOT, 'synthetic', `${id}.md`), syntheticReferenceStandard(id), 6, governance, syntheticSupport(id, ROOT));
  assert.equal(record.id, id);
  assert.equal(record.profileMode, 'canonical');
  assert.equal(record.name.cultivar, 'Atlas Test 006');
  assert.equal(record.provenance.sources.length, 1);
  assert.equal(record.mediaAssets.length, 1);
});

test('canonical records reject missing governed metadata and sections', () => {
  const id = 'RC-006';
  const malformed = syntheticReferenceStandard(id)
    .replace('**Compiler profile:** canonical-rc-v1  \n', '')
    .replace('# 13. Rejected claims\n', '# 13. Unsupported heading\n');
  assert.throws(
    () => buildRecord(path.join(ROOT, 'synthetic', `${id}.md`), malformed, 6, governance, syntheticSupport(id, ROOT)),
    /missing canonical metadata|missing canonical sections/
  );
});

test('approval status is exact and cannot be satisfied by a negative phrase', () => {
  const id = 'RC-006';
  assert.throws(
    () => buildRecord(
      path.join(ROOT, 'synthetic', `${id}.md`),
      syntheticReferenceStandard(id, { status: 'Not approved and frozen' }),
      6,
      governance,
      syntheticSupport(id, ROOT)
    ),
    /record status must be approved and frozen/
  );
});

test('canonical provenance is record-scoped and source-location traceable', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'jma-provenance-'));
  const inputDir = path.join(temp, 'reference-standards');
  const sourceDir = path.join(temp, 'sources');
  const mediaDir = path.join(temp, 'media');
  fs.mkdirSync(inputDir, { recursive: true });
  fs.mkdirSync(sourceDir, { recursive: true });
  fs.mkdirSync(mediaDir, { recursive: true });
  const id = 'RC-006';
  fs.writeFileSync(path.join(inputDir, `${id}.md`), syntheticReferenceStandard(id));
  const support = syntheticSupport(id, ROOT);
  support.provenance.sources[0].id = 'SRC-RC-007-001';
  support.provenance.evidenceMap = Object.fromEntries(Object.keys(support.provenance.evidenceMap).map(group => [group, ['SRC-RC-007-001']]));
  fs.writeFileSync(path.join(sourceDir, `${id}.sources.json`), `${JSON.stringify(support.provenance, null, 2)}\n`);
  fs.writeFileSync(path.join(mediaDir, `${id}.media.json`), `${JSON.stringify(support.media, null, 2)}\n`);
  try {
    assert.throws(
      () => collectInputs({ governance, inputDir, sourceDir, mediaDir }),
      /must be scoped to the record/
    );
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test('legacy frozen records are governed by external adapters, not compiler source branches', () => {
  assert.deepEqual(Object.keys(governance.compatibility.records).sort(), ['RC-001', 'RC-002', 'RC-003', 'RC-004', 'RC-005']);
  const compilerSource = fs.readFileSync(path.join(ROOT, 'scripts', 'compile-atlas.mjs'), 'utf8');
  assert.equal(compilerSource.includes('const RECORD_CONFIG'), false);
  assert.equal(compilerSource.includes("'RC-006':"), false);
});

test('atomic publisher replaces staged outputs and removes transaction directories', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'jma-atomic-'));
  try {
    const manifest = path.join(tempRoot, 'atlas-repository', 'manifest.json');
    fs.mkdirSync(path.dirname(manifest), { recursive: true });
    fs.writeFileSync(manifest, 'old\n');
    writeOutputsAtomically(new Map([['atlas-repository/manifest.json', 'new\n']]), tempRoot);
    assert.equal(fs.readFileSync(manifest, 'utf8'), 'new\n');
    assert.deepEqual(fs.readdirSync(tempRoot).filter(name => name.startsWith('.atlas-compiler-')), []);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});

test('atomic publisher restores all prior targets after an installation failure', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'jma-atomic-rollback-'));
  try {
    const manifest = path.join(tempRoot, 'atlas-repository', 'manifest.json');
    const hashes = path.join(tempRoot, 'atlas-repository', 'hashes.json');
    fs.mkdirSync(path.dirname(manifest), { recursive: true });
    fs.writeFileSync(manifest, 'old manifest\n');
    fs.writeFileSync(hashes, 'old hashes\n');
    const operations = {
      renameSync(source, target) {
        if (source.includes('.atlas-compiler-stage-') && target.endsWith('atlas-repository/hashes.json')) {
          throw new Error('simulated install failure');
        }
        fs.renameSync(source, target);
      }
    };
    assert.throws(
      () => writeOutputsAtomically(new Map([
        ['atlas-repository/manifest.json', 'new manifest\n'],
        ['atlas-repository/hashes.json', 'new hashes\n']
      ]), tempRoot, operations),
      /rolled back/
    );
    assert.equal(fs.readFileSync(manifest, 'utf8'), 'old manifest\n');
    assert.equal(fs.readFileSync(hashes, 'utf8'), 'old hashes\n');
    assert.deepEqual(fs.readdirSync(tempRoot).filter(name => name.startsWith('.atlas-compiler-')), []);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
