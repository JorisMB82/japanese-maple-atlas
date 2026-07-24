import CultivarExplorer from '@/components/CultivarExplorer';
import { getCultivars, getRepositoryStats } from '@/lib/data';

export default function Home() {
  const cultivars = getCultivars();
  const stats = getRepositoryStats();
  return <>
    <section className="hero homeHero">
      <div className="heroCopy"><div className="kicker">Sprint 3 · Knowledge engine</div><h1>Japanese maples, organized as evidence—not folklore.</h1><p>Discover cultivars by form, foliage, seasonal expression, and identity. Compare records side by side and inspect the assertions and evidence behind each profile.</p><div className="heroActions"><a className="button" href="#directory-heading">Explore cultivars</a><a className="button secondary" href="/compare">Compare records</a></div></div>
      <aside className="heroPanel"><span className="panelEyebrow">Pilot repository</span><div className="statGrid"><div><strong>{stats.cultivars}</strong><span>Cultivars</span></div><div><strong>{stats.species}</strong><span>Species</span></div><div><strong>{stats.assertions}</strong><span>Assertions</span></div><div><strong>{stats.assertions}</strong><span>Assertions</span></div><div><strong>{stats.relationships}</strong><span>Relationships</span></div></div><p>The normalized repository and integrity checks are operational. Botanical statements remain provisional until the frozen RC files are imported.</p></aside>
    </section>
    <section className="valueStrip"><div><strong>Searchable</strong><span>Find traits and cultivar names quickly.</span></div><div><strong>Comparable</strong><span>Inspect differences across standardized fields.</span></div><div><strong>Traceable</strong><span>Drill from conclusions to evidence and sources.</span></div></section>
    <CultivarExplorer cultivars={cultivars} />
  </>;
}
