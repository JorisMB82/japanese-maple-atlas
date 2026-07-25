import { getSources, getEvidenceForSource } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';

export const metadata = { title: 'Sources' };

export default function SourcesPage() {
  const sources = getSources();
  return <>
    <section className="pageIntro">
      <div className="kicker">Frozen source register · Sprint 6</div>
      <h1>Inspect the governed Reference Standards behind the compiled Atlas.</h1>
      <p>Each cultivar is compiled from a frozen Markdown Reference Standard with a stable source identifier, freeze date, version, and SHA-256 fingerprint.</p>
    </section>
    <div className="notice"><strong>Canonical source rule:</strong> generated repository objects may be regenerated, but the five frozen RC inputs must remain byte-for-byte unchanged unless a formally governed successor version is approved.</div>
    <div className="sourceGrid">{sources.map(source => {
      const evidence = getEvidenceForSource(source.id);
      return <article className="sourceCard" key={source.id}>
        <div className="cardTop"><code>{source.id}</code><StatusBadge status={source.status} /></div>
        <h2>{source.title}</h2>
        <p className="muted">{source.sourceType} · version {source.version}</p>
        <p>{source.citation}</p>
        <dl className="compactDl"><dt>Frozen</dt><dd>{source.freezeDate}</dd><dt>SHA-256</dt><dd><code>{source.sha256}</code></dd></dl>
        <div className="sourceCount"><strong>{evidence.length}</strong><span>linked evidence objects</span></div>
      </article>;
    })}</div>
  </>;
}
