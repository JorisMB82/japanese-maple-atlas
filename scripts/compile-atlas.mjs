import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { buildKnowledgeGraphIndex, nodeTypeForId } from '../lib/knowledge-graph.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const REPOSITORY = path.join(ROOT, 'atlas-repository');
const INPUT_DIR = path.join(REPOSITORY, 'reference-standards');
const EDITORIAL_INPUT_DIR = path.join(ROOT, 'editorial-inbox');
const GRAPH_INPUT_DIR = path.join(REPOSITORY, 'relationship-standards');
const COMPILER_VERSION = '1.2.0';
const RELEASE_DATE = '2026-07-25';
const BOTANICAL_COMPILER_VERSION = '1.0.0';
const BOTANICAL_RELEASE_DATE = '2026-07-24';
const CHECK_MODE = process.argv.includes('--check');

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

const RECORD_CONFIG = {
  'RC-001': {
    summaryHeadings: ['concise cultivar description'],
    identityHeadings: ['cultivar identity'],
    morphologyHeadings: ['growth form and architecture', 'leaf morphology'],
    cultivationHeadings: ['cultivation guidance'],
    historyHeadings: ['historical provenance'],
    propagationHeadings: ['propagation and cultivar continuity'],
    diagnosticHeadings: ['identification and comparison'],
    tableAliases: {
      acceptedName: ['accepted name'], entityType: ['entity type'], habit: ['general form'], leafForm: ['foliage type'],
      springColor: ['spring color'], summerColor: ['summer color'], autumnColor: ['autumn color'],
      height: ['common reported eventual height'], exposure: ['exposure'], hardiness: ['hardiness'], propagation: ['propagation'],
      history: ['historical association'], diagnostic: ['identification confidence from appearance alone'], confidence: ['reference standard confidence']
    },
    spreadFallback: 'Substantial spread is possible over time.',
    growthRateFallback: 'Slow to moderate.',
    flowerFallback: 'Small purple to purplish-red spring flowers.',
    fruitFallback: 'Red samaras.',
    soilFallback: 'Moist but freely draining soil.',
    barkFallback: 'Gray-brown mature bark; bark is not the principal governed ornamental character.'
  },
  'RC-002': {
    summaryHeadings: ['diagnostic summary'], identityHeadings: ['cultivar identity and nomenclature'],
    morphologyHeadings: ['whole-tree architecture', 'leaf morphology'], cultivationHeadings: ['cultivation'],
    historyHeadings: ['historical provenance'], propagationHeadings: ['propagation and identity continuity'], diagnosticHeadings: ['identification framework'],
    tableAliases: {
      acceptedName: ['accepted working name'], entityType: ['entity type'], habit: ['whole-tree architecture'], leafForm: ['foliage classification'],
      springColor: ['spring foliage'], summerColor: ['summer foliage'], autumnColor: ['autumn foliage'], height: ['published north american size estimate'],
      spread: ['published north american size estimate'], flower: ['flowers'], fruit: ['fruit'], exposure: ['exposure'], soil: ['soil'],
      propagation: ['propagation'], history: ['historical provenance'], diagnostic: ['diagnostic strength'], confidence: ['overall descriptive confidence']
    },
    growthRateFallback: 'No fixed annual growth increment is approved.', hardinessFallback: 'USDA zones 5–8, with regional qualification.',
    barkFallback: 'Bark is not the principal governed ornamental character.'
  },
  'RC-003': {
    summaryHeadings: ['executive summary'], identityHeadings: ['cultivar identity and nomenclature'], morphologyHeadings: ['whole-plant architecture', 'leaf morphology', 'bark and stem color'],
    cultivationHeadings: ['cultivation'], historyHeadings: ['historical provenance'], propagationHeadings: ['propagation and cultivar continuity'], diagnosticHeadings: ['identity and authentication framework'],
    tableAliases: {
      acceptedName: ['accepted working name'], entityType: ['entity type'], habit: ['habit'], leafForm: ['leaves'], springColor: ['spring foliage'],
      summerColor: ['summer foliage'], autumnColor: ['autumn foliage'], height: ['published north american size'], spread: ['published north american size'],
      flower: ['flowers'], fruit: ['fruit'], exposure: ['exposure'], soil: ['soil'], hardiness: ['hardiness'], propagation: ['propagation'],
      history: ['historical provenance'], diagnostic: ['principal diagnostic feature'], confidence: ['descriptive confidence'], bark: ['principal diagnostic feature']
    },
    growthRateFallback: 'Slow to moderate.'
  },
  'RC-004': {
    summaryHeadings: ['executive summary'], identityHeadings: ['identity and nomenclature'], morphologyHeadings: ['whole-plant architecture', 'leaf morphology'],
    cultivationHeadings: ['cultivation'], historyHeadings: ['historical provenance'], propagationHeadings: ['propagation and identity continuity'], diagnosticHeadings: ['diagnostic framework'],
    tableAliases: {
      acceptedName: ['accepted working name'], entityType: ['plant type'], habit: ['architecture'], leafForm: ['leaf morphology'], springColor: ['spring foliage'],
      summerColor: ['summer foliage'], autumnColor: ['autumn foliage'], height: ['north american size'], spread: ['north american size'], flower: ['flowers'], fruit: ['fruit'],
      exposure: ['exposure'], soil: ['soil'], hardiness: ['hardiness'], propagation: ['propagation'], history: ['historical provenance'], diagnostic: ['principal risk'], confidence: ['descriptive confidence']
    },
    growthRateFallback: 'Slow.', barkFallback: 'Bark is not the principal governed ornamental character.'
  },
  'RC-005': {
    summaryHeadings: ['executive summary'], identityHeadings: ['taxonomic identity'], morphologyHeadings: ['whole-plant architecture', 'leaf morphology'],
    cultivationHeadings: ['light climate and color interaction', 'soil and moisture'], historyHeadings: ['historical provenance'], propagationHeadings: ['propagation and cultivar continuity'], diagnosticHeadings: ['diagnostic framework'],
    tableAliases: {
      acceptedName: ['accepted working name'], entityType: ['entity type'], habit: ['architecture'], leafForm: ['leaf outline'], springColor: ['spring foliage'],
      summerColor: ['summer foliage'], autumnColor: ['autumn foliage'], height: ['published mature size'], spread: ['published mature size'], flower: ['flowers'], fruit: ['fruit'],
      exposure: ['exposure'], soil: ['soil'], hardiness: ['hardiness'], propagation: ['propagation'], history: ['historical introduction'],
      diagnostic: ['principal identifying feature'], confidence: ['descriptive confidence']
    },
    growthRateFallback: 'Slow.', barkFallback: 'Bark is not the principal governed ornamental character.'
  }
};

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

function buildRecord(inputPath, markdown, sourceIndex) {
  const fileId = path.basename(inputPath, '.md');
  const config = RECORD_CONFIG[fileId];
  if (!config) throw new Error(`Unsupported Reference Standard ${fileId}`);
  const metadata = parseMetadata(markdown);
  const table = parseAtAGlance(markdown);
  const id = metadata['reference cultivar id'] || metadata['record identifier'] || fileId;
  if (id !== fileId) throw new Error(`${fileId}: embedded identifier ${id} does not match filename`);
  const acceptedRaw = pick(table, config.tableAliases.acceptedName, metadata['accepted working name'] || metadata['accepted name']);
  const name = parseScientificName(acceptedRaw, markdown);
  const taxonId = name.species === 'Acer shirasawanum' ? 'TAX-ASHI' : 'TAX-APAL';
  const version = metadata.version || metadata['record version'] || 'Reference Standard v1.0';
  const freezeDate = metadata['freeze date'] || 'July 24, 2026';
  const status = metadata['record status'] || metadata.status || 'Approved and frozen';
  const values = {
    acceptedName: acceptedRaw,
    entityType: pick(table, config.tableAliases.entityType, metadata['entity type'] || 'Named cultivar'),
    habit: pick(table, config.tableAliases.habit, 'Cultivar architecture described in the frozen Reference Standard'),
    leafForm: pick(table, config.tableAliases.leafForm, 'Leaf morphology described in the frozen Reference Standard'),
    springColor: pick(table, config.tableAliases.springColor, 'Seasonally variable spring foliage'),
    summerColor: pick(table, config.tableAliases.summerColor, 'Seasonally variable summer foliage'),
    autumnColor: pick(table, config.tableAliases.autumnColor, 'Seasonally variable autumn foliage'),
    height: pick(table, config.tableAliases.height, 'Contextual mature dimensions are governed in the Reference Standard'),
    spread: pick(table, config.tableAliases.spread, config.spreadFallback || 'Contextual spread is governed in the Reference Standard'),
    growthRate: config.growthRateFallback || 'No universal annual growth increment is approved',
    flower: pick(table, config.tableAliases.flower, config.flowerFallback || 'Small spring flowers'),
    fruit: pick(table, config.tableAliases.fruit, config.fruitFallback || 'Winged samaras'),
    exposure: pick(table, config.tableAliases.exposure, 'Exposure is climate- and site-dependent'),
    soil: pick(table, config.tableAliases.soil, config.soilFallback || 'Moist but well-drained soil'),
    hardiness: pick(table, config.tableAliases.hardiness, config.hardinessFallback || 'Hardiness is source- and region-specific'),
    propagation: pick(table, config.tableAliases.propagation, 'Vegetative propagation is required to preserve cultivar identity'),
    history: pick(table, config.tableAliases.history, 'Detailed provenance remains partly unresolved'),
    diagnostic: pick(table, config.tableAliases.diagnostic, 'Appearance is descriptive but not independently authenticating'),
    confidence: pick(table, config.tableAliases.confidence, 'High descriptive confidence; lower authentication confidence'),
    bark: pick(table, config.tableAliases.bark, config.barkFallback || 'Bark is described in the frozen Reference Standard')
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
    inputSha256: sha256(markdown), metadata, table, name, taxonId, version, freezeDate, status, values, summary, sections
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

function buildCompilerOutputs(records, editorialInputs, graphInputs) {
  const outputs = new Map();
  const objects = [];
  let assertionCounter = 1;
  let evidenceCounter = 1;

  const sources = records.map(record => ({
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
  }));

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
        generatedFrom: { sourceId: record.sourceId, referenceStandard: record.id, compilerVersion: BOTANICAL_COMPILER_VERSION }
      };
    });
    assertionObjects.push(...perRecordAssertions);

    for (const group of evidenceGroups) {
      const id = `EVD-${String(evidenceCounter++).padStart(6, '0')}`;
      evidenceObjects.push({
        id,
        evidenceType: 'frozen-editorial-reference-standard',
        scope: group.scope,
        sourceId: record.sourceId,
        status: 'approved',
        note: `${record.id} ${group.section}; compiled without converting unresolved or rejected propositions into approved facts.`,
        assertionIds: group.assertions.map(index => perRecordAssertions[index].id),
        sourceLocation: { path: path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'), section: group.section },
        sourceSha256: record.inputSha256
      });
    }

    const mediaId = `MED-${record.id}-IDENTITY-001`;
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
      mediaIds: [mediaId],
      sections: record.sections,
      referenceStandard: {
        id: record.id,
        version: record.version,
        freezeDate: record.freezeDate,
        sourceId: record.sourceId,
        path: path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'),
        sha256: record.inputSha256
      },
      compiler: { name: 'Atlas Compiler', version: BOTANICAL_COMPILER_VERSION, generatedAt: BOTANICAL_RELEASE_DATE }
    };
    cultivarObjects.push(cultivar);
  }

  const taxa = [
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
  const plateConfig = {
    'RC-001': ['bloodgood.svg', 'whole-plant-habit'], 'RC-002': ['seiryu.svg', 'whole-plant-habit'],
    'RC-003': ['sango-kaku.svg', 'young-stem-and-habit'], 'RC-004': ['crimson-queen.svg', 'whole-plant-habit'],
    'RC-005': ['aureum.svg', 'whole-plant-habit']
  };
  const media = records.map(record => {
    const [file, subject] = plateConfig[record.id];
    return {
      id: `MED-${record.id}-IDENTITY-001`, cultivarId: record.id, mediaType: 'atlas-illustration', role: 'identity-plate', subject,
      season: 'representative', status: 'pilot-approved', assetPath: `/media/identity-plates/${file}`, thumbnailPath: `/media/identity-plates/${file}`,
      altText: `Standardized Atlas editorial illustration of ${record.name.scientificName}, based on the frozen Reference Standard but not diagnostic evidence.`,
      caption: `${record.name.cultivar} standardized Atlas identity plate.`, credit: 'Japanese Maple Atlas', creatorType: 'procedural-editorial-illustration',
      rights: 'Copyright retained; licensing decision pending', evidentiaryStatus: 'illustrative-not-evidence', styleVersion: 'atlas-identity-plate-v1',
      reviewNotes: `Reviewed for consistency with ${record.id}; remains illustrative and must not be used as cultivar authentication evidence.`
    };
  });

  const contributorObjects = editorialInputs.contributors.map(({ data, inputPath, inputSha256 }) => ({
    ...data,
    generatedFrom: { path: path.relative(ROOT, inputPath).replaceAll(path.sep, '/'), sha256: inputSha256, compilerVersion: COMPILER_VERSION }
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
        generatedFrom: { path: path.relative(ROOT, inputPath).replaceAll(path.sep, '/'), sha256: inputSha256, compilerVersion: COMPILER_VERSION }
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
      version: submission.version, generatedFrom: { path: path.relative(ROOT, inputPath).replaceAll(path.sep, '/'), sha256: inputSha256, compilerVersion: COMPILER_VERSION }
    });
    submissionObjects.push({
      ...submission, workflowId, reviewIds,
      generatedFrom: { path: path.relative(ROOT, inputPath).replaceAll(path.sep, '/'), sha256: inputSha256, compilerVersion: COMPILER_VERSION }
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
  if (objectTotal !== 235) throw new Error(`Compiler invariant failed: expected 235 repository objects, generated ${objectTotal}`);
  const repositoryHash = sha256(objects.slice().sort((a, b) => a.path.localeCompare(b.path)).map(item => `${item.path}:${item.sha256}`).join('\n'));
  const editorialInputHashes = [...editorialInputs.contributors, ...editorialInputs.submissions].map(item => `${path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/')}:${item.inputSha256}`);
  const graphInputHashes = [graphInputs.typeInput, graphInputs.relationshipInput].map(item => `${path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/')}:${item.inputSha256}`);
  const inputHash = sha256([...records.map(record => `${record.id}:${record.inputSha256}`), ...editorialInputHashes, ...graphInputHashes].sort().join('\n'));

  const objectIndex = { version: '1.0.0', repositoryHash, objectCount: objectTotal, objects: objects.slice().sort((a, b) => a.id.localeCompare(b.id)) };
  outputs.set('atlas-repository/indexes/object-index.json', json(objectIndex));
  const graphIndex = buildKnowledgeGraphIndex({ cultivars: cultivarObjects, taxa, relationships, relationshipTypes, repositoryHash });
  graphIndex.graphHash = sha256(graphIndex.graphHashPayload);
  delete graphIndex.graphHashPayload;
  outputs.set('atlas-repository/indexes/graph-index.json', json(graphIndex));
  const searchIndex = cultivarObjects.map(cultivar => ({
    id: cultivar.id, slug: cultivar.slug, cultivar: cultivar.cultivar, scientificName: cultivar.scientificName,
    text: [cultivar.summary, cultivar.habit, cultivar.leafForm, cultivar.springColor, cultivar.summerColor, cultivar.autumnColor, cultivar.bark, cultivar.light, ...cultivar.diagnosticTraits].map(stripMarkdown).join(' '),
    facets: { taxonId: cultivar.taxonId, habit: cultivar.habit, leafForm: cultivar.leafForm, light: cultivar.light, sizeClass: cultivar.sizeClass, status: cultivar.status }
  }));
  outputs.set('atlas-repository/indexes/search-index.json', json({ version: '1.0.0', repositoryHash, records: searchIndex }));

  const manifest = {
    repositoryVersion: '0.9.0', release: 'Sprint 9 — Knowledge graph and cultivar relationships', generatedAt: RELEASE_DATE,
    compiler: { name: 'Atlas Compiler', version: COMPILER_VERSION, deterministic: true },
    source: { type: 'frozen-reference-standard-cohort', records: records.length, inputHash },
    editorial: { contributors: contributorObjects.length, submissions: submissionObjects.length, workflows: workflowObjects.length, reviews: reviewObjects.length, lifecycleStages: WORKFLOW_STAGES.length, reviewPasses: REVIEW_PASSES.length },
    graph: { nodes: graphIndex.nodeCount, edges: graphIndex.edgeCount, relationshipTypes: relationshipTypes.length, categories: graphIndex.stats.categories, graphHash: graphIndex.graphHash },
    objectCounts, objectTotal, repositoryHash, canonicality: 'canonical-compiled',
    notes: 'RC-001 through RC-005 remain canonical compiled records. Sprint 9 adds governed, evidence-linked taxonomic, morphological, architectural, seasonal, cultivation and diagnostic relationships.'
  };
  outputs.set('atlas-repository/manifest.json', json(manifest));

  const registry = `// GENERATED FILE — DO NOT EDIT. Run \`npm run compile:atlas\`.\n\nimport fs from 'node:fs';\nimport path from 'node:path';\n\nconst repositoryRoot = path.join(process.cwd(), 'atlas-repository');\nconst loadJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));\nconst loadDirectory = directory => {\n  const fullPath = path.join(repositoryRoot, directory);\n  return fs.readdirSync(fullPath)\n    .filter(file => file.endsWith('.json'))\n    .sort()\n    .map(file => loadJson(path.join(fullPath, file)));\n};\n\nexport const manifest = loadJson(path.join(repositoryRoot, 'manifest.json'));\nexport const cultivars = loadDirectory('cultivars');\nexport const assertions = loadDirectory('assertions');\nexport const evidence = loadDirectory('evidence');\nexport const sources = loadDirectory('sources');\nexport const taxa = loadDirectory('taxonomy');\nexport const relationships = loadDirectory('relationships');\nexport const relationshipTypes = loadDirectory('relationship-types');\nexport const media = loadDirectory('media');\nexport const contributors = loadDirectory('contributors');\nexport const submissions = loadDirectory('submissions');\nexport const editorialWorkflows = loadDirectory('editorial-workflows');\nexport const editorialReviews = loadDirectory('editorial-reviews');\nexport const graphIndex = loadJson(path.join(repositoryRoot, 'indexes', 'graph-index.json'));\n`;
  outputs.set('lib/repository-registry.js', registry);

  const generatedHashes = {};
  for (const [relative, content] of [...outputs.entries()].sort(([a], [b]) => a.localeCompare(b))) generatedHashes[relative] = sha256(content);
  const editorialHashInputs = [...editorialInputs.contributors, ...editorialInputs.submissions].map(item => [path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/'), item.inputSha256]);
  const sourceHashInputs = records.map(record => [path.relative(ROOT, record.inputPath).replaceAll(path.sep, '/'), record.inputSha256]);
  const graphHashInputs = [graphInputs.typeInput, graphInputs.relationshipInput].map(item => [path.relative(ROOT, item.inputPath).replaceAll(path.sep, '/'), item.inputSha256]);
  outputs.set('atlas-repository/hashes.json', json({ algorithm: 'sha256', compilerVersion: COMPILER_VERSION, inputHash, repositoryHash, inputs: Object.fromEntries([...sourceHashInputs, ...editorialHashInputs, ...graphHashInputs]), generated: generatedHashes }));

  return { outputs, manifest, records };
}

function collectInputs() {
  const files = fs.readdirSync(INPUT_DIR).filter(file => /^RC-\d{3}\.md$/.test(file)).sort();
  if (files.length !== 5) throw new Error(`Expected five frozen Reference Standards, found ${files.length}`);
  return files.map((file, index) => {
    const inputPath = path.join(INPUT_DIR, file);
    return buildRecord(inputPath, fs.readFileSync(inputPath, 'utf8'), index + 1);
  });
}

const generatedObjectDirs = ['cultivars', 'assertions', 'evidence', 'sources', 'taxonomy', 'relationships', 'relationship-types', 'media', 'contributors', 'submissions', 'editorial-workflows', 'editorial-reviews', 'indexes'];
function writeOutputs(outputs) {
  for (const dir of generatedObjectDirs) {
    const target = path.join(REPOSITORY, dir);
    fs.mkdirSync(target, { recursive: true });
    for (const file of fs.readdirSync(target)) if (file.endsWith('.json')) fs.rmSync(path.join(target, file));
  }
  for (const [relative, content] of outputs) {
    const target = path.join(ROOT, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

function checkOutputs(outputs) {
  const errors = [];
  for (const [relative, expected] of outputs) {
    const target = path.join(ROOT, relative);
    if (!fs.existsSync(target)) errors.push(`Missing generated file: ${relative}`);
    else if (fs.readFileSync(target, 'utf8') !== expected) errors.push(`Generated drift: ${relative}`);
  }
  for (const dir of generatedObjectDirs) {
    const target = path.join(REPOSITORY, dir);
    if (!fs.existsSync(target)) continue;
    for (const file of fs.readdirSync(target).filter(file => file.endsWith('.json'))) {
      const relative = path.relative(ROOT, path.join(target, file)).replaceAll(path.sep, '/');
      if (!outputs.has(relative)) errors.push(`Unexpected generated file: ${relative}`);
    }
  }
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
}

try {
  const editorialInputs = collectEditorialInputs();
  const graphInputs = collectGraphInputs();
  const result = buildCompilerOutputs(collectInputs(), editorialInputs, graphInputs);
  if (CHECK_MODE) checkOutputs(result.outputs); else writeOutputs(result.outputs);
  console.log(`Atlas Compiler ${COMPILER_VERSION}: ${CHECK_MODE ? 'CHECK PASS' : 'COMPILE PASS'}`);
  console.log(`Frozen Reference Standards: ${result.records.length}`);
  console.log(`Repository objects: ${result.manifest.objectTotal}`);
  console.log(`Repository hash: ${result.manifest.repositoryHash}`);
} catch (error) {
  console.error(`Atlas Compiler: FAIL\n${error.stack || error.message}`);
  process.exit(1);
}
