import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  findShortestPath,
  getGraphNeighbors,
  getRelationshipsBetween,
  rankRelatedCultivars
} from '../lib/knowledge-graph.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const REPOSITORY = path.join(ROOT, 'atlas-repository');
const readJson = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const readDirectory = directory => fs.readdirSync(path.join(REPOSITORY, directory))
  .filter(file => file.endsWith('.json'))
  .sort()
  .map(file => readJson(path.join(REPOSITORY, directory, file)));
const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
const errors = [];
const checks = [];
const assert = (condition, label, detail = '') => {
  if (condition) checks.push([label, 'PASS']);
  else { checks.push([label, 'FAIL']); errors.push(`${label}${detail ? `: ${detail}` : ''}`); }
};

const manifest = readJson(path.join(REPOSITORY, 'manifest.json'));
const graph = readJson(path.join(REPOSITORY, 'indexes', 'graph-index.json'));
const cultivars = readDirectory('cultivars');
const taxa = readDirectory('taxonomy');
const assertions = readDirectory('assertions');
const relationships = readDirectory('relationships');
const relationshipTypes = readDirectory('relationship-types');
const nodes = [...cultivars.map(item => [item.id, 'cultivar']), ...taxa.map(item => [item.id, 'taxon'])];
const nodeTypeById = new Map(nodes);
const assertionById = new Map(assertions.map(item => [item.id, item]));
const typeById = new Map(relationshipTypes.map(item => [item.id, item]));
const relationshipById = new Map(relationships.map(item => [item.id, item]));

assert(manifest.repositoryVersion === '0.9.0', 'Sprint 9 repository version', manifest.repositoryVersion);
assert(manifest.objectCounts.relationships === 26, 'Relationship object count', manifest.objectCounts.relationships);
assert(manifest.objectCounts.relationshipTypes === 10, 'Relationship type count', manifest.objectCounts.relationshipTypes);
assert(manifest.objectTotal === 235, 'Repository object total', manifest.objectTotal);
assert(graph.nodeCount === 7 && graph.stats.cultivarNodes === 5 && graph.stats.taxonNodes === 2, 'Graph node inventory');
assert(graph.edgeCount === relationships.length && graph.edgeCount === 26, 'Graph edge inventory');
assert(graph.stats.relationshipTypes === relationshipTypes.length, 'Graph vocabulary inventory');

const relationshipIds = new Set();
const symmetricKeys = new Set();
for (const relationship of relationships) {
  if (relationshipIds.has(relationship.id)) errors.push(`Duplicate relationship ID ${relationship.id}`);
  relationshipIds.add(relationship.id);
  const type = typeById.get(relationship.typeId);
  if (!type) { errors.push(`${relationship.id}: unknown type ${relationship.typeId}`); continue; }
  const fromType = nodeTypeById.get(relationship.fromId);
  const toType = nodeTypeById.get(relationship.toId);
  if (!fromType || !toType) errors.push(`${relationship.id}: missing endpoint`);
  if (fromType !== relationship.fromType || toType !== relationship.toType) errors.push(`${relationship.id}: endpoint type metadata mismatch`);
  if (!type.allowedNodePairs.includes(`${fromType}:${toType}`)) errors.push(`${relationship.id}: disallowed node pair ${fromType}:${toType}`);
  if (relationship.fromId === relationship.toId) errors.push(`${relationship.id}: self-edge`);
  if (!Number.isInteger(relationship.strength) || relationship.strength < 1 || relationship.strength > 5) errors.push(`${relationship.id}: invalid strength`);
  if (!['high','moderate','low'].includes(relationship.confidence)) errors.push(`${relationship.id}: invalid confidence`);
  if (!relationship.rationale || relationship.rationale.length < 40) errors.push(`${relationship.id}: rationale is too short`);
  if (type.evidenceRequired && !relationship.evidenceAssertionIds.length) errors.push(`${relationship.id}: evidence is required`);
  for (const assertionId of relationship.evidenceAssertionIds) {
    const assertion = assertionById.get(assertionId);
    if (!assertion) errors.push(`${relationship.id}: missing assertion ${assertionId}`);
    else if (![relationship.fromId, relationship.toId].includes(assertion.subjectId) && !relationship.properties?.sharedContext) errors.push(`${relationship.id}: evidence assertion ${assertionId} is outside edge subjects`);
  }
  if (type.directionality === 'symmetric') {
    const key = [relationship.fromId, relationship.toId].sort().join('::') + `::${relationship.typeId}`;
    if (symmetricKeys.has(key)) errors.push(`${relationship.id}: duplicate symmetric edge ${key}`);
    symmetricKeys.add(key);
    if (relationship.label !== relationship.inverseLabel && !relationship.inverseLabel) errors.push(`${relationship.id}: symmetric relationship lacks inverse label`);
  }
}
assert(!errors.some(error => error.includes('relationship') || error.includes('edge') || error.includes('endpoint') || error.includes('assertion')), 'Relationship schemas and evidence links');

for (const cultivar of cultivars) {
  const expected = relationships.filter(item => item.fromId === cultivar.id || item.toId === cultivar.id).map(item => item.id).sort();
  assert(JSON.stringify([...cultivar.relationshipIds].sort()) === JSON.stringify(expected), `${cultivar.id} relationship registry`, `${cultivar.relationshipIds.length}/${expected.length}`);
}
for (const taxon of taxa) {
  const expected = relationships.filter(item => item.fromId === taxon.id || item.toId === taxon.id).map(item => item.id).sort();
  assert(JSON.stringify([...taxon.relationshipIds].sort()) === JSON.stringify(expected), `${taxon.id} relationship registry`, `${taxon.relationshipIds.length}/${expected.length}`);
}

const graphNodeIds = new Set(graph.nodes.map(node => node.id));
assert(graphNodeIds.size === graph.nodeCount && nodes.every(([id]) => graphNodeIds.has(id)), 'Graph index node coverage');
assert(graph.edges.every(edge => relationshipById.has(edge.id)), 'Graph index edge coverage');
assert(Object.keys(graph.adjacency).length === graph.nodeCount, 'Adjacency index coverage');
for (const edge of graph.edges) {
  if (!(graph.adjacency[edge.fromId] || []).some(entry => entry.edgeId === edge.id && entry.nodeId === edge.toId)) errors.push(`${edge.id}: missing forward adjacency`);
  if (!(graph.adjacency[edge.toId] || []).some(entry => entry.edgeId === edge.id && entry.nodeId === edge.fromId)) errors.push(`${edge.id}: missing reverse adjacency`);
}
assert(!errors.some(error => error.includes('adjacency')), 'Bidirectional traversal index');

const expectedGraphHash = sha256(JSON.stringify({
  nodes: graph.nodes.map(node => ({ id: node.id, nodeType: node.nodeType })),
  edges: graph.edges.map(edge => ({ id: edge.id, fromId: edge.fromId, toId: edge.toId, typeId: edge.typeId, strength: edge.strength, evidenceAssertionIds: edge.evidenceAssertionIds }))
}));
assert(graph.graphHash === expectedGraphHash && manifest.graph.graphHash === graph.graphHash, 'Graph hash integrity');
assert(manifest.graph.nodes === graph.nodeCount && manifest.graph.edges === graph.edgeCount, 'Manifest graph summary');

const seiryuCrimson = getRelationshipsBetween(graph, 'RC-002', 'RC-004');
assert(seiryuCrimson.some(edge => edge.typeId === 'RLT-SHARED-LEAF-MORPHOLOGY'), 'Seiryu–Crimson Queen shared morphology edge');
assert(seiryuCrimson.some(edge => edge.typeId === 'RLT-CONTRASTING-GROWTH-HABIT'), 'Seiryu–Crimson Queen contrasting architecture edge');
assert(seiryuCrimson.some(edge => edge.typeId === 'RLT-DIAGNOSTIC-COMPARISON'), 'Seiryu–Crimson Queen diagnostic edge');

const aureumTaxon = getGraphNeighbors(graph, 'RC-005', { category: 'taxonomy' });
assert(aureumTaxon.some(item => item.node.id === 'TAX-ASHI' && item.edge.typeId === 'RLT-BELONGS-TO-TAXON'), 'Aureum accepted-taxon traversal');
const crossSpeciesPath = findShortestPath(graph, 'RC-005', 'RC-002');
assert(crossSpeciesPath && crossSpeciesPath.length >= 1, 'Cross-species path traversal');
const ranked = rankRelatedCultivars(graph, 'RC-002', 4);
assert(ranked[0]?.node.id === 'RC-004', 'Evidence-weighted related cultivar ranking', ranked[0]?.node.id);
assert(graph.stats.allCultivarsConnected === true && graph.stats.connectedComponents === 1, 'Connected graph invariant');

console.log('Japanese Maple Atlas — Sprint 9 knowledge graph validation');
console.log(`Nodes: ${graph.nodeCount}`);
console.log(`Edges: ${graph.edgeCount}`);
console.log(`Relationship types: ${relationshipTypes.length}`);
for (const [label, result] of checks) console.log(`${result.padEnd(4)}  ${label}`);
if (errors.length) {
  console.error(`\nErrors: ${errors.length}`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('\nErrors: 0');
console.log('Knowledge graph validation: PASS');
