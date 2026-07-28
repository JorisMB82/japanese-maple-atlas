# ROADMAP-002A — Two-Speed Catalogue and Reference Standard Addendum v1.0

**Status:** APPROVED — governing amendment to ROADMAP-002 Version 1.1  
**Approval date:** 2026-07-28  
**Decision authority:** Project Owner / Editor-in-Chief  
**Related Decision Records:** DR-STRATEGY-001 and DR-STRATEGY-002  
**Approved baseline:** `f8aeff982c5d155ae4880a618453dc38c40f008e`

## 1. Purpose

This addendum amends ROADMAP-002 Version 1.1 without rewriting or erasing it.

Its purpose is to separate:

- a broad, scalable Atlas Catalogue; and
- a selective, deeply governed Reference Standard programme.

The Atlas will use the two public publication classes **Catalogue Profile** and **Reference Standard**.

## 2. Preserved commitments

The following remain unchanged:

- repository-first architecture;
- `main` as production source of truth;
- three-track ownership for engineering, editorial and media;
- rights, attribution, privacy and provenance safeguards;
- deterministic validation and publication;
- stable identity and traceable revision history;
- RC-001 through RC-010 as Reference Standards;
- completion of the RC-006–RC-010 Wave 1 process;
- individual owner G8 approval for Reference Standards;
- paused blockchain/distributed-trust work.

## 3. Strategic amendment

The programme no longer assumes that every future cultivar must enter the full RC process.

Future cultivars may enter one of two tracks:

1. **Catalogue Profile** — lean, risk-qualified, batch-reviewed and scalable.
2. **Reference Standard** — comprehensive, individually governed and owner-frozen.

The next delivery objective is to bring the public Atlas to **twenty-five cultivar identities in total**:

- RC-001 through RC-010 continue as Reference Standards;
- programme slots 011 through 025 are the first Catalogue production cohort, subject to duplicate checking, risk triage and Project Owner approval of the actual cultivar assignments;
- media works toward transparent visual coverage across identities 001 through 025, using approved primary visuals where available and governed visual gaps where not.

The numbers 011–025 are programme slots until a stable cultivar identity is assigned. They are not RC identifiers and do not imply Reference Standard status.

## 4. Stable cultivar identity

The stable identity family is:

`CUL-######`

A cultivar identity is assigned once after duplicate review and remains stable through revisions, publication-class changes and Reference Standard promotion.

The first ten Reference Standard identities will map deterministically during implementation:

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

Frozen source records must not be rewritten solely to introduce these identifiers. Generated compatibility aliases must preserve existing routes and machine references.

Catalogue Profiles do not automatically receive RC identifiers. An RC identifier is created only if the Project Owner approves promotion to the Reference Standard programme.

## 5. Delivery sequence

### Stage A — Strategy and contract design

Status: **COMPLETE**.

Delivered:

- DR-STRATEGY-001;
- this roadmap addendum;
- Catalogue Profile specification;
- risk and batch-review model;
- source and media minimums;
- stable identity and promotion model;
- public-interface concept;
- MVP and migration plan.

### Stage B — Complete Wave 1 and measure the Reference Standard process

RC-006 through RC-010 remain on the full G1–G9 path.

At the RC-010 formative checkpoint, record:

- elapsed cycle time;
- editorial hours per record;
- source count and source-class distribution;
- research and nomenclatural complexity;
- media acquisition and rights burden;
- review iterations;
- engineering defects;
- owner-review burden;
- time from assignment to publication or block.

The checkpoint must identify which controls are essential to Reference Standards and which are disproportionate for ordinary Catalogue Profiles.

### Stage C — Catalogue MVP

Status: **AUTHORISED**.

Implement only the generic infrastructure required to ingest, validate, publish and display a Catalogue Profile while preserving the existing RC compiler path.

Required areas:

- stable cultivar identity registry;
- publication-class field and history;
- Catalogue profile schema and validator;
- lean source-object contract;
- Catalogue media-state and governed-gap contract;
- duplicate detection;
- compiler discovery and transactional output;
- repository inventory and manifests;
- search, graph, comparison and routes;
- publication-class UI;
- tests, CI and rollback evidence.

No cultivar-specific compiler branches are permitted.

Synthetic fixtures must be used until owner-approved assignments and editorial content exist.

### Stage D — First Catalogue production cohort

The initial production target is programme slots 011–025, delivered in three controlled batches:

1. Batch C-001 — slots 011–015;
2. Batch C-002 — slots 016–020;
3. Batch C-003 — slots 021–025.

Each batch may publish independently once it passes the Catalogue contract. The programme must not wait for all fifteen profiles or all twenty-five visuals before delivering useful front-end content.

Batch C-001 is the operational pilot. Its results may adjust thresholds for the following two batches without changing the underlying two-speed decision.

### Stage E — Visual coverage programme

Media will run a parallel visual-coverage programme for cultivar identities 001–025:

- protect and retain existing governed identity visuals for RC-001–RC-005;
- acquire stronger habit, foliage-detail and seasonal visuals for RC-001–RC-010;
- seek one approved primary visual for every Catalogue Profile in slots 011–025;
- record a governed visual gap when a compliant primary visual is not yet available;
- never substitute a generic or weakly identified photograph as an authenticated specimen.

The public interface must distinguish:

- primary visual approved;
- candidate under review;
- governed visual gap;
- non-evidentiary illustration;
- documented, asserted or uncertain specimen identity.

### Stage F — Scale decision

After the first fifteen Catalogue Profiles and the 001–025 visual programme are assessed, decide whether to:

- increase batch size;
- adjust source or media minimums;
- modify risk thresholds;
- promote selected cultivars to Reference Standards;
- begin the next Catalogue cohort;
- defer scaling if quality or identity risks are unacceptable.

## 6. Catalogue workflow

Catalogue Profiles use four states:

- **C0 — Assigned and duplicate-checked**;
- **C1 — Content and evidence ready**;
- **C2 — Approved primary visual or governed visual gap**;
- **C3 — Validated and batch-published**.

A normal low-risk profile does not routinely require G1–G9, a full evidence matrix, a complete historical monograph, a unique Decision Record or individual owner approval.

The specific risk may require deeper work, but that work must remain targeted rather than becoming the default.

## 7. Throughput objectives

### Catalogue objective

Produce useful reviewed profiles in batches without requiring individual owner approval for every low-risk record.

Initial target:

- five profiles per batch;
- three batches to reach twenty-five total cultivar identities;
- editorial cycle measured in days or low single-digit hours per low-risk profile rather than open-ended weeks;
- one to five credible sources per low-risk profile, with more only where the specific risk requires it;
- one approved primary visual where feasible or an explicit governed visual gap;
- no concealed high-risk record in a routine batch.

### Reference Standard objective

Retain full G1–G9 for selected cultivars and improve process efficiency without reducing assurance.

## 8. CTO publication authority

The CTO may publish an owner-approved low-risk Catalogue batch when:

- the cultivar assignments are owner-approved;
- every record passes C0–C3;
- the full protected repository-quality workflow passes;
- all review conversations are resolved;
- production is inspected;
- rollback evidence and the batch record are complete;
- no high-risk exception remains.

The CTO must return the matter to the Project Owner for:

- actual cultivar assignments for slots 011–025;
- any high-risk Catalogue exception;
- any material identity, taxon or rights dispute;
- Reference Standard promotion;
- every Reference Standard G8 freeze;
- material changes to publication classes, stable identity or batch policy.

## 9. Media minimum

A routine Catalogue Profile may pass C2 with:

- one approved rights-compliant primary visual; or
- an explicit governed visual gap.

Copyright, licence, attribution, provenance, source preservation, privacy and specimen-identity controls remain mandatory.

A governed gap is transparent backlog, not visual completion.

## 10. Required front-end outcome

The MVP and first Catalogue cohort must visibly improve the production site, not merely expand repository documentation.

Required capabilities include:

- Catalogue Profile and Reference Standard badges;
- evidence-depth and review-date disclosure;
- media-state disclosure;
- class-aware filtering;
- search, comparison and graph interoperability across both classes;
- stable cultivar routes and redirects through promotion;
- publication and revision history;
- honest confidence and risk language.

## 11. Checkpoints

1. Stage A strategy and contract package merged — **COMPLETE**.
2. Project Owner ratification of terminology, roadmap, identity and batch authority — **COMPLETE**.
3. Editorial assignment and risk proposal for slots 011–025 reviewed by the Project Owner.
4. Catalogue MVP passes the full repository-quality workflow.
5. Batch C-001 publishes and is reviewed in production.
6. Thresholds are adjusted if needed.
7. Batches C-002 and C-003 publish.
8. Visual coverage across identities 001–025 is reported as approved, candidate or governed gap.
9. Scale decision is recorded.

## 12. Excluded scope

This addendum does not itself assign specific cultivars, publish a Catalogue Profile, freeze a Reference Standard or restart blockchain/distributed-trust work.
