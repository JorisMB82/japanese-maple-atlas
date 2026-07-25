from pathlib import Path


def replace_once(path, old, new):
    file = Path(path)
    source = file.read_text()
    if old not in source:
        raise SystemExit(f"{path}: expected text not found: {old[:120]!r}")
    file.write_text(source.replace(old, new, 1))


def replace_between(path, start_marker, end_marker, replacement):
    file = Path(path)
    source = file.read_text()
    start = source.find(start_marker)
    if start < 0:
        raise SystemExit(f"{path}: start marker not found: {start_marker!r}")
    end = source.find(end_marker, start)
    if end < 0:
        raise SystemExit(f"{path}: end marker not found: {end_marker!r}")
    file.write_text(source[:start] + replacement + source[end:])


compiler = 'scripts/compile-atlas.mjs'
replace_once(
    compiler,
    "import os from 'node:os';\n",
    "import os from 'node:os';\nimport { buildKnowledgeGraphIndex, nodeTypeForId } from '../lib/knowledge-graph.mjs';\n"
)
replace_once(
    compiler,
    "const EDITORIAL_INPUT_DIR = path.join(ROOT, 'editorial-inbox');\nconst COMPILER_VERSION = '1.1.0';",
    "const EDITORIAL_INPUT_DIR = path.join(ROOT, 'editorial-inbox');\nconst GRAPH_INPUT_DIR = path.join(REPOSITORY, 'relationship-standards');\nconst COMPILER_VERSION = '1.2.0';"
)

graph_input_function = r'''function collectGraphInputs() {
  const typeInputPath = path.join(GRAPH_INPUT_DIR, 'relationship-types.json');
  const relationshipInputPath = path.join(GRAPH_INPUT_DIR, 'relationships.json');
  const typeRaw = fs.readFileSync(typeInputPath, 'utf8');
  const relationshipRaw = fs.readFileSync(relationshipInputPath, 'utf8');
  const typeDocument = JSON.parse(typeRaw);
  const relationshipDocument = JSON.parse(relationshipRaw);
  if (typeDocument.status !== 'approved' || relationshipDocument.status !== 'approved') throw new Error('Graph input documents must be approved');
  if (!Array.isArray(typeDocument.types) || !Array.isArray(relationshipDocument.relationships)) throw new Error('Graph input documents are malformed');
  const typeIds = new Set();
  for (const type of typeDocument.types) {
    if (!/^RLT-[A-Z0-9-]+$/.test(type.id || '')) throw new Error(`Invalid relationship type id ${type.id}`);
    if (typeIds.has(type.id)) throw new Error(`Duplicate relationship type ${type.id}`);
    typeIds.add(type.id);
    for (const key of ['code','label','inverseLabel','category','directionality','description','allowedNodePairs','evidenceRequired','status','version']) if (!(key in type)) throw new Error(`${type.id}: missing ${key}`);
  }
  const relationshipIds = new Set();
  for (const relationship of relationshipDocument.relationships) {
    if (!/^REL-\d{6}$/.test(relationship.id || '')) throw new Error(`Invalid relationship id ${relationship.id}`);
    if (relationshipIds.has(relationship.id)) throw new Error(`Duplicate relationship ${relationship.id}`);
    relationshipIds.add(relationship.id);
    if (!typeIds.has(relationship.typeId)) throw new Error(`${relationship.id}: unknown relationship type ${relationship.typeId}`);
    for (const key of ['fromId','toId','label','inverseLabel','strength','confidence','rationale','evidenceSelectors','properties']) if (!(key in relationship)) throw new Error(`${relationship.id}: missing ${key}`);
    if (relationship.fromId === relationship.toId) throw new Error(`${relationship.id}: self relationships are not allowed`);
    if (!Number.isInteger(relationship.strength) || relationship.strength < 1 || relationship.strength > 5) throw new Error(`${relationship.id}: strength must be an integer from 1 to 5`);
  }
  return {
    types: typeDocument.types,
    relationships: relationshipDocument.relationships,
    typeInput: { inputPath: typeInputPath, inputSha256: sha256(typeRaw) },
    relationshipInput: { inputPath: relationshipInputPath, inputSha256: sha256(relationshipRaw) }
  };
}

'''
replace_once(compiler, 'const RECORD_CONFIG = {', graph_input_function + 'const RECORD_CONFIG = {')
replace_once(compiler, 'function buildCompilerOutputs(records, editorialInputs) {', 'function buildCompilerOutputs(records, editorialInputs, graphInputs) {')

relationship_block = r'''  const taxa = [
    { id: 'TAX-APAL', scientificName: 'Acer palmatum', rank: 'species', status: 'accepted', commonName: 'Japanese maple', authority: 'Thunb.', relationshipIds: [] },
    { id: 'TAX-ASHI', scientificName: 'Acer shirasawanum', rank: 'species', status: 'accepted', commonName: 'Shirasawa maple', authority: 'Koidz.', relationshipIds: [] }
  ];

  const relationshipTypeInputPath = path.relative(ROOT, graphInputs.typeInput.inputPath).replaceAll(path.sep, '/');
  const relationshipInputPath = path.relative(ROOT, graphInputs.relationshipInput.inputPath).replaceAll(path.sep, '/');
  const relationshipTypes = graphInputs.types.map(type => ({
    ...type,
    generatedFrom: { path: relationshipTypeInputPath, sha256: graphInputs.typeInput.inputSha256, compilerVersion: COMPILER_VERSION }
  }));
  const relationshipTypeById = new Map(relationshipTypes.map(type => [type.id, type]));
  const assertionBySelector = new Map(assertionObjects.map(assertion => [`${assertion.subjectId}:${assertion.predicate}`, assertion]));
  const relationships = graphInputs.relationships.map(specification => {
    const type = relationshipTypeById.get(specification.typeId);
    const evidenceAssertionIds = specification.evidenceSelectors.map(selector => {
      const assertion = assertionBySelector.get(`${selector.subjectId}:${selector.predicate}`);
      if (!assertion) throw new Error(`${specification.id}: missing evidence selector ${selector.subjectId}:${selector.predicate}`);
      return assertion.id;
    });
    const sourceIds = [...new Set(evidenceAssertionIds.map(id => assertionObjects.find(assertion => assertion.id === id)?.generatedFrom?.sourceId).filter(Boolean))];
    const { evidenceSelectors, ...governedSpecification } = specification;
    return {
      ...governedSpecification,
      type: type.code,
      category: type.category,
      directionality: type.directionality,
      fromType: nodeTypeForId(specification.fromId),
      toType: nodeTypeForId(specification.toId),
      status: 'approved',
      version: '1.0.0',
      evidenceAssertionIds,
      sourceIds,
      generatedFrom: { path: relationshipInputPath, sha256: graphInputs.relationshipInput.inputSha256, compilerVersion: COMPILER_VERSION }
    };
  });
  for (const relationship of relationships) {
    cultivarObjects.find(item => item.id === relationship.fromId)?.relationshipIds.push(relationship.id);
    cultivarObjects.find(item => item.id === relationship.toId)?.relationshipIds.push(relationship.id);
    taxa.find(item => item.id === relationship.fromId)?.relationshipIds.push(relationship.id);
    taxa.find(item => item.id === relationship.toId)?.relationshipIds.push(relationship.id);
  }
'''
replace_between(compiler, '  const relationships = [', '  const plateConfig = {', relationship_block + '\n  const plateConfig = {')

replace_once(
    compiler,
    "    ['taxonomy', taxa], ['relationships', relationships], ['media', media],",
    "    ['taxonomy', taxa], ['relationships', relationships], ['relationship-types', relationshipTypes], ['media', media],"
)
replace_once(
    compiler,
    "const countKey = folder => ({ taxonomy: 'taxa', 'editorial-workflows': 'editorialWorkflows', 'editorial-reviews': 'editorialReviews' }[folder] || folder);",
    "const countKey = folder => ({ taxonomy: 'taxa', 'relationship-types': 'relationshipTypes', 'editorial-workflows': 'editorialWorkflows', 'editorial-reviews': 'editorialReviews' }[folder] || folder);"
)
replace_once(
    compiler,
    "if (objectTotal !== 203) throw new Error(`Compiler invariant failed: expected 203 repository objects, generated ${objectTotal}`);",
    "if (objectTotal !== 235) throw new Error(`Compiler invariant failed: expected 235 repository objects, generated ${objectTotal}`);"
)
replace_once(
    compiler,
    "  const editorialInputHashes = [...editorialInputs.contributors, ...editorialInputs.submissions].map(item => `${path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/')}:${item.inputSha256}`);\n  const inputHash = sha256([...records.map(record => `${record.id}:${record.inputSha256}`), ...editorialInputHashes].sort().join('\\n'));",
    "  const editorialInputHashes = [...editorialInputs.contributors, ...editorialInputs.submissions].map(item => `${path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/')}:${item.inputSha256}`);\n  const graphInputHashes = [graphInputs.typeInput, graphInputs.relationshipInput].map(item => `${path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/')}:${item.inputSha256}`);\n  const inputHash = sha256([...records.map(record => `${record.id}:${record.inputSha256}`), ...editorialInputHashes, ...graphInputHashes].sort().join('\\n'));"
)
replace_once(
    compiler,
    "  outputs.set('atlas-repository/indexes/object-index.json', json(objectIndex));\n  const searchIndex = cultivarObjects.map(cultivar => ({",
    "  outputs.set('atlas-repository/indexes/object-index.json', json(objectIndex));\n  const graphIndex = buildKnowledgeGraphIndex({ cultivars: cultivarObjects, taxa, relationships, relationshipTypes, repositoryHash });\n  graphIndex.graphHash = sha256(graphIndex.graphHashPayload);\n  delete graphIndex.graphHashPayload;\n  outputs.set('atlas-repository/indexes/graph-index.json', json(graphIndex));\n  const searchIndex = cultivarObjects.map(cultivar => ({"
)
replace_once(
    compiler,
    "    repositoryVersion: '0.7.0', release: 'Sprint 7 — Editorial workflow and contributor pipeline', generatedAt: RELEASE_DATE,",
    "    repositoryVersion: '0.9.0', release: 'Sprint 9 — Knowledge graph and cultivar relationships', generatedAt: RELEASE_DATE,"
)
replace_once(
    compiler,
    "    editorial: { contributors: contributorObjects.length, submissions: submissionObjects.length, workflows: workflowObjects.length, reviews: reviewObjects.length, lifecycleStages: WORKFLOW_STAGES.length, reviewPasses: REVIEW_PASSES.length },\n    objectCounts, objectTotal, repositoryHash, canonicality: 'canonical-compiled',\n    notes: 'RC-001 through RC-005 remain canonical compiled records. Sprint 7 adds a governed repository-native editorial workflow and contributor pipeline.'",
    "    editorial: { contributors: contributorObjects.length, submissions: submissionObjects.length, workflows: workflowObjects.length, reviews: reviewObjects.length, lifecycleStages: WORKFLOW_STAGES.length, reviewPasses: REVIEW_PASSES.length },\n    graph: { nodes: graphIndex.nodeCount, edges: graphIndex.edgeCount, relationshipTypes: relationshipTypes.length, categories: graphIndex.stats.categories, graphHash: graphIndex.graphHash },\n    objectCounts, objectTotal, repositoryHash, canonicality: 'canonical-compiled',\n    notes: 'RC-001 through RC-005 remain canonical compiled records. Sprint 9 adds governed, evidence-linked taxonomic, morphological, architectural, seasonal, cultivation and diagnostic relationships.'"
)
replace_once(
    compiler,
    "export const relationships = loadDirectory('relationships');\\nexport const media",
    "export const relationships = loadDirectory('relationships');\\nexport const relationshipTypes = loadDirectory('relationship-types');\\nexport const media"
)
replace_once(
    compiler,
    "export const editorialReviews = loadDirectory('editorial-reviews');\\n`;",
    "export const editorialReviews = loadDirectory('editorial-reviews');\\nexport const graphIndex = loadJson(path.join(repositoryRoot, 'indexes', 'graph-index.json'));\\n`;"
)
replace_once(
    compiler,
    "  const sourceHashInputs = records.map(record => [path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'), record.inputSha256]);\n  outputs.set('atlas-repository/hashes.json', json({ algorithm: 'sha256', compilerVersion: COMPILER_VERSION, inputHash, repositoryHash, inputs: Object.fromEntries([...sourceHashInputs, ...editorialHashInputs]), generated: generatedHashes }));",
    "  const sourceHashInputs = records.map(record => [path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'), record.inputSha256]);\n  const graphHashInputs = [graphInputs.typeInput, graphInputs.relationshipInput].map(item => [path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/'), item.inputSha256]);\n  outputs.set('atlas-repository/hashes.json', json({ algorithm: 'sha256', compilerVersion: COMPILER_VERSION, inputHash, repositoryHash, inputs: Object.fromEntries([...sourceHashInputs, ...editorialHashInputs, ...graphHashInputs]), generated: generatedHashes }));"
)
replace_once(
    compiler,
    "const generatedObjectDirs = ['cultivars', 'assertions', 'evidence', 'sources', 'taxonomy', 'relationships', 'media', 'contributors', 'submissions', 'editorial-workflows', 'editorial-reviews', 'indexes'];",
    "const generatedObjectDirs = ['cultivars', 'assertions', 'evidence', 'sources', 'taxonomy', 'relationships', 'relationship-types', 'media', 'contributors', 'submissions', 'editorial-workflows', 'editorial-reviews', 'indexes'];"
)
replace_once(
    compiler,
    "  const editorialInputs = collectEditorialInputs();\n  const result = buildCompilerOutputs(collectInputs(), editorialInputs);",
    "  const editorialInputs = collectEditorialInputs();\n  const graphInputs = collectGraphInputs();\n  const result = buildCompilerOutputs(collectInputs(), editorialInputs, graphInputs);"
)

validator = r'''import fs from 'node:fs';
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
  sources: { dir: 'sources', pattern: /^SRC-\d{6}$/, required: ['id','title','citation','sourceType','version','freezeDate','path','sha256','status'] },
  taxa: { dir: 'taxonomy', pattern: /^TAX-[A-Z0-9]+$/, required: ['id','scientificName','rank','status','relationshipIds'] },
  relationships: { dir: 'relationships', pattern: /^REL-\d{6}$/, required: ['id','typeId','type','category','directionality','fromId','toId','fromType','toType','label','inverseLabel','strength','confidence','rationale','status','evidenceAssertionIds','sourceIds','properties','generatedFrom'] },
  relationshipTypes: { dir: 'relationship-types', pattern: /^RLT-[A-Z0-9-]+$/, required: ['id','code','label','inverseLabel','category','directionality','description','allowedNodePairs','evidenceRequired','status','version','generatedFrom'] },
  media: { dir: 'media', pattern: /^MED-RC-\d{3}-IDENTITY-\d{3}$/, required: ['id','cultivarId','mediaType','role','status','assetPath','altText','evidentiaryStatus'] },
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
if (objectTotal === 235 && manifest.objectTotal === 235) pass('repository object total'); else fail('repository object total', `manifest=${manifest.objectTotal}, actual=${objectTotal}, expected=235`);
if (manifest.repositoryVersion === '0.9.0' && manifest.release.includes('Sprint 9')) pass('Sprint 9 manifest'); else fail('Sprint 9 manifest', `${manifest.repositoryVersion} ${manifest.release}`);
if (manifest.canonicality === 'canonical-compiled') pass('canonicality'); else fail('canonicality', manifest.canonicality);

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
  for (const id of evidence.assertionIds) if (!maps.assertions.has(id)) errors.push(`${evidence.id}: missing assertion ${id}`);
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
if (indexed.objectCount === 235 && calculatedHash === manifest.repositoryHash && hashes.repositoryHash === manifest.repositoryHash) pass('repository hash'); else fail('repository hash', 'manifest, object index and hash registry disagree');

const graph = readJson(path.join(REPO, 'indexes', 'graph-index.json'));
if (graph.nodeCount === 7 && graph.edgeCount === 26 && graph.stats.relationshipTypes === 10 && manifest.graph.graphHash === graph.graphHash) pass('knowledge graph index'); else fail('knowledge graph index', 'graph index and manifest disagree');

const registry = fs.readFileSync(path.join(ROOT, 'lib', 'repository-registry.js'), 'utf8');
const registryCategories = ['cultivars','assertions','evidence','sources','taxonomy','relationships','relationship-types','media','contributors','submissions','editorial-workflows','editorial-reviews'];
for (const category of registryCategories) if (!registry.includes(`loadDirectory('${category}')`)) errors.push(`Registry missing category ${category}`);
if (!registry.includes("loadJson(path.join(repositoryRoot, 'manifest.json'))")) errors.push('Registry missing manifest loader');
if (!registry.includes("loadJson(path.join(repositoryRoot, 'indexes', 'graph-index.json'))")) errors.push('Registry missing graph index loader');
if (!errors.some(error => error.startsWith('Registry missing'))) pass('generated JavaScript registry');

console.log('Japanese Maple Atlas — Sprint 9 repository validation');
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
'''
Path('scripts/validate-repository.mjs').write_text(validator)

print('Sprint 9 compiler and repository validator integration applied.')
