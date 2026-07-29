import AtlasExplorerWorkspace from '@/components/AtlasExplorerWorkspace';
import { getCultivars, getSearchFacets } from '@/lib/data';
import { getRepositoryManifest } from '@/lib/repository';

export const metadata = {
  title: 'Find and compare cultivars',
  description: 'Search Japanese maple Catalogue Profiles and Reference Standards by form, foliage, colour, growing conditions, seasonal interest and governed relationships.'
};

export default function ExplorerPage() {
  const cultivars = getCultivars();
  const facets = getSearchFacets();
  const manifest = getRepositoryManifest();
  return <>
    <section className="pageIntro explorerIntro">
      <div className="kicker">Cultivar finder and research workspace</div>
      <h1>Find Japanese maples by the traits that matter to you.</h1>
      <p>Search across Catalogue Profiles and Reference Standards, then narrow by publication class, growth habit, leaf form, colour or growing conditions. Open the table, seasonal and relationship views when you need a deeper comparison.</p>
    </section>
    <details className="evidenceDisclosure explorerEvidence"><summary>How publication classes and saved work are handled</summary><p>Reference Standards provide the deepest governed evidence; Catalogue Profiles provide reviewed breadth through the lean C0–C3 contract. Search settings, saved views, comparison choices and exports are personal workspace state and never alter the repository.</p></details>
    <AtlasExplorerWorkspace cultivars={cultivars} facets={facets} manifest={manifest}/>
  </>;
}
