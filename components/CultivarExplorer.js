'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  createContextualFacetCounts,
  describeSearchQuery,
  filterCultivars,
  sortCultivars,
  suggestSearchTerms
} from '@/lib/search';
import StatusBadge from './StatusBadge';
import MediaPlate from './MediaPlate';

const SEMANTIC_FILTERS = [
  ['habit', 'Growth habit'],
  ['leaf', 'Leaf form'],
  ['colour', 'Colour character'],
  ['exposure', 'Light tolerance'],
  ['size', 'Plant scale'],
  ['risk', 'Cultivation risk']
];

const initialState = {
  query: '',
  species: 'All',
  habit: 'All',
  leaf: 'All',
  colour: 'All',
  exposure: 'All',
  size: 'All',
  risk: 'All',
  sort: 'relevance'
};

const normalise = value => value || 'All';
const URL_KEYS = { query: 'q', species: 'species', habit: 'habit', leaf: 'leaf', colour: 'colour', exposure: 'exposure', size: 'size', risk: 'risk', sort: 'sort' };
const FIELD_LABELS = {
  id: 'reference ID', cultivar: 'cultivar name', scientificName: 'scientific name', species: 'species',
  summary: 'profile summary', habit: 'growth habit', leafForm: 'leaf form', light: 'light guidance',
  sizeClass: 'plant scale', springColor: 'spring colour', summerColor: 'summer colour',
  autumnColor: 'autumn colour', bark: 'bark', diagnosticTraits: 'diagnostic traits', status: 'record status'
};

function readUrlState() {
  if (typeof window === 'undefined') return initialState;
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(Object.entries(initialState).map(([key, fallback]) => [
    key,
    key === 'query' ? params.get(URL_KEYS[key]) || '' : normalise(params.get(URL_KEYS[key])) || fallback
  ]));
}

function writeUrlState(state) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) {
    if (key === 'query' && value) params.set(URL_KEYS[key], value);
    else if (key !== 'query' && value !== 'All' && !(key === 'sort' && value === 'relevance')) params.set(URL_KEYS[key], value);
  }
  window.history.replaceState({}, '', `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`);
}

function conceptLabel(facets, category, conceptId) {
  return (facets.semantic?.[category] || []).find(option => option.id === conceptId)?.label || conceptId;
}

function reasonLabel(reason) {
  if (reason.semantic && reason.conceptLabel) return reason.conceptLabel;
  return `Matched ${FIELD_LABELS[reason.field] || reason.field}`;
}

export default function CultivarExplorer({ cultivars, facets = {}, examples = [] }) {
  const [state, setState] = useState(initialState);
  const [compare, setCompare] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const urlState = readUrlState();
    setState(urlState);
    setShowAdvanced(['colour', 'exposure', 'size', 'risk'].some(key => urlState[key] !== 'All'));
    try { setCompare(JSON.parse(localStorage.getItem('atlas-compare') || '[]').slice(0, 2)); }
    catch { setCompare([]); }
  }, []);

  useEffect(() => { if (typeof window !== 'undefined') writeUrlState(state); }, [state]);
  useEffect(() => { if (typeof window !== 'undefined') localStorage.setItem('atlas-compare', JSON.stringify(compare)); }, [compare]);

  const filtered = useMemo(
    () => sortCultivars(filterCultivars(cultivars, state), state.sort),
    [cultivars, state]
  );
  const contextualCounts = useMemo(
    () => createContextualFacetCounts(cultivars, state),
    [cultivars, state]
  );
  const queryAnalysis = useMemo(() => describeSearchQuery(state.query), [state.query]);
  const suggestions = useMemo(() => suggestSearchTerms(state.query), [state.query]);

  const activeFilters = [
    ...(state.species !== 'All' ? [{ key: 'species', label: state.species }] : []),
    ...SEMANTIC_FILTERS.filter(([key]) => state[key] !== 'All').map(([key, label]) => ({
      key,
      label: `${label}: ${conceptLabel(facets, key, state[key])}`
    }))
  ];
  const active = Boolean(state.query || activeFilters.length || state.sort !== 'relevance');
  const update = (key, value) => setState(current => ({ ...current, [key]: value }));
  const clearFilter = key => update(key, 'All');
  const reset = () => setState(initialState);
  const toggle = slug => setCompare(current => current.includes(slug)
    ? current.filter(item => item !== slug)
    : current.length >= 2 ? [current[1], slug] : [...current, slug]);
  const compareUrl = compare.length ? `/compare?a=${compare[0] || ''}${compare[1] ? `&b=${compare[1]}` : ''}` : '/compare';

  return <section aria-labelledby="directory-heading">
    <div className="sectionHeading">
      <div><div className="kicker">Semantic repository discovery</div><h2 id="directory-heading">Cultivar explorer</h2></div>
      <p aria-live="polite">{filtered.length} of {cultivars.length} records</p>
    </div>

    <div className="searchPanel semanticSearchPanel">
      <div className="searchLeadRow">
        <label className="searchField">
          <span>Search names, traits, colours and governed concepts</span>
          <input
            aria-label="Search cultivars"
            placeholder='Try “laceleaf upright”, “weeping red” or leaf:laceleaf -habit:cascading'
            value={state.query}
            onChange={event => update('query', event.target.value)}
          />
        </label>
        <label className="speciesFilter">
          <span>Species</span>
          <select value={state.species} onChange={event => update('species', event.target.value)}>
            <option>All</option>
            {(facets.species || []).map(species => <option key={species} value={species}>{species} ({contextualCounts.species?.[species] || 0})</option>)}
          </select>
        </label>
      </div>

      {queryAnalysis.labels.length > 0 && <div className="queryInterpretation" aria-live="polite">
        <strong>Interpreted as</strong>
        {queryAnalysis.labels.map(label => <span key={label}>{label}</span>)}
        {queryAnalysis.exclusions.map(exclusion => <span className="excludedQuery" key={exclusion}>Exclude {exclusion.replace(/^-/, '')}</span>)}
      </div>}

      {examples.length > 0 && <div className="queryExamples">
        <span>Examples:</span>
        {examples.map(example => <button type="button" className="queryChip" key={example} onClick={() => update('query', example)}>{example}</button>)}
      </div>}

      <div className="semanticFilterGrid">
        {SEMANTIC_FILTERS.slice(0, showAdvanced ? SEMANTIC_FILTERS.length : 2).map(([key, label]) => <label key={key}>
          <span>{label}</span>
          <select value={state[key]} onChange={event => update(key, event.target.value)}>
            <option value="All">All</option>
            {(facets.semantic?.[key] || []).map(option => {
              const count = contextualCounts[key]?.[option.id] || 0;
              return <option key={option.id} value={option.id} disabled={count === 0 && state[key] !== option.id}>{option.label} ({count})</option>;
            })}
          </select>
        </label>)}
      </div>

      <div className="searchToolbar">
        <div className="searchToolbarLeft">
          <button className="textButton" type="button" onClick={() => setShowAdvanced(value => !value)}>{showAdvanced ? 'Hide advanced filters' : 'Show advanced filters'}</button>
          {active && <button className="textButton" type="button" onClick={reset}>Clear discovery state</button>}
        </div>
        <label className="sortControl">
          <span>Sort</span>
          <select value={state.sort} onChange={event => update('sort', event.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="reference">Reference ID</option>
            <option value="name">Cultivar name</option>
            <option value="species">Species</option>
          </select>
        </label>
      </div>

      {activeFilters.length > 0 && <div className="activeFilterBar" aria-label="Active filters">
        <span>Active filters</span>
        {activeFilters.map(filter => <button type="button" key={filter.key} onClick={() => clearFilter(filter.key)}>{filter.label} ×</button>)}
      </div>}
    </div>

    {compare.length > 0 && <div className="compareTray">
      <div><strong>Comparison tray</strong><span>{compare.length}/2 selected</span></div>
      <div className="compareTrayNames">{compare.map(slug => <button type="button" key={slug} onClick={() => toggle(slug)}>{cultivars.find(cultivar => cultivar.slug === slug)?.cultivar || slug} ×</button>)}</div>
      <a className={`button ${compare.length < 2 ? 'secondary' : ''}`} href={compareUrl}>{compare.length === 2 ? 'Compare selected' : 'Choose one more'}</a>
    </div>}

    {filtered.length ? <div className="cultivarGrid">{filtered.map(cultivar => <article className="cultivarCard discoveryCard mediaCultivarCard" key={cultivar.id}>
      <div className="cardTop"><span className="referenceId">{cultivar.id}</span><StatusBadge status={cultivar.status} /></div>
      <a className="cardMainLink" href={`/cultivars/${cultivar.slug}`}>
        <MediaPlate media={cultivar.primaryMedia} cultivar={cultivar} compact />
        <p className="speciesName"><em>{cultivar.species}</em></p>
        <h3>{cultivar.cultivar}</h3>
        <p>{cultivar.summary}</p>
        {cultivar._searchMeta?.matchReasons?.length > 0 && <div className="matchReasonLine" aria-label="Why this record matched">
          {cultivar._searchMeta.matchReasons.slice(0, 3).map((reason, index) => <span key={`${reason.field}-${index}`}>{reasonLabel(reason)}</span>)}
        </div>}
        <div className="traitLine"><span>{cultivar.habit}</span><span>{cultivar.leafForm}</span><span>{cultivar.autumnColor}</span></div>
      </a>
      <div className="cardFooterActions"><a href={`/cultivars/${cultivar.slug}`}>Open profile →</a><button type="button" className={compare.includes(cultivar.slug) ? 'selectedCompare' : ''} onClick={() => toggle(cultivar.slug)}>{compare.includes(cultivar.slug) ? 'Selected ✓' : 'Add to compare'}</button></div>
    </article>)}</div> : <div className="empty card searchEmptyState">
      <h3>No matching cultivars</h3>
      <p>The current query and filters do not match a governed record. Broaden the query, remove a filter, or try one of these controlled concepts.</p>
      <div className="searchSuggestions">{suggestions.map(suggestion => <button type="button" key={`${suggestion.query}-${suggestion.label}`} onClick={() => update('query', suggestion.query)}><strong>{suggestion.label}</strong><span>{suggestion.query}</span></button>)}</div>
      <button type="button" onClick={reset}>Reset discovery</button>
    </div>}
  </section>;
}
