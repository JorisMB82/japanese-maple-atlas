import fs from 'node:fs';
import path from 'node:path';
import {
  createContextualFacetCounts,
  createFacets,
  describeSearchQuery,
  filterCultivars,
  parseSearchQuery,
  sortCultivars,
  suggestSearchTerms
} from '../lib/search-engine.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const REPOSITORY = path.join(ROOT, 'atlas-repository');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const readDirectory = directory => fs.readdirSync(path.join(REPOSITORY, directory))
  .filter(file => file.endsWith('.json'))
  .sort()
  .map(file => readJson(path.join(REPOSITORY, directory, file)));

const taxa = new Map(readDirectory('taxonomy').map(taxon => [taxon.id, taxon]));
const cultivars = readDirectory('cultivars').map(cultivar => ({
  ...cultivar,
  species: taxa.get(cultivar.taxonId)?.scientificName || cultivar.scientificName.split(" '")[0]
}));

const failures = [];
const checks = [];
const check = (condition, label, detail = '') => {
  if (condition) checks.push(`PASS  ${label}`);
  else failures.push(`${label}${detail ? ` — ${detail}` : ''}`);
};
const resultIds = (query, filters = {}) => sortCultivars(filterCultivars(cultivars, { query, ...filters }), 'relevance').map(item => item.id);

check(cultivars.length === 5, 'loads the five frozen cultivar records', `found ${cultivars.length}`);
check(JSON.stringify(resultIds('weeping')) === JSON.stringify(['RC-004']), 'semantic alias “weeping” resolves to the cascading cultivar', resultIds('weeping').join(', '));
check(JSON.stringify(resultIds('laceleaf upright')) === JSON.stringify(['RC-002']), 'combined semantic concepts use AND logic', resultIds('laceleaf upright').join(', '));
check(JSON.stringify(resultIds('leaf:laceleaf -habit:cascading')) === JSON.stringify(['RC-002']), 'field filters and exclusions work together', resultIds('leaf:laceleaf -habit:cascading').join(', '));
check(JSON.stringify(resultIds('bark:"coral bark"')) === JSON.stringify(['RC-003']), 'quoted semantic field query finds coral bark', resultIds('bark:"coral bark"').join(', '));
check(JSON.stringify(resultIds('species:"Acer shirasawanum"')) === JSON.stringify(['RC-005']), 'quoted scientific-name field query is exact enough', resultIds('species:"Acer shirasawanum"').join(', '));
check(resultIds('red OR yellow').length === 5, 'OR groups return any matching governed colour concept', resultIds('red OR yellow').join(', '));
check(resultIds('risk:scorch').includes('RC-004') && resultIds('risk:scorch').includes('RC-005'), 'cultivation-risk concept finds documented scorch sensitivity', resultIds('risk:scorch').join(', '));

const parsed = parseSearchQuery('leaf:laceleaf -habit:cascading');
check(parsed.positiveGroups.length === 1 && parsed.negativeTokens.length === 1, 'query parser separates positive and excluded clauses');
const description = describeSearchQuery('weeping red');
check(description.labels.includes('Cascading or weeping') && description.labels.includes('Red or purple foliage'), 'query interpretation exposes governed semantic labels', description.labels.join(', '));

const facets = createFacets(cultivars);
check(facets.semantic.habit.some(option => option.id === 'habit-upright' && option.count >= 1), 'semantic facet catalogue includes upright habit');
check(facets.semantic.leaf.some(option => option.id === 'leaf-dissected' && option.count === 2), 'semantic facet counts identify both dissected cultivars');
const contextual = createContextualFacetCounts(cultivars, { query: 'laceleaf', species: 'All', habit: 'All', leaf: 'All', colour: 'All', exposure: 'All', size: 'All', risk: 'All' });
check(contextual.habit['habit-upright'] === 1 && contextual.habit['habit-cascading'] === 1, 'contextual counts respond to the active query');

const suggestions = suggestSearchTerms('weping');
check(suggestions.some(item => item.query === 'weeping'), 'misspelling suggestions use the governed vocabulary', suggestions.map(item => item.query).join(', '));

console.log('Japanese Maple Atlas — Sprint 8 semantic search validation');
console.log(`Cultivars: ${cultivars.length}`);
for (const line of checks) console.log(line);
if (failures.length) {
  console.error(`\nErrors: ${failures.length}`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('\nErrors: 0');
console.log('Semantic search validation: PASS');
