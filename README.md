# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for finding, comparing and researching Japanese maple cultivars.

## Sprint 10 usability remediation / application v0.10.1

Sprint 10 remains complete. Application v0.10.1 is a focused usability-remediation release before external testing. It preserves the repository-first architecture while improving first-time comprehension and mobile use:

- accessible mobile navigation with every destination visible in one menu;
- plain-language home, Explorer, graph, Compare and Repository introductions;
- progressive disclosure for advanced Explorer filters, guided examples and evidence metrics;
- explicit A/B cultivar selection from a five-item research set;
- inline saved-view naming instead of `window.prompt()`;
- print/PDF, CSV and provenance-preserving JSON exports;
- responsive, copyable repository hashes without page-wide overflow;
- in-page navigation on long cultivar records;
- clearer Compare loading, empty and recovery states;
- targeted unit and static-export regression coverage.

The repository data remains at v0.9.0 with 235 first-class objects. The five frozen Reference Standards, assertions, evidence, sources and Sprint 9 graph are unchanged. Sprint 11 has not started.

## Repository principle

The repository is the source of truth. The application is a derived interface. Contributions enter through governed inputs and only approved, validated repository knowledge may reach publication outputs. Explorer searches, saved views, selections, comparison pairs and exports never modify repository knowledge.

## Install and run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The integrated Explorer is at `http://localhost:3000/explorer`; the graph remains at `http://localhost:3000/graph`.

## Explorer workflows

The Explorer supports:

- everyday searches such as `upright laceleaf`, `weeping red`, or `partial shade`;
- common filters for growth habit, leaf form and foliage colour;
- advanced filters for exposure, mature scale and growing considerations;
- gallery, trait-table, seasonal and relationship views;
- separate spring, summer, autumn and winter-interest inspection;
- explicit comparison-pair selection inside a research set of up to five cultivars;
- shareable URL state and browser-local saved views;
- print/PDF, CSV and machine-readable JSON export.

Technical evidence, relationship rationale, confidence, repository versions and hashes remain available through contextual disclosures and repository pages.

## Quality commands

```bash
npm run verify:repository   # contributor, compiler, schema, repository, search, graph and explorer checks
npm run validate:explorer   # explorer projection, state, comparison, saved-view and export checks
npm run test:unit           # pure services and usability source invariants
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

Every pull request and `main` update runs repository validation, schema conformance, search, graph and Explorer validation, unit and integration tests, coverage thresholds, the production build and static-export regression tests. Quality and release evidence are retained as GitHub Actions artifacts.

The release-readiness workflow can be run manually. A pushed `v*` tag executes the complete verification chain, packages the static export, generates checksums and creates a GitHub release from the verified tag.

## Repository structure

- `atlas-repository/reference-standards/` — frozen canonical cultivar inputs
- `atlas-repository/relationship-standards/` — governed relationship vocabulary and specifications
- `editorial-inbox/` — governed contributor and submission inputs
- `app/explorer/` — integrated interactive research workspace
- `components/AtlasExplorerWorkspace.js` — coordinated Explorer interface
- `lib/atlas-explorer.mjs` — deterministic Explorer state, pairing and export services
- `quality/quality-gates.json` — governed thresholds, routes and release invariants
- `tests/unit/` — search, graph, Explorer, usability and schema-validator behaviour
- `tests/integration/` — repository, compiler and schema boundary tests
- `tests/regression/` — production static-export regression tests
- `scripts/compile-atlas.mjs` — deterministic repository and graph compiler
- `scripts/validate-explorer.mjs` — Explorer-state and repository-projection validation
- `scripts/validate-quality.mjs` — quality-infrastructure verification
- `.github/workflows/repository-validation.yml` — pull-request and production quality gates
- `.github/workflows/release-readiness.yml` — validated artifact and tagged-release automation
- `docs/EXPLORER-001_Interactive-Atlas-Explorer_v1.0.md` — Explorer architecture and operating boundary
- `docs/UX-001_Sprint-10-Usability-Remediation_v1.0.md` — remediation decisions, tests and residual limits
- `docs/QA-001_Testing-and-Quality-Infrastructure_v1.0.md` — quality architecture and operations
