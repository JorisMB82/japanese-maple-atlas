import fs from 'node:fs';
import path from 'node:path';
import { formatSchemaErrors, validateJsonSchema } from './json-schema-validator.mjs';

export const CATALOGUE_MEDIA_SCHEMA_VERSION = '1.0.0';
export const REQUIRED_VISUAL_ROLES = ['habit-primary', 'foliage-detail', 'seasonal-diagnostic'];
export const IDENTITY_CONFIDENCE_LABELS = {
  documented: 'Documented identity',
  'source-asserted': 'Source-identified',
  'community-identified': 'Community-identified'
};

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const nonEmpty = value => typeof value === 'string' && value.trim().length > 0;
const unique = values => new Set(values).size === values.length;

export function identityQualification(asset) {
  if (asset?.identity?.confidence === 'documented') return asset.identity.publicQualification;
  return asset?.identity?.publicQualification || 'The source or contributor identifies this plant as the named cultivar. The Japanese Maple Atlas has not independently authenticated the clone.';
}

export function validateCatalogueMediaSidecar(sidecar, schema) {
  const schemaResult = validateJsonSchema(sidecar, schema);
  const errors = formatSchemaErrors(schemaResult.errors);
  const cultivarId = sidecar?.cultivarId || 'unknown';
  const assets = Array.isArray(sidecar?.assets) ? sidecar.assets : [];
  const ids = assets.map(asset => asset?.id || 'unknown-media');
  const primary = assets.filter(asset => asset?.isPrimary === true);
  const roles = assets.map(asset => asset?.role).filter(Boolean);

  if (!unique(ids)) errors.push(`${cultivarId}: media IDs must be unique`);
  if (assets.length > 0 && primary.length !== 1) errors.push(`${cultivarId}: approved gallery requires exactly one primary item`);
  if (primary[0] && primary[0].role !== 'habit-primary') errors.push(`${cultivarId}: primary item must use habit-primary role`);

  for (const asset of assets) {
    const assetId = asset?.id || 'unknown-media';
    if (asset?.cultivarId !== sidecar?.cultivarId) errors.push(`${assetId}: cultivarId must match sidecar`);
    if (!String(assetId).startsWith(`MED-${cultivarId}-`)) errors.push(`${assetId}: media ID must be scoped to ${cultivarId}`);
    if (asset?.rightsBasis === 'creative-commons' && !asset?.licenceUrl) errors.push(`${assetId}: Creative Commons item requires licenceUrl`);
    if (!nonEmpty(asset?.attributionText)) errors.push(`${assetId}: attributionText is required`);
    if (asset?.identity?.confidence !== 'documented' && !/not independently/i.test(identityQualification(asset))) {
      errors.push(`${assetId}: non-documented identity requires conspicuous independent-authentication qualification`);
    }
    if (asset?.privacy?.gpsRetained !== false || asset?.privacy?.exifRetained !== false) errors.push(`${assetId}: public derivatives must remove GPS and EXIF metadata`);
    const derivativeProfiles = Array.isArray(asset?.derivatives) ? asset.derivatives.map(item => item?.profile).filter(Boolean) : [];
    for (const required of ['thumb', 'card', 'display', 'archive']) {
      if (derivativeProfiles.filter(profile => profile === required).length !== 1) errors.push(`${assetId}: derivative profile ${required} must appear exactly once`);
    }
  }

  const missingRoles = REQUIRED_VISUAL_ROLES.filter(role => !roles.includes(role));
  const needsException = assets.length < 3 || missingRoles.length > 0;
  if (sidecar?.status === 'approved' && assets.length === 0) errors.push(`${cultivarId}: approved sidecar requires at least one lawful visual item`);
  if (sidecar?.status === 'approved' && needsException && !sidecar?.roleException) {
    errors.push(`${cultivarId}: fewer-than-three or missing-role gallery requires roleException`);
  }
  if (sidecar?.roleException) {
    const declared = Array.isArray(sidecar.roleException.missingRoles) ? [...sidecar.roleException.missingRoles].sort() : [];
    const actual = [...missingRoles].sort();
    if (JSON.stringify(declared) !== JSON.stringify(actual)) errors.push(`${cultivarId}: roleException missingRoles must match actual missing required roles`);
  }
  if (!needsException && sidecar?.roleException) errors.push(`${cultivarId}: complete gallery cannot retain a roleException`);

  return { valid: errors.length === 0, errors, assets, primary: primary[0] || null, missingRoles };
}

export function loadCatalogueMediaDirectory({ directory, schemaPath }) {
  const files = fs.existsSync(directory)
    ? fs.readdirSync(directory).filter(file => /^CUL-\d{6}\.media\.json$/.test(file)).sort()
    : [];
  const sidecars = [];
  const byCultivarId = new Map();
  const diagnostics = [];
  if (files.length === 0) return { sidecars, byCultivarId, diagnostics };

  const schema = readJson(schemaPath);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const sidecar = readJson(filePath);
    const result = validateCatalogueMediaSidecar(sidecar, schema);
    diagnostics.push({ cultivarId: sidecar.cultivarId || file, status: result.valid ? 'pass' : 'fail', errors: result.errors, assets: result.assets.length, missingRoles: result.missingRoles });
    if (result.valid) {
      const expected = `${sidecar.cultivarId}.media.json`;
      if (file !== expected) diagnostics.push({ cultivarId: sidecar.cultivarId, status: 'fail', errors: [`filename must be ${expected}`], assets: result.assets.length, missingRoles: result.missingRoles });
      else {
        sidecars.push(sidecar);
        byCultivarId.set(sidecar.cultivarId, sidecar);
      }
    }
  }

  const failures = diagnostics.filter(item => item.status === 'fail');
  if (failures.length) {
    throw new Error(`Catalogue media validation failed:\n${failures.flatMap(item => item.errors.map(error => `- ${item.cultivarId}: ${error}`)).join('\n')}`);
  }

  return { sidecars, byCultivarId, diagnostics };
}
