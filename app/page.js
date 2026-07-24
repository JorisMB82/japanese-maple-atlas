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
        <div className="kicker">Sprint 4 · discovery services</div>
        <h1>Japanese maples, organized as evidence—not folklore.</h1>
        <p>Search across structured cultivar traits, combine free text with field queries, build a comparison tray, and move from discovery into evidence-backed profiles.</p>
        <div className="heroActions"><a className="button" href="#directory-heading">Explore cultivars</a><a className="button secondary" href="/repository">Inspect repository</a></div>
      </div>
      <aside className="heroPanel">
        <span className="panelEyebrow">Operational repository</span>
        <div className="statGrid">
          <div><strong>{stats.cultivars}</strong><span>Cultivars</span></div>
          <div><strong>{stats.species}</strong><span>Species</span></div>
          <div><strong>{stats.assertions}</strong><span>Assertions</span></div>
          <div><strong>{stats.sources}</strong><span>Sources</span></div>
        </div>
        <p>Structured discovery is operational. Botanical content remains provisional until the frozen RC records are normalized.</p>
      </aside>
    </section>

    <div className="valueStrip">
      <div><strong>Searchable</strong><span>Free text, phrases, and field queries.</span></div>
      <div><strong>Filterable</strong><span>Repository facets rather than page keywords.</span></div>
      <div><strong>Comparable</strong><span>Persistent two-record comparison tray.</span></div>
    </div>

    <div className="notice"><strong>Data status:</strong> the discovery engine is production-capable; the five botanical records remain explicitly provisional pending canonical RC normalization.</div>

    <CultivarExplorer cultivars={cultivars} facets={facets} examples={queryExamples()} />
  </>;
}
