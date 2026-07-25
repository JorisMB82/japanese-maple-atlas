const canonicalPair = (a, b) => [a, b].sort().join('::');

const unique = values => [...new Set(values.filter(Boolean))];

export function nodeTypeForId(id = '') {
  if (id.startsWith('RC-')) return 'cultivar';
  if (id.startsWith('TAX-')) return 'taxon';
  return 'unknown';
}

export function buildKnowledgeGraphIndex({ cultivars, taxa, relationships, relationshipTypes, repositoryHash }) {
  const typeById = new Map(relationshipTypes.map(type => [type.id, type]));
  const nodes = [
    ...cultivars.map(cultivar => ({
      id: cultivar.id,
      nodeType: 'cultivar',
      label: cultivar.cultivar,
      scientificName: cultivar.scientificName,
      slug: cultivar.slug,
      taxonId: cultivar.taxonId,
      status: cultivar.status,
      summary: cultivar.summary,
      traits: {
        habit: cultivar.habit,
        leafForm: cultivar.leafForm,
        springColor: cultivar.springColor,
        summerColor: cultivar.summerColor,
        autumnColor: cultivar.autumnColor,
        bark: cultivar.bark,
        light: cultivar.light,
        sizeClass: cultivar.sizeClass
      }
    })),
    ...taxa.map(taxon => ({
      id: taxon.id,
      nodeType: 'taxon',
      label: taxon.scientificName,
      scientificName: taxon.scientificName,
      commonName: taxon.commonName,
      rank: taxon.rank,
      status: taxon.status
    }))
  ].sort((a, b) => a.id.localeCompare(b.id));

  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const edges = relationships.map(relationship => {
    const type = typeById.get(relationship.typeId);
    return {
      id: relationship.id,
      fromId: relationship.fromId,
      toId: relationship.toId,
      fromType: relationship.fromType || nodeTypeForId(relationship.fromId),
      toType: relationship.toType || nodeTypeForId(relationship.toId),
      typeId: relationship.typeId,
      type: type?.code || relationship.type,
      category: type?.category || relationship.category,
      directionality: type?.directionality || relationship.directionality,
      label: relationship.label,
      inverseLabel: relationship.inverseLabel || type?.inverseLabel || relationship.label,
      strength: relationship.strength,
      confidence: relationship.confidence,
      status: relationship.status,
      rationale: relationship.rationale,
      evidenceAssertionIds: relationship.evidenceAssertionIds || [],
      sourceIds: relationship.sourceIds || [],
      properties: relationship.properties || {}
    };
  }).sort((a, b) => a.id.localeCompare(b.id));

  const adjacency = Object.fromEntries(nodes.map(node => [node.id, []]));
  for (const edge of edges) {
    adjacency[edge.fromId]?.push({ edgeId: edge.id, nodeId: edge.toId, direction: 'out' });
    adjacency[edge.toId]?.push({
      edgeId: edge.id,
      nodeId: edge.fromId,
      direction: edge.directionality === 'directed' ? 'in' : 'out'
    });
  }
  for (const entries of Object.values(adjacency)) entries.sort((a, b) => a.edgeId.localeCompare(b.edgeId));

  const categoryCounts = {};
  const typeCounts = {};
  for (const edge of edges) {
    categoryCounts[edge.category] = (categoryCounts[edge.category] || 0) + 1;
    typeCounts[edge.typeId] = (typeCounts[edge.typeId] || 0) + 1;
  }

  const cultivarIds = cultivars.map(item => item.id);
  const components = connectedComponents({ nodes, edges, adjacency });
  const pairCounts = {};
  for (const edge of edges.filter(edge => edge.fromType === 'cultivar' && edge.toType === 'cultivar')) {
    const pair = canonicalPair(edge.fromId, edge.toId);
    pairCounts[pair] = (pairCounts[pair] || 0) + 1;
  }

  const graphHashPayload = JSON.stringify({
    nodes: nodes.map(node => ({ id: node.id, nodeType: node.nodeType })),
    edges: edges.map(edge => ({
      id: edge.id,
      fromId: edge.fromId,
      toId: edge.toId,
      typeId: edge.typeId,
      strength: edge.strength,
      evidenceAssertionIds: edge.evidenceAssertionIds
    }))
  });

  return {
    version: '1.0.0',
    repositoryHash,
    graphHashPayload,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodes,
    edges,
    adjacency,
    stats: {
      cultivarNodes: cultivars.length,
      taxonNodes: taxa.length,
      relationshipTypes: relationshipTypes.length,
      categories: categoryCounts,
      types: typeCounts,
      cultivarPairs: Object.keys(pairCounts).length,
      connectedComponents: components.length,
      allCultivarsConnected: cultivarIds.every(id => adjacency[id]?.length > 0)
    }
  };
}

function connectedComponents(graph) {
  const seen = new Set();
  const components = [];
  for (const node of graph.nodes) {
    if (seen.has(node.id)) continue;
    const queue = [node.id];
    const component = [];
    seen.add(node.id);
    while (queue.length) {
      const id = queue.shift();
      component.push(id);
      for (const entry of graph.adjacency[id] || []) {
        if (!seen.has(entry.nodeId)) {
          seen.add(entry.nodeId);
          queue.push(entry.nodeId);
        }
      }
    }
    components.push(component.sort());
  }
  return components;
}

export function getGraphNode(graph, id) {
  return graph.nodes.find(node => node.id === id);
}

export function getGraphEdge(graph, id) {
  return graph.edges.find(edge => edge.id === id);
}

export function getGraphNeighbors(graph, nodeId, filters = {}) {
  const nodeById = new Map(graph.nodes.map(node => [node.id, node]));
  const edgeById = new Map(graph.edges.map(edge => [edge.id, edge]));
  return (graph.adjacency[nodeId] || [])
    .map(entry => {
      const edge = edgeById.get(entry.edgeId);
      const node = nodeById.get(entry.nodeId);
      if (!edge || !node) return null;
      const label = edge.fromId === nodeId ? edge.label : edge.inverseLabel;
      return { ...entry, edge, node, label };
    })
    .filter(Boolean)
    .filter(item => !filters.category || item.edge.category === filters.category)
    .filter(item => !filters.typeId || item.edge.typeId === filters.typeId)
    .filter(item => !filters.nodeType || item.node.nodeType === filters.nodeType)
    .sort((a, b) => b.edge.strength - a.edge.strength || a.edge.id.localeCompare(b.edge.id));
}

export function findShortestPath(graph, startId, endId, options = {}) {
  if (!startId || !endId || startId === endId) {
    return startId === endId && startId ? { nodeIds: [startId], edgeIds: [], length: 0 } : null;
  }
  const allowedTypeIds = options.typeIds?.length ? new Set(options.typeIds) : null;
  const allowedCategories = options.categories?.length ? new Set(options.categories) : null;
  const edgeById = new Map(graph.edges.map(edge => [edge.id, edge]));
  const queue = [{ nodeId: startId, nodeIds: [startId], edgeIds: [] }];
  const seen = new Set([startId]);
  const maxDepth = Number.isInteger(options.maxDepth) ? options.maxDepth : 8;

  while (queue.length) {
    const current = queue.shift();
    if (current.edgeIds.length >= maxDepth) continue;
    for (const entry of graph.adjacency[current.nodeId] || []) {
      const edge = edgeById.get(entry.edgeId);
      if (!edge) continue;
      if (allowedTypeIds && !allowedTypeIds.has(edge.typeId)) continue;
      if (allowedCategories && !allowedCategories.has(edge.category)) continue;
      if (seen.has(entry.nodeId)) continue;
      const next = {
        nodeId: entry.nodeId,
        nodeIds: [...current.nodeIds, entry.nodeId],
        edgeIds: [...current.edgeIds, edge.id]
      };
      if (entry.nodeId === endId) return { nodeIds: next.nodeIds, edgeIds: next.edgeIds, length: next.edgeIds.length };
      seen.add(entry.nodeId);
      queue.push(next);
    }
  }
  return null;
}

export function getRelationshipsBetween(graph, firstId, secondId) {
  return graph.edges
    .filter(edge => (edge.fromId === firstId && edge.toId === secondId) || (edge.fromId === secondId && edge.toId === firstId))
    .sort((a, b) => b.strength - a.strength || a.id.localeCompare(b.id));
}

export function rankRelatedCultivars(graph, cultivarId, limit = 4) {
  const scores = new Map();
  for (const neighbor of getGraphNeighbors(graph, cultivarId, { nodeType: 'cultivar' })) {
    const current = scores.get(neighbor.node.id) || { node: neighbor.node, score: 0, relationships: [] };
    const categoryWeight = neighbor.edge.category === 'diagnosis' ? 3 : neighbor.edge.category === 'morphology' || neighbor.edge.category === 'architecture' ? 2 : 1;
    current.score += neighbor.edge.strength * categoryWeight;
    current.relationships.push(neighbor.edge);
    scores.set(neighbor.node.id, current);
  }
  return [...scores.values()]
    .sort((a, b) => b.score - a.score || a.node.label.localeCompare(b.node.label))
    .slice(0, limit);
}

export function graphCategories(graph) {
  return unique(graph.edges.map(edge => edge.category)).sort();
}
