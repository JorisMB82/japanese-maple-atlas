# DR-STRATEGY-002 — Two-Speed Publication Model Owner Ratification

**Status:** APPROVED  
**Decision date:** 2026-07-28  
**Repository baseline:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Decision authority:** Project Owner / Editor-in-Chief  
**Responsible implementation authority:** CTO / engineering and programme integration

## 1. Decision

The Project Owner ratifies the two-speed Japanese Maple Atlas publication model and approves the following operating decisions:

1. **Catalogue Profile** and **Reference Standard** are the public publication-class names.
2. `ROADMAP-002A — Two-Speed Catalogue and Reference Standard Addendum v1.0` becomes the governing amendment to ROADMAP-002 Version 1.1.
3. `CUL-######` is the stable cultivar-identity family.
4. Programme slots 011–025 are the first Catalogue production cohort, subject to cultivar-specific duplicate review, risk triage and Project Owner approval of the actual assignments.
5. The CTO may batch-publish owner-approved low-risk Catalogue cohorts that pass C0–C3, the protected repository-quality workflow and production verification.

## 2. Publication classes

### Catalogue Profile

A lean, scalable and risk-qualified public profile designed for useful breadth, batch production and transparent uncertainty.

### Reference Standard

A selectively produced, deeply governed treatment using the existing G1–G9 process and individual Project Owner G8 freeze authority.

The two classes describe different assurance depths for one stable cultivar identity. They must not create duplicate cultivar entities.

## 3. Stable cultivar identity

The approved identity family is:

`CUL-######`

The identity is assigned once after duplicate review and remains stable through revisions, publication-class changes and Reference Standard promotion.

The first ten Reference Standard identities will map deterministically during the Catalogue MVP migration:

| Reference Standard | Cultivar identity |
| --- | --- |
| RC-001 | CUL-000001 |
| RC-002 | CUL-000002 |
| RC-003 | CUL-000003 |
| RC-004 | CUL-000004 |
| RC-005 | CUL-000005 |
| RC-006 | CUL-000006 |
| RC-007 | CUL-000007 |
| RC-008 | CUL-000008 |
| RC-009 | CUL-000009 |
| RC-010 | CUL-000010 |

Frozen Reference Standard source files must not be rewritten merely to introduce these identities. Backward-compatible generated aliases and routes must be preserved.

## 4. First Catalogue cohort

Programme slots 011–025 are reserved for the first fifteen Catalogue Profiles:

- Batch C-001 — slots 011–015;
- Batch C-002 — slots 016–020;
- Batch C-003 — slots 021–025.

The slot approval authorises the cohort structure, not the cultivar names. The editorial stream must return its proposed assignments, duplicate review and risk triage for one Project Owner cohort decision.

After assignment approval and C0 completion, identities will normally map to `CUL-000011` through `CUL-000025`, unless duplicate review establishes that a proposed cultivar is already represented by an existing cultivar identity.

Catalogue Profiles do not automatically receive RC identifiers. An RC identifier is created only through a later Project Owner-approved Reference Standard promotion.

## 5. CTO batch-publication authority

The CTO may publish an owner-approved low-risk Catalogue batch without requesting separate owner approval for each routine profile when all of the following are true:

- the cultivar assignments have been approved by the Project Owner;
- every record passes C0 duplicate and identity review;
- every record passes C1 minimum content, source and editorial review;
- every record passes C2 through an approved primary visual or explicit governed visual gap;
- the batch passes C3 schema, compiler, repository, search, graph, explorer, test, build, regression, quality and release validation;
- all required GitHub checks pass and review conversations are resolved;
- the production preview or deployment is inspected;
- no record contains an unresolved high-risk exception;
- the batch record and rollback boundary are complete.

The CTO must stop and return the matter to the Project Owner when a proposed publication includes:

- a high-risk Catalogue exception;
- an unresolved probable duplicate;
- a material identity or taxon dispute;
- a rights exception;
- a deceptive or weakly identified primary visual;
- a proposed Reference Standard promotion;
- a material change to the governing batch policy.

## 6. Media policy

A routine Catalogue Profile may pass C2 with:

- one approved, rights-compliant primary visual; or
- an explicit governed visual gap.

The approval does not weaken copyright, licence, attribution, provenance, source preservation, privacy or specimen-identity requirements. A generic or weakly identified photograph must not be presented as an authenticated cultivar specimen.

The media stream is authorised to plan governed visual coverage across identities 001–025 and to complete compliant assets under existing ownership boundaries.

## 7. Reference Standard boundary

RC-001 through RC-010 remain Reference Standards.

- RC-001 through RC-005 remain frozen and public.
- RC-006 through RC-010 remain G4 PASS, G5 BLOCKED, non-public and unfrozen.
- This decision does not compile, freeze or publish RC-006 through RC-010.
- The Catalogue model does not downgrade or replace their G1–G9 process.

Every Reference Standard G8 freeze remains reserved to the Project Owner.

## 8. Engineering authorisation

The CTO is authorised to implement the generic Catalogue MVP on `engineering/catalogue-profile-mvp`, including:

- Catalogue schemas and validators;
- stable cultivar identity registry and migration compatibility;
- generic compiler discovery and outputs;
- compact source and governed-gap contracts;
- search, graph, comparison and repository integration;
- class-aware routes and front-end disclosure;
- tests, CI, release evidence and rollback documentation.

The MVP must use synthetic fixtures until owner-approved cultivar assignments and editorial content are available. It must not publish a real Catalogue Profile through infrastructure work alone.

## 9. Remaining Project Owner decisions

Project Owner approval remains required for:

- the actual cultivar assignments for slots 011–025;
- any high-risk Catalogue exception;
- any Reference Standard promotion;
- every Reference Standard G8 freeze;
- a material change to the publication classes, identity family or batch-publication policy.

Routine low-risk profile publication within an approved cohort is delegated to the CTO under Section 5.

## 10. Supersession and governing effect

This Decision Record resolves the approval conditions left open in DR-STRATEGY-001 and the Stage A design documents.

The governing hierarchy is now:

1. ROADMAP-002 Version 1.1;
2. ROADMAP-002A Version 1.0 as the approved two-speed amendment;
3. DR-STRATEGY-001 as the approved strategic decision;
4. this owner-ratification record;
5. CATALOGUE-001 and ARCH-002 as the implementation contracts, subject to versioned engineering refinement that does not alter the approved policy.

The earlier ROADMAP-002A v0.1 draft remains historical and non-governing.

## 11. Review history

- 2026-07-28 — Project Owner approved the two-speed strategic direction in principle.
- 2026-07-28 — Stage A strategy and contract package merged at `f8aeff982c5d155ae4880a618453dc38c40f008e`.
- 2026-07-28 — Project Owner issued the final ratification recorded here.
