import { getEvidence, getSource } from '@/lib/data';
import StatusBadge from './StatusBadge';

export default function EvidencePanel({ assertions }) {
  if (!assertions?.length) return <div className="empty">No assertions are available for this record.</div>;
  return <div className="evidenceList">
    {assertions.map(assertion => {
      const evidence = assertion.evidenceIds.map(getEvidence).filter(Boolean);
      return <details className="evidenceItem" key={assertion.id}>
        <summary>
          <span><span className="domainLabel">{assertion.domain}</span>{assertion.text}</span>
          <span className="confidence">{assertion.confidence}</span>
        </summary>
        <div className="evidenceBody">
          <div className="assertionMeta">
            <code>{assertion.id}</code><span>State: {assertion.state}</span><span>Confidence: {assertion.confidence}</span>
          </div>
          {evidence.map(item => {
            const source = getSource(item.sourceId);
            return <article className="evidenceCard" key={item.id}>
              <div className="evidenceHeading"><strong>{item.type}</strong><StatusBadge status={item.status || 'provisional-pilot'} /></div>
              <p>{item.note}</p>
              <dl className="compactDl"><dt>Evidence ID</dt><dd><code>{item.id}</code></dd><dt>Scope</dt><dd>{item.scope}</dd><dt>Source</dt><dd>{source?.title || 'Source unavailable'}</dd></dl>
              {source && <p className="sourceCitation">{source.citation}</p>}
            </article>;
          })}
        </div>
      </details>;
    })}
  </div>;
}
