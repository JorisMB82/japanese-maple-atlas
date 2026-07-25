import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, readJson } from '../helpers/repository-fixture.mjs';

function runNode(args, cwd = ROOT) {
  return spawnSync(process.execPath, args, { cwd, encoding: 'utf8', env: { ...process.env, CI: 'true' } });
}

test('compiler drift check passes against committed generated outputs', () => {
  const result = runNode(['scripts/compile-atlas.mjs', '--check']);
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /CHECK PASS/);
  assert.match(result.stdout, /Repository objects: 235/);
});

test('fresh compilation is deterministic and reproduces committed hashes', { timeout: 120000 }, () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'jma-compiler-'));
  try {
    fs.cpSync(ROOT, tempRoot, {
      recursive: true,
      filter: source => {
        const relative = path.relative(ROOT, source);
        return !relative.startsWith('.git') && !relative.startsWith('node_modules') && !relative.startsWith('.next') && !relative.startsWith('out') && !relative.startsWith('coverage') && !relative.startsWith('quality-reports') && !relative.startsWith('release-artifacts');
      }
    });
    const first = runNode(['scripts/compile-atlas.mjs'], tempRoot);
    assert.equal(first.status, 0, `${first.stdout}\n${first.stderr}`);
    const firstHashes = fs.readFileSync(path.join(tempRoot, 'atlas-repository', 'hashes.json'), 'utf8');
    const firstManifest = readJson(path.join(tempRoot, 'atlas-repository', 'manifest.json'));

    const second = runNode(['scripts/compile-atlas.mjs'], tempRoot);
    assert.equal(second.status, 0, `${second.stdout}\n${second.stderr}`);
    const secondHashes = fs.readFileSync(path.join(tempRoot, 'atlas-repository', 'hashes.json'), 'utf8');
    const secondManifest = readJson(path.join(tempRoot, 'atlas-repository', 'manifest.json'));

    assert.equal(secondHashes, firstHashes);
    assert.equal(secondManifest.repositoryHash, firstManifest.repositoryHash);
    assert.equal(firstManifest.repositoryHash, readJson(path.join(ROOT, 'atlas-repository', 'manifest.json')).repositoryHash);
    assert.equal(firstManifest.objectTotal, 235);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
