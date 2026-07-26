import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { buildKnowledgeGraphIndex, nodeTypeForId } from '../lib/knowledge-graph.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const REPOSITORY = path.join(ROOT, 'atlas-repository');
const INPUT_DIR = path.join(REPOSITORY, 'reference-standards');
const CONTRACT_DIR = path.join(INPUT_DIR, 'contract');
const MEDIA_INPUT_DIR = path.join(INPUT_DIR, 'media');
const SOURCE_INPUT_DIR = path.join(INPUT_DIR, 'sources');
const EDITORIAL_INPUT_DIR = path.join(ROOT, 'editorial-inbox');
const GRAPH_INPUT_DIR = path.join(REPOSITORY, 'relationship-standards');
const COMPILER_VERSION = '2.0.0';
const RELEASE_DATE = '2026-07-26';
const LEGACY_BOTANICAL_COMPILER_VERSION = '1.0.0';
const LEGACY_BOTANICAL_RELEASE_DATE = '2026-07-24';
const GRAPH_OUTPUT_VERSION = '1.2.0';
const EDITORIAL_OUTPUT_VERSION = '1.2.0';
const REPOSITORY_VERSION = '0.11.0';
const RELEASE_NAME = 'Sprint 11 — Compiler and Repository Scale Generalisation';

const JSON_INDENT = 2;
const json = value => `${JSON.stringify(value, null, JSON_INDENT)}\n`;
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const normalizeSpace = value => String(value || '').replace(/\s+/g, ' ').trim();
const stripMarkdown = value => normalizeSpace(String(value || '')
  .replace(/<!--.*?-->/gs, ' ')
  .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
  .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/[`*_>#]/g, '')
  .replace(/\s+([,.;:])/g, '$1'));
const keyOf = value => stripMarkdown(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const sentence = value => {
  const text = stripMarkdown(value).replace(/^[-–—:;,.\s]+/, '');
  if (!text) return '';
  return /[.!?]$/.test(text) ? text : `${text}.`;
};
const stableSlug = value => stripMarkdown(value).normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const statusIsApproved = (status, patterns) => patterns.some(pattern => keyOf(status) === keyOf(pattern));
const splitGovernedList = value => {
  const normalized = stripMarkdown(value);
  if (!normalized || /^(none|none established|not established|unresolved)$/i.test(normalized)) return [];
  return [...new Set(normalized.split(/\s*;\s*/).map(item => item.trim()).filter(Boolean))];
};

const WORKFLOW_STAGES = [
  'evidence-collection', 'evidence-evaluation', 'assertion-extraction', 'assertion-matrix',
  'approved-register', 'unresolved-register', 'rejected-register', 'editorial-synthesis',
  'five-pass-review', 'corrected-reference-standard', 'editorial-verification', 'freeze'
];
const REVIEW_PASSES = [
  [1, 'botanical-accuracy', 'Botanical accuracy'],
  [2, 'evidence-traceability', 'Evidence traceability'],
  [3, 'terminology-consistency', 'Terminology and consistency'],
  [4, 'editorial-quality', 'Editorial quality and readability'],
  [5, 'governance-release', 'Governance and release readiness']
];

function readEditorialJson(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(file => file.endsWith('.json')).sort().map(file => {
    const inputPath = path.join(dir, file);
    const raw = fs.readFileSync(inputPath, 'utf8');
    return { inputPath, inputSha256: sha256(raw), data: JSON.parse(raw) };
  });
}

function collectEditorialInputs() {
  const contributors = readEditorialJson(path.join(EDITORIAL_INPUT_DIR, 'contributors'));
  const submissions = readEditorialJson(path.join(EDITORIAL_INPUT_DIR, 'submissions'));
  const contributorIds = new Set(contributors.map(item => item.data.id));
  for (const item of contributors) {
    const c = item.data;
    if (!/^CTR-[A-Z0-9-]+$/.test(c.id || '')) throw new Error(`Invalid contributor id in ${item.inputPath}`);
    for (const key of ['displayName','contributorType','roles','status','authorityScope','createdAt','version']) if (!(key in c)) throw new Error(`${c.id}: missing ${key}`);
  }
  for (const item of submissions) {
    const submission = item.data;
    if (!/^SUB-[A-Z0-9-]+$/.test(submission.id || '')) throw new Error(`Invalid submission id in ${item.inputPath}`);
    for (const key of ['targetType','targetId','contributorId','contributionType','title','summary','status','submittedAt','version','workflow']) if (!(key in submission)) throw new Error(`${submission.id}: missing ${key}`);
    if (!contributorIds.has(submission.contributorId)) throw new Error(`${submission.id}: unknown contributor ${submission.contributorId}`);
    if (!WORKFLOW_STAGES.includes(submission.workflow.currentStage)) throw new Error(`${submission.id}: invalid workflow stage ${submission.workflow.currentStage}`);
  }
  return { contributors, submissions };
}

function collectGraphInputs() {
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

function readGovernanceDocument(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return { data: JSON.parse(raw), inputPath: file, inputSha256: sha256(raw) };
}

function loadCompilerGovernance(contractDir = CONTRACT_DIR) {
  const contractInput = readGovernanceDocument(path.join(contractDir, 'rc-contract.json'));
  const compatibilityInput = readGovernanceDocument(path.join(contractDir, 'compatibility-registry.json'));
  const taxaInput = readGovernanceDocument(path.join(contractDir, 'taxa.json'));
  if (contractInput.data.status !== 'approved') throw new Error('Reference Standard contract must be approved');
  if (compatibilityInput.data.status !== 'approved') throw new Error('Compatibility registry must be approved');
  if (taxaInput.data.status !== 'approved') throw new Error('Taxon registry must be approved');
  if (!Array.isArray(taxaInput.data.taxa) || !taxaInput.data.taxa.length) throw new Error('Taxon registry must contain approved taxa');
  const taxonIds = new Set();
  const species = new Set();
  for (const taxon of taxaInput.data.taxa) {
    if (!/^TAX-[A-Z0-9]+$/.test(taxon.id || '')) throw new Error(`Invalid taxon id ${taxon.id}`);
    if (taxonIds.has(taxon.id)) throw new Error(`Duplicate taxon id ${taxon.id}`);
    if (species.has(taxon.scientificName)) throw new Error(`Duplicate taxon scientific name ${taxon.scientificName}`);
    taxonIds.add(taxon.id);
    species.add(taxon.scientificName);
  }
  return {
    contract: contractInput.data,
    compatibility: compatibilityInput.data,
    taxa: taxaInput.data.taxa,
    inputs: [contractInput, compatibilityInput, taxaInput]
  };
}

function mergeProfile(base, override = {}) {
  return {
    ...base,
    ...override,
    tableAliases: { ...(base.tableAliases || {}), ...(override.tableAliases || {}) },
    defaults: { ...(base.defaults || {}), ...(override.defaults || {}) }
  };
}

function recordNumber(id) {
  const match = /^RC-(\d{3})$/.exec(id || '');
  return match ? Number(match[1]) : Number.NaN;
}

function profileForRecord(fileId, governance) {
  const adapter = governance.compatibility.records?.[fileId];
  const exception = (governance.compatibility.exceptions || []).find(item => item.recordId === fileId);
  if (adapter && exception) throw new Error(`${fileId}: cannot have both a legacy adapter and an exception`);
  if (adapter) return { profile: mergeProfile(governance.contract.canonicalProfile, adapter.profile), mode: adapter.kind || 'legacy-adapter', governance: adapter };
  if (exception) return { profile: mergeProfile(governance.contract.canonicalProfile, exception.profile), mode: 'governed-exception', governance: exception };
  if (recordNumber(fileId) < recordNumber(governance.contract.effectiveFromRecord)) {
    throw new Error(`${fileId}: records before ${governance.contract.effectiveFromRecord} require a governed legacy adapter`);
  }
  return { profile: governance.contract.canonicalProfile, mode: 'canonical', governance: null };
}


function parseMetadata(markdown) {
  const metadata = {};
  for (const line of markdown.split(/\r?\n/)) {
    const match = line.match(/^\s*\*\*([^*]+?):\*\*\s*(.*?)\s*$/);
    if (match) metadata[keyOf(match[1])] = stripMarkdown(match[2]);
  }
  return metadata;
}

function parseAtAGlance(markdown) {
  const lines = markdown.split(/\r?\n/);
  for (let i = 0; i < lines.length - 2; i += 1) {
    if (!lines[i].trim().startsWith('|')) continue;
    const header = lines[i].split('|').map(cell => keyOf(cell)).filter(Boolean);
    if (!header.includes('attribute')) continue;
    const table = {};
    for (let j = i + 2; j < lines.length && lines[j].trim().startsWith('|'); j += 1) {
      const cells = lines[j].trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());
      if (cells.length >= 2 && !/^[-:\s]+$/.test(cells[0])) table[keyOf(cells[0])] = stripMarkdown(cells.slice(1).join(' | '));
    }
    return table;
  }
  throw new Error('No At-a-glance Attribute table found');
}

function headingLevel(line) {
  const match = line.match(/^(#{1,6})\s+/);
  return match ? match[1].length : 0;
}

function extractSection(markdown, aliases) {
  const lines = markdown.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const level = headingLevel(lines[i]);
    if (!level) continue;
    const title = keyOf(lines[i].replace(/^#{1,6}\s+/, '').replace(/^\d+(?:\.\d+)*\.?\s*/, ''));
    if (!aliases.some(alias => title.includes(keyOf(alias)))) continue;
    const body = [];
    for (let j = i + 1; j < lines.length; j += 1) {
      const nextLevel = headingLevel(lines[j]);
      if (nextLevel && nextLevel <= level) break;
      body.push(lines[j]);
    }
    const paragraphs = body.join('\n').split(/\n\s*\n/).map(stripMarkdown).filter(p => p.length >= 30 && !/^(published|editorial|expert|status|confidence|assertion|evidence type|scope)$/i.test(p));
    if (paragraphs.length) return paragraphs.slice(0, 3).join(' ');
  }
  return '';
}

function hasHeading(markdown, aliases) {
  return markdown.split(/\r?\n/).some(line => {
    if (!headingLevel(line)) return false;
    const title = keyOf(line.replace(/^#{1,6}\s+/, '').replace(/^\d+(?:\.\d+)*\.?\s*/, ''));
    return aliases.some(alias => title.includes(keyOf(alias)));
  });
}

function metadataValue(metadata, aliases = []) {
  for (const alias of aliases) {
    const value = metadata[keyOf(alias)];
    if (value) return value;
  }
  return '';
}

function pick(table, aliases, fallback = '') {
  for (const alias of aliases || []) {
    const key = keyOf(alias);
    if (table[key]) return table[key];
  }
  return fallback;
}

function parseScientificName(raw, markdown) {
  let cleaned = stripMarkdown(raw);
  if (!cleaned) {
    const candidate = markdown.match(/Acer\s+[a-z-]+[^\n]{0,40}[‘'][^’'\n]+[’']/i)?.[0];
    cleaned = stripMarkdown(candidate || '');
  }
  const match = cleaned.match(/^(Acer\s+[a-z-]+)(?:\s+[A-Z][a-z]+\.)?\s+[‘']([^’']+)[’']/i);
  if (!match) throw new Error(`Unable to parse accepted cultivar name: ${raw}`);
  return { scientificName: `${match[1]} '${match[2]}'`, species: match[1], cultivar: match[2] };
}

function inferSizeClass(habit, height) {
  const combined = `${habit} ${height}`.toLowerCase();
  if (combined.includes('large shrub') || combined.includes('small tree')) return 'Large shrub / small tree';
  if (combined.includes('medium-sized') || combined.includes('medium sized')) return 'Medium shrub / small tree';
  if (combined.includes('compact')) return 'Compact shrub / small tree';
  return 'Small tree';
}

function buildRecord(inputPath, markdown, sourceIndex, governance, support = {}) {
  const fileId = path.basename(inputPath, '.md');
  const { profile: config, mode: profileMode, governance: profileGovernance } = profileForRecord(fileId, governance);
  const metadata = parseMetadata(markdown);
  const statusPreview = metadataValue(metadata, ['record status', 'status']);
  const approved = statusIsApproved(statusPreview, governance.contract.approvedStatusPatterns);
  if (!approved) throw new Error(`${fileId}: record status must be approved and frozen; found "${statusPreview || 'missing'}"`);

  if (profileMode !== 'legacy-adapter') {
    const missingMetadata = [];
    for (const [label, aliases] of Object.entries(governance.contract.requiredMetadata || {})) {
      if (!metadataValue(metadata, aliases)) missingMetadata.push(label);
    }
    if (missingMetadata.length) throw new Error(`${fileId}: missing canonical metadata: ${missingMetadata.join(', ')}`);
    const compilerProfile = metadataValue(metadata, governance.contract.requiredMetadata['compiler profile']);
    if (compilerProfile !== governance.contract.compilerProfile) throw new Error(`${fileId}: compiler profile must be ${governance.contract.compilerProfile}`);
    const freezeDate = metadataValue(metadata, governance.contract.requiredMetadata['freeze date']);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(freezeDate)) throw new Error(`${fileId}: canonical freeze date must use ${governance.contract.canonicalFreezeDateFormat || 'YYYY-MM-DD'}`);
    const missingSections = Object.entries(governance.contract.requiredSections || {})
      .filter(([, aliases]) => !hasHeading(markdown, aliases))
      .map(([label]) => label);
    if (missingSections.length) throw new Error(`${fileId}: missing canonical sections: ${missingSections.join(', ')}`);
  }

  const table = parseAtAGlance(markdown);
  if (profileMode !== 'legacy-adapter') {
    const missingFields = (config.requiredTableFields || []).filter(field => !pick(table, config.tableAliases[field]));
    if (missingFields.length) throw new Error(`${fileId}: missing required At-a-glance fields: ${missingFields.join(', ')}`);
  }
  const id = metadataValue(metadata, ['reference cultivar id', 'record identifier']) || fileId;
  if (id !== fileId) throw new Error(`${fileId}: embedded identifier ${id} does not match filename`);
  const acceptedRaw = pick(table, config.tableAliases.acceptedName, metadataValue(metadata, ['accepted working name', 'accepted name']));
  const name = parseScientificName(acceptedRaw, markdown);
  const taxon = governance.taxa.find(item => item.scientificName === name.species);
  if (!taxon) throw new Error(`${fileId}: species ${name.species} is not present in the governed taxon registry`);
  const version = metadataValue(metadata, ['version', 'record version']) || 'Reference Standard v1.0';
  const freezeDate = metadataValue(metadata, ['freeze date']) || 'July 24, 2026';
  const status = statusPreview || 'Approved and frozen';
  const defaults = config.defaults || {};
  const entityType = pick(table, config.tableAliases.entityType, metadataValue(metadata, ['entity type', 'plant type']) || 'Named cultivar');
  if (profileMode !== 'legacy-adapter' && !(governance.contract.controlledVocabularies?.entityTypes || []).includes(entityType)) {
    throw new Error(`${fileId}: entity type "${entityType}" is outside the governed vocabulary`);
  }
  const values = {
    acceptedName: acceptedRaw,
    synonyms: splitGovernedList(pick(table, config.tableAliases.synonyms, '')),
    entityType,
    habit: pick(table, config.tableAliases.habit, 'Cultivar architecture described in the frozen Reference Standard'),
    leafForm: pick(table, config.tableAliases.leafForm, 'Leaf morphology described in the frozen Reference Standard'),
    springColor: pick(table, config.tableAliases.springColor, 'Seasonally variable spring foliage'),
    summerColor: pick(table, config.tableAliases.summerColor, 'Seasonally variable summer foliage'),
    autumnColor: pick(table, config.tableAliases.autumnColor, 'Seasonally variable autumn foliage'),
    height: pick(table, config.tableAliases.height, 'Contextual mature dimensions are governed in the Reference Standard'),
    spread: pick(table, config.tableAliases.spread, defaults.spread || 'Contextual spread is governed in the Reference Standard'),
    growthRate: pick(table, config.tableAliases.growthRate, defaults.growthRate || 'No universal annual growth increment is approved'),
    flower: pick(table, config.tableAliases.flower, defaults.flower || 'Small spring flowers'),
    fruit: pick(table, config.tableAliases.fruit, defaults.fruit || 'Winged samaras'),
    exposure: pick(table, config.tableAliases.exposure, 'Exposure is climate- and site-dependent'),
    soil: pick(table, config.tableAliases.soil, defaults.soil || 'Moist but well-drained soil'),
    hardiness: pick(table, config.tableAliases.hardiness, defaults.hardiness || 'Hardiness is source- and region-specific'),
    propagation: pick(table, config.tableAliases.propagation, 'Vegetative propagation is required to preserve cultivar identity'),
    history: pick(table, config.tableAliases.history, 'Detailed provenance remains partly unresolved'),
    diagnostic: pick(table, config.tableAliases.diagnostic, 'Appearance is descriptive but not independently authenticating'),
    confidence: pick(table, config.tableAliases.confidence, 'High descriptive confidence; lower authentication confidence'),
    bark: pick(table, config.tableAliases.bark, defaults.bark || 'Bark is described in the frozen Reference Standard')
  };
  const summary = normalizeSpace(`${name.scientificName} is a frozen Atlas reference cultivar. Habit: ${sentence(values.habit)} Leaf form: ${sentence(values.leafForm)} Spring foliage: ${sentence(values.springColor)} Summer foliage: ${sentence(values.summerColor)} Autumn foliage: ${sentence(values.autumnColor)} ${sentence(values.diagnostic)}`);
  const sections = {
    identity: normalizeSpace(`The accepted Atlas identity is ${name.scientificName}. It is governed as ${values.entityType.toLowerCase()} under ${name.species}. The Reference Standard is ${status.toLowerCase()} and source-hash protected.`),
    morphology: normalizeSpace(`${sentence(values.habit)} ${sentence(values.leafForm)} Bark context: ${sentence(values.bark)}`),
    cultivation: normalizeSpace(`${sentence(values.exposure)} ${sentence(values.soil)} ${sentence(values.hardiness)}`),
    history: normalizeSpace(`${sentence(values.history)} Historical claims retain the qualifications and unresolved propositions recorded in the frozen Reference Standard.`),
    propagation: normalizeSpace(`${sentence(values.propagation)} Seed-derived material must not automatically inherit the named cultivar identity.`),
    diagnosis: normalizeSpace(`${sentence(values.diagnostic)} Appearance or a nursery label alone does not establish authenticated clonal identity.`)
  };
  return {
    id, fileId, sourceId: `SRC-${String(sourceIndex).padStart(6, '0')}`, inputPath,
    inputSha256: sha256(markdown), metadata, table, name, taxonId: taxon.id, version, freezeDate, status, values, summary, sections,
    profileMode, profileGovernance,
    provenance: support.provenance || { sources: [], evidenceMap: {} },
    provenanceInput: support.provenanceInput || null,
    mediaAssets: support.media?.assets || [],
    mediaInput: support.mediaInput || null
  };
}


const assertionDefinitions = [
  ['identity', 'accepted-name', r => `The accepted Atlas name is ${r.name.scientificName}.`],
  ['identity', 'accepted-species', r => `The accepted species placement is ${r.name.species}.`],
  ['identity', 'entity-type', r => `The entity is governed as ${r.values.entityType.toLowerCase()}.`],
  ['identity', 'freeze-status', r => `The source record is ${r.status.toLowerCase()} as ${r.version}.`],
  ['morphology', 'habit', r => `Habit: ${sentence(r.values.habit)}`],
  ['morphology', 'leaf-form', r => `Leaf form: ${sentence(r.values.leafForm)}`],
  ['seasonal-expression', 'spring-foliage', r => `Spring foliage: ${sentence(r.values.springColor)}`],
  ['seasonal-expression', 'summer-foliage', r => `Summer foliage: ${sentence(r.values.summerColor)}`],
  ['seasonal-expression', 'autumn-foliage', r => `Autumn foliage: ${sentence(r.values.autumnColor)}`],
  ['dimensions', 'height', r => `Published height context: ${sentence(r.values.height)}`],
  ['dimensions', 'spread', r => `Published spread context: ${sentence(r.values.spread)}`],
  ['dimensions', 'growth-rate', r => `Growth rate: ${sentence(r.values.growthRate)}`],
  ['reproduction', 'flowers', r => `Flowers: ${sentence(r.values.flower)}`],
  ['reproduction', 'fruit', r => `Fruit: ${sentence(r.values.fruit)}`],
  ['cultivation', 'exposure', r => `Exposure: ${sentence(r.values.exposure)}`],
  ['cultivation', 'soil', r => `Soil: ${sentence(r.values.soil)}`],
  ['cultivation', 'hardiness', r => `Hardiness: ${sentence(r.values.hardiness)}`],
  ['cultivar-continuity', 'propagation', r => `Propagation and continuity: ${sentence(r.values.propagation)}`],
  ['history', 'provenance', r => `Historical provenance: ${sentence(r.values.history)}`],
  ['diagnosis', 'distinguishing-feature', r => `Diagnostic context: ${sentence(r.values.diagnostic)}`],
  ['diagnosis', 'authentication-limit', r => 'Appearance or a nursery label alone does not establish authenticated clonal identity.'],
  ['confidence', 'reference-standard-confidence', r => `Reference-standard confidence: ${sentence(r.values.confidence)}`]
];

const evidenceGroups = [
  { key: 'identity', assertions: [0, 1, 2, 3], scope: 'cultivar identity and freeze metadata', section: 'At-a-glance and identity sections' },
  { key: 'morphology', assertions: [4, 5], scope: 'cultivar morphology and architecture', section: 'Morphology and architecture sections' },
  { key: 'seasonal', assertions: [6, 7, 8], scope: 'cultivar seasonal expression', section: 'Seasonal foliage sections' },
  { key: 'dimensions', assertions: [9, 10, 11], scope: 'published horticultural dimensions', section: 'Size and growth sections' },
  { key: 'cultivation', assertions: [12, 13, 14, 15, 16], scope: 'reproductive and cultivation guidance', section: 'Flowers, fruit, cultivation and hardiness sections' },
  { key: 'history', assertions: [17, 18], scope: 'cultivar continuity and historical provenance', section: 'Propagation and history sections' },
  { key: 'diagnosis', assertions: [19, 20, 21], scope: 'diagnosis, authentication limits and confidence', section: 'Identification and confidence sections' }
];

function buildCompilerOutputs(records, editorialInputs, graphInputs, governance) {
  const outputs = new Map();
  const objects = [];
  let assertionCounter = 1;
  let evidenceCounter = 1;

  const canonicalSources = records.map(record => {
    const source = {
      id: record.sourceId,
      title: `${record.id} — ${record.name.scientificName} Reference Standard v1.0`,
      citation: `Japanese Maple Atlas. ${record.id} — ${record.name.scientificName}. Frozen Reference Standard v1.0, ${record.freezeDate}.`,
      sourceType: 'frozen-reference-standard',
      authority: 'Japanese Maple Atlas',
      version: record.version,
      freezeDate: record.freezeDate,
      path: path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'),
      sha256: record.inputSha256,
      status: 'frozen'
    };
    const underlyingSourceIds = (record.provenance.sources || []).map(item => item.id);
    if (underlyingSourceIds.length) source.underlyingSourceIds = underlyingSourceIds;
    return source;
  });
  const underlyingSources = records.flatMap(record => (record.provenance.sources || []).map(source => ({
    ...source,
    status: source.status || 'approved',
    recordIds: [...new Set([...(source.recordIds || []), record.id])],
    generatedFrom: record.provenanceInput ? {
      path: path.relative(ROOT, record.provenanceInput.inputPath).replaceAll(path.sep, '/'),
      sha256: record.provenanceInput.inputSha256,
      compilerVersion: COMPILER_VERSION
    } : undefined
  })));
  const sources = [...canonicalSources, ...underlyingSources];


  const cultivarObjects = [];
  const assertionObjects = [];
  const evidenceObjects = [];

  for (const record of records) {
    const assertionIds = [];
    const perRecordAssertions = assertionDefinitions.map(([domain, predicate, statementFactory], localIndex) => {
      const id = `AST-${String(assertionCounter++).padStart(6, '0')}`;
      assertionIds.push(id);
      const evidenceGroupIndex = evidenceGroups.findIndex(group => group.assertions.includes(localIndex));
      const evidenceId = `EVD-${String((records.indexOf(record) * evidenceGroups.length) + evidenceGroupIndex + 1).padStart(6, '0')}`;
      const qualified = ['dimensions', 'history', 'diagnosis', 'confidence'].includes(domain);
      return {
        id,
        subjectId: record.id,
        domain,
        predicate,
        statement: normalizeSpace(statementFactory(record)),
        state: qualified ? 'approved-qualified' : 'approved',
        confidence: domain === 'history' ? 'moderate' : domain === 'diagnosis' ? 'moderate' : 'high',
        evidenceIds: [evidenceId],
        sourceScope: domain === 'cultivation' ? 'cultivar-specific or explicitly qualified inherited guidance' : 'cultivar-specific editorial synthesis',
        generatedFrom: {
          sourceId: record.sourceId,
          referenceStandard: record.id,
          compilerVersion: record.profileMode === 'legacy-adapter' ? LEGACY_BOTANICAL_COMPILER_VERSION : COMPILER_VERSION
        }
      };
    });
    assertionObjects.push(...perRecordAssertions);

    for (const group of evidenceGroups) {
      const id = `EVD-${String(evidenceCounter++).padStart(6, '0')}`;
      const evidence = {
        id,
        evidenceType: 'frozen-editorial-reference-standard',
        scope: group.scope,
        sourceId: record.sourceId,
        status: 'approved',
        note: `${record.id} ${group.section}; compiled without converting unresolved or rejected propositions into approved facts.`,
        assertionIds: group.assertions.map(index => perRecordAssertions[index].id),
        sourceLocation: { path: path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'), section: group.section },
        sourceSha256: record.inputSha256
      };
      const supportingSourceIds = (record.provenance.evidenceMap || {})[group.key] || [];
      if (supportingSourceIds.length) {
        evidence.sourceIds = [record.sourceId, ...supportingSourceIds];
        evidence.sourceLocations = [
          { sourceId: record.sourceId, path: path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'), section: group.section },
          ...supportingSourceIds.map(sourceId => ({
            sourceId,
            locators: (record.provenance.sources || []).find(source => source.id === sourceId)?.sourceLocations || []
          }))
        ];
      }
      evidenceObjects.push(evidence);
    }

    const mediaIds = record.mediaAssets.map(asset => asset.id);
    const cultivar = {
      id: record.id,
      slug: stableSlug(record.name.cultivar),
      cultivar: record.name.cultivar,
      scientificName: record.name.scientificName,
      taxonId: record.taxonId,
      status: 'frozen-reference-standard',
      canonicality: 'canonical-compiled',
      summary: record.summary,
      habit: record.values.habit,
      leafForm: record.values.leafForm,
      springColor: record.values.springColor,
      summerColor: record.values.summerColor,
      autumnColor: record.values.autumnColor,
      bark: record.values.bark,
      sizeClass: inferSizeClass(record.values.habit, record.values.height),
      light: record.values.exposure,
      diagnosticTraits: [record.values.habit, record.values.leafForm, record.values.diagnostic].map(stripMarkdown).filter(Boolean),
      assertionIds,
      relationshipIds: [],
      mediaIds,
      sections: record.sections,
      referenceStandard: {
        id: record.id,
        version: record.version,
        freezeDate: record.freezeDate,
        sourceId: record.sourceId,
        path: path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'),
        sha256: record.inputSha256
      },
      compiler: {
        name: 'Atlas Compiler',
        version: record.profileMode === 'legacy-adapter' ? LEGACY_BOTANICAL_COMPILER_VERSION : COMPILER_VERSION,
        generatedAt: record.profileMode === 'legacy-adapter' ? LEGACY_BOTANICAL_RELEASE_DATE : RELEASE_DATE
      }
    };
    if (record.values.synonyms.length) cultivar.synonyms = record.values.synonyms;
    cultivarObjects.push(cultivar);
  }

  const taxa = governance.taxa.map(taxon => ({ ...taxon, relationshipIds: [] }));


  const relationshipTypeInputPath = path.relative(ROOT, graphInputs.typeInput.inputPath).replaceAll(path.sep, '/');
  const relationshipInputPath = path.relative(ROOT, graphInputs.relationshipInput.inputPath).replaceAll(path.sep, '/');
  const relationshipTypes = graphInputs.types.map(type => ({
    ...type,
    generatedFrom: { path: relationshipTypeInputPath, sha256: graphInputs.typeInput.inputSha256, compilerVersion: GRAPH_OUTPUT_VERSION }
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
      generatedFrom: { path: relationshipInputPath, sha256: graphInputs.relationshipInput.inputSha256, compilerVersion: GRAPH_OUTPUT_VERSION }
    };
  });
  for (const relationship of relationships) {
    cultivarObjects.find(item => item.id === relationship.fromId)?.relationshipIds.push(relationship.id);
    cultivarObjects.find(item => item.id === relationship.toId)?.relationshipIds.push(relationship.id);
    taxa.find(item => item.id === relationship.fromId)?.relationshipIds.push(relationship.id);
    taxa.find(item => item.id === relationship.toId)?.relationshipIds.push(relationship.id);
  }
  const media = records.flatMap(record => record.mediaAssets.map(asset => ({ ...asset })));


  const contributorObjects = editorialInputs.contributors.map(({ data, inputPath, inputSha256 }) => ({
    ...data,
    generatedFrom: { path: path.relative(ROOT, inputPath).replaceAll(path.sep, '/'), sha256: inputSha256, compilerVersion: EDITORIAL_OUTPUT_VERSION }
  }));
  const submissionObjects = [];
  const workflowObjects = [];
  const reviewObjects = [];
  for (const { data: submission, inputPath, inputSha256 } of editorialInputs.submissions) {
    const workflowId = `EDW-${submission.targetId}-V${submission.version.replace(/\./g, '-')}`;
    const reviewIds = [];
    for (const pass of submission.workflow.reviewPasses || []) {
      const id = `REV-${submission.targetId}-P${pass.passNumber}-V${submission.version.replace(/\./g, '-')}`;
      reviewIds.push(id);
      reviewObjects.push({
        id, workflowId, submissionId: submission.id, targetId: submission.targetId, passNumber: pass.passNumber,
        code: pass.code, lens: pass.lens, result: pass.result, exitCriterion: pass.exitCriterion, completedAt: pass.completedAt,
        reviewerContributorId: 'CTR-EDITOR-IN-CHIEF', status: pass.result === 'pass' ? 'complete' : 'open',
        generatedFrom: { path: path.relative(ROOT, inputPath).replaceAll(path.sep, '/'), sha256: inputSha256, compilerVersion: EDITORIAL_OUTPUT_VERSION }
      });
    }
    const currentIndex = WORKFLOW_STAGES.indexOf(submission.workflow.currentStage);
    const stages = WORKFLOW_STAGES.map((stage, index) => ({
      stage, order: index + 1, status: submission.workflow.status === 'frozen' || index < currentIndex ? 'complete' : index === currentIndex ? 'active' : 'pending'
    }));
    workflowObjects.push({
      id: workflowId, submissionId: submission.id, targetType: submission.targetType, targetId: submission.targetId,
      status: submission.workflow.status, currentStage: submission.workflow.currentStage, stages, reviewIds,
      editorContributorId: 'CTR-EDITOR-IN-CHIEF', startedAt: submission.workflow.startedAt, completedAt: submission.workflow.completedAt || null,
      version: submission.version, generatedFrom: { path: path.relative(ROOT, inputPath).replaceAll(path.sep, '/'), sha256: inputSha256, compilerVersion: EDITORIAL_OUTPUT_VERSION }
    });
    submissionObjects.push({
      ...submission, workflowId, reviewIds,
      generatedFrom: { path: path.relative(ROOT, inputPath).replaceAll(path.sep, '/'), sha256: inputSha256, compilerVersion: EDITORIAL_OUTPUT_VERSION }
    });
  }

  const categories = [
    ['cultivars', cultivarObjects], ['assertions', assertionObjects], ['evidence', evidenceObjects], ['sources', sources],
    ['taxonomy', taxa], ['relationships', relationships], ['relationship-types', relationshipTypes], ['media', media],
    ['contributors', contributorObjects], ['submissions', submissionObjects], ['editorial-workflows', workflowObjects], ['editorial-reviews', reviewObjects]
  ];
  for (const [folder, items] of categories) {
    for (const item of items) {
      const relative = `${folder}/${item.id}.json`;
      const repositoryRelative = `atlas-repository/${relative}`;
      const content = json(item);
      outputs.set(repositoryRelative, content);
      objects.push({ type: folder, id: item.id, path: repositoryRelative, sha256: sha256(content) });
    }
  }

  const countKey = folder => ({ taxonomy: 'taxa', 'relationship-types': 'relationshipTypes', 'editorial-workflows': 'editorialWorkflows', 'editorial-reviews': 'editorialReviews' }[folder] || folder);
  const objectCounts = Object.fromEntries(categories.map(([folder, items]) => [countKey(folder), items.length]));
  const objectTotal = Object.values(objectCounts).reduce((sum, count) => sum + count, 0);
  if (!objectTotal) throw new Error('Compiler invariant failed: no repository objects were generated');
  const repositoryHash = sha256(objects.slice().sort((a, b) => a.path.localeCompare(b.path)).map(item => `${item.path}:${item.sha256}`).join('\n'));
  const editorialInputHashes = [...editorialInputs.contributors, ...editorialInputs.submissions].map(item => `${path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/')}:${item.inputSha256}`);
  const graphInputHashes = [graphInputs.typeInput, graphInputs.relationshipInput].map(item => `${path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/')}:${item.inputSha256}`);
  const governanceInputHashes = governance.inputs.map(item => `${path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/')}:${item.inputSha256}`);
  const sidecarInputHashes = records.flatMap(record => [record.provenanceInput, record.mediaInput].filter(Boolean).map(item => `${path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/')}:${item.inputSha256}`));
  const inputHash = sha256([...records.map(record => `${record.id}:${record.inputSha256}`), ...editorialInputHashes, ...graphInputHashes, ...governanceInputHashes, ...sidecarInputHashes].sort().join('\n'));

  const objectIndex = { version: '1.0.0', repositoryHash, objectCount: objectTotal, objects: objects.slice().sort((a, b) => a.id.localeCompare(b.id)) };
  outputs.set('atlas-repository/indexes/object-index.json', json(objectIndex));
  const graphIndex = buildKnowledgeGraphIndex({ cultivars: cultivarObjects, taxa, relationships, relationshipTypes, repositoryHash });
  graphIndex.graphHash = sha256(graphIndex.graphHashPayload);
  delete graphIndex.graphHashPayload;
  outputs.set('atlas-repository/indexes/graph-index.json', json(graphIndex));
  const searchIndex = cultivarObjects.map(cultivar => ({
    id: cultivar.id, slug: cultivar.slug, cultivar: cultivar.cultivar, scientificName: cultivar.scientificName,
    text: [cultivar.summary, ...(cultivar.synonyms || []), cultivar.habit, cultivar.leafForm, cultivar.springColor, cultivar.summerColor, cultivar.autumnColor, cultivar.bark, cultivar.light, ...cultivar.diagnosticTraits].map(stripMarkdown).join(' '),
    facets: { taxonId: cultivar.taxonId, habit: cultivar.habit, leafForm: cultivar.leafForm, light: cultivar.light, sizeClass: cultivar.sizeClass, status: cultivar.status }
  }));
  outputs.set('atlas-repository/indexes/search-index.json', json({ version: '1.0.0', repositoryHash, records: searchIndex }));

  const manifest = {
    repositoryVersion: REPOSITORY_VERSION,
    release: RELEASE_NAME,
    generatedAt: RELEASE_DATE,
    compiler: { name: 'Atlas Compiler', version: COMPILER_VERSION, deterministic: true, atomicPublication: true },
    contract: {
      version: governance.contract.version,
      profile: governance.contract.compilerProfile,
      effectiveFromRecord: governance.contract.effectiveFromRecord,
      legacyAdapters: Object.keys(governance.compatibility.records || {}).length,
      governedExceptions: (governance.compatibility.exceptions || []).length
    },
    source: {
      type: 'frozen-reference-standard-cohort',
      records: records.length,
      canonicalSources: canonicalSources.length,
      underlyingSources: underlyingSources.length,
      inputHash
    },
    editorial: { contributors: contributorObjects.length, submissions: submissionObjects.length, workflows: workflowObjects.length, reviews: reviewObjects.length, lifecycleStages: WORKFLOW_STAGES.length, reviewPasses: REVIEW_PASSES.length },
    graph: { nodes: graphIndex.nodeCount, edges: graphIndex.edgeCount, relationshipTypes: relationshipTypes.length, categories: graphIndex.stats.categories, graphHash: graphIndex.graphHash },
    objectCounts, objectTotal, repositoryHash, canonicality: 'canonical-compiled',
    notes: `Sprint 11 removes the five-record compiler boundary. ${records.length} approved Reference Standards compile through the canonical contract, legacy adapters and governed sidecars without cultivar-specific JavaScript branches.`
  };
  outputs.set('atlas-repository/manifest.json', json(manifest));

  const registry = `// GENERATED FILE — DO NOT EDIT. Run \`npm run compile:atlas\`.\n\nimport fs from 'node:fs';\nimport path from 'node:path';\n\nconst repositoryRoot = path.join(process.cwd(), 'atlas-repository');\nconst loadJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));\nconst loadDirectory = directory => {\n  const fullPath = path.join(repositoryRoot, directory);\n  return fs.readdirSync(fullPath)\n    .filter(file => file.endsWith('.json'))\n    .sort()\n    .map(file => loadJson(path.join(fullPath, file)));\n};\n\nexport const manifest = loadJson(path.join(repositoryRoot, 'manifest.json'));\nexport const cultivars = loadDirectory('cultivars');\nexport const assertions = loadDirectory('assertions');\nexport const evidence = loadDirectory('evidence');\nexport const sources = loadDirectory('sources');\nexport const taxa = loadDirectory('taxonomy');\nexport const relationships = loadDirectory('relationships');\nexport const relationshipTypes = loadDirectory('relationship-types');\nexport const media = loadDirectory('media');\nexport const contributors = loadDirectory('contributors');\nexport const submissions = loadDirectory('submissions');\nexport const editorialWorkflows = loadDirectory('editorial-workflows');\nexport const editorialReviews = loadDirectory('editorial-reviews');\nexport const graphIndex = loadJson(path.join(repositoryRoot, 'indexes', 'graph-index.json'));\n`;
  outputs.set('lib/repository-registry.js', registry);

  const generatedHashes = {};
  for (const [relative, content] of [...outputs.entries()].sort(([a], [b]) => a.localeCompare(b))) generatedHashes[relative] = sha256(content);
  const editorialHashInputs = [...editorialInputs.contributors, ...editorialInputs.submissions].map(item => [path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/'), item.inputSha256]);
  const sourceHashInputs = records.map(record => [path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'), record.inputSha256]);
  const sidecarHashInputs = records.flatMap(record => [record.provenanceInput, record.mediaInput].filter(Boolean).map(item => [path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/'), item.inputSha256]));
  const governanceHashInputs = governance.inputs.map(item => [path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/'), item.inputSha256]);
  const graphHashInputs = [graphInputs.typeInput, graphInputs.relationshipInput].map(item => [path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/'), item.inputSha256]);
  outputs.set('atlas-repository/hashes.json', json({ algorithm: 'sha256', compilerVersion: COMPILER_VERSION, inputHash, repositoryHash, inputs: Object.fromEntries([...sourceHashInputs, ...sidecarHashInputs, ...governanceHashInputs, ...editorialHashInputs, ...graphHashInputs]), generated: generatedHashes }));

  return { outputs, manifest, records };
}

function readOptionalSidecar(file) {
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf8');
  return { data: JSON.parse(raw), inputPath: file, inputSha256: sha256(raw) };
}

function validateProvenanceSidecar(fileId, input, governance, required) {
  if (!input) {
    if (required) throw new Error(`${fileId}: missing required source provenance sidecar`);
    return { sources: [], evidenceMap: {} };
  }
  const data = input.data;
  if (data.recordId !== fileId) throw new Error(`${fileId}: provenance sidecar recordId ${data.recordId} does not match`);
  if (!Array.isArray(data.sources) || !data.evidenceMap || typeof data.evidenceMap !== 'object') throw new Error(`${fileId}: malformed provenance sidecar`);
  const ids = new Set();
  for (const source of data.sources) {
    if (!/^SRC-RC-\d{3}-\d{3}$/.test(source.id || '')) throw new Error(`${fileId}: invalid underlying source id ${source.id}`);
    if (!source.id.startsWith(`SRC-${fileId}-`)) throw new Error(`${fileId}: underlying source id ${source.id} must be scoped to the record`);
    if (ids.has(source.id)) throw new Error(`${fileId}: duplicate underlying source id ${source.id}`);
    ids.add(source.id);
    for (const key of ['title', 'citation', 'sourceType', 'authority']) if (!source[key]) throw new Error(`${fileId}: source ${source.id} missing ${key}`);
    if ((source.status || 'approved') !== 'approved') throw new Error(`${fileId}: source ${source.id} must be approved`);
    if (!Array.isArray(source.domainScope) || !source.domainScope.length) throw new Error(`${fileId}: source ${source.id} requires domainScope`);
    if (!Array.isArray(source.sourceLocations) || !source.sourceLocations.length) throw new Error(`${fileId}: source ${source.id} requires at least one source locator`);
    const unknownDomains = source.domainScope.filter(group => !(governance.contract.controlledVocabularies?.evidenceGroups || []).includes(group));
    if (unknownDomains.length) throw new Error(`${fileId}: source ${source.id} has unknown evidence domains: ${unknownDomains.join(', ')}`);
  }
  for (const [group, sourceIds] of Object.entries(data.evidenceMap)) {
    if (!(governance.contract.controlledVocabularies?.evidenceGroups || []).includes(group)) throw new Error(`${fileId}: evidenceMap contains unknown group ${group}`);
    if (!Array.isArray(sourceIds)) throw new Error(`${fileId}: evidenceMap.${group} must be an array`);
    for (const sourceId of sourceIds) {
      if (!ids.has(sourceId)) throw new Error(`${fileId}: evidenceMap.${group} references unknown source ${sourceId}`);
      const source = data.sources.find(item => item.id === sourceId);
      if (!source.domainScope.includes(group)) throw new Error(`${fileId}: source ${sourceId} does not declare evidence domain ${group}`);
    }
  }
  if (required) {
    if (!data.sources.length) throw new Error(`${fileId}: canonical records require at least one underlying source`);
    const missingGroups = governance.contract.provenance.requiredEvidenceGroups.filter(group => !Array.isArray(data.evidenceMap[group]) || !data.evidenceMap[group].length);
    if (missingGroups.length) throw new Error(`${fileId}: provenance sidecar missing evidence groups: ${missingGroups.join(', ')}`);
  }
  return data;
}

function validateMediaSidecar(fileId, input) {
  if (!input) return { recordId: fileId, status: 'not-provided', assets: [] };
  const data = input.data;
  if (data.recordId !== fileId) throw new Error(`${fileId}: media sidecar recordId ${data.recordId} does not match`);
  if (!Array.isArray(data.assets)) throw new Error(`${fileId}: media sidecar assets must be an array`);
  const ids = new Set();
  for (const asset of data.assets) {
    if (asset.cultivarId !== fileId) throw new Error(`${fileId}: media ${asset.id} has cultivarId ${asset.cultivarId}`);
    if (!/^MED-RC-\d{3}-[A-Z]+-\d{3}$/.test(asset.id || '')) throw new Error(`${fileId}: invalid media id ${asset.id}`);
    if (!asset.id.startsWith(`MED-${fileId}-`)) throw new Error(`${fileId}: media id ${asset.id} must be scoped to the record`);
    if (ids.has(asset.id)) throw new Error(`${fileId}: duplicate media id ${asset.id}`);
    ids.add(asset.id);
    for (const key of ['mediaType', 'role', 'status', 'assetPath', 'altText', 'evidentiaryStatus']) if (!asset[key]) throw new Error(`${fileId}: media ${asset.id} missing ${key}`);
  }
  return data;
}

function collectInputs(options = {}) {
  const governance = options.governance || loadCompilerGovernance(options.contractDir || CONTRACT_DIR);
  const inputDir = options.inputDir || INPUT_DIR;
  const mediaDir = options.mediaDir || MEDIA_INPUT_DIR;
  const sourceDir = options.sourceDir || SOURCE_INPUT_DIR;
  const files = fs.readdirSync(inputDir).filter(file => /^RC-\d{3}\.md$/.test(file)).sort();
  const records = [];
  const diagnostics = [];
  const skipped = [];
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const markdown = fs.readFileSync(inputPath, 'utf8');
    const fileId = path.basename(file, '.md');
    const metadata = parseMetadata(markdown);
    const status = metadataValue(metadata, ['record status', 'status']);
    const approved = statusIsApproved(status, governance.contract.approvedStatusPatterns);
    if (!approved) {
      skipped.push({ id: fileId, file, status: status || 'missing', reason: 'not approved and frozen' });
      continue;
    }
    try {
      const provenanceInput = readOptionalSidecar(path.join(sourceDir, `${fileId}.sources.json`));
      const mediaInput = readOptionalSidecar(path.join(mediaDir, `${fileId}.media.json`));
      const provenanceRequired = recordNumber(fileId) >= recordNumber(governance.contract.provenance.requiredFromRecord);
      const provenance = validateProvenanceSidecar(fileId, provenanceInput, governance, provenanceRequired);
      const media = validateMediaSidecar(fileId, mediaInput);
      const record = buildRecord(inputPath, markdown, records.length + 1, governance, { provenance, provenanceInput, media, mediaInput });
      records.push(record);
      diagnostics.push({ id: fileId, status: 'pass', profile: record.profileMode, mediaAssets: record.mediaAssets.length, underlyingSources: record.provenance.sources.length });
    } catch (error) {
      diagnostics.push({ id: fileId, status: 'fail', error: error.message });
    }
  }
  const failures = diagnostics.filter(item => item.status === 'fail');
  if (failures.length) throw new Error(`Reference Standard preflight failed:
${failures.map(item => `- ${item.id}: ${item.error}`).join('\n')}`);
  if (!records.length) throw new Error('No approved frozen Reference Standards were discovered');
  const ids = records.map(record => record.id);
  if (new Set(ids).size !== ids.length) throw new Error('Duplicate Reference Standard identifiers discovered');
  const slugs = records.map(record => stableSlug(record.name.cultivar));
  if (new Set(slugs).size !== slugs.length) throw new Error('Duplicate cultivar slugs discovered');
  const sourceIds = records.flatMap(record => (record.provenance.sources || []).map(source => source.id));
  if (new Set(sourceIds).size !== sourceIds.length) throw new Error('Duplicate underlying source identifiers discovered across records');
  const mediaIds = records.flatMap(record => record.mediaAssets.map(asset => asset.id));
  if (new Set(mediaIds).size !== mediaIds.length) throw new Error('Duplicate media identifiers discovered across records');
  return { records, diagnostics, skipped, governance };
}

const generatedObjectDirs = ['cultivars', 'assertions', 'evidence', 'sources', 'taxonomy', 'relationships', 'relationship-types', 'media', 'contributors', 'submissions', 'editorial-workflows', 'editorial-reviews', 'indexes'];

function writeTree(root, outputs) {
  for (const [relative, content] of outputs) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

function writeOutputsAtomically(outputs, root = ROOT, operations = fs) {
  const token = `${process.pid}-${Date.now()}`;
  const stageRoot = path.join(root, `.atlas-compiler-stage-${token}`);
  const backupRoot = path.join(root, `.atlas-compiler-backup-${token}`);
  const targets = [
    ...generatedObjectDirs.map(dir => `atlas-repository/${dir}`),
    'atlas-repository/manifest.json',
    'atlas-repository/hashes.json',
    'lib/repository-registry.js'
  ];
  fs.mkdirSync(stageRoot, { recursive: true });
  fs.mkdirSync(backupRoot, { recursive: true });
  writeTree(stageRoot, outputs);
  const replaced = [];
  try {
    for (const relative of targets) {
      const current = path.join(root, relative);
      const staged = path.join(stageRoot, relative);
      const backup = path.join(backupRoot, relative);
      if (!fs.existsSync(staged)) continue;
      fs.mkdirSync(path.dirname(current), { recursive: true });
      fs.mkdirSync(path.dirname(backup), { recursive: true });
      const state = { relative, current, backup, hadCurrent: fs.existsSync(current), installed: false };
      if (state.hadCurrent) operations.renameSync(current, backup);
      replaced.push(state);
      operations.renameSync(staged, current);
      state.installed = true;
    }
  } catch (error) {
    for (const state of replaced.reverse()) {
      if (state.installed) fs.rmSync(state.current, { recursive: true, force: true });
      if (state.hadCurrent && fs.existsSync(state.backup)) fs.renameSync(state.backup, state.current);
    }
    throw new Error(`Atomic publication failed and was rolled back: ${error.message}`);
  } finally {
    fs.rmSync(stageRoot, { recursive: true, force: true });
    fs.rmSync(backupRoot, { recursive: true, force: true });
  }
}

function checkOutputs(outputs, root = ROOT) {
  const errors = [];
  for (const [relative, expected] of outputs) {
    const target = path.join(root, relative);
    if (!fs.existsSync(target)) errors.push(`Missing generated file: ${relative}`);
    else if (fs.readFileSync(target, 'utf8') !== expected) errors.push(`Generated drift: ${relative}`);
  }
  for (const dir of generatedObjectDirs) {
    const target = path.join(root, 'atlas-repository', dir);
    if (!fs.existsSync(target)) continue;
    for (const file of fs.readdirSync(target).filter(file => file.endsWith('.json'))) {
      const relative = path.relative(root, path.join(target, file)).replaceAll(path.sep, '/');
      if (!outputs.has(relative)) errors.push(`Unexpected generated file: ${relative}`);
    }
  }
  if (errors.length) throw new Error(errors.join('\n'));
}

function parseCli(args) {
  const option = name => {
    const index = args.indexOf(`--${name}`);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const modes = ['check', 'dry-run', 'preflight'].filter(mode => args.includes(`--${mode}`));
  if (modes.length > 1) throw new Error(`Choose only one compiler mode: ${modes.join(', ')}`);
  return {
    mode: modes[0] || 'compile',
    report: option('report'),
    inputDir: option('input-dir'),
    contractDir: option('contract-dir'),
    mediaDir: option('media-dir'),
    sourceDir: option('source-dir')
  };
}

function compilerReport(mode, inputResult, result) {
  return {
    compiler: { name: 'Atlas Compiler', version: COMPILER_VERSION, mode },
    status: 'pass',
    records: inputResult.records.length,
    diagnostics: inputResult.diagnostics,
    skipped: inputResult.skipped,
    repositoryObjects: result.manifest.objectTotal,
    objectCounts: result.manifest.objectCounts,
    repositoryHash: result.manifest.repositoryHash,
    contract: result.manifest.contract
  };
}

function runCompiler(cli = parseCli(process.argv.slice(2))) {
  const governance = loadCompilerGovernance(cli.contractDir ? path.resolve(cli.contractDir) : CONTRACT_DIR);
  const inputResult = collectInputs({
    governance,
    inputDir: cli.inputDir ? path.resolve(cli.inputDir) : INPUT_DIR,
    mediaDir: cli.mediaDir ? path.resolve(cli.mediaDir) : MEDIA_INPUT_DIR,
    sourceDir: cli.sourceDir ? path.resolve(cli.sourceDir) : SOURCE_INPUT_DIR
  });
  const editorialInputs = collectEditorialInputs();
  const graphInputs = collectGraphInputs();
  const result = buildCompilerOutputs(inputResult.records, editorialInputs, graphInputs, governance);
  if (cli.mode === 'check') checkOutputs(result.outputs);
  else if (cli.mode === 'compile') writeOutputsAtomically(result.outputs);
  const report = compilerReport(cli.mode, inputResult, result);
  if (cli.report) {
    const target = path.resolve(cli.report);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, json(report));
  }
  console.log(`Atlas Compiler ${COMPILER_VERSION}: ${cli.mode.toUpperCase().replace('-', ' ')} PASS`);
  console.log(`Approved Reference Standards: ${result.records.length}`);
  console.log(`Repository objects: ${result.manifest.objectTotal}`);
  console.log(`Repository hash: ${result.manifest.repositoryHash}`);
  for (const diagnostic of inputResult.diagnostics) console.log(`PASS  ${diagnostic.id} — ${diagnostic.profile}; ${diagnostic.underlyingSources} underlying sources; ${diagnostic.mediaAssets} media assets`);
  for (const skipped of inputResult.skipped) console.log(`SKIP  ${skipped.id} — ${skipped.reason}`);
  return { result, report };
}

export {
  ROOT, REPOSITORY, INPUT_DIR, CONTRACT_DIR, MEDIA_INPUT_DIR, SOURCE_INPUT_DIR,
  COMPILER_VERSION, REPOSITORY_VERSION, RELEASE_NAME,
  loadCompilerGovernance, buildRecord, buildCompilerOutputs, collectInputs,
  collectEditorialInputs, collectGraphInputs, checkOutputs, writeOutputsAtomically,
  parseCli, runCompiler
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    runCompiler();
  } catch (error) {
    console.error(`Atlas Compiler: FAIL\n${error.stack || error.message}`);
    process.exit(1);
  }
}
