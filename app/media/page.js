import { getCultivars } from '@/lib/data';
import MediaPlate from '@/components/MediaPlate';

export const metadata = { title: 'Media system' };

export default function MediaPage() {
  const cultivars = getCultivars();

  return <>
    <section className="pageIntro">
      <div className="kicker">Sprint 5 · media system</div>
      <h1>A consistent visual language for cultivated plants.</h1>
      <p>Media is stored as a governed repository object with explicit rights, status, subject, season, role, accessibility text, and evidentiary classification.</p>
    </section>

    <div className="notice">
      <strong>Important:</strong> the current identity plates are editorial illustrations created for interface and comparison testing. They are not photographs, diagnostic evidence, or final cultivar representations.
    </div>

    <section className="profileSection">
      <div className="sectionHeading">
        <div><div className="kicker">Pilot identity plates</div><h2>Five standardized visuals</h2></div>
        <p>Same canvas, framing, scale language, and metadata model</p>
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
          <li>Credit and rights statement</li>
          <li>Evidentiary classification</li>
          <li>Editorial review notes</li>
        </ul>
      </article>
      <article>
        <div className="kicker">Planned expansion</div>
        <h2>From identity plate to visual record</h2>
        <p>Future media collections can include whole-plant habit, spring emergence, summer foliage, autumn colour, winter structure, bark, leaf close-ups, samaras, flowers, historical material, and authenticated real-world examples.</p>
        <p>The same repository object can support Atlas illustrations and real photographs without treating them as equivalent evidence.</p>
      </article>
    </section>
  </>;
}
