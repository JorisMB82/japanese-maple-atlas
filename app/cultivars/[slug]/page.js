import { notFound } from 'next/navigation';
import { getAllSlugs, getCultivar, getSimilarCultivars } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import PublicationClassBadge from '@/components/PublicationClassBadge';
import SeasonalTimeline from '@/components/SeasonalTimeline';
import EvidencePanel from '@/components/EvidencePanel';
import RelationshipPanel from '@/components/RelationshipPanel';
import SimilarCultivars from '@/components/SimilarCultivars';
import MediaPlate from '@/components/MediaPlate';
import MediaGallery from '@/components/MediaGallery';

export function generateStaticParams() { return getAllSlugs(); }
export function generateMetadata({ params }) { const c = getCultivar(params.slug); return c ? { title: c.cultivar, description: c.summary } : {}; }

const recordSections = [
  ['overview', 'Overview'],
  ['seasonal', 'Seasonal'],
  ['cultivation', 'Cultivation'],
  ['identity', 'Identity'],
  ['media', 'Media'],
  ['relationships', 'Relationships'],
  ['evidence', 'Evidence']
];

export default function CultivarPage({ params }) {
  const c = getCultivar(params.slug);
  if (!c) notFound();
  const similar = getSimilarCultivars(c.slug, 3);
  const isReferenceStandard = c.publicationClass === 'reference-standard';
  const evidenceCount = c.assertions?.length || 0;
  const visualState = c.mediaState === 'governed-gap'
    ? 'No approved cultivar-specific image is currently available. No generic or substitute cultivar image is displayed.'
    : 'The displayed visual follows the governed media record.';
  return <>
    <nav className="breadcrumb"><a href="/explorer">Explorer</a><span>›</span><span>{c.cultivar}</span></nav>
    <section className="profileHero mediaProfileHero" id="overview">
      <div><div className="profileMeta"><span className="referenceId">{c.displayId || c.id}</span><PublicationClassBadge publicationClass={c.publicationClass}/><StatusBadge status={c.status}/></div><p className="speciesName"><em>{c.species}</em></p><h1>{c.cultivar}</h1><p className="scientificName"><em>{c.scientificName}</em></p><p className="lead">{c.summary}</p><div className="heroActions"><a className="button" href={`/compare?a=${c.slug}`}>Compare cultivar</a>{isReferenceStandard && <a className="button secondary" href={`/graph?node=${c.id}`}>View relationships</a>}<a className="button secondary" href="#evidence">Inspect evidence</a></div></div>
      <MediaPlate media={c.primaryMedia} cultivar={c}/>
    </section>
    <details className="evidenceDisclosure"><summary>About this {c.publicationClassLabel || 'verified record'}</summary>{isReferenceStandard ? <p>This profile is compiled from the frozen {c.referenceStandard.id} Reference Standard and protected by SHA-256. Relationship links are separately reviewed comparisons and do not authenticate a specimen.</p> : <p>This is a reviewed Catalogue Profile using the lean C0–C3 publication contract. It discloses risk, confidence, review date and media state without claiming the full evidentiary depth of a Reference Standard. {visualState}</p>}</details>
    <nav className="recordNav" aria-label="On this cultivar record"><strong>On this record</strong><div>{recordSections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</div></nav>
    <section className="profileSection" id="diagnostic"><div className="sectionHeading"><div><div className="kicker">At a glance</div><h2>Diagnostic profile</h2></div></div><div className="diagnosticGrid">{(c.diagnosticTraits || []).map((trait, index) => <article key={`${trait}-${index}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{trait}</strong></article>)}</div></section>
    <section className="profileSection" id="seasonal"><div className="sectionHeading"><div><div className="kicker">Across the year</div><h2>Seasonal expression</h2></div></div><SeasonalTimeline cultivar={c}/></section>
    <section className="profileSection twoColumn" id="cultivation"><article><div className="kicker">Morphology</div><h2>Form and foliage</h2><p>{c.sections.morphology}</p><dl className="traitDl"><dt>Habit</dt><dd>{c.habit}</dd><dt>Leaf form</dt><dd>{c.leafForm}</dd><dt>Bark</dt><dd>{c.bark || 'Not reviewed in this profile.'}</dd></dl></article><article><div className="kicker">Growing context</div><h2>Cultivation and continuity</h2><p>{c.sections.cultivation}</p><dl className="traitDl"><dt>Light</dt><dd>{c.light || 'See the cultivation summary.'}</dd><dt>Propagation</dt><dd>{c.sections.propagation || 'Not part of the current profile minimum.'}</dd></dl></article></section>
    <section className="profileSection twoColumn" id="identity"><article><div className="kicker">Repository identity</div><h2>Identity and classification</h2><p>{c.sections.identity}</p><dl className="traitDl"><dt>Stable cultivar ID</dt><dd><code>{c.cultivarId}</code></dd><dt>Publication class</dt><dd>{c.publicationClassLabel}</dd><dt>Accepted taxon</dt><dd><em>{c.taxon?.scientificName || c.species}</em></dd>{c.taxonomicRelationships?.[0] && <><dt>Taxonomic relationship</dt><dd>{c.taxonomicRelationships[0].relativeLabel}</dd></>}</dl></article><article><div className="kicker">Historical record</div><h2>History and review</h2><p>{c.sections.history || 'A full historical monograph is not part of the lean Catalogue Profile minimum.'}</p><dl className="traitDl"><dt>Evidence depth</dt><dd>{c.evidenceDepth}</dd><dt>Reviewed</dt><dd>{c.reviewDate || 'Not recorded'}</dd></dl></article></section>
    <section className="profileSection" id="media"><div className="sectionHeading"><div><div className="kicker">Atlas visual record</div><h2>Governed visual state</h2></div><p>{c.media?.length || 0} media object{c.media?.length === 1 ? '' : 's'} · {c.mediaState}</p></div><MediaGallery cultivar={c}/></section>
    <section className="profileSection" id="similar"><div className="sectionHeading"><div><div className="kicker">Related discovery</div><h2>Similar cultivars</h2></div><p>Calculated from standardized fields</p></div><SimilarCultivars items={similar}/></section>
    <section className="profileSection" id="relationships"><div className="sectionHeading"><div><div className="kicker">Cultivar relationships</div><h2>Why this cultivar is connected to others</h2></div><p>{c.graphRelationships?.length || 0} explicit links{isReferenceStandard && <> · <a href={`/graph?node=${c.id}`}>explore node</a></>}</p></div>{c.graphRelationships?.length ? <RelationshipPanel relationships={c.graphRelationships}/> : <div className="empty card"><h3>No explicit relationship links yet</h3><p>Catalogue publication does not require a completed relationship graph.</p></div>}</section>
    <section className="profileSection" id="evidence"><div className="sectionHeading"><div><div className="kicker">Supporting record</div><h2>{isReferenceStandard ? 'Assertions and evidence' : 'Sources and review depth'}</h2></div><p>{evidenceCount} structured assertion{evidenceCount === 1 ? '' : 's'}</p></div>{evidenceCount ? <EvidencePanel assertions={c.assertions}/> : <div className="empty card"><h3>Lean Catalogue evidence</h3><p>This profile is supported by {c.sourceIds?.length || 0} compact source record{c.sourceIds?.length === 1 ? '' : 's'}. Full assertion and evidence matrices are reserved for Reference Standards unless a specific risk requires deeper treatment.</p></div>}</section>
  </>;
}
