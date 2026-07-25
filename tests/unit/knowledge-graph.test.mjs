import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildKnowledgeGraphIndex,
  findShortestPath,
  getGraphEdge,
  getGraphNeighbors,
  getGraphNode,
  getRelationshipsBetween,
  graphCategories,
  nodeTypeForId,
  rankRelatedCultivars
} from '../../lib/knowledge-graph.mjs';
import { repositoryFixture } from '../helpers/repository-fixture.mjs';

const fixture = repositoryFixture();
const graph = fixture.graph;

test('nodeTypeForId recognises governed identifiers', () => {
  assert.equal(nodeTypeForId('RC-001'), 'cultivar');
  assert.equal(nodeTypeForId('TAX-APAL'), 'taxon');
  assert.equal(nodeTypeForId('AST-000001'), 'unknown');
  assert.equal(nodeTypeForId(), 'unknown');
});

test('buildKnowledgeGraphIndex reconstructs the generated graph deterministically', () => {
  const rebuilt = buildKnowledgeGraphIndex({
    cultivars: fixture.cultivars,
    taxa: fixture.taxa,
    relationships: fixture.relationships,
    relationshipTypes: fixture.relationshipTypes,
    repositoryHash: fixture.manifest.repositoryHash
  });
  assert.equal(rebuilt.nodeCount, 7);
  assert.equal(rebuilt.edgeCount, 26);
  assert.equal(rebuilt.stats.connectedComponents, 1);
  assert.equal(rebuilt.stats.allCultivarsConnected, true);
  assert.deepEqual(rebuilt.nodes.map(node => node.id), graph.nodes.map(node => node.id));
  assert.deepEqual(rebuilt.edges.map(edge => edge.id), graph.edges.map(edge => edge.id));
  assert.deepEqual(rebuilt.adjacency, graph.adjacency);
});

test('node and edge lookup return governed objects', () => {
  assert.equal(getGraphNode(graph, 'RC-005').label, 'Aureum');
  assert.equal(getGraphNode(graph, 'TAX-APAL').nodeType, 'taxon');
  assert.equal(getGraphEdge(graph, 'REL-000016').typeId, 'RLT-SHARED-LEAF-MORPHOLOGY');
  assert.equal(getGraphNode(graph, 'RC-999'), undefined);
});

test('neighborhood traversal supports category, type and node filters', () => {
  const all = getGraphNeighbors(graph, 'RC-002');
  assert.ok(all.length > 0);
  assert.ok(all[0].edge.strength >= all.at(-1).edge.strength);
  const morphology = getGraphNeighbors(graph, 'RC-002', { category: 'morphology' });
  assert.ok(morphology.every(item => item.edge.category === 'morphology'));
  const taxa = getGraphNeighbors(graph, 'RC-002', { nodeType: 'taxon' });
  assert.deepEqual(taxa.map(item => item.node.id), ['TAX-APAL']);
  const diagnostic = getGraphNeighbors(graph, 'RC-002', { typeId: 'RLT-DIAGNOSTIC-COMPARISON' });
  assert.deepEqual(diagnostic.map(item => item.node.id), ['RC-004']);
  assert.deepEqual(getGraphNeighbors(graph, 'RC-999'), []);
});

test('directed taxonomic edges expose relative labels in both directions', () => {
  const cultivarSide = getGraphNeighbors(graph, 'RC-001', { nodeType: 'taxon' })[0];
  const taxonSide = getGraphNeighbors(graph, 'TAX-APAL', { nodeType: 'cultivar' })
    .find(item => item.node.id === 'RC-001');
  assert.equal(cultivarSide.direction, 'out');
  assert.match(cultivarSide.label, /belongs to/i);
  assert.equal(taxonSide.direction, 'in');
  assert.match(taxonSide.label, /includes/i);
});

test('shortest paths handle identical, missing, filtered and bounded endpoints', () => {
  assert.deepEqual(findShortestPath(graph, 'RC-001', 'RC-001'), { nodeIds: ['RC-001'], edgeIds: [], length: 0 });
  assert.equal(findShortestPath(graph, '', 'RC-001'), null);
  const direct = findShortestPath(graph, 'RC-002', 'RC-004');
  assert.equal(direct.length, 1);
  assert.deepEqual(direct.nodeIds, ['RC-002', 'RC-004']);
  const taxonBridge = findShortestPath(graph, 'RC-001', 'RC-004', { typeIds: ['RLT-BELONGS-TO-TAXON'] });
  assert.equal(taxonBridge.length, 2);
  assert.ok(taxonBridge.nodeIds.includes('TAX-APAL'));
  assert.equal(findShortestPath(graph, 'RC-001', 'RC-004', { categories: ['cultivation'], maxDepth: 1 }), null);
  assert.equal(findShortestPath(graph, 'RC-001', 'RC-004', { typeIds: ['RLT-SHARED-LEAF-MORPHOLOGY'] }), null);
});

test('pairwise relationship retrieval is symmetric and strength ordered', () => {
  const forward = getRelationshipsBetween(graph, 'RC-002', 'RC-004');
  const reverse = getRelationshipsBetween(graph, 'RC-004', 'RC-002');
  assert.deepEqual(forward.map(edge => edge.id), reverse.map(edge => edge.id));
  assert.deepEqual(forward.map(edge => edge.typeId), [
    'RLT-SHARED-LEAF-MORPHOLOGY',
    'RLT-CONTRASTING-GROWTH-HABIT',
    'RLT-DIAGNOSTIC-COMPARISON',
    'RLT-SAME-TAXON-PEER'
  ]);
  assert.deepEqual(getRelationshipsBetween(graph, 'RC-001', 'RC-999'), []);
});

test('related-cultivar ranking is evidence weighted and limited', () => {
  const ranked = rankRelatedCultivars(graph, 'RC-002', 2);
  assert.equal(ranked.length, 2);
  assert.equal(ranked[0].node.id, 'RC-004');
  assert.ok(ranked[0].score > ranked[1].score);
  assert.ok(ranked[0].relationships.length >= 3);
  assert.deepEqual(rankRelatedCultivars(graph, 'RC-999'), []);
});

test('graph categories are unique and alphabetically stable', () => {
  assert.deepEqual(graphCategories(graph), [
    'architecture',
    'cultivation',
    'diagnosis',
    'morphology',
    'seasonal-expression',
    'taxonomy'
  ]);
});
