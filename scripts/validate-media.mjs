import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {ROOT,PROFILES,buildMedia} from './process-media.mjs';
const SIDE=path.join(ROOT,'atlas-repository/reference-standards/media');
const PLAN=path.join(ROOT,'atlas-repository/media-coverage.json');
const sha=x=>crypto.createHash('sha256').update(x).digest('hex');
const read=x=>JSON.parse(fs.readFileSync(x,'utf8'));
const errors=[]; let assets=0;
for(const file of fs.readdirSync(SIDE).filter(x=>/^RC-\d{3}\.media\.json$/.test(x)).sort()){
 const side=read(path.join(SIDE,file));
 if(side.status!=='approved') errors.push(`${side.recordId}: sidecar not approved`);
 for(const a of side.assets){ assets++;
  for(const key of ['id','cultivarId','mediaType','role','status','assetPath','altText','evidentiaryStatus','creator','rightsHolder','licence','source','identification','privacy','derivatives','approvalHistory']) if(a[key]==null) errors.push(`${a.id}: missing ${key}`);
  if(a.status!=='approved') errors.push(`${a.id}: asset not approved`);
  if(a.evidentiaryStatus!=='illustrative-not-evidence') errors.push(`${a.id}: illustration must remain non-evidentiary`);
  if(!a.syntheticLabel) errors.push(`${a.id}: missing conspicuous synthetic label`);
  if(a.privacy.gpsRetained!==false) errors.push(`${a.id}: GPS must not be retained`);
  const source=path.join(ROOT,'public',a.source.path.replace(/^\//,''));
  if(!fs.existsSync(source)||sha(fs.readFileSync(source))!==a.source.sha256) errors.push(`${a.id}: invalid source checksum`);
  const profiles=new Set(a.derivatives.map(x=>x.profile));
  for(const p of Object.keys(PROFILES)) if(!profiles.has(p)) errors.push(`${a.id}: missing ${p} derivative`);
 }
}
try{buildMedia({check:true});}catch(e){errors.push(e.message)}
const plan=read(PLAN); const ids=plan.records.map(x=>x.recordId);
if(plan.records.length!==20||new Set(ids).size!==20) errors.push('coverage plan must contain RC-001 through RC-020 exactly once');
for(let n=1;n<=20;n++){const id=`RC-${String(n).padStart(3,'0')}`; if(!ids.includes(id)) errors.push(`coverage plan missing ${id}`)}
for(const row of plan.records.slice(0,5)) if(row.releaseMinimum!=='met') errors.push(`${row.recordId}: release minimum not met`);
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`Media validation: PASS — ${assets} governed assets; ${assets*4} derivatives; 20-record coverage plan`);
