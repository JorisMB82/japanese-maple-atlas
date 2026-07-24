import { getSources, getEvidenceForSource } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
export const metadata = { title: 'Sources' };
export default function SourcesPage() {
  const sources=getSources();
  return <><section className="pageIntro"><div className="kicker">Source register</div><h1>Inspect where repository evidence comes from.</h1><p>This pilot source register proves the navigation model. Canonical bibliographic records will replace provisional source entries during RC normalization.</p></section><div className="notice"><strong>Current limitation:</strong> Release 0.2 contains only the internal pilot source used to demonstrate evidence traceability.</div><div className="sourceGrid">{sources.map(source=>{const evidence=getEvidenceForSource(source.id);return <article className="sourceCard" key={source.id}><div className="cardTop"><code>{source.id}</code><StatusBadge status={source.status || 'provisional-pilot'} /></div><h2>{source.title}</h2><p className="muted">{source.sourceType}</p><p>{source.citation}</p><div className="sourceCount"><strong>{evidence.length}</strong><span>linked evidence items</span></div></article>})}</div></>;
}
