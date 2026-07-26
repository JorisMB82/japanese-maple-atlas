# Sprint 11 — Compiler and Repository Scale Generalisation

## Status

Implementation complete and ready for review.

## Objective

Remove the five-record compiler boundary and establish the governed ingestion contract needed to begin RC-006 production without cultivar-specific code.

## Delivered

- canonical `canonical-rc-v1` profile and RC template, including explicit synonym, relationship, source and media registers;
- approved external adapters for RC-001 through RC-005;
- governed exception registry;
- governed taxon registry;
- per-record source-provenance and media sidecars;
- exact approval-state validation and source-level evidence mapping with record-scoped identifiers and locators for RC-006 onward;
- automatic discovery of approved RC files;
- dynamic object totals, manifest inventory and graph/search coverage;
- record-level preflight diagnostics;
- preflight, dry-run, compile and drift-check modes;
- transactional generated-output publication and tested mid-install rollback protection;
- conforming RC-006 integration proof;
- malformed-record non-publication proof;
- synthetic 20-, 25- and 150-record scale validation;
- updated schemas, validators, quality gates, CI and documentation.

## Preserved boundaries

- RC-001 through RC-005 Markdown files remain unchanged and frozen.
- Current public cultivar content remains five records.
- Sprint 11.5 media-governance implementation and RC-006 botanical production have not started.
- Public AI, runtime APIs and SDKs remain deferred.

## Exit criterion

PASS — a conforming RC-006 can be added, preflighted and dry-run compiled through the canonical contract without changing compiler source code.

## Review and merge

Use **Squash and merge** with:

`Sprint 11: generalise Atlas compiler for scalable RC ingestion`

After merge, begin Sprint 11.5 media governance and RC-006 through RC-010 research preparation in accordance with ROADMAP-002.
