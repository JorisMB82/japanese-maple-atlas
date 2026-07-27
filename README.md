# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for finding, comparing and researching Japanese maple cultivars.

## Current programme baseline — application v0.11.5

The repository is operating under **ROADMAP-002 Version 1.1 — Approved and governing**, an integrated three-track plan for engineering, editorial/content production and media/visual assets.

Current state:

- Sprint 11 scalable ingestion is complete;
- Sprint 11.5 media governance and deterministic visual derivatives are complete and merged;
- RC-001 through RC-005 remain the five frozen public Reference Standards;
- the repository contains 235 first-class objects;
- RC-006 through RC-010 are the first coordinated publication wave;
- editorial and media work proceed in separate streams and converge through engineering/integration validation.

Authoritative programme documents:

- [`ROADMAP-002 Version 1.1 — Approved Integrated Three-Track Operating Plan`](docs/ROADMAP-002_Post-Sprint-10_RC-020-Visual-Atlas-Roadmap_v1.1_APPROVED.docx)
- [`DR-ROADMAP-002-001 — Approval and implementation record`](docs/DR-ROADMAP-002-001_Approval-of-ROADMAP-002-v1.1.md)
- [`STATUS-002 — Post-Sprint-11.5 three-track baseline`](docs/STATUS-002_Post-Sprint-11.5-Three-Track-Baseline.md)
- [`RC-001–RC-025 programme register`](docs/PROGRAMME-REGISTER_RC-001-RC-025.md)

The historical Version 1.0 Markdown roadmap remains in the repository for traceability but is operationally superseded by Version 1.1.

## Three-track ownership

- **Engineering/integration:** contracts, schemas, compiler, validation, generated systems, application, CI and deployment.
- **Editorial/content:** cultivar selection, RC Markdown, source sidecars, evidence synthesis, editorial decisions and freeze recommendations.
- **Media/visual assets:** source assets, media sidecars, rights/provenance, specimen-identity treatment, captions, alt text and coverage.

Branches should normally use `engineering/`, `content/`, `media/` and `integration/` prefixes. No track should edit another track's owned files or assume that unmerged files in another conversation exist.

## Sprint 11.5 media governance

Sprint 11.5 adds the governed visual layer required before RC-006 production:

- media-v2 rights, licence, provenance, privacy and approval metadata;
- preserved source checksums and deterministic thumb, card, display and archive derivatives;
- conspicuous non-evidentiary labelling for Atlas illustrations and reconstructions;
- RC-001 through RC-020 coverage accounting with explicit governed gaps;
- media processing, drift validation, schema checks, tests and CI integration.

The five frozen botanical records and 235 repository objects remain unchanged. Visual attractiveness is presentation only and is never cultivar-identification evidence.

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
npm run process:media                # generate deterministic visual derivatives
npm run validate:media               # rights, provenance, privacy and coverage checks
npm run validate:reference-standards # canonical RC and sidecar preflight
npm run compile:atlas:dry-run        # build and report without publishing
npm run verify:repository            # contributor, compiler, schema, repository, search, graph and explorer checks
npm run validate:explorer            # explorer projection, state, comparison, saved-view and export checks
npm run test:unit                    # pure services and usability source invariants
npm run test:integration             # repository, compiler and schema boundaries
npm run test:coverage                # governed native Node coverage thresholds
npm run build                        # validated production static export
npm run test:regression              # exported routes, links, content and assets
npm run validate:scale               # synthetic 20-, 25- and 150-record compiler proof
npm run validate:quality             # quality-infrastructure and release invariants
npm run verify                       # complete local release-readiness sequence
npm run release:manifest             # release evidence and SHA-256 checksums
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
- `docs/ROADMAP-002_Post-Sprint-10_RC-020-Visual-Atlas-Roadmap_v1.1_APPROVED.docx` — approved and governing three-track operating plan
- `docs/ROADMAP-002_Post-Sprint-10_RC-020-Visual-Atlas-Roadmap_v1.0.md` — superseded historical roadmap
- `docs/STATUS-002_Post-Sprint-11.5-Three-Track-Baseline.md` — current programme status addendum
- `docs/PROGRAMME-REGISTER_RC-001-RC-025.md` — live cross-track operating register
- `docs/COMPILER-002_Scalable-Reference-Standard-Ingestion_v1.0.md` — canonical ingestion and publication contract
- `SPRINT-11.md` — Sprint 11 implementation and review boundary
- `SPRINT-11.5.md` — completed governed media pipeline record
- `docs/MEDIA-002_Visual-Asset-Governance-and-Pipeline_v1.0.md` — media contract and operating procedure
