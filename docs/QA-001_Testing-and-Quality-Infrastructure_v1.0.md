# QA-001 — Testing and Quality Infrastructure

**Version:** 1.0  
**Status:** Sprint 9.5 implementation  
**Effective date:** 2026-07-25

## Purpose

Sprint 9.5 establishes a permanent, repository-first quality system for the Japanese Maple Atlas. It converts the validation commands introduced in earlier sprints into layered automated quality gates covering unit behaviour, integration boundaries, regression protection, schema conformance, compiler determinism, coverage thresholds, production export integrity and release packaging.

## Governing principles

- The repository remains the primary product; the application is a derived interface.
- Frozen Reference Standards and generated repository objects must not drift silently.
- A successful production build is necessary but not sufficient for release readiness.
- Tests must exercise both successful and failure paths.
- Quality thresholds and release invariants are governed data, not undocumented CI settings.
- Release artifacts must identify their source commit and carry reproducible checksums.
- No quality workflow may mutate canonical repository content.

## Quality configuration

`quality/quality-gates.json` records the controlled quality thresholds and regression invariants:

- Node.js 24 runtime;
- application version 0.9.5;
- repository data version 0.9.0;
- minimum line, function and branch coverage;
- stable repository object counts;
- required static routes;
- required package scripts;
- files required in a release evidence set.

Changes to these gates require review because lowering a threshold or changing an invariant changes the project's release standard.

## Test layers

### Unit tests

Native Node test-runner suites cover pure behaviour in:

- semantic query normalisation and parsing;
- governed semantic aliases and exclusions;
- relevance scoring and explainability;
- facets, suggestions and similarity services;
- graph construction, node and edge lookup;
- filtered graph traversal and shortest paths;
- evidence-weighted related-cultivar ranking;
- the dependency-free JSON Schema validation engine.

Unit tests are located under `tests/unit/` and run with `npm run test:unit`.

### Integration tests

Integration suites cover boundaries between repository files and executable systems:

- complete repository inventory and referential closure;
- object-index and hash-registry reproducibility;
- editorial workflow baseline integrity;
- compiler drift checks;
- fresh compilation in an isolated temporary repository;
- repeated compilation determinism;
- positive and negative JSON Schema validation paths.

Integration tests are located under `tests/integration/` and run with `npm run test:integration`.

### Production regression tests

The static-export regression suite runs only after a production build. It checks:

- every governed public route has exported HTML;
- release-defining content remains present;
- internal application links resolve to exported routes;
- referenced Next.js static assets exist.

Regression tests are located under `tests/regression/` and run with `npm run test:regression`.

## Schema validation

`lib/json-schema-validator.mjs` implements the JSON Schema features used by the Atlas schemas without introducing a runtime dependency. It supports object, array, scalar and null types; required and additional properties; patterns; constants; enumerations; numeric and length limits; unique arrays; item schemas; local references; and common schema combinators.

`scripts/validate-schemas.mjs` applies fourteen governed schemas to compiled repository objects, including cultivars, assertions, evidence, sources, taxonomy, relationships, relationship types, media, contributors, submissions, editorial workflows, editorial reviews, the compiler manifest and the graph index.

Schema validation complements, rather than replaces, cross-reference and domain-specific repository validation.

## Coverage

`npm run test:coverage` uses the Node.js native test coverage facility. Thresholds are read from `quality/quality-gates.json`; the command fails when line, function or branch coverage falls below the governed minimum. The complete console report is preserved at `quality-reports/coverage.txt` and uploaded by CI.

Coverage is a quality signal, not a substitute for meaningful assertions. Threshold changes must be reviewed together with the affected tests.

## Continuous integration

`.github/workflows/repository-validation.yml` defines three independent quality jobs:

1. **Repository, schemas and tests** — installs from the lockfile with `npm ci`, validates all repository layers and runs unit and integration tests.
2. **Native Node coverage thresholds** — enforces coverage and uploads the report even when the threshold fails.
3. **Production build and static regression** — builds the static application, runs route and asset regression tests, validates the quality infrastructure, generates release evidence and uploads both the evidence and static export.

Concurrency cancellation prevents obsolete pull-request runs from consuming resources while preserving the latest run.

## Release automation

`.github/workflows/release-readiness.yml` runs manually or when a `v*` tag is pushed. It:

- installs exactly from `package-lock.json`;
- executes the full `npm run verify` chain;
- generates a release manifest and SHA-256 checksums;
- packages the static export and release evidence;
- uploads a ninety-day workflow artifact;
- creates a GitHub release for version tags using the verified tag and generated release notes.

`scripts/generate-release-manifest.mjs` records the application version, repository version, compiler version, repository and graph hashes, source commit, source ref, quality thresholds, artifact inventory, byte size and per-file checksums.

## Standard commands

```bash
npm ci
npm run verify:repository
npm run test:unit
npm run test:integration
npm run test:coverage
npm run build
npm run test:regression
npm run validate:quality
npm run release:manifest
```

`npm run verify` executes the complete local release-readiness sequence.

## Failure handling

A failing quality gate blocks merge or release. The correction should address the underlying defect; generated outputs, snapshots, expected counts or thresholds must not be changed merely to make a failing test pass. Changes to canonical data require the established editorial workflow and compiler process.

## Future extension

Sprint 10 and later capabilities should add focused unit, integration and regression tests in the same change that introduces the capability. Browser-level accessibility and interaction testing may be added when the interactive explorer requires behaviour that cannot be validated through static export and pure service tests.

## Sprint 10 usability-remediation coverage

Application v0.10.1 extends the permanent quality system without changing the governed thresholds. Targeted tests now cover:

- mobile navigation completeness, disclosure semantics and active state;
- progressive disclosure of Explorer controls;
- explicit, URL-stable A/B comparison selection inside a five-record research set;
- saved-view naming without browser `prompt()`;
- readable CSV export and provenance-preserving JSON export;
- responsive repository identifier containment and copyability;
- cultivar in-page navigation;
- Compare loading and recovery content;
- release-defining usability content in the production static export.

The source-invariant tests intentionally complement, rather than replace, rendered browser checks. The CI production job remains authoritative for Next.js compilation, static-route output, internal links and assets. Responsive behavior should also be observed at 390px, 768px and 1440px during external-test preparation.
