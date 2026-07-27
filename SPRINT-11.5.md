# Sprint 11.5 — Media Governance and Visual Asset Pipeline

## Status

Implementation complete and ready for merge.

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
- RC-006 editorial research and Sprint 12 have not started.

## Exit criterion

PASS when a clean checkout can generate twenty deterministic derivatives, verify rights/provenance/privacy metadata, compile the unchanged five-record repository, pass all quality gates and produce the static application.
