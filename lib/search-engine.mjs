import {
  FIELD_ALIASES,
  SEARCHABLE_FIELDS,
  SEMANTIC_CONCEPTS,
  SEMANTIC_FACET_CATEGORIES,
  conceptById,
  conceptsForCategory,
  conceptsForDocument,
  resolveSemanticConcept
} from './search-vocabulary.mjs';

export const normaliseSearchText = value => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[’‘]/g, "'")
  .replace(/[^a-z0-9'-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const FIELD_WEIGHTS = Object.freeze({
  id: 150,
  cultivar: 135,
  scientificName: 90,
  species: 70,
  diagnosticTraits: 60,
  habit: 52,
  leafForm: 52,
  bark: 44,
  springColor: 40,
  summerColor: 40,
  autumnColor: 40,
  light: 34,
  sizeClass: 28,
  summary: 22,
  status: 10
});

const QUERY_PATTERN = /-?(?:(?:[a-zA-Z-]+):)?(?:"[^"]+"|[^\s]+)/g;

function stripQuotes(value) {
  const text = String(value || '').trim();
  return text.startsWith('"') && text.endsWith('"') ? text.slice(1, -1) : text;
}

function parseRawToken(raw) {
  const negated = raw.startsWith('-');
  const body = negated ? raw.slice(1) : raw;
  const separator = body.indexOf(':');
  let field = null;
  let term = body;

  if (separator > 0) {
    const requestedField = normaliseSearchText(body.slice(0, separator));
    if (FIELD_ALIASES[requestedField]) {
      field = FIELD_ALIASES[requestedField];
      term = body.slice(separator + 1);
    }
  }

  term = normaliseSearchText(stripQuotes(term));
  const semantic = resolveSemanticConcept(term, field);
  return {
    type: field ? 'field' : 'text',
    field,
    term,
    raw,
    negated,
    semanticConceptId: semantic?.id || null,
    semanticLabel: semantic?.label || null
  };
}

export function parseSearchQuery(query = '') {
  const rawTokens = String(query).match(QUERY_PATTERN) || [];
  const positiveGroups = [];
  const negativeTokens = [];
  let pendingOr = false;

  for (const raw of rawTokens) {
    if (normaliseSearchText(raw) === 'or') {
      pendingOr = true;
      continue;
    }

    const token = parseRawToken(raw);
    if (!token.term) continue;
    if (token.negated) {
      negativeTokens.push(token);
      pendingOr = false;
      continue;
    }

    if (pendingOr && positiveGroups.length) positiveGroups[positiveGroups.length - 1].push(token);
    else positiveGroups.push([token]);
    pendingOr = false;
  }

  return {
    query: String(query || ''),
    positiveGroups,
    negativeTokens,
    semanticConcepts: Array.from(new Map(
      [...positiveGroups.flat(), ...negativeTokens]
        .filter(token => token.semanticConceptId)
        .map(token => [token.semanticConceptId, {
          id: token.semanticConceptId,
          label: token.semanticLabel,
          negated: token.negated
        }])
    ).values()),
    tokenCount: positiveGroups.flat().length + negativeTokens.length
  };
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
  const normalisedFields = Object.fromEntries(Object.entries(fields).map(([key, value]) => [
    key,
    normaliseSearchText(Array.isArray(value) ? value.join(' ') : value)
  ]));
  const concepts = conceptsForDocument(fields);

  return {
    cultivar,
    fields,
    normalisedFields,
    concepts,
    conceptIds: new Set(concepts.map(concept => concept.id)),
    haystack: SEARCHABLE_FIELDS.map(field => normalisedFields[field]).join(' ')
  };
}

function semanticCandidateTerms(token) {
  if (!token.semanticConceptId) return [];
  const concept = conceptById.get(token.semanticConceptId);
  return concept ? concept.matchTerms.map(normaliseSearchText) : [];
}

function targetFieldsForToken(token) {
  if (!token.field) return SEARCHABLE_FIELDS;
  if (token.field === 'seasonalColour') return ['springColor', 'summerColor', 'autumnColor'];
  if (token.field === 'risk') return ['summary', 'light', 'autumnColor', 'diagnosticTraits'];
  return [token.field];
}

function scoreFieldMatch(field, fieldValue, term, isSemantic = false) {
  if (!fieldValue || !term) return 0;
  const weight = FIELD_WEIGHTS[field] || 20;
  if (fieldValue === term) return weight + (isSemantic ? 8 : 35);
  if (fieldValue.startsWith(term)) return weight + (isSemantic ? 4 : 20);
  if (fieldValue.includes(term)) return weight + (isSemantic ? 0 : 8);
  return 0;
}

function scoreToken(document, token) {
  const fields = targetFieldsForToken(token);
  const literalMatches = [];
  const semanticMatches = [];

  const semanticContextMatches = !token.semanticConceptId || document.conceptIds.has(token.semanticConceptId);
  if (semanticContextMatches) {
    for (const field of fields) {
      const score = scoreFieldMatch(field, document.normalisedFields[field], token.term, false);
      if (score) literalMatches.push({ field, score, term: token.term, semantic: false });
    }
  }

  if (token.semanticConceptId && semanticContextMatches) {
    const semanticTerms = semanticCandidateTerms(token);
    for (const field of fields) {
      const fieldValue = document.normalisedFields[field];
      const bestTerm = semanticTerms
        .map(term => ({ term, score: scoreFieldMatch(field, fieldValue, term, true) }))
        .sort((a, b) => b.score - a.score)[0];
      if (bestTerm?.score) semanticMatches.push({
        field,
        score: bestTerm.score,
        term: bestTerm.term,
        semantic: true,
        conceptId: token.semanticConceptId,
        conceptLabel: token.semanticLabel
      });
    }
  }

  const best = [...literalMatches, ...semanticMatches].sort((a, b) => b.score - a.score)[0];
  return best ? { matched: true, ...best } : { matched: false, score: 0 };
}

export function matchCultivar(document, query = '') {
  const parsed = typeof query === 'string' ? parseSearchQuery(query) : query;
  if (!parsed.tokenCount) return {
    matched: true,
    score: 0,
    parsed,
    matchedTerms: [],
    matchedFields: [],
    semanticConcepts: []
  };

  for (const token of parsed.negativeTokens) {
    if (scoreToken(document, token).matched) return {
      matched: false,
      score: -1,
      parsed,
      excludedBy: token.raw,
      matchedTerms: [],
      matchedFields: [],
      semanticConcepts: []
    };
  }

  let score = 0;
  const matches = [];
  for (const group of parsed.positiveGroups) {
    const alternatives = group
      .map(token => ({ token, result: scoreToken(document, token) }))
      .filter(item => item.result.matched)
      .sort((a, b) => b.result.score - a.result.score);
    if (!alternatives.length) return {
      matched: false,
      score: -1,
      parsed,
      matchedTerms: [],
      matchedFields: [],
      semanticConcepts: []
    };
    const winner = alternatives[0];
    score += winner.result.score;
    matches.push({ ...winner.result, queryTerm: winner.token.term, raw: winner.token.raw });
  }

  return {
    matched: true,
    score,
    parsed,
    matchedTerms: matches.map(match => match.queryTerm),
    matchedFields: Array.from(new Set(matches.map(match => match.field))),
    semanticConcepts: Array.from(new Map(
      matches.filter(match => match.conceptId).map(match => [match.conceptId, {
        id: match.conceptId,
        label: match.conceptLabel
      }])
    ).values()),
    matchReasons: matches.map(match => ({
      field: match.field,
      queryTerm: match.queryTerm,
      matchedTerm: match.term,
      semantic: Boolean(match.semantic),
      conceptLabel: match.conceptLabel || null
    }))
  };
}

function normaliseFilterValue(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value || value === 'All') return [];
  return [value];
}

function matchesExactField(document, field, requestedValues) {
  if (!requestedValues.length) return true;
  const haystack = document.normalisedFields[field] || '';
  return requestedValues.some(value => haystack.includes(normaliseSearchText(value)));
}

function matchesSemanticCategory(document, category, requestedValues) {
  if (!requestedValues.length) return true;
  return requestedValues.some(value => {
    const concept = conceptById.get(value);
    return concept?.category === category && document.conceptIds.has(value);
  });
}

export function documentMatchesFilters(document, filters = {}, ignoredFilter = null) {
  const exactFields = ['species', 'status'];
  for (const field of exactFields) {
    if (field === ignoredFilter) continue;
    if (!matchesExactField(document, field, normaliseFilterValue(filters[field]))) return false;
  }

  for (const category of SEMANTIC_FACET_CATEGORIES.map(item => item.id)) {
    if (category === ignoredFilter) continue;
    if (!matchesSemanticCategory(document, category, normaliseFilterValue(filters[category]))) return false;
  }
  return true;
}

export function filterCultivars(cultivars, filters = {}) {
  const parsed = parseSearchQuery(filters.query || '');
  return cultivars
    .map(buildSearchDocument)
    .map(document => {
      const queryResult = matchCultivar(document, parsed);
      if (!queryResult.matched || !documentMatchesFilters(document, filters)) return null;
      return {
        ...document.cultivar,
        _searchScore: queryResult.score,
        _searchMeta: queryResult,
        _semanticConceptIds: [...document.conceptIds]
      };
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
  const documents = cultivars.map(buildSearchDocument);
  const exactFacet = field => Array.from(new Set(cultivars.map(cultivar => cultivar[field]).filter(Boolean))).sort();
  const semantic = Object.fromEntries(SEMANTIC_FACET_CATEGORIES.map(category => [
    category.id,
    conceptsForCategory(category.id).map(concept => ({
      id: concept.id,
      label: concept.label,
      count: documents.filter(document => document.conceptIds.has(concept.id)).length
    })).filter(option => option.count > 0)
  ]));

  return {
    species: exactFacet('species'),
    status: exactFacet('status'),
    semantic,
    categories: SEMANTIC_FACET_CATEGORIES
  };
}

export function createContextualFacetCounts(cultivars, filters = {}) {
  const documents = cultivars.map(buildSearchDocument);
  const parsed = parseSearchQuery(filters.query || '');
  const queryMatched = documents.filter(document => matchCultivar(document, parsed).matched);
  const result = {};

  for (const category of SEMANTIC_FACET_CATEGORIES) {
    result[category.id] = Object.fromEntries(conceptsForCategory(category.id).map(concept => [
      concept.id,
      queryMatched.filter(document => documentMatchesFilters(document, filters, category.id) && document.conceptIds.has(concept.id)).length
    ]));
  }

  result.species = Object.fromEntries(Array.from(new Set(cultivars.map(cultivar => cultivar.species))).map(species => [
    species,
    queryMatched.filter(document => documentMatchesFilters(document, filters, 'species') && matchesExactField(document, 'species', [species])).length
  ]));
  return result;
}

export function describeSearchQuery(query = '') {
  const parsed = parseSearchQuery(query);
  return {
    ...parsed,
    plainTerms: parsed.positiveGroups.flat().filter(token => !token.semanticConceptId).map(token => token.term),
    fieldFilters: parsed.positiveGroups.flat().filter(token => token.field).map(token => ({ field: token.field, term: token.term })),
    exclusions: parsed.negativeTokens.map(token => token.raw),
    labels: parsed.semanticConcepts.map(concept => `${concept.negated ? 'Not ' : ''}${concept.label}`)
  };
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: b.length + 1 }, (_, row) => [row]);
  for (let column = 0; column <= a.length; column += 1) matrix[0][column] = column;
  for (let row = 1; row <= b.length; row += 1) {
    for (let column = 1; column <= a.length; column += 1) {
      matrix[row][column] = b[row - 1] === a[column - 1]
        ? matrix[row - 1][column - 1]
        : Math.min(matrix[row - 1][column - 1], matrix[row][column - 1], matrix[row - 1][column]) + 1;
    }
  }
  return matrix[b.length][a.length];
}

export function suggestSearchTerms(query = '', limit = 4) {
  const parsed = parseSearchQuery(query);
  const requestedTerms = parsed.positiveGroups.flat().map(token => token.term);
  const aliases = SEMANTIC_CONCEPTS.flatMap(concept => concept.aliases.map(alias => ({ alias, concept })));
  const suggestions = [];

  for (const requested of requestedTerms) {
    if (!requested || resolveSemanticConcept(requested)) continue;
    const nearest = aliases
      .map(item => ({ ...item, distance: levenshtein(requested, normaliseSearchText(item.alias)) }))
      .filter(item => item.distance <= Math.max(2, Math.floor(requested.length / 3)))
      .sort((a, b) => a.distance - b.distance || a.alias.localeCompare(b.alias))[0];
    if (nearest) suggestions.push({ query: nearest.alias, label: nearest.concept.label, reason: `Closest governed term to “${requested}”` });
  }

  for (const concept of SEMANTIC_CONCEPTS) {
    if (suggestions.length >= limit) break;
    if (!suggestions.some(item => item.label === concept.label)) suggestions.push({
      query: concept.aliases[0],
      label: concept.label,
      reason: 'Governed semantic search concept'
    });
  }
  return suggestions.slice(0, limit);
}

export function queryExamples() {
  return [
    'laceleaf upright',
    'weeping red',
    'yellow "partial shade"',
    'leaf:laceleaf -habit:cascading',
    'bark:"coral bark"',
    'species:"Acer shirasawanum"'
  ];
}

const SIMILARITY_FIELDS = [
  ['species', 4], ['habit', 4], ['leafForm', 4], ['sizeClass', 2], ['light', 2],
  ['springColor', 1], ['summerColor', 1], ['autumnColor', 1], ['bark', 1]
];

export function similarityScore(a, b) {
  let score = 0;
  const reasons = [];
  for (const [field, weight] of SIMILARITY_FIELDS) {
    if (a[field] && b[field] && normaliseSearchText(a[field]) === normaliseSearchText(b[field])) {
      score += weight;
      reasons.push(field);
    }
  }
  const aConcepts = new Set(buildSearchDocument(a).concepts.map(concept => concept.id));
  const sharedConcepts = buildSearchDocument(b).concepts.map(concept => concept.id).filter(id => aConcepts.has(id));
  if (sharedConcepts.length) {
    score += sharedConcepts.length;
    reasons.push(...sharedConcepts);
  }
  return { score, reasons: Array.from(new Set(reasons)) };
}

export function findSimilarCultivars(target, cultivars, limit = 3) {
  return cultivars
    .filter(cultivar => cultivar.id !== target.id)
    .map(cultivar => ({ cultivar, ...similarityScore(target, cultivar) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score || a.cultivar.cultivar.localeCompare(b.cultivar.cultivar))
    .slice(0, limit);
}
