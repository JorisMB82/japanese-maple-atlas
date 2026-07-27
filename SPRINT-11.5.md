# Sprint 11.5 — Media Governance and Visual Asset Pipeline

## Status

**COMPLETE and merged into `main`.**

- Pull request: `#10 — Sprint 11.5: Media governance and visual asset pipeline`
- Squash commit: `49ae990338dca7f59e00f6ccf664b3e38e2f44cb`
- Merge time: 2026-07-27 01:07 UTC
- Application version: `0.11.5`

## Objective

Create a repeatable, rights-compliant and traceable visual workflow before RC-006 editorial production begins.

## Delivered

- `media-v2` governed metadata contract;
- migrated RC-001 through RC-005 identity illustrations with creator, contributor, rights holder, licence, preserved source checksum, privacy treatment, identification status, conspicuous reconstruction label and approval history;
- deterministic thumb, card, display and archive derivatives with SHA-256 lineage;
- media processing, drift checking and validation commands;
- RC-001 through RC-020 coverage matrix with governed gaps;
- updated media route and profile metadata presentation;
- schema, unit and integration coverage;
- CI and release-quality integration.

## Preserved boundaries

- RC-001 through RC-005 botanical Markdown remains frozen and unchanged.
- Public cultivar count remains five and repository object count remains 235.
- Illustrations remain presentation assets, not botanical identity evidence.
- Sprint 11.5 does not create botanical RC-006 content.
- Public AI, broad SDK, runtime API and unrelated platform expansion remain deferred.

## Authoritative validation

The exact PR tree merged into `main` passed all three GitHub Actions jobs:

- Repository, schemas and tests;
- Native Node coverage thresholds;
- Production build and static regression.

The verified release included 55 passing unit tests, 18 passing integration tests, 20/25/150-record scale validation, deterministic derivative checks, repository and media validation, production static export, regression tests, aggregate quality validation and release-manifest generation.

The Vercel status reported an external account build-rate limit. The repository production build itself passed.

## Exit criterion

**PASS.** A clean checkout can generate twenty deterministic derivatives, verify rights/provenance/privacy metadata, compile the unchanged five-record repository, pass all quality gates and produce the static application.

## Next programme state

Engineering, editorial/content and media/visual-assets now operate as three coordinated streams under ROADMAP-002 Version 1.1. Sprint 12 is the RC-006–RC-010 publication wave and begins through separate editorial and media packages converging at engineering integration gates.
