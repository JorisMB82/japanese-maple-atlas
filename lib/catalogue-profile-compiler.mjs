import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { formatSchemaErrors, validateJsonSchema } from './json-schema-validator.mjs';

export const CATALOGUE_COMPILER_VERSION = '0.1.0';
export const CATALOGUE_RELEASE_DATE = '2026-07-28';

const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const identityNumber = cultivarId => Number(String(cultivarId || '').replace(/^CUL-/, ''));
const expectedSlot = cultivarId => String(identityNumber(cultivarId)).padStart(3, '0');
const normalizeName = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
export const stableCatalogueSlug = value => normalizeName(value).replace(/\s+/g, '-');
export const isPublishedCatalogueRecord = record => record?.publicationClass === 'catalogue-profile' && record?.catalogueProfile?.state === 'published';

export function validateIdentityRegistry(registry) {
  const errors = [];
  if (registry?.status !== 'approved') errors.push('Identity registry must be approved');
  if (registry?.identityFamily !== 'CUL-######') errors.push('Identity registry must use CUL-######');
  if (!Array.isArray(registry?.publicationClasses) || !registry.publicationClasses.includes('catalogue-profile') || !registry.publicationClasses.includes('reference-standard')) errors.push('Identity registry must declare both publication classes');
  if (!Array.isArray(registry?.entries)) errors.push('Identity registry entries must be an array');
  const ids = new Set();
  const slots = new Set();
  for (const entry of registry?.entries || []) {
    if (!/^CUL-\d{6}$/.test(entry.cultivarId || '')) errors.push(`Invalid cultivar identity ${entry.cultivarId}`);
    if (!/^\d{3}$/.test(entry.programmeSlot || '')) errors.push(`${entry.cultivarId}: invalid programme slot ${entry.programmeSlot}`);
    if (entry.programmeSlot !== expectedSlot(entry.cultivarId)) errors.push(`${entry.cultivarId}: programme slot does not match identity number`);
    if (ids.has(entry.cultivarId)) errors.push(`Duplicate cultivar identity ${entry.cultivarId}`);
    if (slots.has(entry.programmeSlot)) errors.push(`Duplicate programme slot ${entry.programmeSlot}`);
    ids.add(entry.cultivarId);
    slots.add(entry.programmeSlot);
    if (!['reference-standard-mapped', 'reserved-catalogue-slot', 'assigned-catalogue', 'retired'].includes(entry.state)) errors.push(`${entry.cultivarId}: invalid registry state ${entry.state}`);
    if (entry.state === 'reference-standard-mapped' && entry.referenceStandardId !== `RC-${entry.programmeSlot}`) errors.push(`${entry.cultivarId}: invalid Reference Standard mapping`);
    if (entry.state === 'reserved-catalogue-slot' && (entry.referenceStandardId !== null || entry.assignedWorkingName !== null)) errors.push(`${entry.cultivarId}: reserved slots must remain unassigned`);
    if (entry.state === 'assigned-catalogue' && (!entry.assignedWorkingName || !entry.assignmentDecision)) errors.push(`${entry.cultivarId}: assigned Catalogue identity requires name and decision`);
  }
  return { valid: errors.length === 0, errors, byId: new Map((registry?.entries || []).map(entry => [entry.cultivarId, entry])) };
}

function mediaErrors(profile) {
  const errors = [];
  const media = profile.media;
  if (media.state === 'approved-primary') {
    if (!media.primaryMediaId) errors.push(`${profile.cultivarId}: approved-primary requires primaryMediaId`);
    if (media.governedGap !== null) errors.push(`${profile.cultivarId}: approved-primary cannot include governedGap`);
    if (media.visualComplete !== true) errors.push(`${profile.cultivarId}: approved-primary must set visualComplete true`);
  }
  if (media.state === 'governed-gap') {
    if (media.primaryMediaId !== null) errors.push(`${profile.cultivarId}: governed-gap cannot include primaryMediaId`);
    if (!media.governedGap) errors.push(`${profile.cultivarId}: governed-gap requires a governedGap record`);
    if (media.visualComplete !== false) errors.push(`${profile.cultivarId}: governed-gap must set visualComplete false`);
  }
  if (['candidate-under-review', 'non-evidentiary-illustration'].includes(media.state) && profile.catalogueState === 'published') errors.push(`${profile.cultivarId}: unresolved media state cannot be published`);
  return errors;
}

export function validateCatalogueProfile(profile, schema, registry, options = {}) {
  const schemaResult = validateJsonSchema(profile, schema);
  const errors = formatSchemaErrors(schemaResult.errors);
  const registryResult = options.registryResult || validateIdentityRegistry(registry);
  if (!registryResult.valid) errors.push(...registryResult.errors.map(error => `identity registry: ${error}`));
  const entry = registryResult.byId.get(profile.cultivarId);
  if (!entry) errors.push(`${profile.cultivarId}: identity is not present in the registry`);
  else {
    if (entry.programmeSlot !== profile.programmeSlot) errors.push(`${profile.cultivarId}: programme slot does not match registry`);
    if (entry.publicationClass !== 'catalogue-profile') errors.push(`${profile.cultivarId}: registry publication class is not catalogue-profile`);
    if (!options.allowReservedIdentity && entry.state !== 'assigned-catalogue') errors.push(`${profile.cultivarId}: identity is not assigned for Catalogue publication`);
    if (entry.state === 'assigned-catalogue' && normalizeName(entry.assignedWorkingName) !== normalizeName(profile.acceptedWorkingName)) errors.push(`${profile.cultivarId}: working name does not match registry assignment`);
  }
  if (profile.programmeSlot !== expectedSlot(profile.cultivarId)) errors.push(`${profile.cultivarId}: programme slot must match identity number`);
  if (stableCatalogueSlug(profile.acceptedWorkingName) !== profile.slug) errors.push(`${profile.cultivarId}: slug must be derived from acceptedWorkingName`);
  if (profile.duplicateCheck.result !== 'unique') errors.push(`${profile.cultivarId}: C0 duplicate check must resolve as unique`);
  if (profile.riskLevel === 'high' && ['approved', 'published'].includes(profile.catalogueState)) errors.push(`${profile.cultivarId}: high-risk profile cannot use routine approval or publication`);
  if (profile.riskLevel === 'high' && profile.review.approvalState === 'batch-approved') errors.push(`${profile.cultivarId}: high-risk profile cannot be batch-approved`);
  if (profile.catalogueState === 'published') {
    if (profile.review.approvalState !== 'batch-approved') errors.push(`${profile.cultivarId}: published profile requires batch approval`);
    if (!profile.publishedAt) errors.push(`${profile.cultivarId}: published profile requires publishedAt`);
  } else if (profile.publishedAt !== null) errors.push(`${profile.cultivarId}: non-published profile must keep publishedAt null`);
  if (profile.referenceStandardId !== null && profile.promotionStatus !== 'promoted') errors.push(`${profile.cultivarId}: referenceStandardId requires promoted status`);
  const sourceIds = new Set();
  for (const source of profile.sources || []) {
    if (!source.id.startsWith(`SRC-${profile.cultivarId}-`)) errors.push(`${profile.cultivarId}: source ${source.id} is not scoped to the cultivar identity`);
    if (sourceIds.has(source.id)) errors.push(`${profile.cultivarId}: duplicate source ${source.id}`);
    sourceIds.add(source.id);
  }
  if (options.taxonIds && !options.taxonIds.has(profile.taxonId)) errors.push(`${profile.cultivarId}: unknown taxon ${profile.taxonId}`);
  errors.push(...mediaErrors(profile));
  return { valid: errors.length === 0, errors, entry };
}

export function compileCatalogueProfile(profile, input = {}) {
  const sourceIds = profile.sources.map(source => source.id);
  const mediaIds = [...new Set([profile.media.primaryMediaId, ...(profile.media.candidateMediaIds || [])].filter(Boolean))];
  return {
    id: profile.cultivarId,
    cultivarId: profile.cultivarId,
    legacyId: null,
    slug: profile.slug,
    cultivar: profile.acceptedWorkingName,
    scientificName: profile.scientificName,
    taxonId: profile.taxonId,
    publicationClass: 'catalogue-profile',
    status: `${profile.catalogueState}-catalogue-profile`,
    canonicality: 'catalogue-compiled',
    riskLevel: profile.riskLevel,
    summary: profile.content.summary,
    habit: profile.content.habit,
    leafForm: profile.content.leafForm,
    springColor: profile.content.seasonal.spring,
    summerColor: profile.content.seasonal.summer,
    autumnColor: profile.content.seasonal.autumn,
    size: profile.content.size,
    cultivation: profile.content.cultivation,
    diagnosticTraits: [profile.content.diagnostic],
    confidence: profile.content.confidence,
    sourceIds,
    mediaIds,
    relationshipIds: [],
    sections: {
      identity: profile.identityNotes || profile.duplicateCheck.notes,
      morphology: `${profile.content.habit} ${profile.content.leafForm}`,
      seasonality: profile.content.seasonal,
      cultivation: profile.content.cultivation,
      comparison: profile.content.diagnostic
    },
    mediaState: profile.media.state,
    catalogueProfile: {
      version: profile.profileVersion,
      state: profile.catalogueState,
      batchId: profile.batchId,
      review: profile.review,
      duplicateCheck: profile.duplicateCheck,
      promotionStatus: profile.promotionStatus,
      referenceStandardId: profile.referenceStandardId,
      publishedAt: profile.publishedAt,
      revisionHistory: profile.revisionHistory,
      path: input.path || null,
      sha256: input.sha256 || null
    },
    referenceStandard: null,
    compiler: {
      name: 'Atlas Catalogue Compiler',
      version: CATALOGUE_COMPILER_VERSION,
      generatedAt: CATALOGUE_RELEASE_DATE
    }
  };
}

export function compileCatalogueDirectory({ inputDir, schemaPath, registryPath, taxonIds, allowReservedIdentity = false }) {
  const schema = readJson(schemaPath);
  const registry = readJson(registryPath);
  const registryResult = validateIdentityRegistry(registry);
  if (!registryResult.valid) throw new Error(`Catalogue identity registry failed:\n${registryResult.errors.map(error => `- ${error}`).join('\n')}`);
  const files = fs.existsSync(inputDir) ? fs.readdirSync(inputDir).filter(file => /^CUL-\d{6}\.json$/.test(file)).sort() : [];
  const records = [];
  const diagnostics = [];
  const slugs = new Set();
  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const raw = fs.readFileSync(inputPath, 'utf8');
    const profile = JSON.parse(raw);
    const result = validateCatalogueProfile(profile, schema, registry, { registryResult, taxonIds, allowReservedIdentity });
    if (!result.valid) diagnostics.push({ id: profile.cultivarId || file, status: 'fail', errors: result.errors });
    else {
      if (path.basename(file, '.json') !== profile.cultivarId) diagnostics.push({ id: profile.cultivarId, status: 'fail', errors: ['filename must match cultivarId'] });
      else if (slugs.has(profile.slug)) diagnostics.push({ id: profile.cultivarId, status: 'fail', errors: [`duplicate slug ${profile.slug}`] });
      else {
        slugs.add(profile.slug);
        records.push(compileCatalogueProfile(profile, { path: path.relative(path.resolve(inputDir, '..', '..'), inputPath).replaceAll(path.sep, '/'), sha256: sha256(raw) }));
        diagnostics.push({ id: profile.cultivarId, status: 'pass', riskLevel: profile.riskLevel, state: profile.catalogueState, mediaState: profile.media.state });
      }
    }
  }
  const failures = diagnostics.filter(item => item.status === 'fail');
  if (failures.length) throw new Error(`Catalogue Profile validation failed:\n${failures.flatMap(item => item.errors.map(error => `- ${item.id}: ${error}`)).join('\n')}`);
  return { records, diagnostics, registry };
}
