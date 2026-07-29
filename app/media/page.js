import { getCultivars } from '@/lib/data';
import MediaPlate from '@/components/MediaPlate';

export const metadata = { title: 'Visual library' };

const roleLabels = {
  'habit-primary': 'Whole plant · habit',
  'foliage-detail': 'Foliage detail',
  'seasonal-diagnostic': 'Seasonal · diagnostic',
  'identity-plate': 'Identity plate'
};

export default function MediaPage() {
  const cultivars = getCultivars();
  const photographicCultivars = cultivars.filter(cultivar =>
    (cultivar.media || []).some(asset => asset.mediaType === 'photograph' && asset.status === 'approved')
  );
  const photographs = photographicCultivars.flatMap(cultivar =>
    (cultivar.media || []).filter(asset => asset.mediaType === 'photograph' && asset.status === 'approved')
  );
  const referenceVisuals = cultivars.filter(cultivar =>
    cultivar.publicationClass === 'reference-standard' && cultivar.primaryMedia?.assetPath
  );
  const catalogueGaps = cultivars.filter(cultivar =>
    cultivar.publicationClass === 'catalogue-profile' && cultivar.mediaState === 'governed-gap'
  );
  const rolesCovered = new Set(photographs.map(asset => asset.role)).size;

  return <>
    <section className="pageIntro mediaLibraryIntro">
      <div>
        <div className="kicker">Governed visual library</div>
        <h1>A growing library of lawful Japanese maple photographs.</h1>
        <p>Browse whole-plant habit, foliage and seasonal views that have passed item-level rights, attribution, privacy and identity-confidence review. The library expands as additional cultivar packages clear the same governed pipeline.</p>
        <div className="heroActions"><a className="button" href="#catalogue-photographs">Browse photographs</a><a className="button secondary" href="/contribute">Contribute a photograph</a></div>
      </div>
      <aside className="mediaLibraryStats" aria-label="Visual library statistics">
        <div><strong>{photographicCultivars.length}</strong><span>Photographed cultivars</span></div>
        <div><strong>{photographs.length}</strong><span>Approved photographs</span></div>
        <div><strong>{rolesCovered}</strong><span>Visual roles covered</span></div>
        <div><strong>{catalogueGaps.length}</strong><span>Open Catalogue gaps</span></div>
      </aside>
    </section>

    <div className="notice mediaLibraryNotice">
      <strong>Rights and identity are reviewed separately.</strong> A lawful photograph may be source-asserted or community-identified without being independently authenticated as a clone. Each item therefore carries its own identity-confidence disclosure.
    </div>

    <section className="profileSection" id="catalogue-photographs">
      <div className="sectionHeading">
        <div><div className="kicker">Catalogue photography</div><h2>Approved three-role galleries</h2></div>
        <p>{photographs.length} lawful photographs across {photographicCultivars.length} published Catalogue Profiles</p>
      </div>

      <div className="mediaCollectionStack">
        {photographicCultivars.map(cultivar => {
          const gallery = (cultivar.media || []).filter(asset => asset.mediaType === 'photograph' && asset.status === 'approved');
          return <article className="mediaCollection" key={cultivar.cultivarId}>
            <header className="mediaCollectionHeader">
              <div><span className="referenceId">{cultivar.cultivarId}</span><h3>{cultivar.cultivar}</h3><p><em>{cultivar.species}</em> · Catalogue Profile</p></div>
              <div className="mediaCollectionActions"><span>{gallery.length} approved photographs</span><a className="button secondary" href={`/cultivars/${cultivar.slug}#media`}>Open cultivar gallery</a></div>
            </header>
            <div className="mediaAssetGrid">
              {gallery.map(asset => <article className="mediaLibraryAsset" key={asset.id}>
                <div className="mediaRoleRow"><span className="mediaRoleBadge">{roleLabels[asset.role] || asset.role}</span><span>{asset.licence}</span></div>
                <MediaPlate media={asset} cultivar={cultivar} />
                <p className="mediaIdentityQualification">{asset.identity?.publicQualification}</p>
                <div className="mediaSourceLinks"><span>{asset.id}</span><a href={asset.sourceUrl} target="_blank" rel="noreferrer">Open original source</a></div>
              </article>)}
            </div>
          </article>;
        })}
      </div>
    </section>

    <section className="profileSection">
      <div className="sectionHeading">
        <div><div className="kicker">Reference Standard visual layer</div><h2>Governed identity plates</h2></div>
        <p>Editorial illustrations remain clearly separated from real cultivar photography</p>
      </div>
      <div className="notice compactMediaNotice"><strong>Not photographs:</strong> these plates support interface consistency and visual orientation. They are illustrative reconstructions and are not diagnostic evidence.</div>
      <div className="mediaPlateGrid referencePlateGrid">
        {referenceVisuals.map(cultivar => <a href={`/cultivars/${cultivar.slug}#media`} className="mediaIndexCard" key={cultivar.id}>
          <MediaPlate media={cultivar.primaryMedia} cultivar={cultivar} compact />
          <div className="mediaIndexMeta"><span className="referenceId">{cultivar.id}</span><h3>{cultivar.cultivar}</h3><p><em>{cultivar.species}</em> · Reference Standard</p></div>
        </a>)}
      </div>
    </section>

    <section className="profileSection twoColumn mediaLibraryBottom">
      <article>
        <div className="kicker">Open visual gaps</div>
        <h2>Help complete the public Catalogue.</h2>
        <p>The Atlas never fills a gap with a generic substitute. These published profiles still need lawful cultivar-specific habit, foliage and seasonal coverage.</p>
        <div className="mediaGapList">{catalogueGaps.map(cultivar => <a href={`/cultivars/${cultivar.slug}#media`} key={cultivar.cultivarId}><span>{cultivar.cultivarId}</span><strong>{cultivar.cultivar}</strong></a>)}</div>
        <a className="button" href="/contribute">Submit an original photograph</a>
      </article>
      <article>
        <div className="kicker">What every photograph carries</div>
        <h2>Traceable from source to display.</h2>
        <ul className="mediaStandardList">
          <li>Stable media identifier and cultivar relationship</li>
          <li>Controlled visual role and primary selection</li>
          <li>Creator, rights holder, licence and source link</li>
          <li>Source and derivative SHA-256 lineage</li>
          <li>EXIF and precise-GPS privacy treatment</li>
          <li>Alt text, caption and attribution</li>
          <li>Identity-confidence basis and public qualification</li>
          <li>Deterministic thumb, card, display and archive derivatives</li>
        </ul>
      </article>
    </section>
  </>;
}
