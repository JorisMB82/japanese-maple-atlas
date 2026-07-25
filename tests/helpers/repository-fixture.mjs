import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(import.meta.dirname, '..', '..');
export const REPOSITORY = path.join(ROOT, 'atlas-repository');
export const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
export const readDirectory = directory => fs.readdirSync(path.join(REPOSITORY, directory))
  .filter(file => file.endsWith('.json'))
  .sort()
  .map(file => readJson(path.join(REPOSITORY, directory, file)));

export function repositoryFixture() {
  const taxa = readDirectory('taxonomy');
  const taxonById = new Map(taxa.map(taxon => [taxon.id, taxon]));
  const cultivars = readDirectory('cultivars').map(cultivar => ({
    ...cultivar,
    species: taxonById.get(cultivar.taxonId)?.scientificName || cultivar.scientificName.split(" '")[0]
  }));
  return {
    manifest: readJson(path.join(REPOSITORY, 'manifest.json')),
    hashes: readJson(path.join(REPOSITORY, 'hashes.json')),
    graph: readJson(path.join(REPOSITORY, 'indexes', 'graph-index.json')),
    objectIndex: readJson(path.join(REPOSITORY, 'indexes', 'object-index.json')),
    searchIndex: readJson(path.join(REPOSITORY, 'indexes', 'search-index.json')),
    cultivars,
    taxa,
    assertions: readDirectory('assertions'),
    evidence: readDirectory('evidence'),
    sources: readDirectory('sources'),
    relationships: readDirectory('relationships'),
    relationshipTypes: readDirectory('relationship-types'),
    media: readDirectory('media'),
    contributors: readDirectory('contributors'),
    submissions: readDirectory('submissions'),
    editorialWorkflows: readDirectory('editorial-workflows'),
    editorialReviews: readDirectory('editorial-reviews')
  };
}
