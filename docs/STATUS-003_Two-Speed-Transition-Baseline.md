# STATUS-003 — Two-Speed Transition Baseline

**Status:** PROPOSED TRANSITION BASELINE  
**Effective design date:** 2026-07-28  
**Inspected `main`:** `8f950fd53902ea68bdce8997f7005584906bd562`  
**Governing roadmap:** ROADMAP-002 Version 1.1 until ROADMAP-002A is approved  
**Strategic Decision Record:** DR-STRATEGY-001

## 1. Purpose

This document records the operating position while the Atlas moves from an all-Reference-Standard production assumption toward a two-speed Catalogue and Reference Standard model.

It does not make ROADMAP-002A governing and does not publish a Catalogue Profile.

## 2. Current programme state

| Area | Current status | Consequence |
| --- | --- | --- |
| Public corpus | RC-001 through RC-005 | Five frozen public Reference Standards remain unchanged. |
| Wave 1 editorial | G4 PASS for RC-006 through RC-010 | RC-006–RC-008 owner conditions are accepted; no freeze is issued. |
| Wave 1 media | G5 BLOCKED for RC-006 through RC-010 | No matching approved primary asset or owner-approved governed gap exists. |
| Wave 1 integration | BLOCKED | No G6 branch or publication action is authorised. |
| Photograph pipeline | AVAILABLE | JPEG/PNG processing, provenance, privacy and derivative controls are present. |
| Main protection | Stage 2 configuration supplied by Project Owner | Pull request, three required checks, conversation resolution, deletion and force-push restrictions are intended to protect `main`; repository Decision Record must be updated after live validation. |
| Two-speed strategy | APPROVED IN PRINCIPLE | Stage A contracts may be designed and merged as proposed non-public infrastructure. |
| Catalogue implementation | NOT STARTED | No schema, compiler, route or profile exists yet. |
| Catalogue cohort | TARGET DEFINED; ASSIGNMENTS PENDING | Programme slots 011–025 are intended as the first fifteen Catalogue profiles, subject to duplicate/risk review and owner assignment approval. |
| Visual programme | TARGET DEFINED | Media should work toward governed visual representation for identities 001–025. |

## 3. Immediate parallel work

### Reference Standard track

- media prioritises the first viable G5 package, with RC-010 and RC-009 the preferred initial targets;
- RC-006 through RC-010 remain non-public;
- no Wave 1 downgrade occurs because the Catalogue model exists.

### Catalogue strategy track

- complete Stage A strategy and contracts;
- obtain owner approval of public terminology, roadmap addendum and assignment process;
- implement the generic MVP with synthetic fixtures only;
- then start Batch C-001 for programme slots 011–015.

### Front-end delivery track

- Catalogue MVP must add class-aware public routes and Explorer disclosure;
- each five-profile batch may publish independently;
- governed media gaps remain visible and backfillable;
- production inspection and correction metrics are mandatory.

## 4. Programme target

The next content objective is **twenty-five total cultivar identities on the platform**:

- ten Reference Standard identities in the first assurance programme;
- fifteen Catalogue identities in the first breadth programme;
- transparent visual coverage accounting across all twenty-five.

This target does not require every identity to have the same evidence depth or complete multi-season photography.

## 5. Required owner decisions before real Catalogue publication

- approve `Catalogue Profile` and `Reference Standard` as public terms;
- approve ROADMAP-002A as the governing amendment;
- approve the stable `CUL-######` identity model;
- approve the actual cultivar assignments for slots 011–025;
- approve the final low-risk batch-publication policy;
- approve any high-risk exception or Reference Standard promotion.

## 6. Repository ownership

### Engineering / integration

Owns:

- strategy and shared contracts;
- schemas, compiler, validators and generated outputs;
- identity migration;
- search, graph, routes, UI, tests and CI;
- batch integration and production inspection;
- programme register.

### Editorial

Owns:

- cultivar assignment recommendations;
- duplicate and risk review;
- Catalogue profile content and compact sources;
- Reference Standard content and source sidecars;
- escalation and promotion recommendations;
- production-effort metrics.

### Media

Owns:

- asset candidates and acquisition;
- rights, provenance, identity and privacy;
- source preservation and derivatives;
- approved-primary and governed-gap states;
- visual coverage across identities 001–025;
- media-effort metrics.

## 7. Branch plan

Current Stage A branch:

`engineering/two-speed-publication-model`

Future branches are created only when their stage begins:

- `engineering/catalogue-profile-mvp`;
- `content/catalogue-batch-c001`;
- `media/catalogue-batch-c001`;
- `integration/catalogue-batch-c001`.

Do not create all future branches in advance.

## 8. Success condition

The transition succeeds when:

- the first five Catalogue Profiles are public and clearly labelled;
- Reference Standard routes remain stable;
- search, graph and comparison work across both classes;
- rights and identity safeguards remain intact;
- the next ten Catalogue Profiles can be produced in two additional bounded batches;
- the programme reports visual completeness and governed gaps honestly;
- the owner burden is materially lower for routine low-risk profiles.
