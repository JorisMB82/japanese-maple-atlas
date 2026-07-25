const VALID_VIEWS = new Set(['gallery', 'matrix', 'seasonal', 'relationships']);
const VALID_LENSES = new Set(['overview', 'identity', 'morphology', 'seasonal', 'cultivation', 'evidence']);
const VALID_SORTS = new Set(['relevance', 'reference', 'name', 'species']);
const FACET_KEYS = ['species', 'habit', 'leaf', 'colour', 'exposure', 'size', 'risk'];
const MAX_SELECTION = 5;

export const EXPLORER_DEFAULT_STATE = Object.freeze({
  query: '',
  species: 'All',
  habit: 'All',
  leaf: 'All',
  colour: 'All',
  exposure: 'All',
  size: 'All',
  risk: 'All',
  sort: 'relevance',
  view: 'gallery',
  lens: 'overview',
  focus: '',
  selected: []
});

export const EXPLORER_URL_KEYS = Object.freeze({
  query: 'q',
  species: 'species',
  habit: 'habit',
  leaf: 'leaf',
  colour: 'colour',
  exposure: 'exposure',
  size: 'size',
  risk: 'risk',
  sort: 'sort',
  view: 'view',
  lens: 'lens',
  focus: 'focus',
  selected: 'set'
});

export const EXPLORER_PRESETS = Object.freeze([
  {
    id: 'dissected-architecture',
    label: 'Dissected architecture',
    description: 'Compare deeply divided foliage across upright and cascading habits.',
    state: { query: 'laceleaf', view: 'matrix', lens: 'morphology' }
  },
  {
    id: 'upright-structure',
    label: 'Upright structure',
    description: 'Study upright tree forms and their different ornamental signatures.',
    state: { query: 'upright', view: 'gallery', lens: 'overview' }
  },
  {
    id: 'seasonal-red',
    label: 'Red seasonal expression',
    description: 'Inspect spring, summer and autumn red-colour behavior.',
    state: { query: 'red', view: 'seasonal', lens: 'seasonal' }
  },
  {
    id: 'protected-golden',
    label: 'Golden protected sites',
    description: 'Find golden foliage associated with partial shade or protected exposure.',
    state: { query: 'yellow "partial shade"', view: 'gallery', lens: 'cultivation' }
  },
  {
    id: 'relationship-teaching',
    label: 'Relationship teaching set',
    description: 'Review graph-based contrasts and shared traits across all pilot cultivars.',
    state: { query: '', view: 'relationships', lens: 'evidence' }
  }
]);

const cleanText = value => String(value || '').trim();
const unique = values => [...new Set(values.filter(Boolean))];

export function normaliseExplorerState(input = {}, cultivarSlugs = []) {
  const allowedSlugs = new Set(cultivarSlugs);
  const state = { ...EXPLORER_DEFAULT_STATE };
  state.query = cleanText(input.query);
  for (const key of FACET_KEYS) state[key] = cleanText(input[key]) || 'All';
  state.sort = VALID_SORTS.has(input.sort) ? input.sort : EXPLORER_DEFAULT_STATE.sort;
  state.view = VALID_VIEWS.has(input.view) ? input.view : EXPLORER_DEFAULT_STATE.view;
  state.lens = VALID_LENSES.has(input.lens) ? input.lens : EXPLORER_DEFAULT_STATE.lens;
  state.focus = allowedSlugs.has(input.focus) ? input.focus : '';
  const selected = Array.isArray(input.selected)
    ? input.selected
    : cleanText(input.selected).split(',');
  state.selected = unique(selected.map(cleanText))
    .filter(slug => allowedSlugs.has(slug))
    .slice(0, MAX_SELECTION);
  if (state.focus && !state.selected.includes(state.focus) && input.focusSelected) {
    state.selected = [state.focus, ...state.selected].slice(0, MAX_SELECTION);
  }
  return state;
}

export function parseExplorerSearchParams(search = '', cultivarSlugs = []) {
  const params = search instanceof URLSearchParams
    ? search
    : new URLSearchParams(String(search || '').replace(/^\?/, ''));
  const raw = {};
  for (const [key, parameter] of Object.entries(EXPLORER_URL_KEYS)) {
    if (key === 'selected') raw.selected = (params.get(parameter) || '').split(',');
    else raw[key] = params.get(parameter) || undefined;
  }
  return normaliseExplorerState(raw, cultivarSlugs);
}

export function serialiseExplorerState(input = {}, cultivarSlugs = []) {
  const state = normaliseExplorerState(input, cultivarSlugs);
  const params = new URLSearchParams();
  for (const [key, parameter] of Object.entries(EXPLORER_URL_KEYS)) {
    const value = state[key];
    if (key === 'selected') {
      if (value.length) params.set(parameter, value.join(','));
      continue;
    }
    const defaultValue = EXPLORER_DEFAULT_STATE[key];
    if (value && value !== defaultValue && value !== 'All') params.set(parameter, value);
  }
  return params.toString();
}

export function applyExplorerPreset(current, presetId, cultivarSlugs = []) {
  const preset = EXPLORER_PRESETS.find(item => item.id === presetId);
  if (!preset) return normaliseExplorerState(current, cultivarSlugs);
  return normaliseExplorerState({
    ...EXPLORER_DEFAULT_STATE,
    ...preset.state,
    selected: current?.selected || [],
    focus: current?.focus || ''
  }, cultivarSlugs);
}

export function toggleExplorerSelection(selected = [], slug, maximum = MAX_SELECTION) {
  const current = unique(selected.map(cleanText));
  if (current.includes(slug)) return current.filter(item => item !== slug);
  if (current.length >= maximum) return [...current.slice(1), slug];
  return [...current, slug];
}

export function explorerFilterState(state) {
  return Object.fromEntries([
    ['query', state.query],
    ['species', state.species],
    ['habit', state.habit],
    ['leaf', state.leaf],
    ['colour', state.colour],
    ['exposure', state.exposure],
    ['size', state.size],
    ['risk', state.risk],
    ['sort', state.sort]
  ]);
}

export function projectCultivarForExplorer(cultivar) {
  const sourceIds = unique((cultivar.assertions || []).flatMap(assertion =>
    (assertion.evidenceIds || []).map(id => assertion.evidence?.find?.(item => item.id === id)?.sourceId)
  ));
  const confidenceCounts = (cultivar.assertions || []).reduce((counts, assertion) => {
    const confidence = assertion.confidence || 'unspecified';
    counts[confidence] = (counts[confidence] || 0) + 1;
    return counts;
  }, {});
  return {
    id: cultivar.id,
    slug: cultivar.slug,
    cultivar: cultivar.cultivar,
    scientificName: cultivar.scientificName,
    species: cultivar.species,
    summary: cultivar.summary,
    status: cultivar.status,
    habit: cultivar.habit,
    leafForm: cultivar.leafForm,
    sizeClass: cultivar.sizeClass,
    light: cultivar.light,
    bark: cultivar.bark,
    springColor: cultivar.springColor,
    summerColor: cultivar.summerColor,
    autumnColor: cultivar.autumnColor,
    diagnosticTraits: cultivar.diagnosticTraits || [],
    assertionCount: cultivar.assertions?.length || cultivar.assertionIds?.length || 0,
    relationshipCount: cultivar.graphRelationships?.length || 0,
    taxonomicRelationshipCount: cultivar.taxonomicRelationships?.length || 0,
    evidenceCount: unique((cultivar.assertions || []).flatMap(assertion => assertion.evidenceIds || [])).length,
    sourceCount: sourceIds.length,
    confidenceCounts,
    relationships: (cultivar.graphRelationships || []).map(relationship => ({
      id: relationship.id,
      label: relationship.relativeLabel || relationship.label,
      category: relationship.category,
      strength: relationship.strength,
      confidence: relationship.confidence,
      rationale: relationship.rationale,
      relatedId: relationship.relatedCultivar?.id,
      relatedSlug: relationship.relatedCultivar?.slug,
      relatedCultivar: relationship.relatedCultivar?.cultivar,
      evidenceAssertionIds: relationship.evidenceAssertionIds || []
    })),
    primaryMedia: cultivar.primaryMedia || null
  };
}

export function buildExplorerSummary(cultivars = [], selectedSlugs = []) {
  const selected = cultivars.filter(cultivar => selectedSlugs.includes(cultivar.slug));
  const species = unique(selected.map(cultivar => cultivar.species));
  const relationshipIds = unique(selected.flatMap(cultivar => cultivar.relationships?.map(item => item.id) || []));
  return {
    selectedCount: selected.length,
    speciesCount: species.length,
    assertionCount: selected.reduce((sum, cultivar) => sum + (cultivar.assertionCount || 0), 0),
    evidenceCount: selected.reduce((sum, cultivar) => sum + (cultivar.evidenceCount || 0), 0),
    relationshipCount: relationshipIds.length,
    comparisonReady: selected.length >= 2,
    exportReady: selected.length >= 1
  };
}

export function explorerExportPayload(cultivars = [], state = {}, repository = {}) {
  const selected = cultivars.filter(cultivar => state.selected?.includes(cultivar.slug));
  return {
    exportType: 'japanese-maple-atlas-explorer-set',
    schemaVersion: '1.0.0',
    generatedAt: new Date().toISOString(),
    repository: {
      version: repository.repositoryVersion || null,
      hash: repository.repositoryHash || null,
      canonicality: repository.canonicality || null
    },
    explorerState: {
      query: state.query || '',
      facets: Object.fromEntries(FACET_KEYS.map(key => [key, state[key] || 'All'])),
      sort: state.sort || 'relevance',
      view: state.view || 'gallery',
      lens: state.lens || 'overview'
    },
    records: selected.map(cultivar => ({
      id: cultivar.id,
      slug: cultivar.slug,
      cultivar: cultivar.cultivar,
      scientificName: cultivar.scientificName,
      status: cultivar.status,
      habit: cultivar.habit,
      leafForm: cultivar.leafForm,
      seasonalColour: {
        spring: cultivar.springColor,
        summer: cultivar.summerColor,
        autumn: cultivar.autumnColor
      },
      cultivation: { light: cultivar.light, sizeClass: cultivar.sizeClass },
      repositoryLinks: {
        profile: `/cultivars/${cultivar.slug}`,
        graph: `/graph?node=${cultivar.id}`
      }
    }))
  };
}

export function explorerLensFields(lens = 'overview') {
  const fields = {
    overview: ['habit', 'leafForm', 'springColor', 'summerColor', 'autumnColor', 'light'],
    identity: ['scientificName', 'species', 'status', 'diagnosticTraits'],
    morphology: ['habit', 'leafForm', 'bark', 'sizeClass'],
    seasonal: ['springColor', 'summerColor', 'autumnColor', 'bark'],
    cultivation: ['light', 'sizeClass', 'habit'],
    evidence: ['assertionCount', 'evidenceCount', 'sourceCount', 'relationshipCount']
  };
  return fields[VALID_LENSES.has(lens) ? lens : 'overview'];
}

export const EXPLORER_MAX_SELECTION = MAX_SELECTION;
