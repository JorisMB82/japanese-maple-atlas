import fs from 'node:fs';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import {
  ROOT,
  buildCompilerOutputs,
  buildRecord,
  collectEditorialInputs,
  collectGraphInputs,
  collectInputs,
  loadCompilerGovernance
} from './compile-atlas.mjs';
import { syntheticReferenceStandard, syntheticSupport } from '../tests/helpers/synthetic-reference-standard.mjs';

const TARGETS = [20, 25, 150];
const governance = loadCompilerGovernance();
const base = collectInputs({ governance }).records;
const editorialInputs = collectEditorialInputs();
const graphInputs = collectGraphInputs();
const reports = [];

for (const target of TARGETS) {
  const records = [...base];
  for (let number = records.length + 1; number <= target; number += 1) {
    const id = `RC-${String(number).padStart(3, '0')}`;
    const markdown = syntheticReferenceStandard(id);
    const support = syntheticSupport(id, ROOT);
    records.push(buildRecord(path.join(ROOT, 'synthetic', `${id}.md`), markdown, records.length + 1, governance, support));
  }
  const started = performance.now();
  const result = buildCompilerOutputs(records, editorialInputs, graphInputs, governance);
  const elapsedMs = performance.now() - started;
  const objectIds = result.manifest.objectTotal;
  const outputBytes = [...result.outputs.values()].reduce((sum, content) => sum + Buffer.byteLength(content), 0);
  const searchIndex = JSON.parse(result.outputs.get('atlas-repository/indexes/search-index.json'));
  const objectIndex = JSON.parse(result.outputs.get('atlas-repository/indexes/object-index.json'));
  const graphIndex = JSON.parse(result.outputs.get('atlas-repository/indexes/graph-index.json'));
  const ids = objectIndex.objects.map(item => item.id);
  const unique = new Set(ids).size === ids.length;
  if (result.manifest.source.records !== target) throw new Error(`${target}: manifest record count mismatch`);
  if (result.manifest.objectCounts.cultivars !== target) throw new Error(`${target}: cultivar count mismatch`);
  if (result.manifest.objectCounts.assertions !== target * 22) throw new Error(`${target}: assertion count mismatch`);
  if (result.manifest.objectCounts.evidence !== target * 7) throw new Error(`${target}: evidence count mismatch`);
  if (searchIndex.records.length !== target) throw new Error(`${target}: search index coverage mismatch`);
  if (graphIndex.nodeCount !== target + governance.taxa.length) throw new Error(`${target}: graph node count mismatch`);
  if (!unique) throw new Error(`${target}: duplicate object identifiers`);
  if (elapsedMs > 5000) throw new Error(`${target}: compiler exceeded 5000 ms performance budget (${elapsedMs.toFixed(1)} ms)`);
  reports.push({ targetRecords: target, elapsedMs: Number(elapsedMs.toFixed(2)), objectTotal: objectIds, outputBytes, uniqueObjectIds: unique, searchRecords: searchIndex.records.length, graphNodes: graphIndex.nodeCount, repositoryHash: result.manifest.repositoryHash });
}

const report = { compilerScaleVersion: '1.0.0', generatedAt: '2026-07-26', targets: reports };
const reportPath = path.join(ROOT, 'quality-reports', 'compiler-scale.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
console.log('Japanese Maple Atlas — Sprint 11 compiler scale validation');
for (const item of reports) console.log(`PASS  ${item.targetRecords} records — ${item.objectTotal} objects, ${item.elapsedMs} ms, ${item.outputBytes} bytes`);
console.log(`Report: ${path.relative(ROOT, reportPath)}`);
