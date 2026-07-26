# Sprint 10 — Interactive Atlas Explorer

## Status

Sprint 10 is complete. A focused post-Sprint-10 usability remediation is complete in application v0.10.1. Sprint 11 has not started.

## Original capability

- dedicated `/explorer` research workspace;
- semantic search and contextual repository facets;
- deterministic, shareable URL state;
- gallery, trait-table, seasonal and relationship views;
- focused record inspection and guided starting points;
- browser-local saved views;
- research sets containing up to five cultivars;
- comparison and graph handoffs;
- repository-aware export;
- dedicated validation, tests and static-export regression coverage.

## Post-Sprint-10 usability remediation

The independent expert audit was treated as a pre-user-testing heuristic review, not observed user research. Every finding was checked against current `main`, the production application and the supplied responsive evidence before implementation.

Implemented corrections:

- replaced the horizontally scrolling mobile header with a disclosed, keyboard-operable menu containing all destinations;
- rewrote first-touch copy around horticultural tasks, with repository and governance detail retained in secondary disclosures;
- reduced initial Explorer density through progressive disclosure while preserving all expert controls and deterministic URL state;
- made repository hashes wrap within constrained containers and added full-value copy controls;
- added explicit A/B comparison selection inside the five-item research set and URL handoff;
- added cultivar-record anchor navigation;
- improved Compare loading, invalid-data and recovery states;
- replaced browser `prompt()` saved-view naming with an inline dialog and validation;
- added print/PDF and CSV export alongside provenance-preserving JSON;
- increased mobile tap-target and focus visibility coverage;
- shortened repetitive image alternative text while keeping the visible illustration disclaimer.

## Version boundary

- Application version: 0.10.1
- Repository data version: 0.9.0
- Atlas Compiler: 1.2.0
- First-class repository objects: 235

The remediation does not alter the five frozen Reference Standards, compiled assertions, evidence, sources, taxonomy, graph relationships, generated repository JSON or repository hashes.

## Explorer contract after remediation

- Workspace state is validated against the current cultivar inventory.
- URL state includes the selected research set and explicit comparison A/B pair.
- Saved views remain local to the browser and use a validated inline name.
- Research sets remain capped at five cultivar records.
- Advanced filters, examples, evidence metrics and technical explanations use progressive disclosure.
- Print/PDF and CSV provide human-readable output; JSON retains repository provenance.
- Relationship views preserve rationale, confidence, strength and evidence context.
- Seasonal expression remains separated into spring, summer, autumn and winter interest.

## Completion rule

The remediation is complete only after contributor validation, compiler drift checking, schemas, repository integrity, search, graph, Explorer validation, unit tests, integration tests, coverage, production static build, static-export regression, quality validation and release-manifest generation all pass.

Use **Squash and merge** with:

`Sprint 10: remediate usability findings before external testing`

After merge, stop and conduct external user testing before considering Sprint 11 — Media Pipeline and IIIF Readiness.
