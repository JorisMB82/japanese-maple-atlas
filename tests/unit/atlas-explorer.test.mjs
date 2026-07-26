import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPLORER_DEFAULT_STATE,
  EXPLORER_PRESETS,
  applyExplorerPreset,
  buildExplorerSummary,
  createSavedExplorerView,
  explorerCsv,
  explorerExportPayload,
  explorerLensFields,
  normaliseComparisonPair,
  normaliseExplorerState,
  normaliseSavedViewName,
  parseExplorerSearchParams,
  projectCultivarForExplorer,
  serialiseExplorerState,
  toggleExplorerSelection
} from '../../lib/atlas-explorer.mjs';

const slugs = ['bloodgood', 'seiryu', 'sango-kaku', 'crimson-queen', 'aureum'];
const cultivar = {
  id: 'RC-002',
  slug: 'seiryu',
  cultivar: 'Seiryu',
  scientificName: "Acer palmatum 'Seiryu'",
  species: 'Acer palmatum',
  summary: 'Upright dissected cultivar.',
  status: 'frozen-reference-standard',
  habit: 'Upright',
  leafForm: 'Deeply dissected',
  sizeClass: 'Small tree',
  light: 'Full sun to partial shade',
  bark: 'Gray-brown',
  springColor: 'Light green',
  summerColor: 'Green',
  autumnColor: 'Gold, orange and red',
  diagnosticTraits: ['Upright', 'Dissected foliage'],
  assertions: [
    { id: 'AST-1', confidence: 'high', evidenceIds: ['EVD-1'], generatedFrom: { sourceId: 'SRC-1' } },
    { id: 'AST-2', confidence: 'moderate', evidenceIds: ['EVD-2'], generatedFrom: { sourceId: 'SRC-1' } }
  ],
  graphRelationships: [{
    id: 'REL-1', relativeLabel: 'Shared leaf morphology', category: 'morphology', strength: 5,
    confidence: 'high', rationale: 'Shared deeply dissected foliage.', evidenceAssertionIds: ['AST-1'],
    relatedCultivar: { id: 'RC-004', slug: 'crimson-queen', cultivar: 'Crimson Queen' }
  }],
  taxonomicRelationships: [{ id: 'REL-TAX' }],
  primaryMedia: { assetPath: '/media/seiryu.svg' }
};

test('normaliseExplorerState rejects invalid controls and selection entries', () => {
  const state = normaliseExplorerState({
    query: '  laceleaf  ', view: 'invalid', lens: 'invalid', sort: 'invalid', focus: 'unknown',
    selected: ['seiryu', 'unknown', 'seiryu', 'aureum']
  }, slugs);
  assert.equal(state.query, 'laceleaf');
  assert.equal(state.view, EXPLORER_DEFAULT_STATE.view);
  assert.equal(state.lens, EXPLORER_DEFAULT_STATE.lens);
  assert.equal(state.sort, EXPLORER_DEFAULT_STATE.sort);
  assert.equal(state.focus, '');
  assert.deepEqual(state.selected, ['seiryu', 'aureum']);
  assert.deepEqual([state.compareA, state.compareB], ['seiryu', 'aureum']);
});

test('explorer URL state serialises and parses deterministically', () => {
  const state = normaliseExplorerState({
    query: 'yellow "partial shade"', species: 'Acer shirasawanum', view: 'seasonal', lens: 'seasonal',
    focus: 'aureum', selected: ['aureum', 'seiryu'], compareA: 'seiryu', compareB: 'aureum', sort: 'name'
  }, slugs);
  const encoded = serialiseExplorerState(state, slugs);
  assert.match(encoded, /q=yellow/);
  assert.match(encoded, /set=aureum%2Cseiryu/);
  assert.match(encoded, /ca=seiryu/);
  assert.match(encoded, /cb=aureum/);
  assert.deepEqual(parseExplorerSearchParams(encoded, slugs), state);
});

test('selection is bounded and uses deterministic rolling replacement', () => {
  let selected = [];
  for (const slug of slugs) selected = toggleExplorerSelection(selected, slug);
  assert.deepEqual(selected, slugs);
  selected = toggleExplorerSelection(selected, 'new-record');
  assert.deepEqual(selected, ['seiryu', 'sango-kaku', 'crimson-queen', 'aureum', 'new-record']);
  selected = toggleExplorerSelection(selected, 'aureum');
  assert.equal(selected.includes('aureum'), false);
});

test('guided investigations preserve the research set while changing the workspace', () => {
  const current = normaliseExplorerState({ selected: ['seiryu', 'aureum'], focus: 'seiryu' }, slugs);
  for (const preset of EXPLORER_PRESETS) {
    const next = applyExplorerPreset(current, preset.id, slugs);
    assert.deepEqual(next.selected, current.selected);
    assert.equal(next.focus, current.focus);
    assert.ok(['gallery', 'matrix', 'seasonal', 'relationships'].includes(next.view));
  }
});

test('cultivar projection retains governed evidence and relationship context', () => {
  const projected = projectCultivarForExplorer(cultivar);
  assert.equal(projected.assertionCount, 2);
  assert.equal(projected.evidenceCount, 2);
  assert.equal(projected.sourceCount, 1);
  assert.equal(projected.relationshipCount, 1);
  assert.equal(projected.taxonomicRelationshipCount, 1);
  assert.deepEqual(projected.confidenceCounts, { high: 1, moderate: 1 });
  assert.equal(projected.relationships[0].relatedSlug, 'crimson-queen');
});

test('research set summary and export payload preserve repository provenance', () => {
  const first = projectCultivarForExplorer(cultivar);
  const second = { ...first, id: 'RC-004', slug: 'crimson-queen', cultivar: 'Crimson Queen', species: 'Acer palmatum' };
  const summary = buildExplorerSummary([first, second], ['seiryu', 'crimson-queen']);
  assert.equal(summary.selectedCount, 2);
  assert.equal(summary.comparisonReady, true);
  assert.equal(summary.assertionCount, 4);
  const payload = explorerExportPayload([first, second], {
    ...EXPLORER_DEFAULT_STATE,
    selected: ['seiryu', 'crimson-queen'],
    view: 'matrix',
    lens: 'morphology'
  }, { repositoryVersion: '0.9.0', repositoryHash: 'abc', canonicality: 'canonical-compiled' });
  assert.equal(payload.records.length, 2);
  assert.equal(payload.repository.version, '0.9.0');
  assert.equal(payload.repository.hash, 'abc');
  assert.equal(payload.records[0].repositoryLinks.profile, '/cultivars/seiryu');
  assert.deepEqual(payload.explorerState.comparisonPair, { compareA: 'seiryu', compareB: 'crimson-queen' });
});

test('analysis lenses return stable governed field sets', () => {
  assert.deepEqual(explorerLensFields('seasonal'), ['springColor', 'summerColor', 'autumnColor', 'bark']);
  assert.deepEqual(explorerLensFields('evidence'), ['assertionCount', 'evidenceCount', 'sourceCount', 'relationshipCount']);
  assert.deepEqual(explorerLensFields('unknown'), explorerLensFields('overview'));
});


test('comparison pair stays explicit, valid and independent of selection order', () => {
  assert.deepEqual(normaliseComparisonPair(['seiryu', 'crimson-queen', 'aureum'], 'aureum', 'seiryu'), { compareA: 'aureum', compareB: 'seiryu' });
  assert.deepEqual(normaliseComparisonPair(['seiryu', 'crimson-queen'], 'unknown', 'unknown'), { compareA: 'seiryu', compareB: 'crimson-queen' });
  assert.deepEqual(normaliseComparisonPair(['seiryu'], 'seiryu', ''), { compareA: '', compareB: '' });
});

test('saved view naming is inline-dialog safe and bounded', () => {
  assert.equal(normaliseSavedViewName('  Shade   study  '), 'Shade study');
  assert.equal(normaliseSavedViewName('x'.repeat(80)).length, 60);
  assert.equal(createSavedExplorerView('   ', EXPLORER_DEFAULT_STATE, 1), null);
  assert.deepEqual(createSavedExplorerView('Winter interest', EXPLORER_DEFAULT_STATE, 42), { id: '42', label: 'Winter interest', state: EXPLORER_DEFAULT_STATE });
});

test('human-readable CSV export preserves selected order and escapes values', () => {
  const projected = projectCultivarForExplorer({ ...cultivar, cultivar: 'Seiryu, selected' });
  const second = { ...projected, id: 'RC-004', slug: 'crimson-queen', cultivar: 'Crimson "Queen"' };
  const csv = explorerCsv([projected, second], ['seiryu', 'crimson-queen']);
  assert.match(csv, /"Reference ID","Cultivar","Scientific name"/);
  assert.match(csv, /"Seiryu, selected"/);
  assert.match(csv, /"Crimson ""Queen"""/);
  assert.equal(csv.split('\n').length, 3);
});
