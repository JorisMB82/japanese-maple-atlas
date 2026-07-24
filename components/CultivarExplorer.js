'use client';

import { useEffect, useMemo, useState } from 'react';
import StatusBadge from './StatusBadge';

const FILTERS = [
  ['species', 'Species'],
  ['habit', 'Habit'],
  ['leafForm', 'Leaf form'],
  ['light', 'Light'],
  ['sizeClass', 'Size'],
  ['autumnColor', 'Autumn colour']
];

const initialState = {
  query: '',
  species: 'All',
  habit: 'All',
  leafForm: 'All',
  light: 'All',
  sizeClass: 'All',
  autumnColor: 'All',
  sort: 'relevance'
};

const normalize = value => value || 'All';

function readUrlState() {
  if (typeof window === 'undefined') return initialState;
  const params = new URLSearchParams(window.location.search);
  return {
    ...initialState,
    query: params.get('q') || '',
    species: normalize(params.get('species')),
    habit: normalize(params.get('habit')),
    leafForm: normalize(params.get('leaf')),
    light: normalize(params.get('light')),
    sizeClass: normalize(params.get('size')),
    autumnColor: normalize(params.get('autumn')),
    sort: params.get('sort') || 'relevance'
  };
}

function writeUrlState(state) {
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.species !== 'All') params.set('species', state.species);
  if (state.habit !== 'All') params.set('habit', state.habit);
  if (state.leafForm !== 'All') params.set('leaf', state.leafForm);
  if (state.light !== 'All') params.set('light', state.light);
  if (state.sizeClass !== 'All') params.set('size', state.sizeClass);
  if (state.autumnColor !== 'All') params.set('autumn', state.autumnColor);
  if (state.sort !== 'relevance') params.set('sort', state.sort);
  const url = `${window.location.pathname}${params.toString() ? `?${params}` : ''}${window.location.hash}`;
  window.history.replaceState({}, '', url);
}

function includes(value, expected) {
  return expected === 'All' || String(value || '').toLowerCase().includes(String(expected).toLowerCase());
}

function score(cultivar, query) {
  if (!query.trim()) return 0;
  const terms = query.toLowerCase().match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  let total = 0;
  const haystack = [
    cultivar.id,
    cultivar.cultivar,
    cultivar.scientificName,
    cultivar.species,
    cultivar.summary,
    cultivar.habit,
    cultivar.leafForm,
    cultivar.light,
    cultivar.sizeClass,
    cultivar.springColor,
    cultivar.summerColor,
    cultivar.autumnColor,
    cultivar.bark,
    ...(cultivar.diagnosticTraits || [])
  ].join(' ').toLowerCase();

  for (const rawTerm of terms) {
    const term = rawTerm.replace(/^"|"$/g, '');
    const separator = term.indexOf(':');
    if (separator > 0) {
      const fieldName = term.slice(0, separator);
      const value = term.slice(separator + 1);
      const map = { species:'species', habit:'habit', leaf:'leafForm', light:'light', size:'sizeClass', autumn:'autumnColor', bark:'bark' };
      const field = map[fieldName];
      if (!field || !String(cultivar[field] || '').toLowerCase().includes(value)) return -1;
      total += 45;
      continue;
    }

    if (!haystack.includes(term)) return -1;
    if (cultivar.cultivar.toLowerCase() === term || cultivar.id.toLowerCase() === term) total += 120;
    else if (cultivar.cultivar.toLowerCase().startsWith(term)) total += 80;
    else if (cultivar.cultivar.toLowerCase().includes(term)) total += 55;
    else total += 10;
  }
  return total;
}

export default function CultivarExplorer({ cultivars, facets = {}, examples = [] }) {
  const [state, setState] = useState(initialState);
  const [compare, setCompare] = useState([]);

  useEffect(() => {
    setState(readUrlState());
    try {
      setCompare(JSON.parse(window.localStorage.getItem('atlas-compare') || '[]').slice(0, 2));
    } catch {
      setCompare([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') writeUrlState(state);
  }, [state]);

  useEffect(() => {
    if (typeof window !== 'undefined') window.localStorage.setItem('atlas-compare', JSON.stringify(compare));
  }, [compare]);

  const filtered = useMemo(() => {
    const result = cultivars
      .map(c => ({ ...c, _score: score(c, state.query) }))
      .filter(c => c._score >= 0)
      .filter(c => includes(c.species, state.species))
      .filter(c => includes(c.habit, state.habit))
      .filter(c => includes(c.leafForm, state.leafForm))
      .filter(c => includes(c.light, state.light))
      .filter(c => includes(c.sizeClass, state.sizeClass))
      .filter(c => includes(c.autumnColor, state.autumnColor));

    return result.sort((a, b) => {
      if (state.sort === 'name') return a.cultivar.localeCompare(b.cultivar);
      if (state.sort === 'species') return a.species.localeCompare(b.species) || a.cultivar.localeCompare(b.cultivar);
      if (state.sort === 'reference') return a.id.localeCompare(b.id);
      return b._score - a._score || a.id.localeCompare(b.id);
    });
  }, [cultivars, state]);

  const activeFilters = FILTERS.filter(([key]) => state[key] !== 'All');
  const active = state.query || activeFilters.length || state.sort !== 'relevance';

  const update = (key, value) => setState(current => ({ ...current, [key]: value }));
  const reset = () => setState(initialState);

  const toggleCompare = slug => {
    setCompare(current => {
      if (current.includes(slug)) return current.filter(item => item !== slug);
      if (current.length >= 2) return [current[1], slug];
      return [...current, slug];
    });
  };

  const compareUrl = compare.length
    ? `/compare?a=${compare[0] || ''}${compare[1] ? `&b=${compare[1]}` : ''}`
    : '/compare';

  return <section aria-labelledby="directory-heading">
    <div className="sectionHeading">
      <div><div className="kicker">Repository discovery</div><h2 id="directory-heading">Cultivar explorer</h2></div>
      <p>{filtered.length} of {cultivars.length} records</p>
    </div>

    <div className="searchPanel advancedSearchPanel">
      <label className="searchField">
        <span>Search names, traits, colours, and structured fields</span>
        <input
          aria-label="Search cultivars"
          placeholder='Try “red upright” or habit:weeping'
          value={state.query}
          onChange={event => update('query', event.target.value)}
        />
      </label>

      {examples.length > 0 && <div className="queryExamples" aria-label="Example searches">
        <span>Examples:</span>
        {examples.map(example => <button type="button" className="queryChip" key={example} onClick={() => update('query', example)}>{example}</button>)}
      </div>}

      <div className="filterGrid filterGridSix">
        {FILTERS.map(([key, label]) => <label key={key}>
          <span>{label}</span>
          <select value={state[key]} onChange={event => update(key, event.target.value)}>
            <option>All</option>
            {(facets[key] || []).map(option => <option key={option}>{option}</option>)}
          </select>
        </label>)}
      </div>

      <div className="searchToolbar">
        <label className="sortControl">
          <span>Sort</span>
          <select value={state.sort} onChange={event => update('sort', event.target.value)}>
            <option value="relevance">Relevance</option>
            <option value="reference">Reference ID</option>
            <option value="name">Cultivar name</option>
            <option value="species">Species</option>
          </select>
        </label>
        {active && <button className="textButton" type="button" onClick={reset}>Clear discovery state</button>}
      </div>

      {(state.query || activeFilters.length > 0) && <div className="activeFilterBar">
        {state.query && <button type="button" onClick={() => update('query', '')}>Search: {state.query} ×</button>}
        {activeFilters.map(([key, label]) => <button type="button" key={key} onClick={() => update(key, 'All')}>{label}: {state[key]} ×</button>)}
      </div>}
    </div>

    {compare.length > 0 && <div className="compareTray">
      <div>
        <strong>Comparison tray</strong>
        <span>{compare.length}/2 selected</span>
      </div>
      <div className="compareTrayNames">
        {compare.map(slug => {
          const cultivar = cultivars.find(c => c.slug === slug);
          return <button type="button" key={slug} onClick={() => toggleCompare(slug)}>{cultivar?.cultivar || slug} ×</button>;
        })}
      </div>
      <a className={`button ${compare.length < 2 ? 'secondary' : ''}`} href={compareUrl}>
        {compare.length === 2 ? 'Compare selected' : 'Choose one more'}
      </a>
    </div>}

    {filtered.length ? <div className="cultivarGrid">{filtered.map(c =>
      <article className="cultivarCard discoveryCard" key={c.id}>
        <div className="cardTop"><span className="referenceId">{c.id}</span><StatusBadge status={c.status} /></div>
        <a className="cardMainLink" href={`/cultivars/${c.slug}`}>
          <div className="leafGlyph" aria-hidden="true">楓</div>
          <p className="speciesName"><em>{c.species}</em></p>
          <h3>{c.cultivar}</h3>
          <p>{c.summary}</p>
          <div className="traitLine"><span>{c.habit}</span><span>{c.leafForm}</span><span>{c.autumnColor}</span></div>
        </a>
        <div className="cardFooterActions">
          <a href={`/cultivars/${c.slug}`}>Open profile →</a>
          <button type="button" className={compare.includes(c.slug) ? 'selectedCompare' : ''} onClick={() => toggleCompare(c.slug)}>
            {compare.includes(c.slug) ? 'Selected ✓' : 'Add to compare'}
          </button>
        </div>
      </article>
    )}</div> : <div className="empty card">
      <h3>No matching cultivars</h3>
      <p>The current pilot contains only five records. Try a broader term, remove a structured field, or clear one of the filters.</p>
      <button type="button" onClick={reset}>Reset discovery</button>
    </div>}
  </section>;
}
