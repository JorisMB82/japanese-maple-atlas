import KnowledgeGraphExplorer from '@/components/KnowledgeGraphExplorer';
import { getKnowledgeGraph, getRelationshipTypes } from '@/lib/repository';

export const metadata = {
  title: 'Knowledge graph',
  description: 'Explore governed taxonomic, morphological, architectural, seasonal, cultivation and diagnostic relationships among Japanese maple cultivars.'
};

export default function KnowledgeGraphPage() {
  const graph = getKnowledgeGraph();
  const relationshipTypes = getRelationshipTypes();
  return <>
    <section className="pageIntro graphIntro">
      <div className="kicker">Sprint 9 · governed relationships</div>
      <h1>Explore how cultivars are connected—and why.</h1>
      <p>The knowledge graph joins cultivar and taxon nodes through explicit, evidence-linked relationships. Shared traits, contrasts and diagnostic comparisons remain separate from identity claims, and every edge retains its rationale and confidence.</p>
      <div className="graphStats">
        <article><strong>{graph.nodeCount}</strong><span>Graph nodes</span></article>
        <article><strong>{graph.edgeCount}</strong><span>Governed edges</span></article>
        <article><strong>{graph.stats.relationshipTypes}</strong><span>Relationship types</span></article>
        <article><strong>{Object.keys(graph.stats.categories).length}</strong><span>Knowledge categories</span></article>
      </div>
    </section>
    <div className="notice"><strong>Interpretation boundary:</strong> a graph edge records an approved relationship or comparison. It does not establish synonymy, genetic identity or specimen authentication unless a future governed relationship type explicitly states that conclusion.</div>
    <KnowledgeGraphExplorer graph={graph} relationshipTypes={relationshipTypes}/>
  </>;
}
