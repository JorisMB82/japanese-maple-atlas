import AtlasExplorerWorkspace from '@/components/AtlasExplorerWorkspace';
import { getCultivars, getRepositoryManifest, getSearchFacets } from '@/lib/repository';

export const metadata = {
  title: 'Interactive Atlas explorer',
  description: 'Search, filter, inspect, compare, save and export governed Japanese maple cultivar research sets.'
};

export default function ExplorerPage() {
  const cultivars = getCultivars();
  const facets = getSearchFacets();
  const manifest = getRepositoryManifest();

  return <>
    <section className="pageIntro explorerIntro">
      <div className="kicker">Sprint 10 · integrated research workspace</div>
      <h1>Explore the Atlas as a connected body of governed knowledge.</h1>
      <p>Move between semantic discovery, trait matrices, seasonal expression, graph relationships and record-level evidence without leaving one workspace. Explorer state is shareable in the URL; saved views remain local to your browser.</p>
      <div className="explorerIntroFacts"><span><strong>{cultivars.length}</strong> frozen cultivar records</span><span><strong>{manifest.objectTotal}</strong> repository objects</span><span><strong>{manifest.graph.edges}</strong> governed graph edges</span><span><strong>0.10.0</strong> application release</span></div>
    </section>
    <div className="notice"><strong>Repository boundary:</strong> the explorer reads canonical compiled records. Saved views, selections and exported research sets are derivative workspace state and do not alter the repository.</div>
    <AtlasExplorerWorkspace cultivars={cultivars} facets={facets} manifest={manifest}/>
  </>;
}
