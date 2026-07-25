import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildSearchDocument,
  createContextualFacetCounts,
  createFacets,
  describeSearchQuery,
  documentMatchesFilters,
  filterCultivars,
  findSimilarCultivars,
  matchCultivar,
  normaliseSearchText,
  parseSearchQuery,
  queryExamples,
  similarityScore,
  sortCultivars,
  suggestSearchTerms
} from '../../lib/search-engine.mjs';
import { repositoryFixture } from '../helpers/repository-fixture.mjs';

const { cultivars } = repositoryFixture();
const byId = new Map(cultivars.map(cultivar => [cultivar.id, cultivar]));
const resultIds = (query, filters = {}) => sortCultivars(filterCultivars(cultivars, { query, ...filters }), 'relevance').map(item => item.id);

test('normaliseSearchText removes accents, punctuation and excess spaces', () => {
  assert.equal(normaliseSearchText('  Sángo–kaku  '), 'sango kaku');
  assert.equal(normaliseSearchText('Acer shirasawanum “Aureum”'), 'acer shirasawanum aureum');
});

test('parseSearchQuery supports quoted fields, OR and exclusions', () => {
  const parsed = parseSearchQuery('leaf:laceleaf OR bark:"coral bark" -habit:cascading');
  assert.equal(parsed.positiveGroups.length, 1);
  assert.equal(parsed.positiveGroups[0].length, 2);
  assert.equal(parsed.negativeTokens.length, 1);
  assert.equal(parsed.positiveGroups[0][0].field, 'leafForm');
  assert.equal(parsed.positiveGroups[0][1].field, 'bark');
  assert.equal(parsed.negativeTokens[0].semanticConceptId, 'habit-cascading');
});

test('empty query matches every document with zero score', () => {
  const document = buildSearchDocument(byId.get('RC-001'));
  const result = matchCultivar(document, '');
  assert.equal(result.matched, true);
  assert.equal(result.score, 0);
  assert.deepEqual(result.matchedTerms, []);
});

test('semantic aliases resolve to governed concepts', () => {
  assert.deepEqual(resultIds('weeping'), ['RC-004']);
  assert.deepEqual(resultIds('laceleaf upright'), ['RC-002']);
  assert.deepEqual(resultIds('bark:"coral bark"'), ['RC-003']);
  assert.deepEqual(resultIds('species:"Acer shirasawanum"'), ['RC-005']);
});

test('OR groups, field filters and exclusions preserve query logic', () => {
  assert.equal(resultIds('red OR yellow').length, 5);
  assert.deepEqual(resultIds('leaf:laceleaf -habit:cascading'), ['RC-002']);
  assert.deepEqual(resultIds('leaf:laceleaf habit:cascading'), ['RC-004']);
});

test('negative tokens exclude matching cultivars', () => {
  const document = buildSearchDocument(byId.get('RC-004'));
  const result = matchCultivar(document, '-habit:cascading');
  assert.equal(result.matched, false);
  assert.equal(result.excludedBy, '-habit:cascading');
});

test('search metadata explains matched fields and semantic concepts', () => {
  const [result] = filterCultivars(cultivars, { query: 'weeping red' });
  assert.equal(result.id, 'RC-004');
  assert.ok(result._searchScore > 0);
  assert.ok(result._searchMeta.matchedFields.length >= 1);
  assert.ok(result._searchMeta.semanticConcepts.some(concept => concept.id === 'habit-cascading'));
  assert.ok(result._searchMeta.semanticConcepts.some(concept => concept.id === 'colour-red-purple'));
  assert.ok(result._searchMeta.matchReasons.some(reason => reason.conceptLabel === 'Cascading or weeping'));
  assert.ok(result._searchMeta.matchReasons.every(reason => reason.queryTerm));
});

test('documentMatchesFilters handles exact and semantic filters', () => {
  const seiryu = buildSearchDocument(byId.get('RC-002'));
  assert.equal(documentMatchesFilters(seiryu, { species: 'Acer palmatum', habit: 'habit-upright' }), true);
  assert.equal(documentMatchesFilters(seiryu, { species: 'Acer shirasawanum' }), false);
  assert.equal(documentMatchesFilters(seiryu, { habit: 'habit-cascading' }), false);
  assert.equal(documentMatchesFilters(seiryu, { habit: 'habit-cascading' }, 'habit'), true);
});

test('facet catalogues and contextual counts remain stable', () => {
  const facets = createFacets(cultivars);
  assert.deepEqual(facets.species, ['Acer palmatum', 'Acer shirasawanum']);
  assert.equal(facets.semantic.leaf.find(option => option.id === 'leaf-dissected').count, 2);
  const counts = createContextualFacetCounts(cultivars, {
    query: 'laceleaf', species: 'All', status: 'All', habit: 'All', leaf: 'All', colour: 'All', exposure: 'All', size: 'All', risk: 'All'
  });
  assert.equal(counts.habit['habit-upright'], 1);
  assert.equal(counts.habit['habit-cascading'], 1);
});

test('query descriptions and suggestions are governed and deterministic', () => {
  const description = describeSearchQuery('weeping red -leaf:rounded');
  assert.ok(description.labels.includes('Cascading or weeping'));
  assert.ok(description.exclusions.includes('-leaf:rounded'));
  const suggestions = suggestSearchTerms('weping', 3);
  assert.equal(suggestions[0].query, 'weeping');
  assert.equal(suggestions.length, 3);
  assert.equal(queryExamples().length, 6);
});

test('sort modes are deterministic', () => {
  const results = filterCultivars(cultivars, { query: '' });
  assert.equal(sortCultivars(results, 'name')[0].cultivar, 'Aureum');
  assert.equal(sortCultivars(results, 'reference')[0].id, 'RC-001');
  assert.equal(sortCultivars(results, 'species')[0].species, 'Acer palmatum');
});

test('similarity scoring excludes the target and returns explainable reasons', () => {
  const bloodgood = byId.get('RC-001');
  const sangoKaku = byId.get('RC-003');
  const score = similarityScore(bloodgood, sangoKaku);
  assert.ok(score.score > 0);
  assert.ok(score.reasons.length > 0);
  const similar = findSimilarCultivars(bloodgood, cultivars, 3);
  assert.equal(similar.length, 3);
  assert.ok(similar.every(item => item.cultivar.id !== bloodgood.id));
  assert.ok(similar[0].score >= similar[1].score);
});
