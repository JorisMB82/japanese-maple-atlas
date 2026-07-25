'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createContextualFacetCounts,
  describeSearchQuery,
  filterCultivars,
  sortCultivars,
  suggestSearchTerms
} from '@/lib/search';
import {
  EXPLORER_DEFAULT_STATE,
  EXPLORER_MAX_SELECTION,
  EXPLORER_PRESETS,
  applyExplorerPreset,
  buildExplorerSummary,
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

const FACETS = [
  ['habit', 'Growth habit'],
  ['leaf', 'Leaf form'],
  ['colour', 'Colour'],
  ['exposure', 'Exposure'],
  ['size', 'Scale'],
  ['risk', 'Cultivation risk']
];
const VIEW_LABELS = { gallery: 'Gallery', matrix: 'Trait matrix', seasonal: 'Seasonal', relationships: 'Relationships' };
const LENS_LABELS = { overview: 'Overview', identity: 'Identity', morphology: 'Morphology', seasonal: 'Seasonal', cultivation: 'Cultivation', evidence: 'Evidence' };
const FIELD_LABELS = {
  scientificName: 'Scientific name', species: 'Species', status: 'Status', diagnosticTraits: 'Diagnostic traits',
  habit: 'Growth habit', leafForm: 'Leaf form', bark: 'Bark / winter interest', sizeClass: 'Scale',
  springColor: 'Spring', summerColor: 'Summer', autumnColor: 'Autumn', light: 'Exposure',
  assertionCount: 'Assertions', evidenceCount: 'Evidence records', sourceCount: 'Sources', relationshipCount: 'Relationships'
};
const SAVED_KEY = 'atlas-explorer-saved-views-v1';

function conceptLabel(facets, category, id) {
  return (facets.semantic?.[category] || []).find(option => option.id === id)?.label || id;
}

function readSavedViews() {
  try {
    const value = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
    return Array.isArray(value) ? value.slice(0, 8) : [];
  } catch { return []; }
}

function downloadJson(filename, payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
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

function GalleryView({ records, state, onFocus, onToggle }) {
  return <div className="explorerGallery">{records.map(cultivar => <article className={`explorerRecordCard ${state.focus === cultivar.slug ? 'focused' : ''}`} key={cultivar.id}>
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
    <tbody>{records.map(cultivar => <tr key={cultivar.id} className={state.focus === cultivar.slug ? 'focusedRow' : ''}>
      <td><input aria-label={`Add ${cultivar.cultivar} to research set`} type="checkbox" checked={state.selected.includes(cultivar.slug)} onChange={() => onToggle(cultivar.slug)}/></td>
      <th scope="row"><button type="button" className="matrixCultivarButton" onClick={() => onFocus(cultivar.slug)}><code>{cultivar.id}</code><strong>{cultivar.cultivar}</strong><em>{cultivar.species}</em></button></th>
      {fields.map(field => <td key={field}>{displayValue(cultivar[field])}</td>)}
    </tr>)}</tbody>
  </table></div>;
}

function SeasonalView({ records, state, onFocus, onToggle }) {
  return <div className="explorerSeasonalGrid">{records.map(cultivar => <article key={cultivar.id} className={state.focus === cultivar.slug ? 'focused' : ''}>
    <header><button type="button" onClick={() => onFocus(cultivar.slug)}><code>{cultivar.id}</code><strong>{cultivar.cultivar}</strong><em>{cultivar.species}</em></button><label><input type="checkbox" checked={state.selected.includes(cultivar.slug)} onChange={() => onToggle(cultivar.slug)}/> Set</label></header>
    <div className="seasonalBand"><section><span>Spring</span><p>{cultivar.springColor}</p></section><section><span>Summer</span><p>{cultivar.summerColor}</p></section><section><span>Autumn</span><p>{cultivar.autumnColor}</p></section><section><span>Winter</span><p>{cultivar.bark}</p></section></div>
  </article>)}</div>;
}

function RelationshipView({ records, state, onFocus, onToggle }) {
  return <div className="explorerRelationshipList">{records.map(cultivar => <article key={cultivar.id} className={state.focus === cultivar.slug ? 'focused' : ''}>
    <header><button type="button" onClick={() => onFocus(cultivar.slug)}><code>{cultivar.id}</code><strong>{cultivar.cultivar}</strong><em>{cultivar.species}</em></button><label><input type="checkbox" checked={state.selected.includes(cultivar.slug)} onChange={() => onToggle(cultivar.slug)}/> Research set</label></header>
    <div className="relationshipStrip">{cultivar.relationships.length ? cultivar.relationships.map(relationship => <a key={relationship.id} href={`/graph?node=${cultivar.id}`}>
      <span><code>{relationship.id}</code><strong>{relationship.label}</strong></span>
      <span><b>{relationship.relatedCultivar}</b><small>{relationship.category} · strength {relationship.strength}/5 · {relationship.confidence}</small></span>
      <p>{relationship.rationale}</p>
    </a>) : <p className="graphMuted">No direct cultivar relationship.</p>}</div>
  </article>)}</div>;
}

function Inspector({ cultivar, onClose, selected, onToggle }) {
  if (!cultivar) return <aside className="explorerInspector empty"><div className="kicker">Record inspector</div><h2>Choose a cultivar</h2><p>Select a record from any view to inspect its governed traits, repository evidence and graph context.</p></aside>;
  return <aside className="explorerInspector">
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
  const [ready, setReady] = useState(false);

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

  const update = (key, value) => setState(current => normaliseExplorerState({ ...current, [key]: value }, slugs));
  const toggleSelection = slug => setState(current => ({ ...current, selected: toggleExplorerSelection(current.selected, slug) }));
  const applyPreset = id => setState(current => applyExplorerPreset(current, id, slugs));
  const reset = () => setState(normaliseExplorerState({}, slugs));

  const saveView = () => {
    const label = window.prompt('Name this explorer view', `Atlas view ${savedViews.length + 1}`)?.trim();
    if (!label) return;
    const item = { id: `${Date.now()}`, label: label.slice(0, 60), state };
    const next = [item, ...savedViews.filter(view => view.label !== item.label)].slice(0, 8);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    setSavedViews(next);
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
  const exportSet = () => {
    const payload = explorerExportPayload(projectedAll, state, manifest);
    downloadJson(`japanese-maple-atlas-set-${new Date().toISOString().slice(0, 10)}.json`, payload);
    setMessage(`Exported ${payload.records.length} governed record${payload.records.length === 1 ? '' : 's'}.`);
  };
  const compareUrl = state.selected.length >= 2 ? `/compare?a=${state.selected[0]}&b=${state.selected[1]}` : '/compare';

  return <div className="atlasExplorerWorkspace">
    <section className="explorerCommandBar" aria-label="Atlas explorer controls">
      <div className="explorerSearchRow">
        <label className="searchField"><span>Search the governed Atlas</span><input value={state.query} onChange={event => update('query', event.target.value)} placeholder='Try “laceleaf upright”, “coral bark” or species:"Acer shirasawanum"'/></label>
        <label><span>Species</span><select value={state.species} onChange={event => update('species', event.target.value)}><option>All</option>{facets.species.map(species => <option key={species} value={species}>{species} ({contextualCounts.species?.[species] || 0})</option>)}</select></label>
        <label><span>Sort</span><select value={state.sort} onChange={event => update('sort', event.target.value)}><option value="relevance">Relevance</option><option value="reference">Reference ID</option><option value="name">Cultivar name</option><option value="species">Species</option></select></label>
      </div>
      <div className="explorerFacetGrid">{FACETS.map(([key, label]) => <label key={key}><span>{label}</span><select value={state[key]} onChange={event => update(key, event.target.value)}><option value="All">All</option>{(facets.semantic?.[key] || []).map(option => <option key={option.id} value={option.id} disabled={!contextualCounts[key]?.[option.id] && state[key] !== option.id}>{option.label} ({contextualCounts[key]?.[option.id] || 0})</option>)}</select></label>)}</div>
      {queryAnalysis.labels.length > 0 && <div className="queryInterpretation"><strong>Interpreted as</strong>{queryAnalysis.labels.map(label => <span key={label}>{label}</span>)}</div>}
      <div className="explorerPresetBar"><span>Guided investigations</span>{EXPLORER_PRESETS.map(preset => <button type="button" key={preset.id} title={preset.description} onClick={() => applyPreset(preset.id)}>{preset.label}</button>)}</div>
      <div className="explorerDisplayBar">
        <div role="group" aria-label="Explorer view">{Object.entries(VIEW_LABELS).map(([id, label]) => <button type="button" className={state.view === id ? 'active' : ''} key={id} onClick={() => update('view', id)}>{label}</button>)}</div>
        <label><span>Analysis lens</span><select value={state.lens} onChange={event => update('lens', event.target.value)}>{Object.entries(LENS_LABELS).map(([id, label]) => <option key={id} value={id}>{label}</option>)}</select></label>
        <div className="explorerUtilities"><button type="button" onClick={copyLink}>Copy link</button><button type="button" onClick={saveView}>Save view</button><button type="button" onClick={reset}>Reset</button></div>
      </div>
      {savedViews.length > 0 && <div className="savedViewBar"><span>Saved in this browser</span>{savedViews.map(view => <span key={view.id}><button type="button" onClick={() => setState(normaliseExplorerState(view.state, slugs))}>{view.label}</button><button type="button" aria-label={`Delete saved view ${view.label}`} onClick={() => removeSaved(view.id)}>×</button></span>)}</div>}
      {message && <p className="explorerMessage" role="status">{message}</p>}
    </section>

    <section className="explorerStatusBar" aria-live="polite"><div><strong>{records.length}</strong><span>visible records</span></div><div><strong>{state.selected.length}</strong><span>in research set</span></div><div><strong>{manifest.objectTotal}</strong><span>repository objects</span></div><div><strong>{manifest.repositoryVersion}</strong><span>repository version</span></div></section>

    <div className={`explorerWorkspaceGrid ${focused ? 'withInspector' : ''}`}>
      <section className="explorerResults" aria-label={`${VIEW_LABELS[state.view]} results`}>
        {!records.length ? <div className="empty explorerNoResults"><h2>No governed records match</h2><p>Broaden the query or remove a facet. These suggestions use the controlled semantic vocabulary.</p><div className="searchSuggestions">{suggestions.map(suggestion => <button type="button" key={suggestion.query} onClick={() => update('query', suggestion.query)}><strong>{suggestion.label}</strong><span>{suggestion.query}</span></button>)}</div></div> : <>
          {state.view === 'gallery' && <GalleryView records={records} state={state} onFocus={slug => update('focus', slug)} onToggle={toggleSelection}/>} 
          {state.view === 'matrix' && <MatrixView records={records} lens={state.lens} state={state} onFocus={slug => update('focus', slug)} onToggle={toggleSelection}/>} 
          {state.view === 'seasonal' && <SeasonalView records={records} state={state} onFocus={slug => update('focus', slug)} onToggle={toggleSelection}/>} 
          {state.view === 'relationships' && <RelationshipView records={records} state={state} onFocus={slug => update('focus', slug)} onToggle={toggleSelection}/>} 
        </>}
      </section>
      <Inspector cultivar={focused} onClose={() => update('focus', '')} selected={Boolean(focused && state.selected.includes(focused.slug))} onToggle={toggleSelection}/>
    </div>

    {state.selected.length > 0 && <section className="explorerResearchTray" aria-label="Research set">
      <div className="researchTraySummary"><div><div className="kicker">Research set</div><strong>{summary.selectedCount}/{EXPLORER_MAX_SELECTION} cultivars</strong></div><div><span>{summary.speciesCount} species</span><span>{summary.assertionCount} assertions</span><span>{summary.evidenceCount} evidence records</span><span>{summary.relationshipCount} graph links</span></div></div>
      <div className="researchTrayRecords">{selectedRecords.map(cultivar => <button type="button" key={cultivar.slug} onClick={() => update('focus', cultivar.slug)}><code>{cultivar.id}</code><strong>{cultivar.cultivar}</strong><span onClick={event => { event.stopPropagation(); toggleSelection(cultivar.slug); }} aria-label={`Remove ${cultivar.cultivar}`}>×</span></button>)}</div>
      <div className="researchTrayActions"><a className={`button ${summary.comparisonReady ? '' : 'secondary'}`} href={compareUrl}>{summary.comparisonReady ? 'Compare first two' : 'Add one more to compare'}</a><button type="button" disabled={!summary.exportReady} onClick={exportSet}>Export governed JSON</button><button type="button" className="textButton" onClick={() => update('selected', [])}>Clear set</button></div>
    </section>}
  </div>;
}
