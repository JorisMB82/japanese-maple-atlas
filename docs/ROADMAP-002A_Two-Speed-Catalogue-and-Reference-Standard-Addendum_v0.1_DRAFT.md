# ROADMAP-002A — Two-Speed Catalogue and Reference Standard Addendum v0.1

**Status:** DRAFT — Project Owner approval required before it becomes governing  
**Parent roadmap:** ROADMAP-002 Version 1.1  
**Related Decision Record:** DR-STRATEGY-001  
**Inspected `main`:** `8f950fd53902ea68bdce8997f7005584906bd562`  
**Prepared:** 2026-07-28

## 1. Purpose

This addendum proposes a traceable amendment to ROADMAP-002 Version 1.1. It does not rewrite or erase the approved roadmap.

Its purpose is to separate:

- a broad, scalable Atlas Catalogue; and
- a selective, deeply governed Reference Standard programme.

Until this addendum is approved, ROADMAP-002 Version 1.1 remains the governing roadmap. The Project Owner has approved the two-speed direction in principle and has directed the programme to prioritise front-end content delivery through the first twenty-five cultivar identities.

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

The programme will no longer assume that every future cultivar must enter the full RC process.

After the RC-010 checkpoint, future cultivars may enter one of two tracks:

1. **Catalogue Profile** — lean, risk-qualified, batch-reviewed and scalable.
2. **Reference Standard** — comprehensive, individually governed and owner-frozen.

The next delivery objective is to bring the public Atlas to **twenty-five cultivar identities in total**:

- RC-001 through RC-010 continue as Reference Standards;
- programme slots 011 through 025 become the first Catalogue production cohort, subject to duplicate checking, risk triage and owner approval of the actual cultivar assignments;
- media works toward transparent visual coverage across identities 001 through 025, using approved primary visuals where available and governed visual gaps where not.

The numbers 011–025 are programme slots until a stable cultivar identity is assigned. They must not be treated as completed RC identifiers or evidence that a cultivar has entered the Reference Standard programme.

## 4. Delivery sequence

### Stage A — Strategy and contract design

Deliver:

- DR-STRATEGY-001;
- this roadmap addendum;
- Catalogue Profile specification;
- risk and batch-review model;
- source and media minimums;
- stable identity and promotion model;
- public-interface concept;
- MVP and migration plan.

Output is documentation and architecture only. No Catalogue record is published.

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

Implement only the generic infrastructure required to ingest, validate, publish and display a Catalogue Profile while preserving the existing RC compiler path.

Likely areas:

- stable cultivar identity registry;
- publication-class field and history;
- Catalogue profile schema and validator;
- lean source-object contract;
- Catalogue media-state contract;
- duplicate detection;
- compiler discovery and transactional output;
- repository inventory and manifests;
- search, graph, comparison and routes;
- publication-class UI;
- tests, CI and rollback evidence.

No cultivar-specific branches are permitted.

### Stage D — First Catalogue production cohort

The initial production target is programme slots 011–025, delivered in three controlled batches:

1. Batch C-001 — slots 011–015;
2. Batch C-002 — slots 016–020;
3. Batch C-003 — slots 021–025.

Each batch may publish independently once it passes the Catalogue contract. The programme must not wait for all fifteen profiles or all twenty-five visuals before delivering useful front-end content.

The first batch is also the operational pilot. Its results may adjust thresholds for the following two batches without changing the underlying two-speed decision.

### Stage E — Visual coverage programme

Media should run a parallel visual-coverage programme for cultivar identities 001–025:

- protect and retain the existing governed identity visuals for RC-001–RC-005;
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

After the first fifteen Catalogue profiles and the 001–025 visual programme are assessed, decide whether to:

- increase batch size;
- adjust source or media minimums;
- modify risk thresholds;
- promote selected cultivars to Reference Standards;
- begin the next Catalogue cohort;
- defer scaling if quality or identity risks are unacceptable.

## 5. Two-track throughput objectives

### Catalogue objective

Produce useful reviewed profiles in batches without requiring individual owner approval for every low-risk record.

Initial target:

- five profiles per first batch;
- then two further five-profile batches to reach twenty-five total cultivar identities;
- median editorial cycle measured in days or low single-digit hours per profile, not weeks of open-ended investigation;
- one to five credible sources per low-risk profile, with more only where the specific risk requires it;
- one approved primary visual where feasible or an explicit governed visual gap;
- no concealed high-risk record in a routine batch.

### Reference Standard objective

Retain full G1–G9 for selected cultivars and improve process efficiency without reducing assurance.

## 6. Programme and owner boundaries

The CTO may merge strategy, contract and non-public infrastructure that implements this approved direction.

Explicit Project Owner approval remains required for:

- this addendum becoming governing;
- final public terminology and badge wording;
- actual cultivar assignments for slots 011–025;
- final policy authorising low-risk batch publication;
- high-risk exceptions;
- Reference Standard promotions;
- every Reference Standard G8 freeze.

The owner does not need to approve each routine low-risk profile individually once the cohort and batch-publication policy are approved.

## 7. Required front-end outcome

The MVP and first Catalogue cohort must visibly improve the production site, not merely expand repository documentation.

Required front-end capabilities include:

- Catalogue Profile and Reference Standard badges;
- evidence-depth and review-date disclosure;
- media-state disclosure;
- class-aware filtering;
- search, comparison and graph interoperability across both classes;
- stable cultivar routes and redirects through promotion;
- publication and revision history;
- honest confidence and risk language.

## 8. Checkpoints

1. Strategy and contract PR merged.
2. Project Owner approves final terminology, this addendum and the slot 011–025 assignment process.
3. Catalogue MVP passes the full repository quality workflow.
4. Batch C-001 publishes and is reviewed in production.
5. Thresholds are adjusted if needed.
6. Batches C-002 and C-003 publish.
7. Visual coverage across 001–025 is reported as approved, candidate or governed gap.
8. Scale decision is recorded.

## 9. Excluded scope

This addendum does not assign specific cultivars, publish a Catalogue Profile, freeze a Reference Standard or restart blockchain/distributed-trust work.
