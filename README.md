# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for finding, comparing and researching Japanese maple cultivars.

## Sprint 11 scalable ingestion / application v0.11.0

Sprint 11 removes the five-record compiler boundary while preserving the five frozen Reference Standards unchanged. Atlas Compiler 2.0.0 now provides:

- an approved canonical RC-006+ contract and template with explicit synonym, relationship, source and media registers;
- external legacy adapters for RC-001 through RC-005;
- a governed exception registry instead of cultivar-specific JavaScript branches;
- per-record, record-scoped underlying-source provenance, source locators and evidence-domain mappings;
- per-record governed media sidecars;
- automatic discovery of approved Reference Standards;
- dynamic object totals, search coverage and graph inventory;
- record-level preflight and dry-run diagnostics;
- transactional generated-output publication with rollback protection;
- conforming RC-006 integration proof;
- synthetic compiler validation at 20, 25 and 150 records.

The repository remains at five public cultivars and 235 first-class objects, but the repository contract is now v0.11.0 and ready for RC-006 production. Sprint 11.5 media governance and new botanical content remain separate next steps.

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
npm run validate:reference-standards # canonical RC and sidecar preflight
npm run compile:atlas:dry-run        # build and report without publishing
npm run verify:repository            # contributor, compiler, schema, repository, search, graph and explorer checks
npm run validate:explorer   # explorer projection, state, comparison, saved-view and export checks
npm run test:unit           # pure services and usability source invariants
npm run test:integration    # repository, compiler and schema boundaries
npm run test:coverage       # governed native Node coverage thresholds
npm run build               # validated production static export
npm run test:regression     # exported routes, links, content and assets
npm run validate:scale      # synthetic 20-, 25- and 150-record compiler proof
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

Every pull request and `main` update runs Reference Standard preflight, compiler drift and scale validation, repository and schema conformance, search, graph and Explorer validation, unit and integration tests, coverage thresholds, the production build and static-export regression tests. Quality and release evidence are retained as GitHub Actions artifacts.

The release-readiness workflow can be run manually. A pushed `v*` tag executes the complete verification chain, packages the static export, generates checksums and creates a GitHub release from the verified tag.

## Repository structure

- `atlas-repository/reference-standards/` — frozen cultivar inputs plus governed contract, source-provenance and media sidecars
- `atlas-repository/relationship-standards/` — governed relationship vocabulary and specifications
- `editorial-inbox/` — governed contributor and submission inputs
- `app/explorer/` — integrated interactive research workspace
- `components/AtlasExplorerWorkspace.js` — coordinated Explorer interface
- `lib/atlas-explorer.mjs` — deterministic Explorer state, pairing and export services
- `quality/quality-gates.json` — governed thresholds, routes and release invariants
- `tests/unit/` — search, graph, Explorer, usability and schema-validator behaviour
- `tests/integration/` — repository, compiler and schema boundary tests
- `tests/regression/` — production static-export regression tests
- `scripts/compile-atlas.mjs` — deterministic, contract-driven and transactional repository compiler
- `scripts/scale-test-compiler.mjs` — synthetic 20-, 25- and 150-record scale validation
- `scripts/validate-explorer.mjs` — Explorer-state and repository-projection validation
- `scripts/validate-quality.mjs` — quality-infrastructure verification
- `.github/workflows/repository-validation.yml` — pull-request and production quality gates
- `.github/workflows/release-readiness.yml` — validated artifact and tagged-release automation
- `docs/EXPLORER-001_Interactive-Atlas-Explorer_v1.0.md` — Explorer architecture and operating boundary
- `docs/UX-001_Sprint-10-Usability-Remediation_v1.0.md` — remediation decisions, tests and residual limits
- `docs/QA-001_Testing-and-Quality-Infrastructure_v1.0.md` — quality architecture and operations
- `docs/ROADMAP-002_Post-Sprint-10_RC-020-Visual-Atlas-Roadmap_v1.0.md` — locked RC-020 governing roadmap
- `docs/COMPILER-002_Scalable-Reference-Standard-Ingestion_v1.0.md` — canonical ingestion and publication contract
- `SPRINT-11.md` — Sprint 11 implementation and review boundary
