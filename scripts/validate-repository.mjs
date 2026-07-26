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

const manifest = readJson(path.join(REPO, 'manifest.json'));
const hashes = readJson(path.join(REPO, 'hashes.json'));
const categoryConfig = {
  cultivars: { dir: 'cultivars', pattern: /^RC-\d{3}$/, required: ['id','slug','cultivar','scientificName','taxonId','status','canonicality','summary','assertionIds','relationshipIds','mediaIds','referenceStandard'] },
  assertions: { dir: 'assertions', pattern: /^AST-\d{6}$/, required: ['id','subjectId','domain','predicate','statement','state','confidence','evidenceIds','generatedFrom'] },
  evidence: { dir: 'evidence', pattern: /^EVD-\d{6}$/, required: ['id','evidenceType','scope','sourceId','status','note','assertionIds','sourceSha256'] },
  sources: { dir: 'sources', pattern: /^SRC-(?:\d{6}|RC-\d{3}-\d{3})$/, required: ['id','title','citation','sourceType','authority','status'] },
  taxa: { dir: 'taxonomy', pattern: /^TAX-[A-Z0-9]+$/, required: ['id','scientificName','rank','status','relationshipIds'] },
  relationships: { dir: 'relationships', pattern: /^REL-\d{6}$/, required: ['id','typeId','type','category','directionality','fromId','toId','fromType','toType','label','inverseLabel','strength','confidence','rationale','status','evidenceAssertionIds','sourceIds','properties','generatedFrom'] },
  relationshipTypes: { dir: 'relationship-types', pattern: /^RLT-[A-Z0-9-]+$/, required: ['id','code','label','inverseLabel','category','directionality','description','allowedNodePairs','evidenceRequired','status','version','generatedFrom'] },
  media: { dir: 'media', pattern: /^MED-RC-\d{3}-[A-Z]+-\d{3}$/, required: ['id','cultivarId','mediaType','role','status','assetPath','altText','evidentiaryStatus'] },
  contributors: { dir: 'contributors', pattern: /^CTR-[A-Z0-9-]+$/, required: ['id','displayName','contributorType','roles','status','authorityScope','generatedFrom'] },
  submissions: { dir: 'submissions', pattern: /^SUB-[A-Z0-9-]+$/, required: ['id','targetType','targetId','contributorId','contributionType','title','summary','status','workflowId','reviewIds','generatedFrom'] },
  editorialWorkflows: { dir: 'editorial-workflows', pattern: /^EDW-[A-Z0-9-]+$/, required: ['id','submissionId','targetType','targetId','status','currentStage','stages','reviewIds','editorContributorId','generatedFrom'] },
  editorialReviews: { dir: 'editorial-reviews', pattern: /^REV-[A-Z0-9-]+$/, required: ['id','workflowId','submissionId','targetId','passNumber','code','lens','result','exitCriterion','reviewerContributorId','status','generatedFrom'] }
};

const db = {};
const byId = new Map();
for (const [category, config] of Object.entries(categoryConfig)) {
  const dir = path.join(REPO, config.dir);
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(file => file.endsWith('.json')).sort() : [];
  db[category] = files.map(file => ({ file: path.join(dir, file), object: readJson(path.join(dir, file)) }));
  const expected = manifest.objectCounts?.[category];
  if (files.length === expected) pass(`${category} count`); else fail(`${category} count`, `expected ${expected}, found ${files.length}`);
  for (const { file, object } of db[category]) {
    if (!config.pattern.test(object.id || '')) errors.push(`${path.relative(ROOT, file)}: invalid id ${object.id}`);
    for (const field of config.required) if (!(field in object)) errors.push(`${path.relative(ROOT, file)}: missing ${field}`);
    if (byId.has(object.id)) errors.push(`Duplicate object ID ${object.id}`);
    byId.set(object.id, { category, object, file });
    if (path.basename(file, '.json') !== object.id) errors.push(`${path.relative(ROOT, file)}: filename does not match id ${object.id}`);
  }
}

const maps = Object.fromEntries(Object.entries(db).map(([category, items]) => [category, new Map(items.map(({ object }) => [object.id, object]))]));
const objectTotal = Object.values(db).reduce((sum, items) => sum + items.length, 0);
if (objectTotal === manifest.objectTotal) pass('repository object total'); else fail('repository object total', `manifest=${manifest.objectTotal}, actual=${objectTotal}`);
if (manifest.repositoryVersion === '0.11.0' && manifest.release.includes('Sprint 11')) pass('Sprint 11 manifest'); else fail('Sprint 11 manifest', `${manifest.repositoryVersion} ${manifest.release}`);
if (manifest.compiler.version === '2.0.0' && manifest.compiler.atomicPublication === true) pass('scalable atomic compiler contract'); else fail('scalable atomic compiler contract', JSON.stringify(manifest.compiler));
if (manifest.contract?.profile === 'canonical-rc-v1' && manifest.contract?.effectiveFromRecord === 'RC-006') pass('canonical RC contract'); else fail('canonical RC contract', JSON.stringify(manifest.contract));
if (manifest.canonicality === 'canonical-compiled') pass('canonicality'); else fail('canonicality', manifest.canonicality);
if (manifest.objectCounts.assertions === manifest.objectCounts.cultivars * 22) pass('dynamic assertion count'); else fail('dynamic assertion count', `${manifest.objectCounts.assertions}`);
if (manifest.objectCounts.evidence === manifest.objectCounts.cultivars * 7) pass('dynamic evidence count'); else fail('dynamic evidence count', `${manifest.objectCounts.evidence}`);

for (const cultivar of maps.cultivars.values()) {
  if (!maps.taxa.has(cultivar.taxonId)) errors.push(`${cultivar.id}: missing taxon ${cultivar.taxonId}`);
  if (cultivar.assertionIds.length !== 22) errors.push(`${cultivar.id}: expected 22 assertions, found ${cultivar.assertionIds.length}`);
  for (const id of cultivar.assertionIds) if (!maps.assertions.has(id)) errors.push(`${cultivar.id}: missing assertion ${id}`);
  for (const id of cultivar.relationshipIds) if (!maps.relationships.has(id)) errors.push(`${cultivar.id}: missing relationship ${id}`);
  for (const id of cultivar.mediaIds) if (!maps.media.has(id)) errors.push(`${cultivar.id}: missing media ${id}`);
  if (cultivar.status !== 'frozen-reference-standard') errors.push(`${cultivar.id}: non-frozen status ${cultivar.status}`);
}
for (const taxon of maps.taxa.values()) for (const id of taxon.relationshipIds) if (!maps.relationships.has(id)) errors.push(`${taxon.id}: missing relationship ${id}`);
for (const assertion of maps.assertions.values()) {
  if (!maps.cultivars.has(assertion.subjectId)) errors.push(`${assertion.id}: missing subject ${assertion.subjectId}`);
  for (const id of assertion.evidenceIds) if (!maps.evidence.has(id)) errors.push(`${assertion.id}: missing evidence ${id}`);
}
for (const evidence of maps.evidence.values()) {
  if (!maps.sources.has(evidence.sourceId)) errors.push(`${evidence.id}: missing source ${evidence.sourceId}`);
  const hasUnderlyingSources = Array.isArray(evidence.sourceIds) || Array.isArray(evidence.sourceLocations);
  if (hasUnderlyingSources) {
    if (!Array.isArray(evidence.sourceIds) || evidence.sourceIds.length < 2) errors.push(`${evidence.id}: canonical provenance requires Reference Standard and underlying source IDs`);
    if (!Array.isArray(evidence.sourceLocations) || evidence.sourceLocations.length !== evidence.sourceIds?.length) errors.push(`${evidence.id}: canonical provenance requires one source-location entry per source ID`);
    if (!evidence.sourceIds?.includes(evidence.sourceId)) errors.push(`${evidence.id}: canonical provenance must include primary sourceId ${evidence.sourceId}`);
    for (const id of evidence.sourceIds || []) if (!maps.sources.has(id)) errors.push(`${evidence.id}: missing source ${id}`);
    for (const location of evidence.sourceLocations || []) {
      if (!maps.sources.has(location.sourceId)) errors.push(`${evidence.id}: source location references missing source ${location.sourceId}`);
      if (!evidence.sourceIds?.includes(location.sourceId)) errors.push(`${evidence.id}: source location ${location.sourceId} is not declared in sourceIds`);
      const hasLocator = Boolean(location.path && location.section) || (Array.isArray(location.locators) && location.locators.length > 0);
      if (!hasLocator) errors.push(`${evidence.id}: source location ${location.sourceId} has no usable locator`);
    }
  }
  for (const id of evidence.assertionIds) if (!maps.assertions.has(id)) errors.push(`${evidence.id}: missing assertion ${id}`);
}
for (const source of maps.sources.values()) {
  for (const id of source.underlyingSourceIds || []) if (!maps.sources.has(id)) errors.push(`${source.id}: missing underlying source ${id}`);
  for (const id of source.recordIds || []) if (!maps.cultivars.has(id)) errors.push(`${source.id}: missing linked cultivar ${id}`);
}
for (const relationship of maps.relationships.values()) {
  const from = byId.get(relationship.fromId);
  const to = byId.get(relationship.toId);
  const type = maps.relationshipTypes.get(relationship.typeId);
  if (!from || !to) errors.push(`${relationship.id}: invalid graph endpoint`);
  if (!type) errors.push(`${relationship.id}: missing relationship type ${relationship.typeId}`);
  if (relationship.fromId === relationship.toId) errors.push(`${relationship.id}: self relationship`);
  if (relationship.strength < 1 || relationship.strength > 5) errors.push(`${relationship.id}: invalid strength`);
  for (const id of relationship.evidenceAssertionIds) if (!maps.assertions.has(id)) errors.push(`${relationship.id}: missing evidence assertion ${id}`);
  for (const id of relationship.sourceIds) if (!maps.sources.has(id)) errors.push(`${relationship.id}: missing source ${id}`);
}
for (const media of maps.media.values()) if (!maps.cultivars.has(media.cultivarId)) errors.push(`${media.id}: missing cultivar ${media.cultivarId}`);

const workflowStages = ['evidence-collection','evidence-evaluation','assertion-extraction','assertion-matrix','approved-register','unresolved-register','rejected-register','editorial-synthesis','five-pass-review','corrected-reference-standard','editorial-verification','freeze'];
for (const submission of maps.submissions.values()) {
  if (!maps.contributors.has(submission.contributorId)) errors.push(`${submission.id}: missing contributor ${submission.contributorId}`);
  if (submission.targetType === 'cultivar' && !maps.cultivars.has(submission.targetId)) errors.push(`${submission.id}: missing target ${submission.targetId}`);
  if (!maps.editorialWorkflows.has(submission.workflowId)) errors.push(`${submission.id}: missing workflow ${submission.workflowId}`);
  for (const id of submission.reviewIds) if (!maps.editorialReviews.has(id)) errors.push(`${submission.id}: missing review ${id}`);
}
for (const workflow of maps.editorialWorkflows.values()) {
  if (!maps.submissions.has(workflow.submissionId)) errors.push(`${workflow.id}: missing submission ${workflow.submissionId}`);
  if (!maps.contributors.has(workflow.editorContributorId)) errors.push(`${workflow.id}: missing editor ${workflow.editorContributorId}`);
  if (workflow.stages.length !== 12 || workflow.stages.map(item => item.stage).join('|') !== workflowStages.join('|')) errors.push(`${workflow.id}: invalid 12-stage lifecycle`);
  for (const id of workflow.reviewIds) if (!maps.editorialReviews.has(id)) errors.push(`${workflow.id}: missing review ${id}`);
  if (workflow.status === 'frozen' && (workflow.currentStage !== 'freeze' || workflow.reviewIds.length !== 5 || workflow.stages.some(stage => stage.status !== 'complete'))) errors.push(`${workflow.id}: frozen workflow is incomplete`);
}
for (const review of maps.editorialReviews.values()) {
  if (!maps.editorialWorkflows.has(review.workflowId)) errors.push(`${review.id}: missing workflow ${review.workflowId}`);
  if (!maps.submissions.has(review.submissionId)) errors.push(`${review.id}: missing submission ${review.submissionId}`);
  if (!maps.contributors.has(review.reviewerContributorId)) errors.push(`${review.id}: missing reviewer ${review.reviewerContributorId}`);
  if (review.passNumber < 1 || review.passNumber > 5) errors.push(`${review.id}: invalid pass number`);
}
if (!errors.some(error => /missing|invalid|Duplicate|incomplete|expected 22|non-frozen|self relationship/.test(error))) pass('schemas and cross references');

let inputHashesValid = true;
for (const [relative, expected] of Object.entries(hashes.inputs)) {
  const file = path.join(ROOT, relative);
  if (!fs.existsSync(file) || sha256(fs.readFileSync(file)) !== expected) { errors.push(`Input hash mismatch: ${relative}`); inputHashesValid = false; }
}
if (inputHashesValid) pass('source, editorial and graph input hashes'); else checks.push(['source, editorial and graph input hashes','FAIL']);

let generatedHashesValid = true;
for (const [relative, expected] of Object.entries(hashes.generated)) {
  const file = path.join(ROOT, relative);
  if (!fs.existsSync(file) || sha256(fs.readFileSync(file)) !== expected) { errors.push(`Generated hash mismatch: ${relative}`); generatedHashesValid = false; }
}
if (generatedHashesValid) pass('generated file hashes'); else checks.push(['generated file hashes','FAIL']);

const indexed = readJson(path.join(REPO, 'indexes', 'object-index.json'));
const calculatedHash = sha256(indexed.objects.slice().sort((a,b) => a.path.localeCompare(b.path)).map(item => `${item.path}:${item.sha256}`).join('\n'));
if (indexed.objectCount === objectTotal && calculatedHash === manifest.repositoryHash && hashes.repositoryHash === manifest.repositoryHash) pass('repository hash'); else fail('repository hash', 'manifest, object index and hash registry disagree');

const graph = readJson(path.join(REPO, 'indexes', 'graph-index.json'));
if (graph.nodeCount === maps.cultivars.size + maps.taxa.size && graph.edgeCount === maps.relationships.size && graph.stats.relationshipTypes === maps.relationshipTypes.size && manifest.graph.graphHash === graph.graphHash) pass('knowledge graph index'); else fail('knowledge graph index', 'graph index and manifest disagree');

const registry = fs.readFileSync(path.join(ROOT, 'lib', 'repository-registry.js'), 'utf8');
const registryCategories = ['cultivars','assertions','evidence','sources','taxonomy','relationships','relationship-types','media','contributors','submissions','editorial-workflows','editorial-reviews'];
for (const category of registryCategories) if (!registry.includes(`loadDirectory('${category}')`)) errors.push(`Registry missing category ${category}`);
if (!registry.includes("loadJson(path.join(repositoryRoot, 'manifest.json'))")) errors.push('Registry missing manifest loader');
if (!registry.includes("loadJson(path.join(repositoryRoot, 'indexes', 'graph-index.json'))")) errors.push('Registry missing graph index loader');
if (!errors.some(error => error.startsWith('Registry missing'))) pass('generated JavaScript registry');

console.log('Japanese Maple Atlas — Sprint 11 repository validation');
console.log(`Compiler: ${manifest.compiler.name} ${manifest.compiler.version}`);
console.log(`Frozen inputs: ${manifest.source.records}`);
console.log(`Graph nodes: ${manifest.graph.nodes}`);
console.log(`Graph edges: ${manifest.graph.edges}`);
console.log(`Repository objects: ${objectTotal}`);
for (const [label, result] of checks) console.log(`${result.padEnd(4)}  ${label}`);
if (errors.length) {
  console.error(`\nErrors: ${errors.length}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('\nErrors: 0');
console.log('Repository validation: PASS');
