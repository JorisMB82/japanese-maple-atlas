import * as referenceRepository from './repository';
import { catalogueCultivars } from './catalogue-runtime';
import { createFacets, filterCultivars, findSimilarCultivars, sortCultivars } from './search';

const stableIdForReference = id => `CUL-${String(id || '').replace(/^RC-/, '').padStart(6, '0')}`;

const referenceCultivars = referenceRepository.getCultivars().map(cultivar => ({
  ...cultivar,
  cultivarId: cultivar.cultivarId || stableIdForReference(cultivar.id),
  displayId: cultivar.id,
  referenceStandardId: cultivar.id,
  publicationClass: 'reference-standard',
  publicationClassLabel: 'Reference Standard',
  evidenceDepth: 'full-reference-standard',
  reviewDate: cultivar.referenceStandard?.freezeDate || null,
  mediaState: cultivar.primaryMedia ? 'approved-primary' : 'governed-gap'
}));

function hydrateCatalogueCultivar(cultivar) {
  const taxon = referenceRepository.getTaxon(cultivar.taxonId);
  return {
    ...cultivar,
    displayId: cultivar.cultivarId,
    referenceStandardId: null,
    publicationClassLabel: 'Catalogue Profile',
    evidenceDepth: 'lean-catalogue-profile',
    reviewDate: cultivar.catalogueProfile?.review?.reviewedAt || null,
    species: taxon?.scientificName || cultivar.scientificName.split(" '")[0],
    taxon,
    assertionIds: [],
    assertions: [],
    relationships: [],
    graphRelationships: [],
    taxonomicRelationships: [],
    graphRelatedCultivars: [],
    media: [],
    primaryMedia: undefined,
    editorialWorkflow: undefined,
    bark: cultivar.bark || '',
    light: cultivar.light || cultivar.cultivation || '',
    sizeClass: cultivar.sizeClass || '',
    sections: {
      identity: '',
      morphology: '',
      seasonal: cultivar.sections?.seasonality || {},
      cultivation: cultivar.cultivation || '',
      history: 'A full historical monograph is not part of the lean Catalogue Profile minimum.',
      propagation: 'Propagation detail has not been reviewed for this Catalogue Profile.',
      comparison: '',
      ...(cultivar.sections || {})
    }
  };
}

const runtimeCatalogueCultivars = catalogueCultivars.map(hydrateCatalogueCultivar);
const allCultivars = [...referenceCultivars, ...runtimeCatalogueCultivars];

export function getCultivars() { return allCultivars; }
export function getCultivar(slug) { return allCultivars.find(item => item.slug === slug); }
export function getAllSlugs() { return allCultivars.map(item => ({ slug: item.slug })); }
export function getRepositoryStats() {
  return {
    ...referenceRepository.getRepositoryStats(),
    cultivars: allCultivars.length,
    referenceStandards: referenceCultivars.length,
    catalogueProfiles: runtimeCatalogueCultivars.length
  };
}
export function getSearchFacets() { return createFacets(allCultivars); }
export function searchCultivars(filters = {}) { return sortCultivars(filterCultivars(allCultivars, filters), filters.sort || 'relevance'); }
export function getSimilarCultivars(slug, limit = 3) {
  const target = getCultivar(slug);
  return target ? findSimilarCultivars(target, allCultivars, limit) : [];
}
export function getMediaForCultivar(cultivarId) {
  if (/^CUL-/.test(cultivarId || '')) return [];
  return referenceRepository.getMediaForCultivar(cultivarId);
}
export function getPrimaryMediaForCultivar(cultivarId) {
  return getMediaForCultivar(cultivarId).find(item => item.role === 'identity-plate') || getMediaForCultivar(cultivarId)[0];
}

export {
  getEvidence,
  getSource,
  getSources,
  getEvidenceForSource,
  getContributors,
  getSubmissions,
  getEditorialWorkflows,
  getEditorialReviews,
  getEditorialStats,
  getWorkflowForTarget,
  getReviewsForWorkflow,
  getRelationships,
  getRelationshipTypes,
  getRelationshipType,
  getKnowledgeGraph,
  getGraphStats,
  getGraphNeighbors,
  getRelationshipsBetween,
  getRelationshipPath,
  getGraphRelatedCultivars
} from './repository';
