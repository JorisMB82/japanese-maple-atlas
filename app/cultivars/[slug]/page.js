import { notFound } from 'next/navigation';
import { getAllSlugs, getCultivar, getSimilarCultivars } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import SeasonalTimeline from '@/components/SeasonalTimeline';
import EvidencePanel from '@/components/EvidencePanel';
import RelationshipPanel from '@/components/RelationshipPanel';
import SimilarCultivars from '@/components/SimilarCultivars';
import MediaPlate from '@/components/MediaPlate';
import MediaGallery from '@/components/MediaGallery';

export function generateStaticParams(){return getAllSlugs()}
export function generateMetadata({params}){const c=getCultivar(params.slug);return c?{title:c.cultivar,description:c.summary}:{}}

export default function CultivarPage({params}){
 const c=getCultivar(params.slug);if(!c)notFound();const similar=getSimilarCultivars(c.slug,3);
 return <>
  <nav className="breadcrumb"><a href="/">Cultivars</a><span>›</span><span>{c.cultivar}</span></nav>
  <section className="profileHero mediaProfileHero">
   <div><div className="profileMeta"><span className="referenceId">{c.id}</span><StatusBadge status={c.status}/></div><p className="speciesName"><em>{c.species}</em></p><h1>{c.cultivar}</h1><p className="scientificName"><em>{c.scientificName}</em></p><p className="lead">{c.summary}</p><div className="heroActions"><a className="button" href={`/compare?a=${c.slug}`}>Compare cultivar</a><a className="button secondary" href="#media">Inspect media</a></div></div>
   <MediaPlate media={c.primaryMedia} cultivar={c}/>
  </section>
  <div className="notice"><strong>Data status:</strong> the identity plate is an editorial illustration for product testing, not botanical evidence. Canonical content and final visuals remain subject to RC normalization and review.</div>
  <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">At a glance</div><h2>Diagnostic profile</h2></div></div><div className="diagnosticGrid">{c.diagnosticTraits.map((t,i)=><article key={t}><span>0{i+1}</span><strong>{t}</strong></article>)}</div></section>
  <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">Across the year</div><h2>Seasonal expression</h2></div></div><SeasonalTimeline cultivar={c}/></section>
  <section className="profileSection twoColumn"><article><div className="kicker">Morphology</div><h2>Form and foliage</h2><p>{c.sections.morphology}</p><dl className="traitDl"><dt>Habit</dt><dd>{c.habit}</dd><dt>Leaf form</dt><dd>{c.leafForm}</dd><dt>Bark</dt><dd>{c.bark}</dd></dl></article><article><div className="kicker">Growing context</div><h2>Cultivation and continuity</h2><p>{c.sections.cultivation}</p><dl className="traitDl"><dt>Light</dt><dd>{c.light}</dd><dt>Propagation</dt><dd>{c.sections.propagation}</dd></dl></article></section>
  <section className="profileSection twoColumn"><article><div className="kicker">Repository identity</div><h2>Identity and classification</h2><p>{c.sections.identity}</p></article><article><div className="kicker">Historical record</div><h2>History</h2><p>{c.sections.history}</p></article></section>
  <section className="profileSection" id="media"><div className="sectionHeading"><div><div className="kicker">First-class repository media</div><h2>Atlas visual record</h2></div><p>{c.media.length} media object{c.media.length===1?'':'s'}</p></div><MediaGallery cultivar={c}/></section>
  <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">Discovery service</div><h2>Similar cultivars</h2></div><p>Calculated from standardized repository fields</p></div><SimilarCultivars items={similar}/></section>
  <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">Knowledge graph</div><h2>Related cultivars</h2></div><p>{c.relationships.length} explicit links</p></div><RelationshipPanel relationships={c.relationships}/></section>
  <section className="profileSection" id="evidence"><div className="sectionHeading"><div><div className="kicker">Traceability</div><h2>Assertions and evidence</h2></div><p>{c.assertions.length} structured assertions</p></div><EvidencePanel assertions={c.assertions}/></section>
 </>;
}
