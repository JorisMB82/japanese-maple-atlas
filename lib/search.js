const normalize = value => String(value || '').trim().toLowerCase();

const FIELD_ALIASES = {
  species: 'species',
  habit: 'habit',
  leaf: 'leafForm',
  'leaf-form': 'leafForm',
  light: 'light',
  size: 'sizeClass',
  spring: 'springColor',
  summer: 'summerColor',
  autumn: 'autumnColor',
  fall: 'autumnColor',
  bark: 'bark',
  status: 'status'
};

export function tokenizeQuery(query = '') {
  const tokens = [];
  const pattern = /(?:[^\s"]+|"[^"]*")+/g;
  for (const raw of query.match(pattern) || []) {
    const value = raw.replace(/^"|"$/g, '');
    const separator = value.indexOf(':');
    if (separator > 0) {
      const field = normalize(value.slice(0, separator));
      const term = normalize(value.slice(separator + 1));
      if (FIELD_ALIASES[field] && term) {
        tokens.push({ type: 'field', field: FIELD_ALIASES[field], term, raw: value });
        continue;
      }
    }
    tokens.push({ type: 'text', term: normalize(value), raw: value });
  }
  return tokens;
}

export function buildSearchDocument(cultivar) {
  const fields = {
    id: cultivar.id,
    cultivar: cultivar.cultivar,
    scientificName: cultivar.scientificName,
    species: cultivar.species,
    summary: cultivar.summary,
    habit: cultivar.habit,
    leafForm: cultivar.leafForm,
    light: cultivar.light,
    sizeClass: cultivar.sizeClass,
    springColor: cultivar.springColor,
    summerColor: cultivar.summerColor,
    autumnColor: cultivar.autumnColor,
    bark: cultivar.bark,
    status: cultivar.status,
    diagnosticTraits: cultivar.diagnosticTraits || []
  };

  return {
    cultivar,
    fields,
    haystack: normalize(Object.values(fields).flat().join(' '))
  };
}

function fieldMatches(value, term) {
  return normalize(Array.isArray(value) ? value.join(' ') : value).includes(term);
}

function scoreText(document, term) {
  if (!term) return 0;
  const c = document.cultivar;
  const name = normalize(c.cultivar);
  const scientific = normalize(c.scientificName);
  const id = normalize(c.id);
  const diagnostic = normalize((c.diagnosticTraits || []).join(' '));

  if (name === term || id === term) return 120;
  if (name.startsWith(term)) return 80;
  if (name.includes(term)) return 55;
  if (scientific.includes(term)) return 35;
  if (diagnostic.includes(term)) return 25;
  if (document.haystack.includes(term)) return 10;
  return -1000;
}

export function matchCultivar(document, query = '') {
  const tokens = tokenizeQuery(query);
  if (!tokens.length) return { matched: true, score: 0, tokens: [] };

  let score = 0;
  for (const token of tokens) {
    if (token.type === 'field') {
      if (!fieldMatches(document.fields[token.field], token.term)) {
        return { matched: false, score: -1, tokens };
      }
      score += 45;
    } else {
      const tokenScore = scoreText(document, token.term);
      if (tokenScore < 0) return { matched: false, score: -1, tokens };
      score += tokenScore;
    }
  }
  return { matched: true, score, tokens };
}

export function filterCultivars(cultivars, filters = {}) {
  const documents = cultivars.map(buildSearchDocument);
  const activeFilters = Object.entries(filters).filter(([, value]) => value && value !== 'All');

  return documents
    .map(document => {
      const queryResult = matchCultivar(document, filters.query);
      if (!queryResult.matched) return null;

      for (const [field, value] of activeFilters) {
        if (field === 'query' || field === 'sort') continue;
        if (!fieldMatches(document.fields[field], normalize(value))) return null;
      }

      return { ...document.cultivar, _searchScore: queryResult.score };
    })
    .filter(Boolean);
}

export function sortCultivars(cultivars, sort = 'relevance') {
  return [...cultivars].sort((a, b) => {
    if (sort === 'name') return a.cultivar.localeCompare(b.cultivar);
    if (sort === 'species') return a.species.localeCompare(b.species) || a.cultivar.localeCompare(b.cultivar);
    if (sort === 'reference') return a.id.localeCompare(b.id);
    return (b._searchScore || 0) - (a._searchScore || 0) || a.id.localeCompare(b.id);
  });
}

export function createFacets(cultivars) {
  const facet = key => Array.from(new Set(cultivars.map(c => c[key]).filter(Boolean))).sort();
  return {
    species: facet('species'),
    habit: facet('habit'),
    leafForm: facet('leafForm'),
    light: facet('light'),
    sizeClass: facet('sizeClass'),
    springColor: facet('springColor'),
    summerColor: facet('summerColor'),
    autumnColor: facet('autumnColor'),
    bark: facet('bark'),
    status: facet('status')
  };
}

const SIMILARITY_FIELDS = [
  ['species', 4],
  ['habit', 4],
  ['leafForm', 4],
  ['sizeClass', 2],
  ['light', 2],
  ['springColor', 1],
  ['summerColor', 1],
  ['autumnColor', 1],
  ['bark', 1]
];

export function similarityScore(a, b) {
  let score = 0;
  const reasons = [];

  for (const [field, weight] of SIMILARITY_FIELDS) {
    if (a[field] && b[field] && normalize(a[field]) === normalize(b[field])) {
      score += weight;
      reasons.push(field);
    }
  }

  const aTraits = new Set((a.diagnosticTraits || []).map(normalize));
  const sharedTraits = (b.diagnosticTraits || []).map(normalize).filter(trait => aTraits.has(trait));
  if (sharedTraits.length) {
    score += sharedTraits.length * 2;
    reasons.push('diagnosticTraits');
  }

  return { score, reasons };
}

export function findSimilarCultivars(target, cultivars, limit = 3) {
  return cultivars
    .filter(c => c.id !== target.id)
    .map(c => ({ cultivar: c, ...similarityScore(target, c) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.cultivar.cultivar.localeCompare(b.cultivar.cultivar))
    .slice(0, limit);
}

export function queryExamples() {
  return [
    'red upright',
    'species:"Acer palmatum"',
    'habit:weeping',
    'leaf:dissected',
    'light:"partial shade"',
    'autumn:crimson'
  ];
}
