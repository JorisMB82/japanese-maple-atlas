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
        <p>Explore cultivars by growth habit, leaf shape, seasonal colour, growing conditions and winter interest. Every profile identifies whether it is a concise Catalogue Profile or a deeply governed Reference Standard.</p>
        <div className="heroActions"><a className="button" href="/explorer">Find a cultivar</a><a className="button secondary" href="#directory-heading">Browse the cultivars</a><a className="button secondary" href="/compare">Compare two cultivars</a></div>
      </div>
      <aside className="heroPanel">
        <span className="panelEyebrow">A practical research guide</span>
        <h2>Move from a garden question to the supporting record.</h2>
        <ul className="plainFeatureList"><li>Search in ordinary horticultural language.</li><li>Compare form, foliage and seasonal interest.</li><li>See the publication class and evidence depth.</li><li>Trace important claims to evidence and sources.</li></ul>
        <details className="compactDisclosure"><summary>Repository status</summary><div className="statGrid"><div><strong>{stats.cultivars}</strong><span>Cultivars</span></div><div><strong>{stats.referenceStandards}</strong><span>Reference Standards</span></div><div><strong>{stats.catalogueProfiles}</strong><span>Catalogue Profiles</span></div><div><strong>{stats.graphEdges}</strong><span>Verified connections</span></div></div><p>Reference Standards remain frozen and hash-protected. Catalogue Profiles use a lean, reviewed contract with explicit confidence and media-state disclosure.</p></details>
      </aside>
    </section>

    <div className="valueStrip">
      <div><strong>Choose</strong><span>Filter by shape, colour, exposure and mature scale.</span></div>
      <div><strong>Compare</strong><span>See meaningful differences side by side.</span></div>
      <div><strong>Verify</strong><span>Open evidence, sources and publication details when needed.</span></div>
    </div>

    <details className="evidenceDisclosure"><summary>How the evidence works</summary><p>The repository is the source of truth. Reference Standards provide the deepest assurance; Catalogue Profiles provide scalable reviewed breadth. Search results, saved views and exports do not authenticate a specimen.</p></details>

    <CultivarExplorer cultivars={cultivars} facets={facets} examples={queryExamples()} />
  </>;
}
