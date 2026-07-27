import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {ROOT} from '../helpers/repository-fixture.mjs';
const run=(script,args=[])=>spawnSync(process.execPath,[script,...args],{cwd:ROOT,encoding:'utf8'});

test('media pipeline generates and verifies twenty deterministic derivatives',()=>{
 const generated=run('scripts/process-media.mjs');assert.equal(generated.status,0,generated.stderr);
 const checked=run('scripts/process-media.mjs',['--check']);assert.equal(checked.status,0,checked.stderr);
 const manifest=JSON.parse(fs.readFileSync(path.join(ROOT,'public/media/derivatives/manifest.json'),'utf8'));
 assert.equal(manifest.derivativeCount,20);assert.equal(new Set(manifest.entries.map(x=>x.sha256)).size,20);
});

test('media governance validator passes the five-record cohort and RC-020 plan',()=>{
 const result=run('scripts/validate-media.mjs');assert.equal(result.status,0,result.stderr);assert.match(result.stdout,/5 governed assets; 20 derivatives; 20-record coverage plan/);
});
