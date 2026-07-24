import { cultivars, assertions, evidence, sources, taxa, relationships, media, manifest } from './repository-registry';
import { createFacets, filterCultivars, findSimilarCultivars, sortCultivars } from './search';

const byId = list => new Map(list.map(item => [item.id, item]));
const indexes = {
  cultivars: byId(cultivars), assertions: byId(assertions), evidence: byId(evidence),
  sources: byId(sources), taxa: byId(taxa), relationships: byId(relationships), media: byId(media)
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
export function getMediaForCultivar(cultivarId){ return media.filter(item => item.cultivarId === cultivarId); }
export function getPrimaryMediaForCultivar(cultivarId){ return getMediaForCultivar(cultivarId).find(item => item.role === 'identity-plate') || getMediaForCultivar(cultivarId)[0]; }
export function getSources(){ return sources; }
export function getTaxa(){ return taxa; }
export function getRelationships(){ return relationships; }
export function getEvidenceForSource(sourceId){ return evidence.filter(item => item.sourceId === sourceId); }
export function getAssertionsForCultivar(cultivarId){ return assertions.filter(item => item.subjectId === cultivarId); }
export function getRelationshipsForCultivar(cultivarId){ return relationships.filter(item => item.fromId === cultivarId || item.toId === cultivarId); }

export function hydrateCultivar(cultivar){
  if(!cultivar) return undefined;
  const taxon = getTaxon(cultivar.taxonId);
  const hydratedAssertions = cultivar.assertionIds.map(getAssertion).filter(Boolean);
  const hydratedRelationships = cultivar.relationshipIds.map(getRelationship).filter(Boolean).map(rel => {
    const relatedId = rel.fromId === cultivar.id ? rel.toId : rel.fromId;
    return { ...rel, relatedCultivar: getCultivarObject(relatedId) };
  });
  const hydratedMedia = getMediaForCultivar(cultivar.id);
  return {
    ...cultivar,
    species: taxon?.scientificName || cultivar.scientificName.split(" '")[0],
    taxon,
    assertions: hydratedAssertions,
    relationships: hydratedRelationships,
    media: hydratedMedia,
    primaryMedia: hydratedMedia.find(item => item.role === 'identity-plate') || hydratedMedia[0]
  };
}

export function getCultivars(){ return cultivars.map(hydrateCultivar); }
export function getCultivar(slug){ return hydrateCultivar(getCultivarBySlug(slug)); }
export function getAllSlugs(){ return cultivars.map(item => ({slug:item.slug})); }
export function getRepositoryStats(){ return { ...manifest.objectCounts, species: taxa.length }; }
export function getSearchFacets(){ return createFacets(getCultivars()); }
export function searchCultivars(filters = {}){ return sortCultivars(filterCultivars(getCultivars(), filters), filters.sort || 'relevance'); }
export function getSimilarCultivars(slug, limit = 3){
  const target = getCultivar(slug);
  if (!target) return [];
  return findSimilarCultivars(target, getCultivars(), limit);
}

export function getIntegrityReport(){
 const missing=[];
 for(const c of cultivars){
  if(!indexes.taxa.has(c.taxonId)) missing.push(`${c.id}: missing taxon ${c.taxonId}`);
  for(const id of c.assertionIds) if(!indexes.assertions.has(id)) missing.push(`${c.id}: missing assertion ${id}`);
  for(const id of c.relationshipIds) if(!indexes.relationships.has(id)) missing.push(`${c.id}: missing relationship ${id}`);
  if(!getMediaForCultivar(c.id).length) missing.push(`${c.id}: no media object`);
 }
 for(const a of assertions) for(const id of a.evidenceIds) if(!indexes.evidence.has(id)) missing.push(`${a.id}: missing evidence ${id}`);
 for(const e of evidence) if(!indexes.sources.has(e.sourceId)) missing.push(`${e.id}: missing source ${e.sourceId}`);
 for(const m of media){
   if(!indexes.cultivars.has(m.cultivarId)) missing.push(`${m.id}: missing cultivar ${m.cultivarId}`);
   if(!m.assetPath) missing.push(`${m.id}: missing asset path`);
   if(!m.altText) missing.push(`${m.id}: missing alt text`);
 }
 return { valid: missing.length === 0, issues: missing, checkedObjects: Object.values(manifest.objectCounts).reduce((a,b)=>a+b,0) };
}
