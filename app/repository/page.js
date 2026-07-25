import {
  getRepositoryManifest,
  getRepositoryStats,
  getIntegrityReport,
  getTaxa,
  getRelationships,
  getRelationshipTypes,
  getGraphStats
} from '@/lib/repository';
import RepositoryHealth from '@/components/RepositoryHealth';

export const metadata={title:'Repository'};

export default function RepositoryPage(){
 const m=getRepositoryManifest(), stats=getRepositoryStats(), report=getIntegrityReport(), taxa=getTaxa(), rels=getRelationships(), types=getRelationshipTypes(), graph=getGraphStats();
 return <>
  <section className="pageIntro"><div className="kicker">Knowledge layer · Sprint 9</div><h1>The Atlas repository now contains an evidence-linked cultivar knowledge graph.</h1><p>Cultivars, taxa, assertions, evidence, editorial records and governed relationship objects are deterministic, joined through stable identifiers and protected by SHA-256. The graph is a repository output; the application only presents it.</p></section>
  <RepositoryHealth report={report}/>
  <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">Repository manifest</div><h2>Object inventory</h2></div><code>v{m.repositoryVersion}</code></div><div className="repositoryStats">{Object.entries(stats).filter(([k])=>k!=='species').map(([k,v])=><article key={k}><strong>{v}</strong><span>{k}</span></article>)}</div></section>
  <section className="profileSection twoColumn"><article><div className="kicker">Compiler</div><h2>{m.compiler.name} {m.compiler.version}</h2><dl className="compactDl"><dt>Canonicality</dt><dd>{m.canonicality}</dd><dt>Frozen inputs</dt><dd>{m.source.records}</dd><dt>Objects</dt><dd>{m.objectTotal}</dd><dt>Repository hash</dt><dd><code>{m.repositoryHash}</code></dd></dl></article><article><div className="kicker">Graph integrity</div><h2>{graph.nodes} nodes · {graph.edges} edges</h2><dl className="compactDl"><dt>Relationship types</dt><dd>{types.length}</dd><dt>Cultivar pairs</dt><dd>{graph.cultivarPairs}</dd><dt>Connected components</dt><dd>{graph.connectedComponents}</dd><dt>Graph hash</dt><dd><code>{graph.graphHash}</code></dd></dl></article></section>
  <section className="profileSection twoColumn"><article><div className="kicker">Taxonomy</div><h2>Taxon register</h2>{taxa.map(t=><div className="registryRow" key={t.id}><code>{t.id}</code><span><strong><em>{t.scientificName}</em></strong><small>{t.commonName} · {t.relationshipIds.length} graph links</small></span></div>)}</article><article><div className="kicker">Controlled vocabulary</div><h2>Relationship types</h2>{types.map(type=><div className="registryRow" key={type.id}><code>{type.id}</code><span><strong>{type.label}</strong><small>{type.category} · {type.directionality}</small></span></div>)}</article></section>
  <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">Graph layer</div><h2>Governed relationships</h2></div><p><a href="/graph">Open interactive graph</a></p></div>{rels.map(r=><div className="registryRow" key={r.id}><code>{r.id}</code><span><strong>{r.label}</strong><small>{r.fromId} → {r.toId} · {r.category} · strength {r.strength}/5 · {r.evidenceAssertionIds.length} evidence links</small></span></div>)}</section>
  <div className="notice"><strong>Generated-file rule:</strong> {m.notes}</div>
 </>;
}
