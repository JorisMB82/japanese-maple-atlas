import CultivarExplorer from '@/components/CultivarExplorer';
import { getCultivars, getRepositoryStats, getSearchFacets } from '@/lib/data';
import { queryExamples } from '@/lib/search';

export default function Home() {
  const cultivars = getCultivars();
  const stats = getRepositoryStats();
  const facets = getSearchFacets();

  return <>
    <section className="hero homeHero">
      <div>
        <div className="kicker">Sprint 8 · semantic discovery</div>
        <h1>Japanese maples, organized as evidence—not folklore.</h1>
        <p>Search canonical cultivar records through governed horticultural concepts, inspect why each result matched, and follow the evidence behind every profile.</p>
        <div className="heroActions"><a className="button" href="#directory-heading">Search cultivars</a><a className="button secondary" href="/editorial">Inspect editorial workflow</a></div>
      </div>
      <aside className="heroPanel">
        <span className="panelEyebrow">Governed knowledge repository</span>
        <div className="statGrid">
          <div><strong>{stats.cultivars}</strong><span>Cultivars</span></div>
          <div><strong>{stats.species}</strong><span>Species</span></div>
          <div><strong>{stats.assertions}</strong><span>Assertions</span></div>
          <div><strong>{stats.sources}</strong><span>Frozen sources</span></div>
        </div>
        <p>RC-001 through RC-005 remain frozen and hash-protected. Sprint 8 adds explainable semantic search without altering canonical botanical content.</p>
      </aside>
    </section>

    <div className="valueStrip">
      <div><strong>Semantic</strong><span>Common horticultural language maps to governed repository concepts.</span></div>
      <div><strong>Explainable</strong><span>Results identify the field or concept responsible for each match.</span></div>
      <div><strong>Qualified</strong><span>Search broadens discovery without erasing climatic or evidentiary limits.</span></div>
    </div>

    <div className="notice"><strong>Search status:</strong> semantic interpretation improves discovery but does not create new botanical claims. The five cultivar records remain canonical compiled outputs.</div>

    <CultivarExplorer cultivars={cultivars} facets={facets} examples={queryExamples()} />
  </>;
}
