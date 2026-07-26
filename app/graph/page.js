import KnowledgeGraphExplorer from '@/components/KnowledgeGraphExplorer';
import { getKnowledgeGraph, getRelationshipTypes } from '@/lib/repository';

export const metadata = {
  title: 'Cultivar relationships',
  description: 'Explore verified taxonomic, morphological, architectural, seasonal, cultivation and diagnostic relationships among Japanese maple cultivars.'
};

export default function KnowledgeGraphPage() {
  const graph = getKnowledgeGraph();
  const relationshipTypes = getRelationshipTypes();
  return <>
    <section className="pageIntro graphIntro">
      <div className="kicker">Cultivar relationships</div>
      <h1>See how Japanese maple cultivars are similar, different and connected.</h1>
      <p>Choose a cultivar to see shared leaf forms, contrasting growth habits, seasonal similarities and other evidence-linked comparisons.</p>
      <div className="graphStartingPoints" aria-label="Suggested graph starting points"><span>Try:</span><a href="/graph?node=RC-002">Seiryu and dissected foliage</a><a href="/graph?node=RC-004">Crimson Queen and cascading form</a><a href="#relationship-path">Find a path between two cultivars</a></div>
    </section>
    <details className="evidenceDisclosure"><summary>What a relationship does—and does not—mean</summary><p>Every connection retains a rationale, category, strength and confidence. A connection records an approved comparison; it does not prove synonymy, genetic identity or specimen authenticity.</p><p>{graph.nodeCount} nodes · {graph.edgeCount} connections · {graph.stats.relationshipTypes} relationship types.</p></details>
    <KnowledgeGraphExplorer graph={graph} relationshipTypes={relationshipTypes}/>
  </>;
}
