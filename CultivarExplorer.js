'use client';
import { useMemo, useState } from 'react';
import StatusBadge from './StatusBadge';

export default function CultivarExplorer({ cultivars }) {
  const [query, setQuery] = useState('');
  const [species, setSpecies] = useState('All');
  const [habit, setHabit] = useState('All');
  const [leaf, setLeaf] = useState('All');
  const [sort, setSort] = useState('reference');

  const options = key => ['All', ...Array.from(new Set(cultivars.map(c => c[key]))).sort()];
  const filtered = useMemo(() => {
    const result = cultivars.filter(c => {
      const text = [c.id,c.cultivar,c.scientificName,c.summary,c.habit,c.leafForm,c.springColor,c.summerColor,c.autumnColor,...c.diagnosticTraits].join(' ').toLowerCase();
      return text.includes(query.trim().toLowerCase()) &&
        (species === 'All' || c.species === species) &&
        (habit === 'All' || c.habit === habit) &&
        (leaf === 'All' || c.leafForm === leaf);
    });
    return [...result].sort((a,b) => sort === 'name' ? a.cultivar.localeCompare(b.cultivar) : a.id.localeCompare(b.id));
  }, [cultivars, query, species, habit, leaf, sort]);

  const reset = () => { setQuery(''); setSpecies('All'); setHabit('All'); setLeaf('All'); setSort('reference'); };
  const active = query || species !== 'All' || habit !== 'All' || leaf !== 'All';

  return <section aria-labelledby="directory-heading">
    <div className="sectionHeading"><div><div className="kicker">Pilot collection</div><h2 id="directory-heading">Cultivar directory</h2></div><p>{filtered.length} of {cultivars.length} records</p></div>
    <div className="searchPanel">
      <label className="searchField"><span>Search the Atlas</span><input aria-label="Search cultivars" placeholder="Name, habit, leaf, color, trait…" value={query} onChange={e=>setQuery(e.target.value)} /></label>
      <div className="filterGrid">
        <label><span>Species</span><select value={species} onChange={e=>setSpecies(e.target.value)}>{options('species').map(x=><option key={x}>{x}</option>)}</select></label>
        <label><span>Habit</span><select value={habit} onChange={e=>setHabit(e.target.value)}>{options('habit').map(x=><option key={x}>{x}</option>)}</select></label>
        <label><span>Leaf form</span><select value={leaf} onChange={e=>setLeaf(e.target.value)}>{options('leafForm').map(x=><option key={x}>{x}</option>)}</select></label>
        <label><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="reference">Reference ID</option><option value="name">Cultivar name</option></select></label>
      </div>
      {active && <button className="textButton" type="button" onClick={reset}>Clear search and filters</button>}
    </div>
    {filtered.length ? <div className="cultivarGrid">{filtered.map(c =>
      <a className="cultivarCard" href={`/cultivars/${c.slug}`} key={c.id}>
        <div className="cardTop"><span className="referenceId">{c.id}</span><StatusBadge status={c.status} /></div>
        <div className="leafGlyph" aria-hidden="true">楓</div>
        <p className="speciesName"><em>{c.species}</em></p>
        <h3>{c.cultivar}</h3>
        <p>{c.summary}</p>
        <div className="traitLine"><span>{c.habit}</span><span>{c.leafForm}</span></div>
        <div className="cardAction">Open profile <span aria-hidden="true">→</span></div>
      </a>
    )}</div> : <div className="empty card"><h3>No matching cultivars</h3><p>Try a broader term or clear one of the filters.</p><button type="button" onClick={reset}>Reset filters</button></div>}
  </section>;
}
