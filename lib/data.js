import cultivars from '@/data/cultivars.json';
import evidence from '@/data/evidence.json';
import sources from '@/data/sources.json';

export function getCultivars() { return cultivars; }
export function getCultivar(slug) { return cultivars.find(c => c.slug === slug); }
export function getEvidence(id) { return evidence.find(e => e.id === id); }
export function getSource(id) { return sources.find(s => s.id === id); }
export function getSources() { return sources; }
export function getEvidenceForSource(sourceId) { return evidence.filter(e => e.sourceId === sourceId); }
export function getAllSlugs() { return cultivars.map(c => ({ slug: c.slug })); }
export function getRepositoryStats() { return { cultivars: cultivars.length, species: new Set(cultivars.map(c=>c.species)).size, assertions: cultivars.reduce((n,c)=>n+c.assertions.length,0), evidence: evidence.length, sources: sources.length }; }
