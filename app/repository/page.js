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
import CopyIdentifier from '@/components/CopyIdentifier';

export const metadata = { title: 'Repository' };

export default function RepositoryPage() {
  const m = getRepositoryManifest(), stats = getRepositoryStats(), report = getIntegrityReport(), taxa = getTaxa(), rels = getRelationships(), types = getRelationshipTypes(), graph = getGraphStats();
  return <>
    <section className="pageIntro"><div className="kicker">How the Atlas is maintained</div><h1>See where the cultivar information comes from and how it is checked.</h1><p>The public pages are built from linked cultivar, evidence, source, taxonomy and relationship records. Stable identifiers and integrity checks help keep every published statement traceable.</p></section>
    <details className="evidenceDisclosure"><summary>Technical repository details</summary><p>The repository is the source of truth. Compiled objects are deterministic and protected by SHA-256; the application presents those outputs without changing them.</p></details>
    <RepositoryHealth report={report}/>
    <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">Repository manifest</div><h2>Verified record inventory</h2></div><code>v{m.repositoryVersion}</code></div><div className="repositoryStats">{Object.entries(stats).filter(([k]) => k !== 'species').map(([k, v]) => <article key={k}><strong>{v}</strong><span>{k}</span></article>)}</div></section>
    <section className="profileSection twoColumn repositoryIntegrityGrid"><article><div className="kicker">Compiler</div><h2>{m.compiler.name} {m.compiler.version}</h2><dl className="compactDl"><dt>Canonicality</dt><dd>{m.canonicality}</dd><dt>Frozen inputs</dt><dd>{m.source.records}</dd><dt>Objects</dt><dd>{m.objectTotal}</dd><dt>Repository hash</dt><dd><CopyIdentifier value={m.repositoryHash} label="repository hash"/></dd></dl></article><article><div className="kicker">Relationship data</div><h2>{graph.nodes} nodes · {graph.edges} connections</h2><dl className="compactDl"><dt>Relationship types</dt><dd>{types.length}</dd><dt>Cultivar pairs</dt><dd>{graph.cultivarPairs}</dd><dt>Connected components</dt><dd>{graph.connectedComponents}</dd><dt>Graph hash</dt><dd><CopyIdentifier value={graph.graphHash} label="graph hash"/></dd></dl></article></section>
    <section className="profileSection twoColumn"><article><div className="kicker">Taxonomy</div><h2>Taxon register</h2>{taxa.map(t => <div className="registryRow" key={t.id}><code>{t.id}</code><span><strong><em>{t.scientificName}</em></strong><small>{t.commonName} · {t.relationshipIds.length} graph links</small></span></div>)}</article><article><div className="kicker">Relationship vocabulary</div><h2>How connections are described</h2>{types.map(type => <div className="registryRow" key={type.id}><code>{type.id}</code><span><strong>{type.label}</strong><small>{type.category} · {type.directionality}</small></span></div>)}</article></section>
    <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">Relationship layer</div><h2>Verified cultivar connections</h2></div><p><a href="/graph">Open interactive graph</a></p></div>{rels.map(r => <div className="registryRow" key={r.id}><code>{r.id}</code><span><strong>{r.label}</strong><small>{r.fromId} → {r.toId} · {r.category} · strength {r.strength}/5 · {r.evidenceAssertionIds.length} evidence links</small></span></div>)}</section>
    <div className="notice"><strong>Generated-file rule:</strong> {m.notes}</div>
  </>;
}
