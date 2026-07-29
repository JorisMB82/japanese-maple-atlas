export * from './search-engine.mjs';

import {
  createContextualFacetCounts as createBaseContextualFacetCounts,
  createFacets as createBaseFacets,
  filterCultivars as filterBaseCultivars
} from './search-engine.mjs';

const normaliseClass = value => {
  if (!value || value === 'All') return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
};

const classMatches = (cultivar, requested) => !requested.length || requested.includes(cultivar.publicationClass);

export function filterCultivars(cultivars, filters = {}) {
  const requested = normaliseClass(filters.publicationClass);
  return filterBaseCultivars(cultivars, filters).filter(cultivar => classMatches(cultivar, requested));
}

export function createFacets(cultivars) {
  const base = createBaseFacets(cultivars);
  return {
    ...base,
    publicationClasses: Array.from(new Set(cultivars.map(cultivar => cultivar.publicationClass).filter(Boolean))).sort()
  };
}

export function createContextualFacetCounts(cultivars, filters = {}) {
  const base = createBaseContextualFacetCounts(cultivars, filters);
  const withoutClass = { ...filters, publicationClass: 'All' };
  const queryAndOtherFilters = filterBaseCultivars(cultivars, withoutClass);
  return {
    ...base,
    publicationClass: Object.fromEntries(
      Array.from(new Set(cultivars.map(cultivar => cultivar.publicationClass).filter(Boolean))).sort()
        .map(publicationClass => [publicationClass, queryAndOtherFilters.filter(cultivar => cultivar.publicationClass === publicationClass).length])
    )
  };
}
