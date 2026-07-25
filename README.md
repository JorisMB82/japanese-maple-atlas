# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for discovering, comparing and governing Japanese maple cultivar knowledge.

## Sprint 10 / application v0.10.0

Sprint 10 adds the integrated Interactive Atlas Explorer:

- dedicated `/explorer` research workspace;
- semantic search and contextual facets;
- gallery, trait-matrix, seasonal and relationship views;
- overview, identity, morphology, seasonal, cultivation and evidence lenses;
- shareable URL state;
- browser-local saved views;
- focused record inspection;
- five guided investigations;
- research sets containing up to five cultivars;
- direct handoff to comparison and graph routes;
- derivative JSON export with repository provenance;
- dedicated explorer validation, tests and static-export regression coverage.

The repository data remains at v0.9.0 with 235 first-class objects. The five frozen Reference Standards, assertions, evidence, sources and Sprint 9 graph are unchanged. Sprint 10 is an application-layer workspace over those governed objects.

## Repository principle

The repository is the source of truth. The application is a derived interface. Contributions enter through governed inputs and only approved, validated repository knowledge may reach publication outputs. Explorer selections, saved views and exports never silently modify repository knowledge.

## Install and run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The integrated explorer is at `http://localhost:3000/explorer`; the graph explorer remains at `http://localhost:3000/graph`.

## Explorer workflows

The explorer supports:

- semantic queries such as `laceleaf upright`, `weeping red`, or `species:"Acer shirasawanum"`;
- governed facets for habit, leaf form, colour, exposure, scale and cultivation risk;
- trait matrices driven by an analysis lens;
- separate spring, summer, autumn and winter-interest inspection;
- graph relationship rationale, confidence and strength;
- shareable workspace URLs;
- local saved views;
- research-set comparison and JSON export.

Exported JSON identifies the repository version, repository hash and canonicality. It is a derivative research aid, not a repository package or authentication certificate.

## Quality commands

```bash
npm run verify:repository   # contributor, compiler, schema, repository, search, graph and explorer checks
npm run validate:explorer   # explorer projections, state, presets, research sets and exports
npm run test:unit           # pure service behaviour
npm run test:integration    # repository, compiler and schema boundaries
npm run test:coverage       # governed native Node coverage thresholds
npm run build               # validated production static export
npm run test:regression     # exported routes, links, content and assets
npm run validate:quality    # quality-infrastructure and release invariants
npm run verify              # complete local release-readiness sequence
npm run release:manifest    # release evidence and SHA-256 checksums
```

Coverage thresholds and release invariants are governed in `quality/quality-gates.json`. The production static export is written to `out/`; release evidence is written to `release-artifacts/`.

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
npm run verify
```

Do not edit generated JSON under `atlas-repository/` or `lib/repository-registry.js` directly. Relationship proposals must enter through the governed relationship standards or contributor workflow and retain evidence selectors, rationale, uncertainty and review history.

## Continuous integration and releases

Every pull request and `main` update runs repository validation, schema conformance, search, graph and explorer validation, unit and integration tests, coverage thresholds, the production build and static-export regression tests. Quality and release evidence are retained as GitHub Actions artifacts.

The release-readiness workflow can be run manually. A pushed `v*` tag executes the complete verification chain, packages the static export, generates checksums and creates a GitHub release from the verified tag.

## Repository structure

- `atlas-repository/reference-standards/` — frozen canonical cultivar inputs
- `atlas-repository/relationship-standards/` — governed relationship vocabulary and relationship specifications
- `editorial-inbox/` — governed contributor and submission inputs
- `atlas-repository/relationships/` — generated graph edge objects
- `atlas-repository/relationship-types/` — generated controlled relationship types
- `atlas-repository/indexes/graph-index.json` — generated nodes, edges, adjacency and graph statistics
- `app/explorer/` — integrated interactive research workspace
- `components/AtlasExplorerWorkspace.js` — coordinated explorer interface
- `lib/atlas-explorer.mjs` — deterministic explorer state, projection, selection and export services
- `quality/quality-gates.json` — governed thresholds, routes and regression invariants
- `tests/unit/` — search, graph, explorer and schema-validator behaviour
- `tests/integration/` — repository, compiler and schema boundary tests
- `tests/regression/` — production static-export regression tests
- `lib/knowledge-graph.mjs` — deterministic graph construction, traversal and ranking services
- `lib/search-engine.mjs` — query parsing, relevance, explainability and facets
- `lib/json-schema-validator.mjs` — dependency-free schema validation engine
- `scripts/compile-atlas.mjs` — deterministic repository and graph compiler
- `scripts/validate-explorer.mjs` — explorer-state and repository-projection validation
- `scripts/validate-schemas.mjs` — repository-wide schema conformance
- `scripts/validate-quality.mjs` — quality infrastructure verification
- `scripts/generate-release-manifest.mjs` — release evidence and checksums
- `.github/workflows/repository-validation.yml` — pull-request and production quality gates
- `.github/workflows/release-readiness.yml` — validated artifact and tagged-release automation
- `docs/EXPLORER-001_Interactive-Atlas-Explorer_v1.0.md` — explorer architecture and operating boundary
- `docs/QA-001_Testing-and-Quality-Infrastructure_v1.0.md` — quality architecture and operations
