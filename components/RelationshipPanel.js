export default function RelationshipPanel({ relationships=[] }){
 if(!relationships.length) return <div className="empty">No explicit relationships are registered.</div>;
 return <div className="relationshipGrid">{relationships.map(rel=><a className="relationshipCard" href={`/cultivars/${rel.relatedCultivar.slug}`} key={rel.id}><code>{rel.id}</code><span className="relationshipType">{rel.label}</span><strong>{rel.relatedCultivar.cultivar}</strong><em>{rel.relatedCultivar.scientificName}</em><span>Open related record →</span></a>)}</div>;
}
