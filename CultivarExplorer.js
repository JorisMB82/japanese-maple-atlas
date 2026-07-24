'use client';
import { useMemo, useState } from 'react';

export default function CultivarExplorer({ cultivars }) {
  const [query, setQuery] = useState('');
  const [species, setSpecies] = useState('All');
  const [habit, setHabit] = useState('All');
  const [leaf, setLeaf] = useState('All');

  const options = key => ['All', ...Array.from(new Set(cultivars.map(c => c[key]))).sort()];
  const filtered = useMemo(() => cultivars.filter(c => {
    const text = `${c.cultivar} ${c.scientificName} ${c.summary} ${c.diagnosticTraits.join(' ')}`.toLowerCase();
    return text.includes(query.toLowerCase()) &&
      (species === 'All' || c.species === species) &&
      (habit === 'All' || c.habit === habit) &&
      (leaf === 'All' || c.leafForm === leaf);
  }), [cultivars, query, species, habit, leaf]);

  return <>
    <div className="toolbar">
      <input aria-label="Search cultivars" placeholder="Search name, trait, color…" value={query} onChange={e=>setQuery(e.target.value)} />
      <select value={species} onChange={e=>setSpecies(e.target.value)}>{options('species').map(x=><option key={x}>{x}</option>)}</select>
      <select value={habit} onChange={e=>setHabit(e.target.value)}>{options('habit').map(x=><option key={x}>{x}</option>)}</select>
      <select value={leaf} onChange={e=>setLeaf(e.target.value)}>{options('leafForm').map(x=><option key={x}>{x}</option>)}</select>
    </div>
    <p className="muted">{filtered.length} of {cultivars.length} pilot cultivars</p>
    {filtered.length ? <div className="grid">{filtered.map(c =>
      <a className="cardLink" href={`/cultivars/${c.slug}`} key={c.id}><article className="card">
        <div className="kicker">{c.id} · {c.species}</div>
        <h2>{c.cultivar}</h2>
        <p className="muted"><em>{c.scientificName}</em></p>
        <p>{c.summary}</p>
        <div className="tags"><span className="tag">{c.habit}</span><span className="tag">{c.leafForm}</span><span className="tag">{c.autumnColor}</span></div>
      </article></a>
    )}</div> : <div className="empty card">No cultivars match the current filters.</div>}
  </>;
}
