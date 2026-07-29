import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createContextualFacetCounts,
  createFacets,
  filterCultivars
} from '../../lib/search.js';
import {
  applyExplorerPreset,
  explorerCsv,
  explorerExportPayload,
  explorerFilterState,
  explorerLensFields,
  normaliseExplorerState,
  parseExplorerSearchParams,
  projectCultivarForExplorer,
  serialiseExplorerState
} from '../../lib/catalogue-explorer.mjs';

function cultivar(overrides = {}) {
  return {
    id: 'RC-001',
    cultivarId: 'CUL-000001',
    displayId: 'RC-001',
    slug: 'alpha',
    cultivar: 'Alpha',
    scientificName: "Acer palmatum 'Alpha'",
    species: 'Acer palmatum',
    publicationClass: 'reference-standard',
    publicationClassLabel: 'Reference Standard',
    evidenceDepth: 'full-reference-standard',
    reviewDate: '2026-07-28',
    mediaState: 'approved-primary',
    status: 'frozen-reference-standard',
    summary: 'Upright red Japanese maple fixture.',
    habit: 'upright',
    leafForm: 'palmate',
    light: 'partial shade',
    sizeClass: 'medium',
    springColor: 'red',
    summerColor: 'dark red',
    autumnColor: 'scarlet',
    bark: 'grey',
    diagnosticTraits: ['upright red foliage'],
    assertionIds: [],
    assertions: [],
    graphRelationships: [],
    taxonomicRelationships: [],
    primaryMedia: null,
    ...overrides
  };
}

const reference = cultivar();
const catalogue = cultivar({
  id: 'CUL-000011',
  cultivarId: 'CUL-000011',
  displayId: 'CUL-000011',
  slug: 'beta',
  cultivar: 'Beta',
  scientificName: "Acer palmatum 'Beta'",
  publicationClass: 'catalogue-profile',
  publicationClassLabel: 'Catalogue Profile',
  evidenceDepth: 'lean-catalogue-profile',
  mediaState: 'governed-gap',
  status: 'published-catalogue-profile',
  summary: 'Compact green Japanese maple Catalogue fixture.',
  habit: 'compact',
  springColor: 'green',
  summerColor: 'green',
  autumnColor: 'orange',
  diagnosticTraits: ['compact green foliage'],
  sourceIds: ['SRC-CUL-000011-01']
});
const cultivars = [reference, catalogue];

test('search facets disclose and filter both publication classes', () => {
  const facets = createFacets(cultivars);
  assert.deepEqual(facets.publicationClasses, ['catalogue-profile', 'reference-standard']);
  assert.deepEqual(filterCultivars(cultivars, { publicationClass: 'catalogue-profile' }).map(item => item.id), ['CUL-000011']);
  assert.deepEqual(filterCultivars(cultivars, { publicationClass: 'reference-standard' }).map(item => item.id), ['RC-001']);
  assert.equal(filterCultivars(cultivars, { publicationClass: 'All' }).length, 2);
});

test('contextual class counts respect query and non-class filters', () => {
  const counts = createContextualFacetCounts(cultivars, { query: 'green', publicationClass: 'All', species: 'Acer palmatum' });
  assert.equal(counts.publicationClass['catalogue-profile'], 1);
  assert.equal(counts.publicationClass['reference-standard'], 0);
});

test('Catalogue Explorer state round trips publication class through URLs and presets', () => {
  const slugs = cultivars.map(item => item.slug);
  const state = normaliseExplorerState({ publicationClass: 'catalogue-profile', selected: ['beta'] }, slugs);
  assert.equal(state.publicationClass, 'catalogue-profile');
  assert.equal(explorerFilterState(state).publicationClass, 'catalogue-profile');
  const encoded = serialiseExplorerState(state, slugs);
  assert.match(encoded, /class=catalogue-profile/);
  assert.equal(parseExplorerSearchParams(encoded, slugs).publicationClass, 'catalogue-profile');
  assert.equal(applyExplorerPreset(state, 'upright-structure', slugs).publicationClass, 'catalogue-profile');
  assert.equal(normaliseExplorerState({ publicationClass: 'invalid' }, slugs).publicationClass, 'All');
});

test('Explorer projection and identity lens expose stable identity and assurance class', () => {
  const projected = projectCultivarForExplorer(catalogue);
  assert.equal(projected.cultivarId, 'CUL-000011');
  assert.equal(projected.publicationClassLabel, 'Catalogue Profile');
  assert.equal(projected.evidenceDepth, 'lean-catalogue-profile');
  assert.equal(projected.sourceCount, 1);
  assert.deepEqual(explorerLensFields('identity').slice(0, 2), ['publicationClassLabel', 'cultivarId']);
});

test('Explorer JSON and CSV exports retain publication class and media state', () => {
  const projected = cultivars.map(projectCultivarForExplorer);
  const state = normaliseExplorerState({ publicationClass: 'catalogue-profile', selected: ['beta'] }, cultivars.map(item => item.slug));
  const payload = explorerExportPayload(projected, state, { repositoryVersion: 'test', repositoryHash: 'hash', canonicality: 'mixed' });
  assert.equal(payload.schemaVersion, '1.1.0');
  assert.equal(payload.explorerState.facets.publicationClass, 'catalogue-profile');
  assert.equal(payload.records[0].cultivarId, 'CUL-000011');
  assert.equal(payload.records[0].publicationClass, 'catalogue-profile');
  assert.equal(payload.records[0].mediaState, 'governed-gap');
  const csv = explorerCsv(projected, ['beta']);
  assert.match(csv, /Publication class/);
  assert.match(csv, /Catalogue Profile/);
  assert.match(csv, /governed-gap/);
});
