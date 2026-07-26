'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  findShortestPath,
  getGraphEdge,
  getGraphNeighbors,
  getGraphNode,
  graphCategories
} from '@/lib/knowledge-graph.mjs';

const categoryLabels = {
  taxonomy: 'Taxonomy',
  morphology: 'Leaf morphology',
  architecture: 'Growth architecture',
  'seasonal-expression': 'Seasonal expression',
  cultivation: 'Cultivation',
  diagnosis: 'Diagnostic comparison'
};

function graphPositions(nodes) {
  const taxa = nodes.filter(node => node.nodeType === 'taxon');
  const cultivars = nodes.filter(node => node.nodeType === 'cultivar');
  const positions = {};
  taxa.forEach((node, index) => {
    positions[node.id] = { x: 250 + (index * 400), y: 95 };
  });
  cultivars.forEach((node, index) => {
    const angle = (-Math.PI / 2) + (index * ((Math.PI * 2) / cultivars.length));
    positions[node.id] = { x: 450 + Math.cos(angle) * 300, y: 365 + Math.sin(angle) * 205 };
  });
  return positions;
}

function nodeHref(node) {
  return node.nodeType === 'cultivar' ? `/cultivars/${node.slug}` : `/graph?node=${node.id}`;
}

function PathResult({ graph, path }) {
  if (!path) return <p className="graphMuted">No path is available with the current graph.</p>;
  return <ol className="graphPath" aria-label="Relationship path">
    {path.nodeIds.map((nodeId, index) => {
      const node = getGraphNode(graph, nodeId);
      const edge = index ? getGraphEdge(graph, path.edgeIds[index - 1]) : null;
      return <li key={`${nodeId}-${index}`}>
        {edge && <span className="pathEdge"><strong>{edge.label}</strong><small>{categoryLabels[edge.category] || edge.category}</small></span>}
        <a href={nodeHref(node)}><code>{node.id}</code><strong>{node.label}</strong></a>
      </li>;
    })}
  </ol>;
}

export default function KnowledgeGraphExplorer({ graph, relationshipTypes }) {
  const cultivarNodes = graph.nodes.filter(node => node.nodeType === 'cultivar');
  const [category, setCategory] = useState('all');
  const [selectedId, setSelectedId] = useState(cultivarNodes[0]?.id || graph.nodes[0]?.id);
  const [startId, setStartId] = useState(cultivarNodes[0]?.id || '');
  const [endId, setEndId] = useState(cultivarNodes[1]?.id || '');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get('node');
    if (requested && graph.nodes.some(node => node.id === requested)) setSelectedId(requested);
  }, [graph.nodes]);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (selectedId) url.searchParams.set('node', selectedId);
    window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
  }, [selectedId]);

  const categories = useMemo(() => graphCategories(graph), [graph]);
  const positions = useMemo(() => graphPositions(graph.nodes), [graph.nodes]);
  const visibleEdges = useMemo(
    () => graph.edges.filter(edge => category === 'all' || edge.category === category),
    [category, graph.edges]
  );
  const selectedNode = getGraphNode(graph, selectedId);
  const neighbors = getGraphNeighbors(graph, selectedId, category === 'all' ? {} : { category });
  const path = useMemo(() => findShortestPath(graph, startId, endId), [graph, startId, endId]);
  const typeById = useMemo(() => new Map(relationshipTypes.map(type => [type.id, type])), [relationshipTypes]);

  return <>
    <section className="graphControls" aria-label="Graph controls">
      <label><span>Relationship category</span><select value={category} onChange={event => setCategory(event.target.value)}>
        <option value="all">All categories ({graph.edgeCount})</option>
        {categories.map(item => <option key={item} value={item}>{categoryLabels[item] || item} ({graph.stats.categories[item]})</option>)}
      </select></label>
      <label><span>Focus node</span><select value={selectedId} onChange={event => setSelectedId(event.target.value)}>
        <optgroup label="Cultivars">{cultivarNodes.map(node => <option key={node.id} value={node.id}>{node.label}</option>)}</optgroup>
        <optgroup label="Taxa">{graph.nodes.filter(node => node.nodeType === 'taxon').map(node => <option key={node.id} value={node.id}>{node.label}</option>)}</optgroup>
      </select></label>
      <div className="graphLegend" aria-label="Node legend"><span><i className="cultivarDot"/>Cultivar</span><span><i className="taxonDot"/>Taxon</span><span>{visibleEdges.length} visible edges</span></div>
    </section>

    <section className="graphCanvasCard" aria-label="Knowledge graph visualization">
      <svg className="graphCanvas" viewBox="0 0 900 620" role="img" aria-labelledby="graph-title graph-description">
        <title id="graph-title">Japanese Maple Atlas cultivar knowledge graph</title>
        <desc id="graph-description">Cultivar and taxon nodes connected by governed botanical and diagnostic relationships.</desc>
        <g className="graphEdges">
          {visibleEdges.map(edge => {
            const from = positions[edge.fromId], to = positions[edge.toId];
            if (!from || !to) return null;
            const selected = edge.fromId === selectedId || edge.toId === selectedId;
            return <line key={edge.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`graphEdge graphEdge-${edge.category} ${selected ? 'selected' : ''}`} strokeWidth={1 + edge.strength * .55}>
              <title>{edge.label}: {edge.rationale}</title>
            </line>;
          })}
        </g>
        <g className="graphNodes">
          {graph.nodes.map(node => {
            const position = positions[node.id];
            const selected = node.id === selectedId;
            return <g key={node.id} className={`graphNode graphNode-${node.nodeType} ${selected ? 'selected' : ''}`} transform={`translate(${position.x} ${position.y})`} role="button" tabIndex="0" aria-label={`Focus ${node.label}`} onClick={() => setSelectedId(node.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setSelectedId(node.id); }}>
              <circle r={node.nodeType === 'taxon' ? 42 : 36}/>
              <text textAnchor="middle" y="-2">{node.nodeType === 'taxon' ? node.label.replace('Acer ', 'A. ') : node.label}</text>
              <text className="nodeId" textAnchor="middle" y="17">{node.id}</text>
            </g>;
          })}
        </g>
      </svg>
    </section>

    <section className="graphDetailGrid">
      <article className="graphNodeDetail">
        <div className="kicker">Focused node</div>
        <h2>{selectedNode?.label}</h2>
        <p className="graphScientific"><em>{selectedNode?.scientificName}</em></p>
        {selectedNode?.summary && <p>{selectedNode.summary}</p>}
        <div className="graphNodeMeta"><code>{selectedNode?.id}</code><span>{selectedNode?.nodeType}</span><span>{neighbors.length} visible relationship{neighbors.length === 1 ? '' : 's'}</span></div>
        {selectedNode?.nodeType === 'cultivar' && <a className="button secondary" href={`/cultivars/${selectedNode.slug}`}>Open cultivar profile</a>}
      </article>
      <article>
        <div className="kicker">Governed neighborhood</div>
        <h2>Direct relationships</h2>
        {!neighbors.length ? <div className="empty">No relationships match this category.</div> : <div className="graphNeighborList">
          {neighbors.map(({ edge, node, label }) => <button key={edge.id} onClick={() => setSelectedId(node.id)}>
            <span><code>{edge.id}</code><strong>{label}</strong><small>{typeById.get(edge.typeId)?.label || edge.typeId} · strength {edge.strength}/5 · {edge.confidence} confidence</small></span>
            <span><strong>{node.label}</strong><small>{node.nodeType}</small></span>
          </button>)}
        </div>}
      </article>
    </section>

    <section className="profileSection graphPathSection" id="relationship-path">
      <div className="sectionHeading"><div><div className="kicker">Graph traversal</div><h2>Find a relationship path</h2></div><p>Shortest path across governed edges</p></div>
      <div className="pathControls">
        <label><span>Start cultivar</span><select value={startId} onChange={event => setStartId(event.target.value)}>{cultivarNodes.map(node => <option key={node.id} value={node.id}>{node.label}</option>)}</select></label>
        <button type="button" className="swapButton" aria-label="Swap path endpoints" onClick={() => { setStartId(endId); setEndId(startId); }}>⇄</button>
        <label><span>End cultivar</span><select value={endId} onChange={event => setEndId(event.target.value)}>{cultivarNodes.map(node => <option key={node.id} value={node.id}>{node.label}</option>)}</select></label>
      </div>
      <PathResult graph={graph} path={path}/>
    </section>
  </>;
}
