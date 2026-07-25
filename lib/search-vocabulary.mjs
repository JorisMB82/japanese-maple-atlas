export const FIELD_ALIASES = Object.freeze({
  id: 'id',
  name: 'cultivar',
  cultivar: 'cultivar',
  scientific: 'scientificName',
  species: 'species',
  habit: 'habit',
  form: 'habit',
  leaf: 'leafForm',
  foliage: 'leafForm',
  'leaf-form': 'leafForm',
  light: 'light',
  exposure: 'light',
  size: 'sizeClass',
  spring: 'springColor',
  summer: 'summerColor',
  autumn: 'autumnColor',
  fall: 'autumnColor',
  colour: 'seasonalColour',
  color: 'seasonalColour',
  bark: 'bark',
  risk: 'risk',
  trait: 'diagnosticTraits',
  status: 'status'
});

export const SEARCHABLE_FIELDS = Object.freeze([
  'id', 'cultivar', 'scientificName', 'species', 'summary', 'habit', 'leafForm',
  'light', 'sizeClass', 'springColor', 'summerColor', 'autumnColor', 'bark',
  'status', 'diagnosticTraits'
]);

export const SEMANTIC_FACET_CATEGORIES = Object.freeze([
  { id: 'habit', label: 'Growth habit' },
  { id: 'leaf', label: 'Leaf form' },
  { id: 'colour', label: 'Colour character' },
  { id: 'exposure', label: 'Light tolerance' },
  { id: 'size', label: 'Plant scale' },
  { id: 'risk', label: 'Cultivation risk' }
]);

export const SEMANTIC_CONCEPTS = Object.freeze([
  {
    id: 'habit-upright', category: 'habit', label: 'Upright',
    aliases: ['upright', 'erect', 'columnar', 'vase', 'vase shaped', 'vertical'],
    fields: ['habit'], matchTerms: ['upright', 'erect', 'columnar', 'vase-shaped']
  },
  {
    id: 'habit-cascading', category: 'habit', label: 'Cascading or weeping',
    aliases: ['weeping', 'cascading', 'cascade', 'pendulous', 'arching', 'mounding'],
    fields: ['habit'], matchTerms: ['cascading', 'pendulous', 'arching', 'mounding']
  },
  {
    id: 'habit-rounded', category: 'habit', label: 'Rounded or bushy',
    aliases: ['rounded', 'bushy', 'broad', 'broadening', 'multistemmed', 'multi stemmed'],
    fields: ['habit'], matchTerms: ['rounded', 'bushy', 'broadening', 'multistemmed', 'multi-stemmed']
  },
  {
    id: 'leaf-dissected', category: 'leaf', label: 'Dissected or laceleaf',
    aliases: ['dissected', 'laceleaf', 'lace leaf', 'lace-like', 'filigree', 'finely cut'],
    fields: ['leafForm'], matchTerms: ['dissected', 'laceleaf', 'lace-like', 'narrow-lobed']
  },
  {
    id: 'leaf-palmate', category: 'leaf', label: 'Palmate, non-dissected',
    aliases: ['palmate', 'non dissected', 'non-dissected', 'broad lobed', 'broad-lobed'],
    fields: ['leafForm'], matchTerms: ['palmate', 'non-dissected', 'five- to seven-lobed', 'five to seven lobes']
  },
  {
    id: 'leaf-rounded', category: 'leaf', label: 'Rounded or fan-like',
    aliases: ['rounded leaf', 'rounded leaves', 'fan shaped', 'fan-shaped', 'orbicular'],
    fields: ['leafForm'], matchTerms: ['rounded', 'orbicular', 'fan-like', 'suborbicular']
  },
  {
    id: 'colour-red-purple', category: 'colour', label: 'Red or purple foliage',
    aliases: ['red', 'purple', 'burgundy', 'crimson', 'scarlet', 'wine red', 'wine-red'],
    fields: ['springColor', 'summerColor', 'autumnColor'],
    matchTerms: ['red', 'purple', 'crimson', 'scarlet', 'wine-red', 'reddish']
  },
  {
    id: 'colour-yellow-gold', category: 'colour', label: 'Yellow or gold foliage',
    aliases: ['yellow', 'gold', 'golden', 'chartreuse'],
    fields: ['springColor', 'summerColor', 'autumnColor'],
    matchTerms: ['yellow', 'gold', 'golden']
  },
  {
    id: 'colour-green', category: 'colour', label: 'Green foliage',
    aliases: ['green', 'green foliage'],
    fields: ['springColor', 'summerColor'], matchTerms: ['green']
  },
  {
    id: 'colour-coral-bark', category: 'colour', label: 'Coral or red bark',
    aliases: ['coral bark', 'red bark', 'coral stem', 'red stem', 'winter bark'],
    fields: ['bark'], matchTerms: ['coral', 'red young bark', 'coral-red']
  },
  {
    id: 'exposure-sun', category: 'exposure', label: 'Sun tolerant, qualified',
    aliases: ['sun', 'full sun', 'sun tolerant', 'sun-tolerant'],
    fields: ['light'], matchTerms: ['full sun', 'sun to partial shade']
  },
  {
    id: 'exposure-partial-shade', category: 'exposure', label: 'Partial shade',
    aliases: ['shade', 'partial shade', 'part shade', 'afternoon shade'],
    fields: ['light'], matchTerms: ['partial shade', 'shade generally preferred']
  },
  {
    id: 'size-small-tree', category: 'size', label: 'Small tree',
    aliases: ['small tree', 'tree'], fields: ['sizeClass'], matchTerms: ['small tree']
  },
  {
    id: 'size-large-shrub', category: 'size', label: 'Large shrub or small tree',
    aliases: ['large shrub', 'shrub', 'large shrub small tree'],
    fields: ['sizeClass'], matchTerms: ['large shrub']
  },
  {
    id: 'risk-scorch', category: 'risk', label: 'Heat or scorch sensitivity',
    aliases: ['scorch', 'leaf scorch', 'heat sensitive', 'sunburn', 'drying wind'],
    fields: ['summary', 'light', 'autumnColor', 'diagnosticTraits'],
    matchTerms: ['scorch', 'heat qualification', 'hot sun', 'drying winds', 'heat conditions']
  }
]);

const normalise = value => String(value || '')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[’‘]/g, "'")
  .replace(/[^a-z0-9'-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export const conceptById = new Map(SEMANTIC_CONCEPTS.map(concept => [concept.id, concept]));

export function resolveSemanticConcept(term, field) {
  const needle = normalise(term);
  if (!needle) return null;
  return SEMANTIC_CONCEPTS.find(concept => {
    if (field && field !== 'seasonalColour' && field !== 'risk' && !concept.fields.includes(field)) return false;
    if (field === 'seasonalColour' && concept.category !== 'colour') return false;
    if (field === 'risk' && concept.category !== 'risk') return false;
    return concept.aliases.some(alias => normalise(alias) === needle) || normalise(concept.label) === needle;
  }) || null;
}

export function conceptsForDocument(fields) {
  return SEMANTIC_CONCEPTS.filter(concept => concept.fields.some(field => {
    const value = Array.isArray(fields[field]) ? fields[field].join(' ') : fields[field];
    const haystack = normalise(value);
    return concept.matchTerms.some(term => haystack.includes(normalise(term)));
  }));
}

export function conceptsForCategory(category) {
  return SEMANTIC_CONCEPTS.filter(concept => concept.category === category);
}
