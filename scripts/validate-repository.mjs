import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = path.resolve(import.meta.dirname, '..');
const REPO = path.join(ROOT, 'atlas-repository');
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [];
const checks = [];
const pass = label => checks.push([label, 'PASS']);
const fail = (label, message) => { checks.push([label, 'FAIL']); errors.push(`${label}: ${message}`); };

const manifestPath = path.join(REPO, 'manifest.json');
const hashesPath = path.join(REPO, 'hashes.json');
if (!fs.existsSync(manifestPath)) throw new Error('Missing atlas-repository/manifest.json');
if (!fs.existsSync(hashesPath)) throw new Error('Missing atlas-repository/hashes.json');
const manifest = readJson(manifestPath);
const hashes = readJson(hashesPath);

const categoryConfig = {
  cultivars: { dir: 'cultivars', pattern: /^RC-\d{3}$/, required: ['id','slug','cultivar','scientificName','taxonId','status','canonicality','summary','assertionIds','relationshipIds','mediaIds','referenceStandard'] },
  assertions: { dir: 'assertions', pattern: /^AST-\d{6}$/, required: ['id','subjectId','domain','predicate','statement','state','confidence','evidenceIds','generatedFrom'] },
  evidence: { dir: 'evidence', pattern: /^EVD-\d{6}$/, required: ['id','evidenceType','scope','sourceId','status','note','assertionIds','sourceSha256'] },
  sources: { dir: 'sources', pattern: /^SRC-\d{6}$/, required: ['id','title','citation','sourceType','version','freezeDate','path','sha256','status'] },
  taxa: { dir: 'taxonomy', pattern: /^TAX-[A-Z0-9]+$/, required: ['id','scientificName','rank','status'] },
  relationships: { dir: 'relationships', pattern: /^REL-\d{6}$/, required: ['id','fromId','toId','type','label','status'] },
  media: { dir: 'media', pattern: /^MED-RC-\d{3}-IDENTITY-\d{3}$/, required: ['id','cultivarId','mediaType','role','status','assetPath','altText','evidentiaryStatus'] }
};

const db = {};
const byId = new Map();
for (const [category, config] of Object.entries(categoryConfig)) {
  const dir = path.join(REPO, config.dir);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(file => file.endsWith('.json')).sort() : [];
  db[category] = files.map(file => ({ file: path.join(dir, file), object: readJson(path.join(dir, file)) }));
  const expected = manifest.objectCounts?.[category];
  if (files.length !== expected) fail(`${category} count`, `expected ${expected}, found ${files.length}`); else pass(`${category} count`);
  for (const { file, object } of db[category]) {
    if (!config.pattern.test(object.id || '')) errors.push(`${path.relative(ROOT, file)}: invalid id ${object.id}`);
    for (const key of config.required) if (!(key in object)) errors.push(`${path.relative(ROOT, file)}: missing ${key}`);
    if (byId.has(object.id)) errors.push(`Duplicate object ID ${object.id}`);
    byId.set(object.id, { category, object, file });
    if (path.basename(file, '.json') !== object.id) errors.push(`${path.relative(ROOT, file)}: filename does not match id ${object.id}`);
  }
}

const objectTotal = Object.values(db).reduce((sum, items) => sum + items.length, 0);
if (objectTotal === 166 && manifest.objectTotal === 166) pass('repository object total'); else fail('repository object total', `manifest=${manifest.objectTotal}, actual=${objectTotal}, expected=166`);
if (manifest.canonicality === 'canonical-compiled') pass('canonicality'); else fail('canonicality', manifest.canonicality);

const maps = Object.fromEntries(Object.entries(db).map(([category, items]) => [category, new Map(items.map(({ object }) => [object.id, object]))]));
for (const cultivar of maps.cultivars.values()) {
  if (!maps.taxa.has(cultivar.taxonId)) errors.push(`${cultivar.id}: missing taxon ${cultivar.taxonId}`);
  if (cultivar.assertionIds.length !== 22) errors.push(`${cultivar.id}: expected 22 assertions, found ${cultivar.assertionIds.length}`);
  for (const id of cultivar.assertionIds) if (!maps.assertions.has(id)) errors.push(`${cultivar.id}: missing assertion ${id}`);
  for (const id of cultivar.relationshipIds) if (!maps.relationships.has(id)) errors.push(`${cultivar.id}: missing relationship ${id}`);
  for (const id of cultivar.mediaIds) if (!maps.media.has(id)) errors.push(`${cultivar.id}: missing media ${id}`);
  if (cultivar.status !== 'frozen-reference-standard') errors.push(`${cultivar.id}: non-frozen status ${cultivar.status}`);
  if (/provisional|pending canonical/i.test(JSON.stringify(cultivar))) errors.push(`${cultivar.id}: provisional language remains in canonical object`);
}
for (const assertion of maps.assertions.values()) {
  if (!maps.cultivars.has(assertion.subjectId)) errors.push(`${assertion.id}: missing subject ${assertion.subjectId}`);
  for (const id of assertion.evidenceIds) if (!maps.evidence.has(id)) errors.push(`${assertion.id}: missing evidence ${id}`);
  if (!['approved','approved-qualified'].includes(assertion.state)) errors.push(`${assertion.id}: invalid state ${assertion.state}`);
}
for (const evidence of maps.evidence.values()) {
  if (!maps.sources.has(evidence.sourceId)) errors.push(`${evidence.id}: missing source ${evidence.sourceId}`);
  for (const id of evidence.assertionIds) if (!maps.assertions.has(id)) errors.push(`${evidence.id}: missing assertion ${id}`);
}
for (const relationship of maps.relationships.values()) {
  if (!maps.cultivars.has(relationship.fromId)) errors.push(`${relationship.id}: missing fromId ${relationship.fromId}`);
  if (!maps.cultivars.has(relationship.toId)) errors.push(`${relationship.id}: missing toId ${relationship.toId}`);
}
for (const media of maps.media.values()) if (!maps.cultivars.has(media.cultivarId)) errors.push(`${media.id}: missing cultivar ${media.cultivarId}`);
if (!errors.some(error => /missing|invalid|Duplicate|expected 22|provisional|non-frozen/.test(error))) pass('schema and cross references');

let sourceHashesValid = true;
for (const source of maps.sources.values()) {
  const sourcePath = path.join(ROOT, source.path);
  if (!fs.existsSync(sourcePath)) { errors.push(`${source.id}: missing frozen input ${source.path}`); sourceHashesValid = false; continue; }
  const actual = sha256(fs.readFileSync(sourcePath));
  if (actual !== source.sha256 || hashes.inputs[source.path] !== actual) { errors.push(`${source.id}: frozen input hash mismatch`); sourceHashesValid = false; }
}
if (sourceHashesValid) pass('frozen source hashes'); else checks.push(['frozen source hashes','FAIL']);

let generatedHashesValid = true;
for (const [relative, expected] of Object.entries(hashes.generated)) {
  const target = path.join(ROOT, relative);
  if (!fs.existsSync(target) || sha256(fs.readFileSync(target)) !== expected) {
    errors.push(`Generated hash mismatch: ${relative}`);
    generatedHashesValid = false;
  }
}
if (generatedHashesValid) pass('generated file hashes'); else checks.push(['generated file hashes','FAIL']);

const indexed = readJson(path.join(REPO, 'indexes', 'object-index.json'));
const calculatedRepositoryHash = sha256(indexed.objects.slice().sort((a,b)=>a.path.localeCompare(b.path)).map(item => `${item.path}:${item.sha256}`).join('\n'));
if (indexed.objectCount === 166 && calculatedRepositoryHash === manifest.repositoryHash && hashes.repositoryHash === manifest.repositoryHash) pass('repository hash');
else fail('repository hash', 'manifest, object index, and hash registry disagree');

const registry = fs.readFileSync(path.join(ROOT, 'lib', 'repository-registry.js'), 'utf8');
for (const { object } of Object.values(db).flat()) if (!registry.includes(`${object.id}.json`)) errors.push(`Registry missing import for ${object.id}`);
if (!errors.some(error => error.startsWith('Registry missing'))) pass('generated JavaScript registry');

console.log('Japanese Maple Atlas — Sprint 6 validation');
console.log(`Compiler: ${manifest.compiler.name} ${manifest.compiler.version}`);
console.log(`Frozen inputs: ${manifest.source.records}`);
console.log(`Repository objects: ${objectTotal}`);
for (const [label, result] of checks) console.log(`${result.padEnd(4)}  ${label}`);
if (errors.length) {
  console.error(`\nErrors: ${errors.length}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('\nErrors: 0');
console.log('Repository validation: PASS');
