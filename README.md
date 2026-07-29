# Japanese Maple Atlas

An evidence-aware botanical knowledge platform for finding, comparing and researching Japanese maple cultivars.

## Current programme baseline — application v0.11.5

The repository operates under the approved two-speed, Visual-First publication model:

- **Catalogue Profiles** provide reviewed, risk-qualified breadth through the lean C0–C3 workflow;
- **Reference Standards** provide selected cultivars with deep G1–G9 assurance;
- Catalogue imagery separates lawful reuse rights from transparent specimen-identity confidence;
- one stable `CUL-######` identity persists across revision or later Reference Standard promotion;
- the repository remains the source of truth and `main` remains the production source.

ROADMAP-002A Version 1.0 governs the two-speed model. ROADMAP-002B Version 1.0 adds the Visual-First Catalogue media standard.

Current state:

- RC-001 through RC-005 are the five frozen public Reference Standards;
- RC-006 through RC-010 have passed G4 but remain non-public while G5 media is blocked;
- the Reference Standard repository contains 235 first-class objects;
- Catalogue Batch C-001 publishes five LOW-risk Catalogue Profiles under C0–C3;
- CUL-000011 through CUL-000015 currently use temporary governed visual gaps and are assigned immediate Visual-First backfill;
- CUL-000016 through CUL-000020 are the next Catalogue production batch and will use the Visual-First standard from the start;
- all 25 stable identities remain governed by the approved registry;
- Reference Standard G5 remains unchanged.

Authoritative programme documents:

- [`ROADMAP-002A Version 1.0 — Approved two-speed governing amendment`](docs/ROADMAP-002A_Two-Speed-Catalogue-and-Reference-Standard-Addendum_v1.0_APPROVED.md)
- [`ROADMAP-002B Version 1.0 — Approved Visual-First Catalogue amendment`](docs/ROADMAP-002B_Visual-First-Catalogue-Amendment_v1.0_APPROVED.md)
- [`DR-STRATEGY-003 — Visual-First Catalogue owner approval`](docs/DR-STRATEGY-003_Visual-First-Catalogue-Owner-Approval.md)
- [`DR-CATALOGUE-001 — Assignments 011–025`](docs/DR-CATALOGUE-001_Owner-Approval-of-Cultivar-Assignments-011-025.md)
- [`DR-CATALOGUE-002 — C-001 governed gaps and publication`](docs/DR-CATALOGUE-002_Owner-Approval-of-C-001-Governed-Gaps-and-Publication.md)
- [`CATALOGUE-001 — Catalogue Profile specification`](docs/CATALOGUE-001_Catalogue-Profile-Specification_v0.1.md)
- [`CATALOGUE-002 — Visual-First Catalogue media contract`](docs/CATALOGUE-002_Visual-First-Catalogue-Media-Contract_v1.0.md)
- [`MEDIA-016 — Visual-First Catalogue policy`](docs/MEDIA-016_Visual-First-Catalogue-Policy_v1.0.md)
- [`ARCH-002 — Stable cultivar identity and publication classes`](docs/ARCH-002_Stable-Cultivar-Identity-and-Publication-Class-Model_v0.1.md)
- [`Cultivar identity programme register 001–025`](docs/PROGRAMME-REGISTER_RC-001-RC-025.md)

The original ROADMAP-002 Version 1.1 remains authoritative for the three-track operating model except where ROADMAP-002A or ROADMAP-002B expressly amends it.

## Publication classes and gates

### Catalogue Profile

A normal low-risk Catalogue Profile uses one canonical JSON input under:

`atlas-repository/catalogue-profiles/CUL-######.json`

It passes:

- **C0** — owner-approved assignment and duplicate review;
- **C1** — lean content, sources, risk and editorial review;
- **C2** — normally a lawful three-item visual gallery covering habit, foliage and seasonal or diagnostic representation, or a controlled exception or governed gap;
- **C3** — schema, semantic, build, regression, release and production validation.

Catalogue images may be `documented`, `source-asserted` or `community-identified`. Every displayed item requires a lawful reuse basis, attribution and item-level identity-confidence disclosure. Rights-unresolved images may be retained as research candidates but cannot be displayed.

High-risk profiles cannot use routine batch approval. A probable duplicate, unresolved rights issue or concealed identity dispute blocks publication.

### Reference Standard

Reference Standards retain the existing canonical Markdown and sidecar contract, G1–G9, individual owner G8 freeze and deterministic Atlas Compiler publication path.

Catalogue publication and Visual-First identity qualification do not weaken or replace a Reference Standard or its G5 requirements.

## Three-track ownership

- **Engineering/integration:** contracts, stable identity, schemas, compiler, validation, generated systems, application, CI, releases and batch integration.
- **Editorial/content:** cultivar assignment proposals, duplicate/risk review, Catalogue content, compact sources, visual-role guidance, Reference Standard research and freeze recommendations.
- **Media/visual assets:** candidates, rights, provenance, identity-confidence treatment, source preservation, derivatives, governed gaps, captions, alt text and visual coverage.

Branches normally use `engineering/`, `content/`, `media/` and `integration/` prefixes. No track should edit another track's owned files or assume that unmerged work exists.

## Repository principle

The repository is the source of truth. The application is a derived interface. Only approved, validated repository knowledge and lawfully reusable media may reach public outputs.

Searches, saved views, research sets, comparison pairs and exports never modify repository knowledge. Visual resemblance is never treated as cultivar authentication.

## Install and run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`. The class-aware Explorer is at `http://localhost:3000/explorer`; the relationship graph is at `http://localhost:3000/graph`.

## Explorer and comparison workflows

The public interface supports:

- filtering by **Catalogue Profile** or **Reference Standard**;
- stable cultivar identity and record-ID disclosure;
- everyday searches such as `upright laceleaf`, `weeping red` or `partial shade`;
- common and advanced horticultural facets;
- gallery, trait-table, seasonal and relationship views;
- cross-class comparison with evidence-depth and media-state disclosure;
- shareable URL state and browser-local saved views;
- print/PDF, CSV and governed JSON export.

Reference Standards expose structured assertions and evidence. Catalogue Profiles expose compact sources, risk, review state, confidence, media roles, rights basis and identity-confidence state without implying equivalent assurance depth.

## Quality commands

```bash
npm run process:media                 # generate deterministic visual derivatives
npm run validate:media                # rights, provenance, privacy and coverage checks
npm run validate:reference-standards  # canonical RC and sidecar preflight
npm run validate:catalogue            # Catalogue schema and C0–C3 semantic checks
npm run compile:atlas:check           # Reference Standard output drift check
npm run compile:catalogue:check       # Catalogue validation and deterministic compile check
npm run verify:repository             # full repository, compiler, schema, search, graph and Explorer checks
npm run test:unit                     # pure services and contract behaviour
npm run test:integration              # repository and compiler boundaries
npm run test:coverage                 # governed native Node thresholds
npm run build                         # validated production static export
npm run test:regression               # exported routes, links, disclosures and assets
npm run validate:scale                # synthetic 20-, 25- and 150-record compiler proof
npm run validate:quality              # quality and release invariants
npm run verify                        # complete local release-readiness sequence
npm run release:manifest              # release evidence and SHA-256 checksums
```

Coverage thresholds, required routes, stable identity counts and release files are governed in `quality/quality-gates.json`. Release manifests checksum the stable identity registry, Catalogue schemas, every canonical Catalogue input and the static export.

## Continuous integration and releases

Every pull request and `main` update runs the three protected checks:

- `Repository, schemas and tests`;
- `Native Node coverage thresholds`;
- `Production build and static regression`.

The first job explicitly validates both publication paths. The release workflow executes the complete verification chain, generates a Catalogue-aware release manifest and packages the static export for version tags.

## Repository structure

- `atlas-repository/reference-standards/` — Reference Standard Markdown, contracts and sidecars
- `atlas-repository/catalogue-profiles/` — Catalogue inputs plus stable identity contract
- `atlas-repository/catalogue-profiles/contract/cultivar-identity-registry.json` — governed `CUL-######` registry
- `atlas-repository/schemas/catalogue-profile.schema.json` — canonical Catalogue schema
- `lib/catalogue-profile-compiler.mjs` — semantic validation and generic Catalogue compiler
- `lib/catalogue-runtime.js` — published-only build-time Catalogue discovery
- `lib/catalogue-data.js` — class-aware application data layer
- `lib/catalogue-explorer.mjs` — publication-class Explorer state and exports
- `scripts/validate-catalogue-profiles.mjs` — canonical Catalogue validator
- `scripts/compile-catalogue-profiles.mjs` — deterministic Catalogue check command
- `app/explorer/` and `components/AtlasExplorerWorkspace.js` — class-aware research workspace
- `quality/quality-gates.json` — governed thresholds, routes and release invariants
- `tests/unit/`, `tests/integration/`, `tests/regression/` — contract, pipeline and static-export tests
- `.github/workflows/repository-validation.yml` — protected pull-request and production gates
- `.github/workflows/release-readiness.yml` — validated artefact and tagged-release automation
- `docs/HANDOFF-ENGINEERING-CATALOGUE-003_Visual-First-Media-Implementation.md` — active Visual-First implementation authority

## Current publication boundary

C-001 contains the first five public Catalogue Profiles. Their governed gaps remain transparent temporary states until lawful galleries replace them.

The Visual-First amendment authorises C-001 backfill and requires C-002 and later batches to target three-to-five-item lawful galleries. No rights-unresolved candidate, synthetic fixture or unapproved image is a public cultivar asset.
