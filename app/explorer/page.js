import AtlasExplorerWorkspace from '@/components/AtlasExplorerWorkspace';
import { getCultivars, getRepositoryManifest, getSearchFacets } from '@/lib/repository';

export const metadata = {
  title: 'Find and compare cultivars',
  description: 'Search Japanese maple cultivars by form, foliage, colour, growing conditions, seasonal interest and verified relationships.'
};

export default function ExplorerPage() {
  const cultivars = getCultivars();
  const facets = getSearchFacets();
  const manifest = getRepositoryManifest();
  return <>
    <section className="pageIntro explorerIntro">
      <div className="kicker">Cultivar finder and research workspace</div>
      <h1>Find Japanese maples by the traits that matter to you.</h1>
      <p>Start with a simple search, then narrow by growth habit, leaf form, colour or growing conditions. Open the table, seasonal and relationship views when you need a deeper comparison.</p>
    </section>
    <details className="evidenceDisclosure explorerEvidence"><summary>How records and saved work are handled</summary><p>The Explorer reads verified compiled records. Search settings, saved views, comparison choices and exports are personal workspace state and never alter the repository.</p></details>
    <AtlasExplorerWorkspace cultivars={cultivars} facets={facets} manifest={manifest}/>
  </>;
}
