import cultivars from '@/data/cultivars.json';
import evidence from '@/data/evidence.json';
import sources from '@/data/sources.json';

export function getCultivars() { return cultivars; }
export function getCultivar(slug) { return cultivars.find(c => c.slug === slug); }
export function getEvidence(id) { return evidence.find(e => e.id === id); }
export function getSource(id) { return sources.find(s => s.id === id); }
export function getAllSlugs() { return cultivars.map(c => ({ slug: c.slug })); }
