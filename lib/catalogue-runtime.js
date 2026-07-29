import fs from 'node:fs';
import path from 'node:path';
import { compileCatalogueDirectory } from './catalogue-profile-compiler.mjs';

const ROOT = process.cwd();
const inputDir = path.join(ROOT, 'atlas-repository', 'catalogue-profiles');
const schemaPath = path.join(ROOT, 'atlas-repository', 'schemas', 'catalogue-profile.schema.json');
const registryPath = path.join(inputDir, 'contract', 'cultivar-identity-registry.json');
const taxaPath = path.join(ROOT, 'atlas-repository', 'reference-standards', 'contract', 'taxa.json');
const taxa = JSON.parse(fs.readFileSync(taxaPath, 'utf8'));

const result = compileCatalogueDirectory({
  inputDir,
  schemaPath,
  registryPath,
  taxonIds: new Set((taxa.taxa || []).map(taxon => taxon.id))
});

export const catalogueCultivars = result.records;
export const catalogueDiagnostics = result.diagnostics;
export const cultivarIdentityRegistry = result.registry;
