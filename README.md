# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for discovering, comparing and governing Japanese maple cultivar knowledge.

## Sprint 9.5 / application v0.9.5

Sprint 9.5 establishes the permanent testing and quality infrastructure governing the Atlas:

- native Node unit tests for search, graph and schema behaviour;
- integration tests for repository closure, hashes and compiler determinism;
- JSON Schema validation across fourteen repository object classes and indexes;
- production static-export route, link, content and asset regression tests;
- governed line, function and branch coverage thresholds;
- multi-job GitHub Actions quality gates;
- release manifests, SHA-256 checksums and packaged static exports;
- manual and version-tag release automation.

The repository data remains at v0.9.0 with 235 first-class objects. The five frozen Reference Standards and the Sprint 9 knowledge graph are unchanged; Sprint 9.5 adds the quality system that protects them and future work.

## Repository principle

The repository is the source of truth. The application is a derived interface. Contributions enter through governed inputs and only approved, validated repository knowledge may reach publication outputs.

## Install and run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The graph explorer is available at `http://localhost:3000/graph`.

## Quality commands

```bash
npm run verify:repository   # contributor, compiler, schema, repository, search and graph checks
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
npm run verify
```

Do not edit generated JSON under `atlas-repository/` or `lib/repository-registry.js` directly. Relationship proposals must enter through the governed relationship standards or contributor workflow and retain evidence selectors, rationale, uncertainty and review history.

## Continuous integration and releases

Every pull request and `main` update runs repository validation, schema conformance, unit and integration tests, coverage thresholds, the production build and static-export regression tests. Quality and release evidence are retained as GitHub Actions artifacts.

The release-readiness workflow can be run manually. A pushed `v*` tag executes the complete verification chain, packages the static export, generates checksums and creates a GitHub release from the verified tag.

## Repository structure

- `atlas-repository/reference-standards/` — frozen canonical cultivar inputs
- `atlas-repository/relationship-standards/` — governed relationship vocabulary and relationship specifications
- `editorial-inbox/` — governed contributor and submission inputs
- `atlas-repository/relationships/` — generated graph edge objects
- `atlas-repository/relationship-types/` — generated controlled relationship types
- `atlas-repository/indexes/graph-index.json` — generated nodes, edges, adjacency and graph statistics
- `quality/quality-gates.json` — governed thresholds, routes and regression invariants
- `tests/unit/` — search, graph and schema-validator behaviour
- `tests/integration/` — repository, compiler and schema boundary tests
- `tests/regression/` — production static-export regression tests
- `lib/knowledge-graph.mjs` — deterministic graph construction, traversal and ranking services
- `lib/search-engine.mjs` — query parsing, relevance, explainability and facets
- `lib/json-schema-validator.mjs` — dependency-free schema validation engine
- `scripts/compile-atlas.mjs` — deterministic repository and graph compiler
- `scripts/validate-schemas.mjs` — repository-wide schema conformance
- `scripts/validate-quality.mjs` — quality infrastructure verification
- `scripts/generate-release-manifest.mjs` — release evidence and checksums
- `.github/workflows/repository-validation.yml` — pull-request and production quality gates
- `.github/workflows/release-readiness.yml` — validated artifact and tagged-release automation
- `docs/QA-001_Testing-and-Quality-Infrastructure_v1.0.md` — quality architecture and operations
