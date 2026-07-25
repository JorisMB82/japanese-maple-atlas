export default function RelationshipPanel({ relationships = [] }) {
  const cultivarRelationships = relationships.filter(relationship => relationship.relatedCultivar);
  if (!cultivarRelationships.length) return <div className="empty">No cultivar-to-cultivar relationships are registered.</div>;
  return <div className="relationshipGrid">{cultivarRelationships.map(relationship => <a className="relationshipCard" href={`/cultivars/${relationship.relatedCultivar.slug}`} key={relationship.id}>
    <div className="relationshipCardHeader"><code>{relationship.id}</code><span>{relationship.relationshipType?.category || relationship.category}</span></div>
    <span className="relationshipType">{relationship.relativeLabel || relationship.label}</span>
    <strong>{relationship.relatedCultivar.cultivar}</strong>
    <em>{relationship.relatedCultivar.scientificName}</em>
    <p>{relationship.rationale}</p>
    <div className="relationshipMeta"><span>Strength {relationship.strength}/5</span><span>{relationship.confidence} confidence</span><span>{relationship.evidenceAssertionIds?.length || 0} evidence links</span></div>
    <span>Open related record →</span>
  </a>)}</div>;
}
