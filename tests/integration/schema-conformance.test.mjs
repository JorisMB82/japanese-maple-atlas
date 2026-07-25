import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT } from '../helpers/repository-fixture.mjs';

function runValidator(cwd = ROOT) {
  return spawnSync(process.execPath, ['scripts/validate-schemas.mjs'], { cwd, encoding: 'utf8' });
}

test('all compiled repository objects conform to their JSON Schemas', () => {
  const result = runValidator();
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /Schema validation: PASS/);
  assert.match(result.stdout, /Errors: 0/);
});

test('schema validation rejects a malformed compiled object', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'jma-schema-'));
  try {
    fs.mkdirSync(path.join(tempRoot, 'scripts'), { recursive: true });
    fs.mkdirSync(path.join(tempRoot, 'lib'), { recursive: true });
    fs.cpSync(path.join(ROOT, 'atlas-repository'), path.join(tempRoot, 'atlas-repository'), { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'scripts', 'validate-schemas.mjs'), path.join(tempRoot, 'scripts', 'validate-schemas.mjs'));
    fs.copyFileSync(path.join(ROOT, 'lib', 'json-schema-validator.mjs'), path.join(tempRoot, 'lib', 'json-schema-validator.mjs'));
    const cultivarPath = path.join(tempRoot, 'atlas-repository', 'cultivars', 'RC-001.json');
    const cultivar = JSON.parse(fs.readFileSync(cultivarPath, 'utf8'));
    cultivar.id = 'invalid';
    cultivar.assertionIds = cultivar.assertionIds.slice(0, 3);
    fs.writeFileSync(cultivarPath, `${JSON.stringify(cultivar, null, 2)}\n`);

    const result = runValidator(tempRoot);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /RC-001\.json/);
    assert.match(result.stderr, /pattern/);
    assert.match(result.stderr, /minItems/);
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
});
