import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {ROOT,PROFILES,render} from '../../scripts/process-media.mjs';
const sideDir=path.join(ROOT,'atlas-repository/reference-standards/media');
const sides=fs.readdirSync(sideDir).filter(x=>/^RC-\d{3}\.media\.json$/.test(x)).sort().map(x=>JSON.parse(fs.readFileSync(path.join(sideDir,x),'utf8')));

test('five pilot sidecars use the governed media-v2 contract',()=>{
 assert.equal(sides.length,5);
 for(const side of sides){const a=side.assets[0];assert.equal(side.status,'approved');assert.equal(side.contractVersion,'media-v2');assert.equal(a.status,'approved');assert.equal(a.privacy.gpsRetained,false);assert.equal(a.evidentiaryStatus,'illustrative-not-evidence');assert.match(a.syntheticLabel,/not an observed specimen/i);assert.deepEqual(a.derivatives.map(x=>x.profile),Object.keys(PROFILES));}
});

test('derivative rendering is deterministic and profile-labelled',()=>{
 const svg='<svg viewBox="0 0 10 10"></svg>';
 assert.equal(render(svg,'thumb',320,231),render(svg,'thumb',320,231));
 assert.match(render(svg,'display',960,693),/data-atlas-profile="display"/);
});

test('RC-001 through RC-020 coverage is explicit',()=>{
 const plan=JSON.parse(fs.readFileSync(path.join(ROOT,'atlas-repository/media-coverage.json'),'utf8'));
 assert.equal(plan.records.length,20);assert.deepEqual(plan.records.slice(0,5).map(x=>x.releaseMinimum),Array(5).fill('met'));assert.ok(plan.records.slice(5).every(x=>x.releaseMinimum==='gap'&&x.gap));
});
