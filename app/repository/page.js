import { getRepositoryManifest, getRepositoryStats, getIntegrityReport, getTaxa, getRelationships } from '@/lib/repository';
import RepositoryHealth from '@/components/RepositoryHealth';

export const metadata={title:'Repository'};

export default function RepositoryPage(){
 const m=getRepositoryManifest(), stats=getRepositoryStats(), report=getIntegrityReport(), taxa=getTaxa(), rels=getRelationships();
 return <>
  <section className="pageIntro"><div className="kicker">Knowledge layer · Sprint 7</div><h1>The Atlas repository is compiled from frozen Reference Standards.</h1><p>Cultivars, assertions, evidence, sources, editorial submissions, workflows, review passes and contributor identities are deterministic objects joined through stable identifiers and protected by SHA-256.</p></section>
  <RepositoryHealth report={report}/>
  <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">Repository manifest</div><h2>Object inventory</h2></div><code>v{m.repositoryVersion}</code></div><div className="repositoryStats">{Object.entries(stats).filter(([k])=>k!=='species').map(([k,v])=><article key={k}><strong>{v}</strong><span>{k}</span></article>)}</div></section>
  <section className="profileSection twoColumn"><article><div className="kicker">Compiler</div><h2>{m.compiler.name} {m.compiler.version}</h2><dl className="compactDl"><dt>Canonicality</dt><dd>{m.canonicality}</dd><dt>Frozen inputs</dt><dd>{m.source.records}</dd><dt>Objects</dt><dd>{m.objectTotal}</dd><dt>Repository hash</dt><dd><code>{m.repositoryHash}</code></dd></dl></article><article><div className="kicker">Taxonomy</div><h2>Taxon register</h2>{taxa.map(t=><div className="registryRow" key={t.id}><code>{t.id}</code><span><strong><em>{t.scientificName}</em></strong><small>{t.commonName}</small></span></div>)}</article></section>
  <section className="profileSection"><div className="sectionHeading"><div><div className="kicker">Graph layer</div><h2>Explicit relationships</h2></div></div>{rels.map(r=><div className="registryRow" key={r.id}><code>{r.id}</code><span><strong>{r.label}</strong><small>{r.fromId} → {r.toId}</small></span></div>)}</section>
  <div className="notice"><strong>Generated-file rule:</strong> {m.notes}</div>
 </>;
}
