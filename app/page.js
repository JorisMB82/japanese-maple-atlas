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
        <div className="kicker">Japanese maple cultivar guide</div>
        <h1>Find, understand and compare Japanese maples.</h1>
        <p>Explore cultivars by growth habit, leaf shape, seasonal colour, growing conditions and winter interest. Each profile also shows the evidence behind the description.</p>
        <div className="heroActions"><a className="button" href="/explorer">Find a cultivar</a><a className="button secondary" href="#directory-heading">Browse the five cultivars</a><a className="button secondary" href="/compare">Compare two cultivars</a></div>
      </div>
      <aside className="heroPanel">
        <span className="panelEyebrow">A practical research guide</span>
        <h2>Move from a garden question to the supporting record.</h2>
        <ul className="plainFeatureList"><li>Search in ordinary horticultural language.</li><li>Compare form, foliage and seasonal interest.</li><li>See why cultivars are considered similar or different.</li><li>Trace important claims to evidence and sources.</li></ul>
        <details className="compactDisclosure"><summary>Repository status</summary><div className="statGrid"><div><strong>{stats.cultivars}</strong><span>Cultivars</span></div><div><strong>{stats.species}</strong><span>Species</span></div><div><strong>{stats.graphNodes}</strong><span>Relationship nodes</span></div><div><strong>{stats.graphEdges}</strong><span>Verified connections</span></div></div><p>RC-001 through RC-005 remain frozen and hash-protected. The interface is derived from those source records.</p></details>
      </aside>
    </section>

    <div className="valueStrip">
      <div><strong>Choose</strong><span>Filter by shape, colour, exposure and mature scale.</span></div>
      <div><strong>Compare</strong><span>See meaningful differences side by side.</span></div>
      <div><strong>Verify</strong><span>Open evidence, sources and relationship explanations when needed.</span></div>
    </div>

    <details className="evidenceDisclosure"><summary>How the evidence works</summary><p>The repository is the source of truth. Search results, saved views and exports are working aids; they do not change the verified cultivar records or imply specimen authentication.</p></details>

    <CultivarExplorer cultivars={cultivars} facets={facets} examples={queryExamples()} />
  </>;
}
