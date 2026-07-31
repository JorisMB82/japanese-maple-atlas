import { getCultivars } from '@/lib/data';
import { buildAtlasStructure } from '@/lib/atlas-structure.mjs';

export const metadata = {
  title: 'Maple map',
  description: 'See how published Japanese maple cultivars fit into species, practical horticultural groups and the Atlas publication model.'
};

function PublicationBadge({ cultivar }) {
  const short = cultivar.publicationClass === 'reference-standard' ? 'RS' : 'Catalogue';
  return <span className={`mapPublicationBadge mapPublication-${cultivar.publicationClass}`}>{short}</span>;
}

function CultivarLink({ cultivar, compact = false }) {
  return <a className={compact ? 'mapCultivarChip' : 'mapCultivarCard'} href={`/cultivars/${cultivar.slug}`}>
    <span>
      <strong>{cultivar.name}</strong>
      {!compact && <small>{cultivar.displayId}</small>}
    </span>
    <span className="mapCultivarMeta">
      {cultivar.hasApprovedVisual && <span className="mapVisualDot" title="Approved governed visual" aria-label="Approved governed visual">●</span>}
      <PublicationBadge cultivar={cultivar} />
    </span>
  </a>;
}

export default function MapleMapPage() {
  const structure = buildAtlasStructure(getCultivars());

  return <>
    <section className="pageIntro mapIntro">
      <div className="kicker">The big picture</div>
      <h1>See where every published Japanese maple fits.</h1>
      <p>The Maple Map separates three different ideas that are often mixed together: botanical species, practical horticultural types and the Atlas publication class. It is generated from published records, so it expands as new cultivars are released.</p>
      <div className="mapStats" aria-label="Current Maple Map coverage">
        <article><strong>{structure.totalCultivars}</strong><span>Published cultivars</span></article>
        <article><strong>{structure.speciesCount}</strong><span>Species represented</span></article>
        <article><strong>{structure.horticulturalGroups.length}</strong><span>Practical lenses</span></article>
        <article><strong>{structure.visualCultivarCount}</strong><span>With approved visuals</span></article>
      </div>
    </section>

    <section className="mapReadingGuide" aria-labelledby="map-guide-heading">
      <div>
        <div className="kicker">How to read the map</div>
        <h2 id="map-guide-heading">One cultivar can be organised in several valid ways.</h2>
      </div>
      <div className="mapGuideGrid">
        <article><span>1</span><h3>Taxonomy</h3><p>A formal hierarchy: genus, species and named cultivar.</p></article>
        <article><span>2</span><h3>Horticultural type</h3><p>Overlapping practical lenses such as dissected, upright, bark-interest or golden foliage.</p></article>
        <article><span>3</span><h3>Publication layer</h3><p>How deeply the Atlas has governed the record: Catalogue Profile or Reference Standard.</p></article>
      </div>
    </section>

    <section className="mapSection" aria-labelledby="taxonomy-map-heading">
      <div className="sectionHeading">
        <div><div className="kicker">Formal botanical structure</div><h2 id="taxonomy-map-heading">Genus → species → cultivar</h2></div>
        <p>This is the taxonomic backbone. Publication class and visual appearance do not change a cultivar’s botanical placement.</p>
      </div>
      <div className="taxonomyTree" role="tree" aria-label="Published cultivar taxonomy">
        <div className="taxonomyRoot" role="treeitem" aria-expanded="true">
          <span className="taxonomyRank">Genus</span>
          <strong><em>{structure.genus}</em></strong>
          <small>{structure.totalCultivars} published cultivar records</small>
        </div>
        <div className="speciesBranches" role="group">
          {structure.species.map(species => <article className="speciesBranch" key={species.id} role="treeitem" aria-expanded="true">
            <header>
              <span className="taxonomyRank">Species</span>
              <h3><em>{species.scientificName}</em></h3>
              <small>{species.count} published {species.count === 1 ? 'cultivar' : 'cultivars'}</small>
            </header>
            <div className="speciesCultivars" role="group">
              {species.cultivars.map(cultivar => <CultivarLink cultivar={cultivar} key={cultivar.id} />)}
            </div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="mapSection" aria-labelledby="horticultural-map-heading">
      <div className="sectionHeading">
        <div><div className="kicker">Practical garden view</div><h2 id="horticultural-map-heading">Horticultural types and visual character</h2></div>
        <p>These are overlapping discovery lenses derived from the published profile descriptions—not formal botanical ranks and not specimen authentication.</p>
      </div>
      <div className="horticulturalMap">
        {structure.horticulturalGroups.map(group => <article className="horticulturalGroup" key={group.id}>
          <header><div><span className="mapGroupCount">{group.count}</span><h3>{group.label}</h3></div><p>{group.description}</p></header>
          <div className="mapChipList">{group.cultivars.map(cultivar => <CultivarLink cultivar={cultivar} compact key={cultivar.id} />)}</div>
        </article>)}
      </div>
      <p className="mapMethodNote">A cultivar may appear in more than one practical group. The rules are transparent and profile-driven, so a new published record enters the map without maintaining a separate hand-built chart.</p>
    </section>

    <section className="mapSection" aria-labelledby="publication-map-heading">
      <div className="sectionHeading">
        <div><div className="kicker">Atlas knowledge system</div><h2 id="publication-map-heading">Two publication layers</h2></div>
        <p>Publication class describes evidence and governance depth. It is not a quality grade for the tree itself.</p>
      </div>
      <div className="publicationMap">
        {structure.publicationClasses.map(group => <article className={`publicationBranch publicationBranch-${group.id}`} key={group.id}>
          <header><span>{group.count}</span><div><h3>{group.label}</h3><p>{group.description}</p></div></header>
          <div className="mapChipList">{group.cultivars.map(cultivar => <CultivarLink cultivar={cultivar} compact key={cultivar.id} />)}</div>
        </article>)}
      </div>
    </section>

    <section className="mapFuture">
      <div><div className="kicker">Built to grow</div><h2>The map becomes more useful with every release.</h2><p>New species create new taxonomic branches. New cultivars appear under their species and practical lenses. Promotions to Reference Standard change the publication layer without changing the stable cultivar identity.</p></div>
      <div className="mapFutureActions"><a className="button" href="/explorer">Explore all cultivars</a><a className="button secondary" href="/graph">Explore evidence-linked relationships</a></div>
    </section>
  </>;
}
