# DR-STRATEGY-001 — Two-Speed Catalogue and Reference Standard Model

**Status:** APPROVED — ratified by the Project Owner on 2026-07-28  
**Decision date:** 2026-07-28  
**Ratification baseline:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Decision authority:** Project Owner / Editor-in-Chief  
**Responsible stream:** CTO / engineering and programme integration  
**Related roadmap:** ROADMAP-002 Version 1.1 and approved ROADMAP-002A Version 1.0  
**Owner ratification:** DR-STRATEGY-002

## 1. Context

The Japanese Maple Atlas has established a rigorous Reference Standard process with canonical records, source sidecars, media governance, staged G1–G9 review, deterministic compilation and production verification.

That process is appropriate for authoritative, high-value and methodologically important cultivars. It is not an economical default for a catalogue intended to contain hundreds of useful cultivar profiles.

RC-006 through RC-010 demonstrate the cost drivers:

- extensive source collection and locator work;
- full evidence-domain coverage;
- nomenclatural and historical review;
- unresolved and rejected-claim registers;
- record-specific owner conditions;
- rights, provenance and specimen-identity media work;
- multi-stream handoffs and repeated validation.

Using the same burden for every cultivar would make breadth dependent on hundreds of deep investigations and near-perfect media packages. That would conflict with the Atlas objective of becoming broadly useful.

## 2. Scale problem

The Atlas needs two outcomes that cannot be optimised by one uniform workflow:

1. **Breadth:** hundreds of useful, reviewed and honestly qualified cultivar profiles.
2. **Authority:** a smaller body of deeply governed Reference Standards that act as exemplars, comparison anchors and high-assurance treatments.

A single maximum-rigour pipeline optimises authority but suppresses throughput. A lightly governed system optimises throughput but would sacrifice the evidentiary and legal safeguards already established.

## 3. Decision

The Atlas will operate at two publication speeds:

### A. Catalogue Profile

A lean, scalable and risk-qualified profile intended for batch production and publication. It provides useful identity, morphology, seasonality, cultivation, comparison, source and media information without routinely requiring a full historical investigation, seven-domain evidence matrix, unique Decision Record or G1–G9 process.

### B. Reference Standard

The existing deeply governed treatment for selected cultivars that justify comprehensive nomenclatural, evidentiary, media and owner-review work.

The existing governance framework is retained as the premium assurance layer. It is not discarded and is not weakened.

RC-001 through RC-010 remain Reference Standards. RC-006 through RC-010 must complete the current Wave 1 process without downgrade or interruption.

The first breadth objective is to bring the platform to **twenty-five total cultivar identities**:

- RC-001 through RC-010 remain the first Reference Standard identities;
- programme slots 011 through 025 are the first Catalogue production cohort after duplicate review, risk triage and Project Owner approval of the actual assignments;
- media works toward governed visual representation across identities 001 through 025, using approved primary visuals where available and explicit governed visual gaps where not.

Programme slots 011–025 are not automatically RC identifiers. A future RC identifier is created only if a cultivar is promoted to the Reference Standard programme.

## 4. Strategic outcome

The target state is:

> Hundreds of useful, clearly qualified Catalogue Profiles and a smaller collection of deeply governed Reference Standards.

The Catalogue creates breadth. Reference Standards create authority, exemplars and depth.

The public interface must disclose publication class, evidence depth, confidence, media state and review history so users are not led to believe that every profile carries the same assurance level.

## 5. Alternatives considered

### Alternative 1 — Full Reference Standard process for every cultivar

**Benefit:** uniform maximum assurance.  
**Rejected because:** cycle time, owner burden, media acquisition and evidence depth would prevent the Atlas from reaching useful breadth.

### Alternative 2 — Abandon deep governance

**Benefit:** fastest content expansion.  
**Rejected because:** it would discard the strongest differentiator of the Atlas and increase the risk of duplicate entities, unsupported certainty, synonym errors, copied marketing claims and legally weak media.

### Alternative 3 — One medium-rigour process

**Benefit:** operational simplicity.  
**Rejected because:** it would still be too heavy for ordinary low-risk profiles and too shallow for difficult, high-value or methodologically important cultivars.

### Alternative 4 — Two-speed model

**Benefit:** separates breadth from premium assurance while retaining shared identity, source, media, validation, search and graph infrastructure.  
**Decision:** approved.

### Alternative 5 — Defer scaling until hundreds of complete media packages exist

**Benefit:** visually complete launch inventory.  
**Rejected because:** rights and acquisition timelines would become a permanent publication bottleneck. A transparent governed media gap is preferable to indefinite non-publication or deceptive substitution.

## 6. Rationale

The two-speed model is the smallest design that satisfies the combined objectives:

- useful breadth;
- stable cultivar identity;
- source transparency;
- legal media use;
- explicit uncertainty;
- automated validation;
- later promotion to a Reference Standard;
- preservation of the existing RC pipeline;
- visible front-end delivery in bounded batches.

The current repository already demonstrates that generic compilation, search, graph and scale validation can support larger inventories. The principal design change is not raw record count; it is the introduction of a lighter governed input class without duplicating cultivar identity.

## 7. Benefits

- materially higher editorial throughput;
- batch review for low-risk cultivars;
- fewer owner decisions for routine records;
- publication despite an explicit governed visual gap;
- visible distinction between useful review and deep assurance;
- reuse of Catalogue sources and media during later promotion;
- preservation of existing Reference Standards and routes;
- risk-based allocation of specialist effort;
- earlier delivery of useful content through the production front end.

## 8. Drawbacks

- two publication classes require clear UI and documentation;
- validators and compiler discovery become more complex;
- risk classification can be misapplied;
- users may wrongly assume Catalogue Profiles are unreliable or Reference Standards are infallible;
- promotion and revision history require careful identity design;
- operating metrics must be collected to prevent the lighter path from quietly becoming heavy.

## 9. Risks and safeguards

| Risk | Safeguard |
| --- | --- |
| Catalogue becomes unreviewed AI content | Human editorial review, source locators, automated validation and explicit prohibition on unreviewed generated factual claims |
| Duplicate cultivar pages | One stable cultivar entity identifier and mandatory duplicate check before profile assignment |
| False synonym equivalence | Risk escalation and explicit unresolved/variant treatment |
| Copied nursery marketing | Credible-source minimum and prohibition on unqualified commercial claims |
| Legally weak image aggregation | Existing rights, attribution, provenance, privacy and checksum controls remain mandatory |
| Generic image presented as a specimen | Explicit media states and no deceptive substitution |
| Catalogue bureaucracy recreates G1–G9 | Four simple Catalogue states and batch review; no per-record Decision Record for normal low-risk profiles |
| Reference Standards are weakened | Existing canonical RC contract and G1–G9 remain unchanged |
| Publication classes become disconnected databases | Shared cultivar identity, search, graph, media and source links; promotion changes assurance class rather than creating a new cultivar |
| Content waits for all twenty-five records | Three independently publishable five-profile batches |

## 10. Publication-class selection

A cultivar should enter or be promoted to the Reference Standard programme when one or more of these factors are material:

- major horticultural importance;
- identity confusion or frequent commercial misidentification;
- disputed synonyms or nomenclatural complexity;
- conflicting historical claims;
- foundational comparison value;
- strong institutional evidence suitable for deep treatment;
- methodological importance;
- high user demand;
- owner or institutional nomination.

Ordinary low-risk cultivars default to the Catalogue path under the approved Catalogue contract.

## 11. Implementation stages

### Stage A — Strategy and contract design

Status: **COMPLETE**.

The Decision Record, roadmap addendum, Catalogue Profile specification, risk model, publication-state model, identity/promotion design, media minimum, batch policy, interface concept and migration plan are established.

### Stage B — RC-010 formative checkpoint

Complete the current Reference Standard wave and measure actual editorial effort, source depth, media burden, rights blockers, review iterations, owner burden and elapsed time.

### Stage C — Catalogue MVP

Status: **AUTHORISED**.

Implement the smallest generic Catalogue path without destabilising the Reference Standard pipeline. Changes may include schemas, compiler discovery, source/media contracts, repository inventory, search, graph, routes, validators, tests, CI and documentation.

The MVP uses synthetic fixtures until real cultivar assignments and editorial content are approved.

### Stage D — First Catalogue production cohort

Use programme slots 011–025 as the first fifteen Catalogue Profiles, delivered in three batches:

- C-001 — slots 011–015;
- C-002 — slots 016–020;
- C-003 — slots 021–025.

Batch C-001 is the operational pilot. Each batch may publish independently after validation and production review.

### Stage E — Visual coverage to identity 025

Run a parallel media programme across identities 001–025:

- improve the existing visual layer for RC-001–RC-010;
- seek one approved primary visual for every Catalogue Profile;
- permit explicit governed visual gaps without counting them as visual-complete;
- preserve all rights, provenance, privacy and identity safeguards.

### Stage F — Scale

Increase cohort size only after the first fifteen Catalogue Profiles demonstrate acceptable quality, cycle time, correction behaviour and front-end clarity.

## 12. RC-006–RC-010 boundary

RC-006 through RC-010 remain the first full Reference Standard production wave.

- G4 has passed for all five records.
- G5 remains blocked for all five records.
- no record is frozen, compiled or public;
- no `integration/rc-006-010` branch is authorised until a coherent G5 package exists.

The two-speed programme must not divert the media stream from completing the first viable Wave 1 G5 package.

## 13. Metrics

### Catalogue

- profiles assigned and published per batch;
- median cycle time;
- editorial and media effort per profile;
- approved-primary-visual percentage;
- governed-gap percentage;
- low/medium/high-risk distribution;
- blocked percentage;
- correction rate;
- source count;
- owner escalations per batch.

### Reference Standards

- cycle time;
- source depth;
- review iterations;
- media completeness;
- unresolved-claim count;
- owner-review time;
- integration defects;
- post-publication corrections.

Record count alone is not a success metric.

## 14. Authority and approval boundaries

The CTO may autonomously design and implement non-public infrastructure under this decision.

The CTO may batch-publish an owner-approved low-risk Catalogue cohort when every record passes C0–C3, all protected checks pass, review conversations are resolved, production is inspected and rollback evidence is complete.

Explicit Project Owner approval remains required for:

- the actual cultivar assignments for programme slots 011–025;
- any high-risk Catalogue exception;
- any material identity, taxon or rights dispute requiring exception treatment;
- Reference Standard promotion;
- every Reference Standard G8 freeze;
- material changes to the approved publication classes, stable identity family or batch-publication policy.

Routine low-risk profiles inside an approved cohort do not require separate owner approval after C0–C3.

## 15. Evidence that could change this decision

The model should be reconsidered if evidence shows that:

- the lightweight path produces unacceptable correction or identity-error rates;
- users cannot understand the publication-class distinction;
- the shared identity model cannot preserve stable links and graph relationships;
- batch review creates concealed risk;
- the Reference Standard process becomes sufficiently automated that its marginal cost approaches the Catalogue path;
- legal or institutional requirements demand a uniform higher standard;
- pilot throughput gains are immaterial.

## 16. Review history

- 2026-07-28 — Project Owner approved the two-speed strategic direction in principle.
- 2026-07-28 — Project Owner directed the programme to prioritise twenty-five total cultivar identities and governed visual representation across identities 001–025.
- 2026-07-28 — Stage A architecture and contract package merged at `f8aeff982c5d155ae4880a618453dc38c40f008e`.
- 2026-07-28 — Project Owner ratified the public terminology, ROADMAP-002A, `CUL-######`, slots 011–025 and bounded CTO batch-publication authority.

## 17. Excluded scope

Distributed trust and blockchain integration remain paused and outside this decision.
