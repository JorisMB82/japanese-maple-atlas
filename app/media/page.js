import { getCultivars } from '@/lib/data';
import MediaPlate from '@/components/MediaPlate';

export const metadata = { title: 'Media system' };

export default function MediaPage() {
  const cultivars = getCultivars();

  return <>
    <section className="pageIntro">
      <div className="kicker">Sprint 11.5 · governed media pipeline</div>
      <h1>A consistent visual language for cultivated plants.</h1>
      <p>Media is stored as a governed repository object with explicit rights, status, subject, season, role, accessibility text, and evidentiary classification.</p>
    </section>

    <div className="notice">
      <strong>Important:</strong> the current identity plates are editorial illustrations created for interface and comparison testing. They are not photographs, diagnostic evidence, or final cultivar representations.
    </div>

    <section className="profileSection">
      <div className="sectionHeading">
        <div><div className="kicker">Pilot identity plates</div><h2>Five governed identity visuals</h2></div>
        <p>Rights-cleared sources, four deterministic derivatives, explicit non-evidentiary status</p>
      </div>
      <div className="mediaPlateGrid">
        {cultivars.map(c => <a href={`/cultivars/${c.slug}#media`} className="mediaIndexCard" key={c.id}>
          <MediaPlate media={c.primaryMedia} cultivar={c} compact />
          <div className="mediaIndexMeta"><span className="referenceId">{c.id}</span><h3>{c.cultivar}</h3><p><em>{c.species}</em></p></div>
        </a>)}
      </div>
    </section>

    <section className="profileSection twoColumn">
      <article>
        <div className="kicker">Media standard</div>
        <h2>Every asset is governed</h2>
        <ul className="mediaStandardList">
          <li>Stable media identifier</li>
          <li>Explicit cultivar relationship</li>
          <li>Controlled media type and role</li>
          <li>Subject and seasonal scope</li>
          <li>Alt text and caption</li>
          <li>Creator, contributor, rights holder and licence</li>
          <li>Source and derivative SHA-256 lineage</li>
          <li>EXIF/GPS privacy treatment</li>
          <li>Evidentiary classification</li>
          <li>Editorial review notes</li>
        </ul>
      </article>
      <article>
        <div className="kicker">RC-020 coverage</div>
        <h2>Governed gaps before editorial production</h2>
        <p>RC-001 through RC-005 meet the release minimum through approved Atlas identity plates. RC-006 through RC-020 carry explicit visual gaps that must be resolved or retained transparently during editorial production.</p>
        <p>The same repository object can support Atlas illustrations and real photographs without treating them as equivalent evidence.</p>
      </article>
    </section>
  </>;
}
