import {
  cultivars,
  assertions,
  evidence,
  sources,
  taxa,
  relationships,
  media,
  contributors,
  submissions,
  editorialWorkflows,
  editorialReviews,
  manifest
} from './repository-registry';
import { createFacets, filterCultivars, findSimilarCultivars, sortCultivars } from './search';

const byId = list => new Map(list.map(item => [item.id, item]));
const indexes = {
  cultivars: byId(cultivars),
  assertions: byId(assertions),
  evidence: byId(evidence),
  sources: byId(sources),
  taxa: byId(taxa),
  relationships: byId(relationships),
  media: byId(media),
  contributors: byId(contributors),
  submissions: byId(submissions),
  editorialWorkflows: byId(editorialWorkflows),
  editorialReviews: byId(editorialReviews)
};

export function getRepositoryManifest(){ return manifest; }
export function getCultivarObjects(){ return cultivars; }
export function getCultivarObject(id){ return indexes.cultivars.get(id); }
export function getCultivarBySlug(slug){ return cultivars.find(item => item.slug === slug); }
export function getTaxon(id){ return indexes.taxa.get(id); }
export function getAssertion(id){ return indexes.assertions.get(id); }
export function getEvidence(id){ return indexes.evidence.get(id); }
export function getSource(id){ return indexes.sources.get(id); }
export function getRelationship(id){ return indexes.relationships.get(id); }
export function getMedia(id){ return indexes.media.get(id); }
export function getContributor(id){ return indexes.contributors.get(id); }
export function getSubmission(id){ return indexes.submissions.get(id); }
export function getEditorialWorkflow(id){ return indexes.editorialWorkflows.get(id); }
export function getEditorialReview(id){ return indexes.editorialReviews.get(id); }

export function getMediaForCultivar(cultivarId){
  return media.filter(item => item.cultivarId === cultivarId);
}

export function getPrimaryMediaForCultivar(cultivarId){
  const cultivarMedia = getMediaForCultivar(cultivarId);
  return cultivarMedia.find(item => item.role === 'identity-plate') || cultivarMedia[0];
}

export function getSources(){ return sources; }
export function getTaxa(){ return taxa; }
export function getRelationships(){ return relationships; }
export function getContributors(){ return contributors; }
export function getSubmissions(){ return submissions; }
export function getEditorialWorkflows(){ return editorialWorkflows; }
export function getEditorialReviews(){ return editorialReviews; }
export function getEvidenceForSource(sourceId){ return evidence.filter(item => item.sourceId === sourceId); }
export function getAssertionsForCultivar(cultivarId){ return assertions.filter(item => item.subjectId === cultivarId); }
export function getRelationshipsForCultivar(cultivarId){
  return relationships.filter(item => item.fromId === cultivarId || item.toId === cultivarId);
}
export function getWorkflowForTarget(targetId){
  return editorialWorkflows.find(item => item.targetId === targetId);
}
export function getReviewsForWorkflow(workflowId){
  return editorialReviews
    .filter(item => item.workflowId === workflowId)
    .sort((a, b) => a.passNumber - b.passNumber);
}

export function hydrateCultivar(cultivar){
  if (!cultivar) return undefined;
  const taxon = getTaxon(cultivar.taxonId);
  const hydratedAssertions = cultivar.assertionIds.map(getAssertion).filter(Boolean);
  const hydratedRelationships = cultivar.relationshipIds
    .map(getRelationship)
    .filter(Boolean)
    .map(relationship => {
      const relatedId = relationship.fromId === cultivar.id ? relationship.toId : relationship.fromId;
      return { ...relationship, relatedCultivar: getCultivarObject(relatedId) };
    });
  const hydratedMedia = getMediaForCultivar(cultivar.id);

  return {
    ...cultivar,
    species: taxon?.scientificName || cultivar.scientificName.split(" '")[0],
    taxon,
    assertions: hydratedAssertions,
    relationships: hydratedRelationships,
    media: hydratedMedia,
    primaryMedia: hydratedMedia.find(item => item.role === 'identity-plate') || hydratedMedia[0],
    editorialWorkflow: getWorkflowForTarget(cultivar.id)
  };
}

export function getCultivars(){ return cultivars.map(hydrateCultivar); }
export function getCultivar(slug){ return hydrateCultivar(getCultivarBySlug(slug)); }
export function getAllSlugs(){ return cultivars.map(item => ({ slug: item.slug })); }
export function getRepositoryStats(){ return { ...manifest.objectCounts, species: taxa.length }; }
export function getEditorialStats(){
  return {
    contributors: contributors.length,
    submissions: submissions.length,
    workflows: editorialWorkflows.length,
    reviews: editorialReviews.length,
    frozen: editorialWorkflows.filter(item => item.status === 'frozen').length,
    active: editorialWorkflows.filter(item => ['draft', 'active', 'blocked', 'approved'].includes(item.status)).length
  };
}
export function getSearchFacets(){ return createFacets(getCultivars()); }
export function searchCultivars(filters = {}){
  return sortCultivars(filterCultivars(getCultivars(), filters), filters.sort || 'relevance');
}
export function getSimilarCultivars(slug, limit = 3){
  const target = getCultivar(slug);
  if (!target) return [];
  return findSimilarCultivars(target, getCultivars(), limit);
}

export function getIntegrityReport(){
  const issues = [];

  for (const cultivar of cultivars) {
    if (!indexes.taxa.has(cultivar.taxonId)) issues.push(`${cultivar.id}: missing taxon ${cultivar.taxonId}`);
    for (const id of cultivar.assertionIds) {
      if (!indexes.assertions.has(id)) issues.push(`${cultivar.id}: missing assertion ${id}`);
    }
    for (const id of cultivar.relationshipIds) {
      if (!indexes.relationships.has(id)) issues.push(`${cultivar.id}: missing relationship ${id}`);
    }
    if (!getMediaForCultivar(cultivar.id).length) issues.push(`${cultivar.id}: no media object`);
  }

  for (const assertion of assertions) {
    for (const id of assertion.evidenceIds) {
      if (!indexes.evidence.has(id)) issues.push(`${assertion.id}: missing evidence ${id}`);
    }
  }

  for (const evidenceItem of evidence) {
    if (!indexes.sources.has(evidenceItem.sourceId)) issues.push(`${evidenceItem.id}: missing source ${evidenceItem.sourceId}`);
  }

  for (const mediaItem of media) {
    if (!indexes.cultivars.has(mediaItem.cultivarId)) issues.push(`${mediaItem.id}: missing cultivar ${mediaItem.cultivarId}`);
    if (!mediaItem.assetPath) issues.push(`${mediaItem.id}: missing asset path`);
    if (!mediaItem.altText) issues.push(`${mediaItem.id}: missing alt text`);
  }

  for (const submission of submissions) {
    if (!indexes.contributors.has(submission.contributorId)) issues.push(`${submission.id}: missing contributor ${submission.contributorId}`);
    if (!indexes.editorialWorkflows.has(submission.workflowId)) issues.push(`${submission.id}: missing workflow ${submission.workflowId}`);
  }

  for (const workflow of editorialWorkflows) {
    if (workflow.stages.length !== 12) issues.push(`${workflow.id}: invalid lifecycle`);
    for (const id of workflow.reviewIds) {
      if (!indexes.editorialReviews.has(id)) issues.push(`${workflow.id}: missing review ${id}`);
    }
  }

  return { valid: issues.length === 0, issues, checkedObjects: manifest.objectTotal };
}
