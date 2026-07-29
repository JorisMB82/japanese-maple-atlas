import fs from 'node:fs';
import path from 'node:path';
import { compileCatalogueDirectory, isPublishedCatalogueRecord } from './catalogue-profile-compiler.mjs';
import { loadCatalogueMediaDirectory } from './catalogue-media.mjs';

const ROOT = process.cwd();
const inputDir = path.join(ROOT, 'atlas-repository', 'catalogue-profiles');
const schemaPath = path.join(ROOT, 'atlas-repository', 'schemas', 'catalogue-profile.schema.json');
const mediaDirectory = path.join(inputDir, 'media');
const mediaSchemaPath = path.join(ROOT, 'atlas-repository', 'schemas', 'catalogue-media.schema.json');
const registryPath = path.join(inputDir, 'contract', 'cultivar-identity-registry.json');
const taxaPath = path.join(ROOT, 'atlas-repository', 'reference-standards', 'contract', 'taxa.json');
const taxa = JSON.parse(fs.readFileSync(taxaPath, 'utf8'));

const result = compileCatalogueDirectory({
  inputDir,
  schemaPath,
  registryPath,
  taxonIds: new Set((taxa.taxa || []).map(taxon => taxon.id))
});
const mediaResult = loadCatalogueMediaDirectory({ directory:mediaDirectory, schemaPath:mediaSchemaPath });

function attachMedia(record) {
  const sidecar = mediaResult.byCultivarId.get(record.cultivarId) || null;
  const media = sidecar?.assets || [];
  const primaryMedia = media.find(asset => asset.isPrimary) || null;
  const approvedGallery = sidecar?.status === 'approved' && Boolean(primaryMedia);
  return {
    ...record,
    media,
    primaryMedia,
    mediaState: approvedGallery ? 'approved-gallery' : record.mediaState,
    mediaGovernedGap: approvedGallery ? null : record.mediaGovernedGap,
    visualComplete: approvedGallery && !sidecar.roleException,
    catalogueMedia: sidecar ? {
      schemaVersion: sidecar.schemaVersion,
      status: sidecar.status,
      roleException: sidecar.roleException,
      review: sidecar.review
    } : null
  };
}

export const catalogueCandidates = result.records.map(attachMedia);
export const catalogueCultivars = catalogueCandidates.filter(isPublishedCatalogueRecord);
export const catalogueDiagnostics = result.diagnostics;
export const catalogueMediaDiagnostics = mediaResult.diagnostics;
export const cultivarIdentityRegistry = result.registry;
