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
        <div className="kicker">Sprint 10 · interactive Atlas explorer</div>
        <h1>Japanese maples, organized as evidence—not folklore.</h1>
        <p>Search canonical cultivar records here, or open the integrated explorer to move across traits, seasonal expression, relationships, evidence and research sets in one workspace.</p>
        <div className="heroActions"><a className="button" href="/explorer">Open interactive explorer</a><a className="button secondary" href="#directory-heading">Quick search</a><a className="button secondary" href="/graph">Explore knowledge graph</a></div>
      </div>
      <aside className="heroPanel">
        <span className="panelEyebrow">Governed knowledge repository</span>
        <div className="statGrid">
          <div><strong>{stats.cultivars}</strong><span>Cultivars</span></div>
          <div><strong>{stats.species}</strong><span>Species</span></div>
          <div><strong>{stats.graphNodes}</strong><span>Graph nodes</span></div>
          <div><strong>{stats.graphEdges}</strong><span>Graph edges</span></div>
        </div>
        <p>RC-001 through RC-005 remain frozen and hash-protected. Sprint 10 adds an interactive research workspace without altering canonical repository knowledge.</p>
      </aside>
    </section>

    <div className="valueStrip">
      <div><strong>Investigate</strong><span>Use semantic filters, analysis lenses and multiple views over the same governed records.</span></div>
      <div><strong>Connect</strong><span>Move directly between cultivar profiles, comparison, graph relationships and evidence context.</span></div>
      <div><strong>Preserve boundaries</strong><span>Saved views and exports are derivative workspace state, never silent repository edits.</span></div>
    </div>

    <div className="notice"><strong>Explorer status:</strong> the integrated workspace is available at <a href="/explorer">/explorer</a>. Relationships and comparisons remain qualified and do not establish clonal identity or specimen authentication.</div>

    <CultivarExplorer cultivars={cultivars} facets={facets} examples={queryExamples()} />
  </>;
}
