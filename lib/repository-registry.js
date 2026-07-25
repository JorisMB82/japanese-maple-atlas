// GENERATED FILE — DO NOT EDIT. Run `npm run compile:atlas`.

import fs from 'node:fs';
import path from 'node:path';

const repositoryRoot = path.join(process.cwd(), 'atlas-repository');
const loadJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const loadDirectory = directory => {
  const fullPath = path.join(repositoryRoot, directory);
  return fs.readdirSync(fullPath)
    .filter(file => file.endsWith('.json'))
    .sort()
    .map(file => loadJson(path.join(fullPath, file)));
};

export const manifest = loadJson(path.join(repositoryRoot, 'manifest.json'));
export const cultivars = loadDirectory('cultivars');
export const assertions = loadDirectory('assertions');
export const evidence = loadDirectory('evidence');
export const sources = loadDirectory('sources');
export const taxa = loadDirectory('taxonomy');
export const relationships = loadDirectory('relationships');
export const media = loadDirectory('media');
export const contributors = loadDirectory('contributors');
export const submissions = loadDirectory('submissions');
export const editorialWorkflows = loadDirectory('editorial-workflows');
export const editorialReviews = loadDirectory('editorial-reviews');
