# PLAN-STRATEGY-001 — Two-Speed Catalogue MVP and Delivery Plan v0.1

**Status:** PROPOSED IMPLEMENTATION PLAN  
**Related Decision Record:** DR-STRATEGY-001  
**Related contracts:** ROADMAP-002A, CATALOGUE-001 and ARCH-002  
**Inspected `main`:** `8f950fd53902ea68bdce8997f7005584906bd562`

## 1. Programme objective

Deliver a public Atlas with twenty-five cultivar identities as quickly as the evidence, media and validation safeguards permit:

- identities 001–010 remain full Reference Standards;
- programme slots 011–025 become the first Catalogue Profile cohort after assignment approval;
- media works toward governed visual representation across identities 001–025;
- Catalogue batches may publish with an explicit governed visual gap rather than waiting indefinitely for perfect photography;
- front-end delivery is the primary outcome, not repository file count.

## 2. Current boundary

At the Stage A baseline:

- RC-001 through RC-005 are frozen and public;
- RC-006 through RC-010 have G4 PASS;
- RC-006 through RC-010 remain G5 BLOCKED;
- no Wave 1 record is frozen, compiled or public;
- the governed raster pipeline is available;
- the current Reference Standard compiler must remain stable;
- no Catalogue implementation exists yet.

Strategy work must not interrupt record-specific media work for the first viable Wave 1 G5 package.

## 3. Safest implementation sequence

### PR 1 — Strategy and contracts

Branch:

`engineering/two-speed-publication-model`

Scope:

- Decision Record;
- roadmap addendum;
- Catalogue Profile contract;
- stable identity and promotion architecture;
- implementation/migration plan;
- transition status.

No compiler, schema, application, media asset or cultivar content changes.

### PR 2 — Catalogue engineering MVP

Branch:

`engineering/catalogue-profile-mvp`

Scope:

- stable cultivar identity registry;
- Catalogue schema and validator;
- generic compiler discovery and transactional output;
- compact source handling;
- Catalogue media-state validation;
- duplicate-detection support;
- generated repository inventory and manifests;
- search, graph and comparison integration;
- profile routes and class-aware UI;
- tests, CI, documentation and rollback proof.

No real pilot cultivar content should be mixed into this PR beyond synthetic fixtures.

### PR 3 — Catalogue assignment and editorial Batch C-001

Branch:

`content/catalogue-batch-c001`

Scope:

- owner-approved cultivar assignments for slots 011–015;
- C0 duplicate and risk review;
- five C1 Catalogue Profile candidates;
- measurable editorial effort and source data.

### PR 4 — Media Batch C-001 and visual backfill tranche

Branch:

`media/catalogue-batch-c001`

Scope:

- C2 packages for slots 011–015;
- approved primary visuals or governed gaps;
- a defined five-record backfill tranche from identities 001–010;
- throughput and blocker reporting.

### PR 5 — Integration Batch C-001

Branch:

`integration/catalogue-batch-c001`

Scope:

- combine matching C1/C2 packages;
- run C3 validation;
- publish five Catalogue Profiles;
- inspect production;
- record corrections and metrics.

### Batches C-002 and C-003

Repeat the bounded sequence for slots 016–020 and 021–025, adjusting only thresholds demonstrated by the first batch.

Do not create all branches in advance.

## 4. Catalogue MVP technical design

### 4.1 Governed inputs

Proposed new inputs:

- `atlas-repository/cultivar-identities/cultivars.json` — stable identity and alias registry;
- `atlas-repository/catalogue-profiles/CUL-######.json` — lean Catalogue input;
- shared governed media sidecars updated to reference `cultivarId`;
- batch review records under `docs/catalogue-batches/`.

Reference Standard inputs remain unchanged.

### 4.2 Compiler

Create a new versioned compiler contract rather than silently extending COMPILER-002.

Suggested successor:

`docs/COMPILER-003_Two-Speed-Catalogue-and-Reference-Standard-Ingestion_v1.0.md`

The compiler should:

1. load the stable identity registry;
2. discover approved Catalogue inputs and frozen Reference Standards separately;
3. reject duplicate cultivar identities and slugs;
4. validate class-specific contracts;
5. project both classes into one cultivar inventory;
6. preserve Reference Standard evidence depth;
7. expose publication class and media state;
8. build search, graph, comparison and manifests across both classes;
9. publish transactionally only after the complete batch succeeds;
10. preserve the previous public repository on failure.

No cultivar-specific code is permitted.

### 4.3 Schemas

Likely new or amended schemas:

- `cultivar-identity.schema.json`;
- `catalogue-profile.schema.json`;
- `catalogue-batch.schema.json` or equivalent validation contract;
- generic media linkage using `cultivarId`;
- generated cultivar schema with publication-class support;
- manifest and inventory schemas.

Reference Standard source and RC schemas remain valid and should not be weakened.

### 4.4 Validators

Add validation for:

- stable identity and alias uniqueness;
- duplicate candidates;
- Catalogue state transitions C0–C3;
- risk classification and escalation;
- source minimum and locators;
- media state and visual-complete accounting;
- batch membership and approval;
- promotion history;
- route and redirect consistency;
- class-aware search/graph inclusion;
- no hidden high-risk publication.

### 4.5 Generated outputs

The public cultivar projection should use `cultivarId` as the canonical node while retaining existing RC aliases.

Generated inventories should report separately:

- total cultivar identities;
- Catalogue Profiles;
- Reference Standards;
- approved-primary visuals;
- governed visual gaps;
- promotion candidates;
- current batch.

## 5. Front-end concept

### 5.1 Cultivar page

Every cultivar page should display:

- cultivar name and taxon;
- publication-class badge;
- concise explanation of the class;
- confidence/risk disclosure suitable for public users;
- primary visual or clear visual-gap treatment;
- source count;
- last reviewed date;
- revision and promotion history;
- comparison links.

Reference Standard pages additionally expose deeper evidence, source mappings, uncertainty and freeze information.

### 5.2 Explorer

Add filters for:

- all profiles;
- Catalogue Profiles;
- Reference Standards;
- approved primary visual;
- governed visual gap;
- confidence/risk label;
- last reviewed date where useful.

Search results must not rank a Reference Standard as a different cultivar from its former Catalogue Profile.

### 5.3 Comparison

Catalogue Profiles and Reference Standards should be comparable in the same workspace.

The comparison table should disclose evidence depth and missing fields rather than fabricating equivalence.

### 5.4 Graph

One cultivar identity equals one graph node.

Publication class, source depth, media state and promotion history are node metadata, not duplicate nodes.

### 5.5 Visual gap presentation

A governed visual gap should show a deliberate Atlas placeholder and a plain statement that no rights-cleared cultivar-specific primary visual is yet approved.

It must not use a generic maple photograph that could be mistaken for the cultivar.

## 6. RC-001–RC-025 visual delivery programme

Media work should be organised as a visible coverage programme, not an all-or-nothing requirement.

### Tranche V-001 — RC-001–RC-005

Goal:

- retain existing governed identity plates;
- add one stronger habit or foliage-detail photograph per record where rights and identity permit.

### Tranche V-002 — RC-006–RC-010

Goal:

- secure the first viable G5 package, prioritising RC-010 and RC-009;
- continue one approved primary visual per record;
- do not delay the Catalogue MVP while every seasonal view is acquired.

### Tranche V-003 — slots 011–015

Goal:

- one approved primary visual per Catalogue Profile where feasible;
- governed gaps allowed and counted separately.

### Tranche V-004 — slots 016–020

Same standard.

### Tranche V-005 — slots 021–025

Same standard.

Each tranche should report:

- approved visuals;
- candidates;
- governed gaps;
- rights blockers;
- identity blockers;
- source preservation status;
- media effort per record.

## 7. Editorial delivery programme

Editorial should select low-risk cultivars that provide useful horticultural breadth and can be supported efficiently.

Assignment criteria should balance:

- horticultural usefulness;
- diversity of habit, leaf form, colour and scale;
- user search value;
- source availability;
- low identity and synonym risk;
- media feasibility;
- comparison value with RC-001–RC-010.

The first fifteen Catalogue slots should not be filled with only visually similar or commercially dominant cultivars.

Editorial should return an assignment proposal before C0 begins. The Project Owner approves the cohort assignments in one decision rather than approving each later low-risk publication individually.

## 8. Migration impact assessment

### Existing frozen records

- RC Markdown and frozen hashes remain unchanged;
- generated objects gain `cultivarId` through compiler projection or compatibility mapping;
- old `RC-###` identifiers and routes remain resolvable;
- media and relationship objects are linked to stable cultivar identity without losing legacy IDs.

### Current application

- existing `/cultivars/<slug>` routes remain canonical;
- components gain class-aware badges and disclosures;
- search and graph projections include both classes;
- saved URLs and exports need compatibility tests.

### Current media contract

- rights, provenance, privacy and derivative rules remain;
- linkage changes from RC-only to cultivar identity plus publication use;
- governed-gap treatment becomes available to Catalogue Profiles;
- visual completeness is reported separately from publication count.

### Current programme register

The register should evolve from an RC-only table into a concise cultivar programme register with fields such as:

- programme slot;
- cultivar ID;
- accepted working name;
- publication class;
- risk level;
- editorial state;
- media state;
- publication state;
- Reference Standard candidacy;
- blocker/next action.

Do not manually duplicate source, media or history data already maintained elsewhere.

## 9. Documents and contracts requiring amendment

### Stage A

- DR-STRATEGY-001;
- ROADMAP-002A;
- CATALOGUE-001;
- ARCH-002;
- this implementation plan;
- transition status document.

### Stage C

- README programme baseline;
- successor compiler contract;
- media governance addendum;
- programme register structure;
- repository architecture documentation;
- contribution instructions;
- quality and release documentation;
- schemas and controlled vocabularies;
- UI/Explorer documentation.

ROADMAP-002 Version 1.1 must remain in history and must not be silently overwritten.

## 10. Quality and CI

Every implementation and content PR continues to require:

- `Repository, schemas and tests`;
- `Native Node coverage thresholds`;
- `Production build and static regression`;
- resolved review conversations;
- protected-branch PR merge.

Catalogue-specific checks should be added inside the established jobs unless a distinct job is operationally necessary. Avoid multiplying checks merely to mirror documentation sections.

## 11. Batch publication authority

After the Project Owner approves:

- the actual slots 011–025 cultivar assignments;
- the public class terminology;
- the final Catalogue contract;
- the low-risk batch-publication policy;

the CTO may merge a qualifying Catalogue batch without individual owner approval for every profile.

Escalation remains mandatory for:

- high-risk identity;
- material rights or legal exception;
- assignment changes;
- policy changes;
- Reference Standard promotion;
- unresolved issue materially affecting public trust.

## 12. Metrics and checkpoint

### Catalogue batches

Record:

- assigned and published count;
- cycle time;
- editorial and media hours;
- source count;
- risk distribution;
- approved visual and governed-gap percentages;
- blocked profiles;
- owner escalations;
- corrections after publication;
- compiler/build effect.

### Reference Standard Wave 1

Record:

- cycle time;
- source depth;
- review iterations;
- media completeness;
- unresolved claims;
- owner-review time;
- integration defects;
- post-publication corrections.

The RC-010 checkpoint compares the two models and finalises expected throughput.

## 13. Stop conditions

Stage A stops after a reviewable strategy/contract PR.

Stage C stops after the Catalogue infrastructure is validated with synthetic fixtures and no real cohort content is published.

Each Catalogue batch stops after production inspection and metric recording before the next batch expands.
