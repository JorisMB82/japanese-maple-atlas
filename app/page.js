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
        <div className="kicker">Sprint 9 · knowledge graph</div>
        <h1>Japanese maples, organized as evidence—not folklore.</h1>
        <p>Search canonical cultivar records, inspect why results matched, and explore the governed taxonomic, morphological and diagnostic relationships connecting the Atlas.</p>
        <div className="heroActions"><a className="button" href="#directory-heading">Search cultivars</a><a className="button secondary" href="/graph">Explore knowledge graph</a></div>
      </div>
      <aside className="heroPanel">
        <span className="panelEyebrow">Governed knowledge repository</span>
        <div className="statGrid">
          <div><strong>{stats.cultivars}</strong><span>Cultivars</span></div>
          <div><strong>{stats.species}</strong><span>Species</span></div>
          <div><strong>{stats.graphNodes}</strong><span>Graph nodes</span></div>
          <div><strong>{stats.graphEdges}</strong><span>Graph edges</span></div>
        </div>
        <p>RC-001 through RC-005 remain frozen and hash-protected. Sprint 9 adds evidence-linked relationships without altering canonical cultivar assertions.</p>
      </aside>
    </section>

    <div className="valueStrip">
      <div><strong>Connected</strong><span>Cultivars and taxa are joined through explicit, controlled relationship types.</span></div>
      <div><strong>Traceable</strong><span>Every graph edge links back to approved assertions and frozen sources.</span></div>
      <div><strong>Qualified</strong><span>Shared traits and diagnostic comparisons remain separate from authentication claims.</span></div>
    </div>

    <div className="notice"><strong>Graph status:</strong> relationships organize approved knowledge and comparisons; they do not establish clonal identity, parentage or specimen authentication.</div>

    <CultivarExplorer cultivars={cultivars} facets={facets} examples={queryExamples()} />
  </>;
}
