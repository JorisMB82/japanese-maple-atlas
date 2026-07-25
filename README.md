# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for discovering, comparing and governing Japanese maple cultivar knowledge.

## Sprint 9 / application and repository v0.9.0

The Atlas now provides a governed, evidence-linked cultivar knowledge graph:

- five cultivar nodes and two accepted taxon nodes;
- twenty-six first-class relationship objects;
- ten controlled relationship types;
- taxonomic, morphological, architectural, seasonal, cultivation and diagnostic relationship categories;
- explicit directionality, inverse labels, strength and confidence;
- assertion and source links for every graph edge;
- deterministic adjacency and traversal indexes;
- shortest-path and related-cultivar services;
- an interactive public graph explorer;
- dedicated graph validation integrated into permanent CI.

The five frozen Reference Standards remain the canonical botanical source. Graph relationships organize approved comparisons and taxonomic links without creating new cultivar identity claims or authenticating specimens.

## Repository principle

The repository is the source of truth. The application is a derived interface. Contributions enter through governed inputs and only approved, validated repository knowledge may reach publication outputs.

## Run locally

```bash
npm install
npm run validate:contributions
npm run compile:atlas:check
npm run validate:repository
npm run validate:search
npm run validate:graph
npm run dev
```

Open `http://localhost:3000`. The graph explorer is available at `http://localhost:3000/graph`.

## Search examples

```text
laceleaf upright
weeping red
yellow "partial shade"
leaf:laceleaf -habit:cascading
bark:"coral bark"
species:"Acer shirasawanum"
```

## Create a contribution

```bash
npm run contribution:new -- \
  --target RC-001 \
  --type evidence-addition \
  --title "Add verified observation" \
  --contributor CTR-CONTRIBUTOR-ID
```

Then complete the generated file under `editorial-inbox/submissions/` and run:

```bash
npm run compile:atlas
npm test
```

Do not edit generated JSON under `atlas-repository/` or `lib/repository-registry.js` directly. Relationship proposals must enter through the governed relationship standards or contributor workflow and retain evidence selectors, rationale, uncertainty and review history.

## Production build

```bash
npm run build
```

The static export is written to `out/`.

## Repository structure

- `atlas-repository/reference-standards/` — frozen canonical cultivar inputs
- `atlas-repository/relationship-standards/` — governed relationship vocabulary and relationship specifications
- `editorial-inbox/` — governed contributor and submission inputs
- `atlas-repository/relationships/` — generated graph edge objects
- `atlas-repository/relationship-types/` — generated controlled relationship types
- `atlas-repository/indexes/graph-index.json` — generated nodes, edges, adjacency and graph statistics
- `lib/knowledge-graph.mjs` — deterministic graph construction, traversal and ranking services
- `lib/search-vocabulary.mjs` — governed semantic concepts and aliases
- `lib/search-engine.mjs` — query parsing, relevance, explainability and facets
- `scripts/compile-atlas.mjs` — deterministic repository and graph compiler
- `scripts/validate-contributions.mjs` — contributor-input validation
- `scripts/validate-repository.mjs` — repository integrity validation
- `scripts/validate-search.mjs` — semantic-search validation
- `scripts/validate-graph.mjs` — graph schema, evidence, traversal and integrity validation
- `app/graph/` — interactive graph application route
- `docs/` — architecture, editorial, search, graph, contributor and implementation records
