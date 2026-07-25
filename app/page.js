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
        <div className="kicker">Sprint 7 · editorial workflow</div>
        <h1>Japanese maples, organized as evidence—not folklore.</h1>
        <p>Explore canonical cultivar records, inspect their evidence, and follow the governed editorial workflows that protect repository truth.</p>
        <div className="heroActions"><a className="button" href="#directory-heading">Explore cultivars</a><a className="button secondary" href="/editorial">Inspect editorial workflow</a></div>
      </div>
      <aside className="heroPanel">
        <span className="panelEyebrow">Governed knowledge repository</span>
        <div className="statGrid">
          <div><strong>{stats.cultivars}</strong><span>Cultivars</span></div>
          <div><strong>{stats.species}</strong><span>Species</span></div>
          <div><strong>{stats.assertions}</strong><span>Assertions</span></div>
          <div><strong>{stats.sources}</strong><span>Frozen sources</span></div>
        </div>
        <p>RC-001 through RC-005 remain frozen and hash-protected. Sprint 7 adds contributor, submission, workflow and review objects without changing canonical botanical content.</p>
      </aside>
    </section>

    <div className="valueStrip">
      <div><strong>Compiled</strong><span>One governed source produces every repository layer.</span></div>
      <div><strong>Traceable</strong><span>Assertions link to evidence and frozen source hashes.</span></div>
      <div><strong>Reproducible</strong><span>Generated files are byte-for-byte drift checked.</span></div>
    </div>

    <div className="notice"><strong>Data status:</strong> the five cultivar records are canonical compiled outputs. Atlas identity plates remain editorial illustrations and are not botanical evidence.</div>

    <CultivarExplorer cultivars={cultivars} facets={facets} examples={queryExamples()} />
  </>;
}
