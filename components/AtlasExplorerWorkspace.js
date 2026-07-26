'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createContextualFacetCounts,
  describeSearchQuery,
  filterCultivars,
  sortCultivars,
  suggestSearchTerms
} from '@/lib/search';
import {
  EXPLORER_MAX_SELECTION,
  EXPLORER_PRESETS,
  applyExplorerPreset,
  buildExplorerSummary,
  createSavedExplorerView,
  explorerCsv,
  explorerExportPayload,
  explorerFilterState,
  explorerLensFields,
  normaliseExplorerState,
  parseExplorerSearchParams,
  projectCultivarForExplorer,
  serialiseExplorerState,
  toggleExplorerSelection
} from '@/lib/atlas-explorer.mjs';
import MediaPlate from './MediaPlate';
import StatusBadge from './StatusBadge';

const COMMON_FACETS = [
  ['habit', 'Growth habit'],
  ['leaf', 'Leaf form'],
  ['colour', 'Foliage colour']
];
const ADVANCED_FACETS = [
  ['exposure', 'Sun and shade'],
  ['size', 'Mature scale'],
  ['risk', 'Growing considerations']
];
const VIEW_LABELS = { gallery: 'Gallery', matrix: 'Trait table', seasonal: 'Seasons', relationships: 'Relationships' };
const LENS_LABELS = { overview: 'Overview', identity: 'Identity', morphology: 'Form and foliage', seasonal: 'Seasonal colour', cultivation: 'Growing context', evidence: 'Evidence' };
const FIELD_LABELS = {
  scientificName: 'Scientific name', species: 'Species', status: 'Status', diagnosticTraits: 'Diagnostic traits',
  habit: 'Growth habit', leafForm: 'Leaf form', bark: 'Bark / winter interest', sizeClass: 'Scale',
  springColor: 'Spring', summerColor: 'Summer', autumnColor: 'Autumn', light: 'Exposure',
  assertionCount: 'Assertions', evidenceCount: 'Evidence records', sourceCount: 'Sources', relationshipCount: 'Relationships'
};
const SAVED_KEY = 'atlas-explorer-saved-views-v1';

function readSavedViews() {
  try {
    const value = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(value) ? value.slice(0, 8) : [];
  } catch { return []; }
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function displayValue(value) {
  if (Array.isArray(value)) return value.join('; ');
  if (typeof value === 'number') return value.toLocaleString();
  return value || '—';
}

function FacetSelect({ facets, contextualCounts, state, facet, onChange }) {
  const [key, label] = facet;
  return <label><span>{label}</span><select value={state[key]} onChange={event => onChange(key, event.target.value)}><option value="All">All</option>{(facets.semantic?.[key] || []).map(option => <option key={option.id} value={option.id} disabled={!contextualCounts[key]?.[option.id] && state[key] !== option.id}>{option.label} ({contextualCounts[key]?.[option.id] || 0})</option>)}</select></label>;
}

function GalleryView({ records, state, onFocus, onToggle }) {
  return <div className="explorerGallery">{records.map(cultivar => <article className={`explorerRecordCard ${state.focus === cultivar.slug ? 'focused' : ''} ${state.selected.includes(cultivar.slug) ? 'selectedForResearch' : ''}`} key={cultivar.id}>
    <button type="button" className="explorerCardFocus" onClick={() => onFocus(cultivar.slug)} aria-label={`Inspect ${cultivar.cultivar}`}>
      <MediaPlate media={cultivar.primaryMedia} cultivar={cultivar} compact />
      <div className="explorerCardHeader"><code>{cultivar.id}</code><StatusBadge status={cultivar.status}/></div>
      <p className="speciesName"><em>{cultivar.species}</em></p>
      <h3>{cultivar.cultivar}</h3>
      <p>{cultivar.summary}</p>
      <div className="traitLine"><span>{cultivar.habit}</span><span>{cultivar.leafForm}</span></div>
    </button>
    <div className="explorerCardActions">
      <label><input type="checkbox" checked={state.selected.includes(cultivar.slug)} onChange={() => onToggle(cultivar.slug)}/> Add to research set</label>
      <a href={`/cultivars/${cultivar.slug}`}>Profile →</a>
    </div>
  </article>)}</div>;
}

function MatrixView({ records, lens, state, onFocus, onToggle }) {
  const fields = explorerLensFields(lens);
  return <div className="tableWrap explorerMatrixWrap"><table className="explorerMatrix">
    <thead><tr><th scope="col">Set</th><th scope="col">Cultivar</th>{fields.map(field => <th scope="col" key={field}>{FIELD_LABELS[field] || field}</th>)}</tr></thead>
    <tbody>{records.map(cultivar => <tr key={cultivar.id} className={`${state.focus === cultivar.slug ? 'focusedRow' : ''} ${state.selected.includes(cultivar.slug) ? 'selectedForResearch' : ''}`}>
      <td><input aria-label={`Add ${cultivar.cultivar} to research set`} type="checkbox" checked={state.selected.includes(cultivar.slug)} onChange={() => onToggle(cultivar.slug)}/></td>
      <th scope="row"><button type="button" className="matrixCultivarButton" onClick={() => onFocus(cultivar.slug)}><code>{cultivar.id}</code><strong>{cultivar.cultivar}</strong><em>{cultivar.species}</em></button></th>
      {fields.map(field => <td key={field}>{displayValue(cultivar[field])}</td>)}
    </tr>)}</tbody>
  </table></div>;
}

function SeasonalView({ records, state, onFocus, onToggle }) {
  return <div className="explorerSeasonalGrid">{records.map(cultivar => <article key={cultivar.id} className={`${state.focus === cultivar.slug ? 'focused' : ''} ${state.selected.includes(cultivar.slug) ? 'selectedForResearch' : ''}`}>
    <header><button type="button" onClick={() => onFocus(cultivar.slug)}><code>{cultivar.id}</code><strong>{cultivar.cultivar}</strong><em>{cultivar.species}</em></button><label><input type="checkbox" checked={state.selected.includes(cultivar.slug)} onChange={() => onToggle(cultivar.slug)}/> Add to set</label></header>
    <div className="seasonalBand"><section><span>Spring</span><p>{cultivar.springColor}</p></section><section><span>Summer</span><p>{cultivar.summerColor}</p></section><section><span>Autumn</span><p>{cultivar.autumnColor}</p></section><section><span>Winter</span><p>{cultivar.bark}</p></section></div>
  </article>)}</div>;
}

function RelationshipView({ records, state, onFocus, onToggle }) {
  return <div className="explorerRelationshipList">{records.map(cultivar => <article key={cultivar.id} className={`${state.focus === cultivar.slug ? 'focused' : ''} ${state.selected.includes(cultivar.slug) ? 'selectedForResearch' : ''}`}>
    <header><button type="button" onClick={() => onFocus(cultivar.slug)}><code>{cultivar.id}</code><strong>{cultivar.cultivar}</strong><em>{cultivar.species}</em></button><label><input type="checkbox" checked={state.selected.includes(cultivar.slug)} onChange={() => onToggle(cultivar.slug)}/> Add to set</label></header>
    <div className="relationshipStrip">{cultivar.relationships.length ? cultivar.relationships.map(relationship => <a key={relationship.id} href={`/graph?node=${cultivar.id}`}>
      <span><code>{relationship.id}</code><strong>{relationship.label}</strong></span>
      <span><b>{relationship.relatedCultivar}</b><small>{relationship.category} · strength {relationship.strength}/5 · {relationship.confidence}</small></span>
      <p>{relationship.rationale}</p>
    </a>) : <p className="graphMuted">No direct cultivar relationship.</p>}</div>
  </article>)}</div>;
}

function Inspector({ cultivar, onClose, selected, onToggle }) {
  if (!cultivar) return null;
  return <aside className="explorerInspector">
    <button type="button" className="inspectorBack" onClick={onClose}>← Back to results</button>
    <div className="inspectorTop"><div><div className="kicker">Focused record · {cultivar.id}</div><h2>{cultivar.cultivar}</h2><p><em>{cultivar.scientificName}</em></p></div><button type="button" className="inspectorClose" aria-label="Close record inspector" onClick={onClose}>×</button></div>
    <p>{cultivar.summary}</p>
    <dl className="inspectorTraits"><dt>Habit</dt><dd>{cultivar.habit}</dd><dt>Leaf form</dt><dd>{cultivar.leafForm}</dd><dt>Exposure</dt><dd>{cultivar.light}</dd><dt>Scale</dt><dd>{cultivar.sizeClass}</dd></dl>
    <div className="inspectorMetrics"><span><strong>{cultivar.assertionCount}</strong> assertions</span><span><strong>{cultivar.evidenceCount}</strong> evidence records</span><span><strong>{cultivar.relationshipCount}</strong> cultivar links</span></div>
    <div className="inspectorActions"><button type="button" onClick={() => onToggle(cultivar.slug)}>{selected ? 'Remove from set' : 'Add to research set'}</button><a className="button secondary" href={`/cultivars/${cultivar.slug}`}>Full profile</a><a className="button secondary" href={`/graph?node=${cultivar.id}`}>Graph node</a></div>
  </aside>;
}

export default function AtlasExplorerWorkspace({ cultivars, facets, manifest }) {
  const slugs = useMemo(() => cultivars.map(cultivar => cultivar.slug), [cultivars]);
  const projectedAll = useMemo(() => cultivars.map(projectCultivarForExplorer), [cultivars]);
  const [state, setState] = useState(() => normaliseExplorerState({}, slugs));
  const [savedViews, setSavedViews] = useState([]);
  const [message, setMessage] = useState('');
  const [saveName, setSaveName] = useState('');
  const [ready, setReady] = useState(false);
  const saveDialog = useRef(null);
  const exportDialog = useRef(null);

  useEffect(() => {
    setState(parseExplorerSearchParams(window.location.search, slugs));
    setSavedViews(readSavedViews());
    setReady(true);
  }, [slugs]);

  useEffect(() => {
    if (!ready) return;
    const query = serialiseExplorerState(state, slugs);
    window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`);
  }, [ready, slugs, state]);

  const filteredHydrated = useMemo(() => sortCultivars(filterCultivars(cultivars, explorerFilterState(state)), state.sort), [cultivars, state]);
  const records = useMemo(() => filteredHydrated.map(projectCultivarForExplorer), [filteredHydrated]);
  const contextualCounts = useMemo(() => createContextualFacetCounts(cultivars, explorerFilterState(state)), [cultivars, state]);
  const focused = projectedAll.find(cultivar => cultivar.slug === state.focus);
  const selectedRecords = projectedAll.filter(cultivar => state.selected.includes(cultivar.slug));
  const summary = buildExplorerSummary(projectedAll, state.selected);
  const queryAnalysis = useMemo(() => describeSearchQuery(state.query), [state.query]);
  const suggestions = useMemo(() => suggestSearchTerms(state.query), [state.query]);
  const compareARecord = projectedAll.find(cultivar => cultivar.slug === state.compareA);
  const compareBRecord = projectedAll.find(cultivar => cultivar.slug === state.compareB);

  const update = (key, value) => setState(current => normaliseExplorerState({ ...current, [key]: value }, slugs));
  const toggleSelection = slug => setState(current => normaliseExplorerState({ ...current, selected: toggleExplorerSelection(current.selected, slug) }, slugs));
  const applyPreset = id => setState(current => applyExplorerPreset(current, id, slugs));
  const reset = () => setState(normaliseExplorerState({}, slugs));

  const openSaveDialog = () => {
    setSaveName(`Atlas view ${savedViews.length + 1}`);
    saveDialog.current?.showModal();
  };
  const saveView = event => {
    event.preventDefault();
    const item = createSavedExplorerView(saveName, state);
    if (!item) return;
    const next = [item, ...savedViews.filter(view => view.label !== item.label)].slice(0, 8);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSavedViews(next);
    saveDialog.current?.close();
    setMessage(`Saved “${item.label}” in this browser.`);
  };
  const removeSaved = id => {
    const next = savedViews.filter(view => view.id !== id);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSavedViews(next);
  };
  const copyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setMessage('Shareable explorer link copied.'); }
    catch { setMessage('Copy was unavailable. Use the current browser address.'); }
  };
  const exportJson = () => {
    const payload = explorerExportPayload(projectedAll, state, manifest);
    downloadFile(`japanese-maple-atlas-set-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(payload, null, 2), 'application/json');
    exportDialog.current?.close();
    setMessage(`Exported ${payload.records.length} record${payload.records.length === 1 ? '' : 's'} as governed JSON.`);
  };
  const exportCsv = () => {
    downloadFile(`japanese-maple-atlas-set-${new Date().toISOString().slice(0, 10)}.csv`, explorerCsv(projectedAll, state.selected), 'text/csv;charset=utf-8');
    exportDialog.current?.close();
    setMessage(`Exported ${state.selected.length} record${state.selected.length === 1 ? '' : 's'} as a readable CSV.`);
  };
  const printSet = () => {
    exportDialog.current?.close();
    document.body.classList.add('printingResearchSet');
    const cleanup = () => document.body.classList.remove('printingResearchSet');
    window.addEventListener('afterprint', cleanup, { once: true });
    window.print();
    window.setTimeout(cleanup, 1000);
  };
  const compareUrl = summary.comparisonReady ? `/compare?a=${state.compareA}&b=${state.compareB}` : '/compare';

  return <div className="atlasExplorerWorkspace">
    <section className="explorerCommandBar" aria-label="Atlas explorer controls">
      <div className="explorerSearchRow">
        <label className="searchField"><span>What are you looking for?</span><input value={state.query} onChange={event => update('query', event.target.value)} placeholder='Try “upright laceleaf”, “coral bark” or “partial shade”'/></label>
        <label><span>Species</span><select value={state.species} onChange={event => update('species', event.target.value)}><option>All</option>{facets.species.map(species => <option key={species} value={species}>{species} ({contextualCounts.species?.[species] || 0})</option>)}</select></label>
        <label><span>Sort results</span><select value={state.sort} onChange={event => update('sort', event.target.value)}><option value="relevance">Best match</option><option value="reference">Reference ID</option><option value="name">Cultivar name</option><option value="species">Species</option></select></label>
      </div>
      <div className="explorerCommonFacetGrid">{COMMON_FACETS.map(facet => <FacetSelect key={facet[0]} facets={facets} contextualCounts={contextualCounts} state={state} facet={facet} onChange={update}/>)}</div>
      <details className="explorerAdvancedFilters"><summary>More filters</summary><div className="explorerAdvancedFacetGrid">{ADVANCED_FACETS.map(facet => <FacetSelect key={facet[0]} facets={facets} contextualCounts={contextualCounts} state={state} facet={facet} onChange={update}/>)}</div></details>
      {queryAnalysis.labels.length > 0 && <div className="queryInterpretation"><strong>Search understood as</strong>{queryAnalysis.labels.map(label => <span key={label}>{label}</span>)}</div>}
      <details className="explorerGuided"><summary>Try a guided starting point</summary><p>Examples apply a useful search and view; your research set is preserved.</p><div className="explorerPresetBar">{EXPLORER_PRESETS.map(preset => <button type="button" key={preset.id} title={preset.description} onClick={() => applyPreset(preset.id)}>{preset.label}</button>)}</div></details>
      <div className={`explorerDisplayBar ${state.view === 'matrix' ? 'withAnalysis' : ''}`}>
        <div role="group" aria-label="Explorer view">{Object.entries(VIEW_LABELS).map(([id, label]) => <button type="button" className={state.view === id ? 'active' : ''} aria-pressed={state.view === id} key={id} onClick={() => update('view', id)}>{label}</button>)}</div>
        {state.view === 'matrix' && <label className="analysisOptions"><span>Columns to show</span><select value={state.lens} onChange={event => update('lens', event.target.value)}>{Object.entries(LENS_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>}
        <div className="explorerUtilities"><button type="button" onClick={copyLink}>Copy link</button><button type="button" onClick={openSaveDialog}>Save view</button><button type="button" onClick={reset}>Reset</button></div>
      </div>
      {savedViews.length > 0 && <div className="savedViewBar"><span>Saved in this browser</span>{savedViews.map(view => <span key={view.id}><button type="button" onClick={() => setState(normaliseExplorerState(view.state, slugs))}>{view.label}</button><button type="button" aria-label={`Delete saved view ${view.label}`} onClick={() => removeSaved(view.id)}>×</button></span>)}</div>}
      {message && <p className="explorerMessage" role="status">{message}</p>}
    </section>

    <section className="explorerStatusBar" aria-live="polite"><div><strong>{records.length}</strong><span>cultivar{records.length === 1 ? '' : 's'} shown</span></div><div><strong>{state.selected.length}</strong><span>saved for research</span></div><details><summary>Data and evidence details</summary><p>Repository v{manifest.repositoryVersion} · {manifest.objectTotal} verified objects. Search, saved views and exports do not change the source records.</p></details></section>

    <div className={`explorerWorkspaceGrid ${focused ? 'withInspector' : ''}`}>
      <section className="explorerResults" id="explorer-results" aria-label={`${VIEW_LABELS[state.view]} results`}>
        {!records.length ? <div className="empty explorerNoResults"><h2>No cultivars match these choices</h2><p>Try a broader search or remove a filter.</p><div className="searchSuggestions">{suggestions.map(suggestion => <button type="button" key={suggestion.query} onClick={() => update('query', suggestion.query)}><strong>{suggestion.label}</strong><span>{suggestion.query}</span></button>)}</div><button type="button" className="button secondary" onClick={reset}>Clear all filters</button></div> : <>
          {state.view === 'gallery' && <GalleryView records={records} state={state} onFocus={slug => update('focus', slug)} onToggle={toggleSelection}/>} 
          {state.view === 'matrix' && <MatrixView records={records} lens={state.lens} state={state} onFocus={slug => update('focus', slug)} onToggle={toggleSelection}/>} 
          {state.view === 'seasonal' && <SeasonalView records={records} state={state} onFocus={slug => update('focus', slug)} onToggle={toggleSelection}/>} 
          {state.view === 'relationships' && <RelationshipView records={records} state={state} onFocus={slug => update('focus', slug)} onToggle={toggleSelection}/>} 
        </>}
      </section>
      <Inspector cultivar={focused} onClose={() => update('focus', '')} selected={Boolean(focused && state.selected.includes(focused.slug))} onToggle={toggleSelection}/>
    </div>

    {state.selected.length > 0 && <section className="explorerResearchTray" aria-label="Research set">
      <div className="researchTraySummary"><div><div className="kicker">Research set</div><strong>{summary.selectedCount}/{EXPLORER_MAX_SELECTION} cultivars</strong><small>A temporary group for comparison and export.</small></div><div><span>{summary.speciesCount} species</span><span>{summary.assertionCount} assertions</span><span>{summary.evidenceCount} evidence records</span></div></div>
      <div className="researchTrayRecords">{selectedRecords.map(cultivar => <span key={cultivar.slug}><button type="button" className="researchRecordFocus" onClick={() => update('focus', cultivar.slug)}><code>{cultivar.id}</code><strong>{cultivar.cultivar}</strong></button><button type="button" className="researchRecordRemove" onClick={() => toggleSelection(cultivar.slug)} aria-label={`Remove ${cultivar.cultivar} from research set`}>×</button></span>)}</div>
      {summary.comparisonReady && <fieldset className="comparisonPairChooser"><legend>Pair to compare</legend><label><span>A</span><select aria-label="First cultivar to compare" value={state.compareA} onChange={event => update('compareA', event.target.value)}>{selectedRecords.map(cultivar => <option key={cultivar.slug} value={cultivar.slug}>{cultivar.cultivar}</option>)}</select></label><label><span>B</span><select aria-label="Second cultivar to compare" value={state.compareB} onChange={event => update('compareB', event.target.value)}>{selectedRecords.filter(cultivar => cultivar.slug !== state.compareA).map(cultivar => <option key={cultivar.slug} value={cultivar.slug}>{cultivar.cultivar}</option>)}</select></label></fieldset>}
      <div className="researchTrayActions"><a className={`button ${summary.comparisonReady ? '' : 'secondary'}`} href={compareUrl}>{summary.comparisonReady ? `Compare ${compareARecord?.cultivar} + ${compareBRecord?.cultivar}` : 'Add one more to compare'}</a><button type="button" disabled={!summary.exportReady} onClick={() => exportDialog.current?.showModal()}>Export research set</button><button type="button" className="textButton" onClick={() => update('selected', [])}>Clear set</button></div>
    </section>}

    <dialog ref={saveDialog} className="atlasDialog" aria-labelledby="save-view-title"><form method="dialog" onSubmit={saveView}><div className="kicker">Saved view</div><h2 id="save-view-title">Name this Explorer view</h2><p>This saves the current search, filters, view and research set in this browser only.</p><label><span>View name</span><input autoFocus maxLength="60" value={saveName} onChange={event => setSaveName(event.target.value)} required/></label><div className="dialogActions"><button type="button" className="button secondary" onClick={() => saveDialog.current?.close()}>Cancel</button><button type="submit">Save view</button></div></form></dialog>

    <dialog ref={exportDialog} className="atlasDialog" aria-labelledby="export-title"><div className="kicker">Research set</div><h2 id="export-title">Choose an export format</h2><p>Readable formats are intended for garden planning and discussion. JSON retains the governed repository provenance for data use.</p><div className="exportChoices"><button type="button" onClick={printSet}><strong>Print / save as PDF</strong><span>Human-readable browser summary</span></button><button type="button" onClick={exportCsv}><strong>Download CSV</strong><span>Open in a spreadsheet</span></button><button type="button" onClick={exportJson}><strong>Download JSON</strong><span>Machine-readable with provenance</span></button></div><div className="dialogActions"><button type="button" className="button secondary" onClick={() => exportDialog.current?.close()}>Cancel</button></div></dialog>
  </div>;
}
