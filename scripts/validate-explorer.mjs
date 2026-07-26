import fs from 'node:fs';
import path from 'node:path';
import {
  EXPLORER_PRESETS,
  applyExplorerPreset,
  buildExplorerSummary,
  createSavedExplorerView,
  explorerCsv,
  explorerExportPayload,
  explorerLensFields,
  normaliseComparisonPair,
  normaliseExplorerState,
  parseExplorerSearchParams,
  projectCultivarForExplorer,
  serialiseExplorerState,
  toggleExplorerSelection
} from '../lib/atlas-explorer.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const REPOSITORY = path.join(ROOT, 'atlas-repository');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const readDirectory = directory => fs.readdirSync(path.join(REPOSITORY, directory))
  .filter(file => file.endsWith('.json'))
  .sort()
  .map(file => readJson(path.join(REPOSITORY, directory, file)));
const failures = [];
const checks = [];
const check = (condition, label, detail = '') => {
  if (condition) checks.push(`PASS  ${label}`);
  else failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
};

const manifest = readJson(path.join(REPOSITORY, 'manifest.json'));
const cultivars = readDirectory('cultivars');
const assertions = readDirectory('assertions');
const relationships = readDirectory('relationships');
const taxa = readDirectory('taxonomy');
const media = readDirectory('media');
const assertionById = new Map(assertions.map(item => [item.id, item]));
const relationshipById = new Map(relationships.map(item => [item.id, item]));
const taxonById = new Map(taxa.map(item => [item.id, item]));
const mediaByCultivar = new Map(media.map(item => [item.cultivarId, item]));
const cultivarById = new Map(cultivars.map(item => [item.id, item]));

const hydrated = cultivars.map(cultivar => ({
  ...cultivar,
  species: taxonById.get(cultivar.taxonId)?.scientificName,
  assertions: cultivar.assertionIds.map(id => assertionById.get(id)).filter(Boolean),
  graphRelationships: cultivar.relationshipIds
    .map(id => relationshipById.get(id))
    .filter(item => item && (cultivarById.has(item.fromId) && cultivarById.has(item.toId)))
    .map(item => {
      const relatedId = item.fromId === cultivar.id ? item.toId : item.fromId;
      return {
        ...item,
        relativeLabel: item.fromId === cultivar.id ? item.label : item.inverseLabel,
        relatedCultivar: cultivarById.get(relatedId)
      };
    }),
  taxonomicRelationships: cultivar.relationshipIds
    .map(id => relationshipById.get(id))
    .filter(item => item && (taxonById.has(item.fromId) || taxonById.has(item.toId))),
  primaryMedia: mediaByCultivar.get(cultivar.id)
}));
const slugs = hydrated.map(item => item.slug);
const projected = hydrated.map(projectCultivarForExplorer);

check(projected.length === 5, 'all frozen cultivar records project into the explorer');
check(projected.every(item => item.assertionCount === 22), 'explorer projections retain governed assertion counts');
check(projected.every(item => item.evidenceCount === 7), 'explorer projections retain governed evidence counts');
check(projected.every(item => item.sourceCount === 1), 'explorer projections retain source provenance');
check(projected.every(item => item.primaryMedia?.assetPath), 'explorer projections retain primary media');
check(projected.reduce((sum, item) => sum + item.relationshipCount, 0) > 0, 'explorer projections retain graph relationships');

const state = normaliseExplorerState({
  query: 'laceleaf upright',
  species: 'Acer palmatum',
  view: 'matrix',
  lens: 'morphology',
  focus: 'seiryu',
  selected: ['seiryu', 'crimson-queen', 'unknown', 'seiryu']
}, slugs);
check(state.selected.join(',') === 'seiryu,crimson-queen', 'selection is unique, valid and ordered');
check(state.compareA === 'seiryu' && state.compareB === 'crimson-queen', 'comparison pair defaults deterministically and remains explicit');
check(state.focus === 'seiryu' && state.view === 'matrix' && state.lens === 'morphology', 'focus and display state are validated');
const encoded = serialiseExplorerState(state, slugs);
const decoded = parseExplorerSearchParams(encoded, slugs);
check(JSON.stringify(decoded) === JSON.stringify(state), 'URL state round trip is deterministic');

let selection = [];
for (const slug of slugs) selection = toggleExplorerSelection(selection, slug);
selection = toggleExplorerSelection(selection, 'bloodgood');
check(selection.length === 4 && !selection.includes('bloodgood'), 'selection toggle removes existing records');
selection = toggleExplorerSelection([...slugs], 'extra', 5);
check(selection.length === 5 && selection.at(-1) === 'extra', 'selection capacity uses deterministic rolling replacement');

check(EXPLORER_PRESETS.length === 5, 'five guided investigations are available');
check(EXPLORER_PRESETS.every(preset => applyExplorerPreset(state, preset.id, slugs).view), 'every guided investigation resolves to valid state');
check(explorerLensFields('evidence').includes('assertionCount'), 'evidence lens exposes repository metrics');
check(explorerLensFields('seasonal').join(',') === 'springColor,summerColor,autumnColor,bark', 'seasonal lens is stable');

const summary = buildExplorerSummary(projected, ['seiryu', 'crimson-queen']);
check(summary.selectedCount === 2 && summary.comparisonReady, 'research set summary supports comparison');
check(summary.assertionCount === 44 && summary.evidenceCount === 14, 'research set summary aggregates governed evidence');
check(summary.relationshipCount > 0, 'research set summary aggregates graph links');

const exportPayload = explorerExportPayload(projected, { ...state, selected: ['seiryu', 'crimson-queen'] }, manifest);
check(exportPayload.exportType === 'japanese-maple-atlas-explorer-set', 'export payload type is governed');
check(exportPayload.schemaVersion === '1.0.0' && exportPayload.records.length === 2, 'export payload schema and record count are stable');
check(exportPayload.repository.version === '0.9.0' && exportPayload.repository.hash === manifest.repositoryHash, 'export payload identifies repository provenance');
check(exportPayload.records.every(item => item.repositoryLinks.profile && item.repositoryLinks.graph), 'export payload retains canonical application links');
check(exportPayload.explorerState.comparisonPair.compareA === 'seiryu', 'export payload identifies the selected comparison pair');
check(normaliseComparisonPair(['seiryu', 'crimson-queen', 'aureum'], 'aureum', 'seiryu').compareA === 'aureum', 'comparison pair is adjustable within a five-record research set');
check(createSavedExplorerView('  Shade study  ', state, 7)?.label === 'Shade study', 'saved views use validated inline names');
const csv = explorerCsv(projected, ['seiryu', 'crimson-queen']);
check(csv.split('\n').length === 3 && csv.includes('Scientific name'), 'human-readable CSV export is stable');

for (const file of [
  'app/explorer/page.js',
  'app/explorer.css',
  'components/AtlasExplorerWorkspace.js',
  'lib/atlas-explorer.mjs',
  'docs/EXPLORER-001_Interactive-Atlas-Explorer_v1.0.md',
  'SPRINT-10.md'
]) check(fs.existsSync(path.join(ROOT, file)), `required explorer file ${file}`);

console.log('Japanese Maple Atlas — Sprint 10 interactive explorer validation');
console.log(`Cultivars projected: ${projected.length}`);
console.log(`Guided investigations: ${EXPLORER_PRESETS.length}`);
console.log(`Repository version: ${manifest.repositoryVersion}`);
for (const line of checks) console.log(line);
if (failures.length) {
  console.error(`\nErrors: ${failures.length}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('\nErrors: 0');
console.log('Interactive explorer validation: PASS');
