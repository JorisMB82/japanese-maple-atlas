export * from './atlas-explorer.mjs';

import {
  EXPLORER_DEFAULT_STATE as BASE_DEFAULT_STATE,
  applyExplorerPreset as applyBasePreset,
  explorerCsv as baseExplorerCsv,
  explorerExportPayload as baseExplorerExportPayload,
  explorerFilterState as baseExplorerFilterState,
  explorerLensFields as baseExplorerLensFields,
  normaliseExplorerState as normaliseBaseExplorerState,
  parseExplorerSearchParams as parseBaseExplorerSearchParams,
  projectCultivarForExplorer as projectBaseCultivarForExplorer,
  serialiseExplorerState as serialiseBaseExplorerState
} from './atlas-explorer.mjs';

const VALID_PUBLICATION_CLASSES = new Set(['All', 'reference-standard', 'catalogue-profile']);
const classValue = value => VALID_PUBLICATION_CLASSES.has(value) ? value : 'All';
const csvCell = value => `"${String(value ?? '').replaceAll('"', '""')}"`;

export const EXPLORER_DEFAULT_STATE = Object.freeze({
  ...BASE_DEFAULT_STATE,
  publicationClass: 'All'
});

export function normaliseExplorerState(input = {}, cultivarSlugs = []) {
  return {
    ...normaliseBaseExplorerState(input, cultivarSlugs),
    publicationClass: classValue(input.publicationClass)
  };
}

export function parseExplorerSearchParams(search = '', cultivarSlugs = []) {
  const params = search instanceof URLSearchParams
    ? search
    : new URLSearchParams(String(search || '').replace(/^\?/, ''));
  return {
    ...parseBaseExplorerSearchParams(params, cultivarSlugs),
    publicationClass: classValue(params.get('class') || 'All')
  };
}

export function serialiseExplorerState(input = {}, cultivarSlugs = []) {
  const state = normaliseExplorerState(input, cultivarSlugs);
  const params = new URLSearchParams(serialiseBaseExplorerState(state, cultivarSlugs));
  if (state.publicationClass !== 'All') params.set('class', state.publicationClass);
  return params.toString();
}

export function applyExplorerPreset(current, presetId, cultivarSlugs = []) {
  return {
    ...applyBasePreset(current, presetId, cultivarSlugs),
    publicationClass: classValue(current?.publicationClass)
  };
}

export function explorerFilterState(state) {
  return {
    ...baseExplorerFilterState(state),
    publicationClass: classValue(state?.publicationClass)
  };
}

export function projectCultivarForExplorer(cultivar) {
  return {
    ...projectBaseCultivarForExplorer(cultivar),
    cultivarId: cultivar.cultivarId || cultivar.id,
    displayId: cultivar.displayId || cultivar.id,
    publicationClass: cultivar.publicationClass || 'reference-standard',
    publicationClassLabel: cultivar.publicationClassLabel || 'Reference Standard',
    evidenceDepth: cultivar.evidenceDepth || 'full-reference-standard',
    reviewDate: cultivar.reviewDate || null,
    mediaState: cultivar.mediaState || (cultivar.primaryMedia ? 'approved-primary' : 'governed-gap')
  };
}

export function explorerExportPayload(cultivars = [], state = {}, repository = {}) {
  const payload = baseExplorerExportPayload(cultivars, state, repository);
  payload.schemaVersion = '1.1.0';
  payload.explorerState.facets.publicationClass = classValue(state.publicationClass);
  payload.records = payload.records.map(record => {
    const cultivar = cultivars.find(item => item.slug === record.slug);
    return {
      ...record,
      cultivarId: cultivar?.cultivarId || cultivar?.id || record.id,
      publicationClass: cultivar?.publicationClass || 'reference-standard',
      evidenceDepth: cultivar?.evidenceDepth || 'full-reference-standard',
      mediaState: cultivar?.mediaState || null
    };
  });
  return payload;
}

export function explorerCsv(cultivars = [], selectedSlugs = []) {
  const selected = cultivars.filter(cultivar => selectedSlugs.includes(cultivar.slug));
  const baseLines = baseExplorerCsv(cultivars, selectedSlugs).split('\n');
  if (!baseLines.length) return '';
  const header = `${baseLines[0]},${csvCell('Stable cultivar ID')},${csvCell('Publication class')},${csvCell('Evidence depth')},${csvCell('Media state')}`;
  return [header, ...baseLines.slice(1).map((line, index) => {
    const cultivar = selected[index];
    return `${line},${csvCell(cultivar?.cultivarId || cultivar?.id)},${csvCell(cultivar?.publicationClassLabel || cultivar?.publicationClass)},${csvCell(cultivar?.evidenceDepth)},${csvCell(cultivar?.mediaState)}`;
  })].join('\n');
}

export function explorerLensFields(lens = 'overview') {
  const fields = baseExplorerLensFields(lens);
  return lens === 'identity'
    ? ['publicationClassLabel', 'cultivarId', ...fields, 'evidenceDepth']
    : fields;
}
