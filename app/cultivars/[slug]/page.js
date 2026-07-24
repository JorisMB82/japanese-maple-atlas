import { notFound } from 'next/navigation';
import { getAllSlugs, getCultivar, getEvidence, getSource } from '@/lib/data';

export function generateStaticParams() { return getAllSlugs(); }

export default function CultivarPage({ params }) {
  const c = getCultivar(params.slug);
  if (!c) notFound();
  return <>
    <section className="profileHeader">
      <div>
        <div className="kicker">{c.id} · {c.status}</div>
        <h1>{c.cultivar}</h1>
        <p className="muted"><em>{c.scientificName}</em></p>
        <p>{c.summary}</p>
      </div>
      <aside className="statBox">
        <strong>Primary discovery traits</strong>
        <div className="tags">{c.diagnosticTraits.map(t=><span className="tag" key={t}>{t}</span>)}</div>
      </aside>
    </section>
    <div className="notice"><strong>Normalization status:</strong> this profile is wired to structured JSON but still awaits direct replacement with the frozen Reference Standard.</div>
    <section className="sections">
      <article className="card"><h2>Identity & classification</h2><dl>
        <dt>Reference ID</dt><dd>{c.id}</dd><dt>Species</dt><dd><em>{c.species}</em></dd><dt>Cultivar</dt><dd>{c.cultivar}</dd><dt>Status</dt><dd>{c.status}</dd>
      </dl><p>{c.sections.identity}</p></article>
      <article className="card"><h2>Trait summary</h2><dl>
        <dt>Habit</dt><dd>{c.habit}</dd><dt>Leaf form</dt><dd>{c.leafForm}</dd><dt>Size class</dt><dd>{c.sizeClass}</dd><dt>Bark</dt><dd>{c.bark}</dd><dt>Light</dt><dd>{c.light}</dd>
      </dl></article>
      <article className="card"><h2>Seasonal expression</h2><dl>
        <dt>Spring</dt><dd>{c.springColor}</dd><dt>Summer</dt><dd>{c.summerColor}</dd><dt>Autumn</dt><dd>{c.autumnColor}</dd>
      </dl></article>
      <article className="card"><h2>Cultivation</h2><p>{c.sections.cultivation}</p><h3>Propagation</h3><p>{c.sections.propagation}</p></article>
      <article className="card"><h2>Morphology</h2><p>{c.sections.morphology}</p></article>
      <article className="card"><h2>History</h2><p>{c.sections.history}</p></article>
    </section>
    <section className="card" style={{marginTop:'1rem'}}>
      <h2>Assertion and evidence drill-down</h2>
      {c.assertions.map(a => {
        const evs = a.evidenceIds.map(getEvidence).filter(Boolean);
        return <details key={a.id}><summary>{a.domain}: {a.text}</summary><div className="assertion">
          <div className="assertionMeta"><span>ID {a.id}</span><span>State: {a.state}</span><span>Confidence: {a.confidence}</span></div>
          {evs.map(e => { const s=getSource(e.sourceId); return <div key={e.id} className="card" style={{marginTop:'.8rem'}}><strong>{e.type}</strong><p>{e.note}</p><p className="muted">Scope: {e.scope}<br/>Source: {s?.title} — {s?.citation}</p></div>})}
        </div></details>
      })}
    </section>
    <p style={{marginTop:'1.2rem'}}><a className="button secondary" href={`/compare?a=${c.slug}`}>Compare this cultivar</a></p>
  </>;
}
