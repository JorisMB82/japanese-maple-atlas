# METRICS-EDITORIAL-001 — Wave 1 Reference Standard Effort

**Status:** TRACEABLE METRICS WITH LABELLED ESTIMATES  
**Inspected `main`:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Measured cohort:** RC-006 through RC-010  
**Purpose:** distinguish Reference Standard effort from ordinary Catalogue production

## 1. Measurement limitations

The repository does not contain time-sheet data or continuous authoring telemetry. Source counts, files, review stages, decisions and validation runs are traceable. Hours and cycle-time estimates are reconstructed from the completed workflow and are therefore labelled **estimates**.

The estimates exclude media-rights acquisition, engineering implementation, CI runtime and Project Owner reading time unless explicitly stated.

## 2. Traceable output volume

Each Wave 1 record produced or required:

- one canonical `RC-###.md` record;
- one governed `RC-###.sources.json` sidecar;
- one evidence/assertion matrix or equivalent research register;
- one G1–G3 record handoff;
- one G4 record handoff;
- cohort-level handoffs and Decision Records;
- repository validation and pull-request review.

The record-level source-object counts are:

| Record | Cultivar | Source objects | Principal nomenclatural complexity | Owner decision at G4 |
| --- | --- | ---: | --- | --- |
| RC-006 | ‘Osakazuki’ | 6 | ‘Ōsakazuki’, ‘Taihai’, Amoenum/Elegans/Heptalobum formulations and JC Raulston ‘Ōsakasuki’ | Yes — conservative treatment accepted |
| RC-007 | ‘Butterfly’ | 7 | ‘Kochō-no-mai’, spelling normalization and separate ‘White Butterfly’ | Yes — bounded synonym treatment accepted |
| RC-008 | ‘Shishi-gashira’ | 6 | ‘Shishigashira’, ‘Ribesifolium’, ‘Crispifolium’, ‘Mejishi’ and rejection of RHS prose typo | Yes — bounded synonym treatment accepted |
| RC-009 | ‘Katsura’ | 6 | no approved cultivar synonym; cross-taxon confusion with *Cercidiphyllum japonicum* | No separate condition |
| RC-010 | ‘Mikawa-yatsubusa’ | 7 | hyphen/spacing/capitalization variants, flower-colour conflict and unsupported origin narrative | No separate condition |
| **Total / average** |  | **32 / 6.4** |  | **3 of 5 records** |

The source counts are measured from the merged source sidecars. They do not include every webpage inspected and rejected during discovery.

## 3. Research and review iterations

### Measured workflow stages

All five records passed through:

1. assignment and scope definition;
2. G1 research strategy;
3. G2 evidence, locator, conflict and uncertainty assembly;
4. G3 canonical record and source-sidecar drafting;
5. G4 botanical, nomenclatural and cross-record review;
6. repository-quality validation;
7. Project Owner disposition where a material condition existed.

### Estimated iteration count

| Record | Estimated substantive editorial iterations | Basis |
| --- | ---: | --- |
| RC-006 | 4–5 | first-record template application; initial research cycle; baseline reconciliation; G4 rewrite; owner condition disposition |
| RC-007 | 3–4 | G1–G3 production; G4 review; owner synonym disposition; validation corrections |
| RC-008 | 3–4 | G1–G3 production; G4 review; owner synonym disposition; validation corrections |
| RC-009 | 2–3 | G1–G3 production; G4 review; validation |
| RC-010 | 2–3 | G1–G3 production; G4 review; validation and RC-010 checkpoint treatment |

An “iteration” means a substantive evidence or editorial pass, not every minor file save.

## 4. Estimated editorial hours

| Record | Estimated hours | Main drivers |
| --- | ---: | --- |
| RC-006 | 22–32 | first canonical implementation, six-source synthesis, group/synonym conflicts, specimen/accession locators, extensive unresolved/rejected-claim treatment |
| RC-007 | 16–24 | seven sources, variegation and reversion limits, synonym relationship, separate-cultivar disambiguation |
| RC-008 | 16–24 | synonym set, spelling normalization, architecture-versus-leaf-texture distinction, specimen and photograph records |
| RC-009 | 13–19 | six sources, spring trajectory, unrelated katsura-tree disambiguation, compact source conflict treatment |
| RC-010 | 15–22 | seven sources, dwarf-size context, flower-colour conflict, archived source qualification, seasonal comparison |
| **Estimated cohort total** | **82–121** | editorial research and G1–G4 production only |
| **Estimated average** | **16–24 per record** | midpoint approximately 20 hours |

These estimates are compatible with the observed number of source objects, lengthy canonical records, evidence matrices, two handoff stages and owner decision work. They are not invoicing or performance records.

## 5. Nomenclatural complexity

The cohort demonstrates that even familiar cultivars can require governance beyond ordinary horticultural description:

- **romanisation and diacritics:** ‘Ōsakazuki’, ‘Kochō-no-mai’, ‘Shin-deshōjō’-type issues;
- **hyphenation and joined forms:** ‘Shishi-gashira’ / ‘Shishigashira’, ‘Mikawa-yatsubusa’ / ‘Mikawa yatsubusa’;
- **synonym scope:** ‘Taihai’, ‘Kochō-no-mai’, ‘Ribesifolium’, ‘Crispifolium’, ‘Mejishi’;
- **horticultural-group terminology:** Amoenum, Elegans, Heptalobum;
- **cross-taxon homonym/confusion:** ‘Katsura’ versus katsura tree;
- **institutional record errors:** RHS “Shish geshira”, JC Raulston ‘Ōsakasuki’;
- **commercial narrative:** unsupported discovery, regional-origin and uniformity claims.

Three of five records required explicit owner acceptance of a bounded naming treatment. This is a 60% owner-condition rate for this deliberately deep cohort and should not be assumed for a low-risk Catalogue batch.

## 6. Recurring bottlenecks

### 6.1 Primary history scarcity

Original selector, date, place, naming authority and earliest catalogue were usually absent. Reference Standards retained long unresolved registers rather than inventing provenance.

### 6.2 Source-locator normalization

The first G1–G3 sidecars used structured locator objects that did not match the generated-source string contract. G4 required normalization across all five sidecars.

### 6.3 Dimensions without protocols

Institutional height, spread and maturity ranges frequently differed. Records had to preserve source context rather than calculate a synthetic universal maximum.

### 6.4 Descriptive confidence versus authentication

Strong morphology and seasonal descriptions did not establish original-clone identity. Each record required repeated qualification of labels, photographs, herbarium sheets, living accessions and nursery provenance.

### 6.5 Media and editorial coupling

Editorial could specify diagnostic subjects, but rights, provenance, identity basis and media-sidecar approval remained separate. Missing governed visuals blocked G5 even when G4 passed.

### 6.6 Cross-record consistency

Architecture, leaf morphology, seasonal trajectory, hardiness, dimensions, synonyms and evidence labels required cohort-level review to prevent drift.

### 6.7 Owner decision latency

Nomenclatural conditions could not be silently resolved by editorial. The workflow needed explicit Project Owner acceptance before G4 became PASS for RC-006 through RC-008.

## 7. Essential Reference Standard elements

The following are justified for deeply governed Reference Standards:

- explicit source objects with deterministic locators;
- evidence mapping across the required domains;
- clear separation of published description, editorial synthesis and interpretation;
- full naming and synonym treatment;
- material conflicts and uncertainty register;
- rejected claims where misinformation is likely;
- descriptive-confidence and authentication limits;
- cross-record relationship proposals;
- record-specific media requirements;
- botanical/nomenclatural G4 review;
- Project Owner freeze decision;
- immutable freeze metadata and publication validation.

These elements create durable scholarly transparency and are appropriate when a cultivar is a reference anchor, identity is complex or future promotion value is high.

## 8. Elements excessive for an ordinary LOW-risk Catalogue Profile

The following should not be routine Catalogue requirements:

- seven evidence domains regardless of relevance;
- six or seven sources when two or three credible sources support the useful profile;
- separate evidence matrix and sidecar for every record;
- complete historical monograph;
- specimen-by-specimen research;
- long unresolved and rejected-claim registers;
- unique record-level Decision Record;
- individual owner approval;
- G1–G9 terminology;
- multiple seasonal assets before publication;
- exhaustive propagation and authentication analysis;
- full relationship graph proposal.

A Catalogue Profile should still disclose a material synonym, conflict or identity limit. It should do so in compact fields and escalate only the affected issue.

## 9. Expected Catalogue efficiency

### Editorial effort target

| Catalogue profile type | Estimated hours | Reduction from RS average |
| --- | ---: | ---: |
| LOW risk | 4–6 | approximately 70–80% |
| MEDIUM risk | 6–9 | approximately 55–70% |
| HIGH risk | not routine | escalate or replace |

### Batch target

A five-profile C-001 batch is estimated at:

- **25–35 editorial hours**;
- **10–20 total source objects or embedded source records**;
- one assignment approval at cohort level;
- no expected record-specific owner decision;
- **7–12 working days** calendar time when media and engineering run in parallel;
- longer only when rights acquisition or a duplicate/identity issue intervenes.

### Full fifteen-profile cohort

Using the proposed distribution of ten LOW and five MEDIUM records:

- LOW: 40–60 hours;
- MEDIUM: 30–45 hours;
- cohort planning, consistency and batch review: 10–18 hours;
- **estimated editorial total: 80–123 hours** across three batches.

This produces fifteen useful profiles for roughly the same editorial order of effort as five Reference Standards, while retaining escalation for genuine complexity.

## 10. Metrics to capture prospectively

Engineering and editorial should capture the following from C-001 onward:

- source-discovery start and C1-ready date;
- active editorial hours or bounded effort estimate;
- number of sources reviewed, used and rejected;
- risk level and reason;
- number of substantive review iterations;
- owner escalations;
- media candidate and approved/gap dates;
- validation failures and cause;
- correction requests after publication;
- promotion nominations.

The first two batches should be used to replace the current estimates with measured Catalogue data before committing to a sustained publication cadence.
