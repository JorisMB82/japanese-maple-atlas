# HANDOFF-ENGINEERING-CATALOGUE-001 — Catalogue MVP

**Status:** READY FOR OWNER-APPROVED CATALOGUE PRODUCTION  
**Branch:** `engineering/catalogue-profile-mvp`  
**Base:** `e5f588dac6d4871a69ad728a5bf27e1141dc7f75`  
**Governing decisions:** DR-STRATEGY-001, DR-STRATEGY-002, DR-ENGINEERING-002 and ROADMAP-002A Version 1.0

## 1. Delivered platform capability

- approved `CUL-######` identity registry;
- deterministic RC-001–RC-010 stable-identity mappings;
- reserved, unassigned identities CUL-000011 through CUL-000025;
- canonical and mirrored Catalogue Profile schemas;
- semantic C0–C3 validation;
- generic deterministic Catalogue compiler;
- explicit Catalogue validation and compiler-check commands in protected CI;
- runtime integration with current Reference Standards;
- class-aware home directory, Explorer, cultivar profiles and comparison;
- publication-class facets in URLs and saved views;
- class, stable identity, evidence depth and media state in JSON/CSV exports;
- static route and release validation for future canonical Catalogue inputs;
- release checksums and deterministic Catalogue inventory/hash;
- synthetic unit and integration fixtures;
- rollback and compatibility safeguards.

## 2. Current production content boundary

Canonical Catalogue Profile count: **0**.

The platform is ready to ingest owner-approved profiles, but this implementation does not:

- assign a real cultivar to slots 011–025;
- convert a reserved identity into an assigned identity;
- add a canonical Catalogue input;
- publish a new cultivar route;
- approve a governed media gap for a real cultivar;
- freeze or publish RC-006–RC-010;
- alter frozen RC source files or generated Reference Standard outputs.

## 3. What editorial must return after owner assignment approval

For each approved slot:

- exact accepted working name;
- supported taxon;
- duplicate-review result;
- risk level and targeted conditions;
- lean content fields;
- compact source records and locators;
- editorial reviewer and review date;
- batch assignment;
- unresolved material issue, if any.

The canonical file must match:

`atlas-repository/catalogue-profiles/CUL-######.json`

## 4. What media must return for C2

Either:

1. one approved primary media ID whose source, rights, provenance, identity, privacy and derivative lineage pass the governed media pipeline; or
2. a real governed visual-gap record with reason, reviewer, date, public wording and backfill priority.

A candidate under review and a non-evidentiary illustration cannot pass C2 for publication.

## 5. Engineering integration sequence for Batch C-001

1. Project Owner approves or amends the actual slots 011–015 assignments.
2. Engineering changes the matching registry entries from `reserved-catalogue-slot` to `assigned-catalogue` and records the owner decision.
3. Editorial creates five canonical profile inputs against the merged schema.
4. Media resolves each C2 state.
5. Engineering validates C0–C3 and the protected three-job workflow.
6. Inspect generated public routes, class badges, search, comparison, sources, media wording and mobile layouts.
7. Publish the low-risk batch under the authority granted in DR-STRATEGY-002.
8. Retain rollback evidence and measure corrections, effort and governed-gap rate.

## 6. Validation commands

```bash
npm run validate:catalogue
npm run compile:catalogue:check
npm run verify:repository
npm run test:unit
npm run test:integration
npm run test:coverage
npm run build
npm run test:regression
npm run validate:scale
npm run validate:quality
npm run release:manifest
```

## 7. Rollback

The Catalogue path is additive. With zero canonical Catalogue inputs, the public application renders the existing Reference Standard corpus.

A platform rollback reverts the MVP merge. A batch rollback reverts the batch’s canonical inputs and media changes. Existing frozen RC files and routes are not migrated or rewritten by the MVP.

## 8. Next receiver

- Project Owner: approve or amend the actual editorial assignments for slots 011–025.
- Media: perform assignment-specific visual feasibility and C2 work.
- Editorial: begin canonical Batch C-001 production after assignment approval and after this MVP is merged.
- CTO / engineering: integrate and publish approved low-risk batches that pass C0–C3.
