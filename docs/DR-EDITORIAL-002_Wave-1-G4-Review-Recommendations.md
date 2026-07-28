# DR-EDITORIAL-002 — Wave 1 G4 Review Recommendations

**Status:** Editorial recommendations complete; bounded G4 owner conditions resolved; freeze decisions pending  
**Decision date:** 2026-07-28  
**Inspected `main`:** `774be47d4709700a3c217af9aca093bb2d6a38c3`  
**Editorial branch:** `content/rc-006-010`  
**Related owner decision:** `DR-EDITORIAL-003_Wave-1-G4-Owner-Acceptance.md`  
**Decision authority for later freeze/publication:** Project Owner / Editor-in-Chief  
**Responsible stream:** Editorial and content production  
**Governing roadmap:** ROADMAP-002 Version 1.1 — approved and governing

## 1. Context

RC-006 through RC-010 entered this review with G1 PASS, G2 PASS FOR REVIEW, G3 DRAFT COMPLETE and G4 CONDITIONAL. PR #16 established the RC-007 through RC-010 drafts, while RC-006 was already present. None was frozen, public or part of the compiled cultivar corpus.

The G4 work reviewed accepted names, synonyms, horticultural-group terminology, morphology, architecture, seasonal expression, dimensions, cultivation, propagation, provenance, identity limits, unresolved questions, rejected claims and comparisons across RC-001 through RC-010.

The review also corrected the mandatory source-sidecar incompatibility. All `sourceLocations` are now deterministic string arrays. No source schema, compiler or validator was extended.

## 2. Locked assignments

The G0 assignments remain unchanged:

1. RC-006 — *Acer palmatum* ‘Osakazuki’
2. RC-007 — *Acer palmatum* ‘Butterfly’
3. RC-008 — *Acer palmatum* ‘Shishi-gashira’
4. RC-009 — *Acer palmatum* ‘Katsura’
5. RC-010 — *Acer palmatum* ‘Mikawa-yatsubusa’

## 3. Editorial recommendations and owner disposition

| Record | Final G4 assessment | Freeze-candidate recommendation | Project Owner disposition |
| --- | --- | --- | --- |
| RC-006 ‘Osakazuki’ | **PASS — owner condition accepted** | Suitable for later freeze consideration once G5–G7 are complete | Conservative treatment of ‘Taihai’, Amoenum/Elegans/Heptalobum formulations, JC Raulston ‘Ōsakasuki’ and absent primary provenance accepted through DR-EDITORIAL-003 |
| RC-007 ‘Butterfly’ | **PASS — owner condition accepted** | Suitable for later freeze consideration once G5–G7 are complete | Use of RHS-recorded ‘Kochō-no-mai’ while historical sequence and primary provenance remain unresolved accepted through DR-EDITORIAL-003 |
| RC-008 ‘Shishi-gashira’ | **PASS — owner condition accepted** | Suitable for later freeze consideration once G5–G7 are complete | Retention of ‘Ribesifolium’, ‘Crispifolium’ and ‘Mejishi’ while priority and historical scope remain unresolved accepted through DR-EDITORIAL-003 |
| RC-009 ‘Katsura’ | **PASS** | Suitable for later freeze consideration once G5–G7 are complete | No material nomenclatural condition; provenance and seasonal variability remain explicit research gaps |
| RC-010 ‘Mikawa-yatsubusa’ | **PASS** | Suitable for later freeze consideration once G5–G7 are complete | No material nomenclatural condition; flower-colour conflict, size context and provenance remain explicit research gaps |

The original CONDITIONAL assessments were not failures of the descriptive profiles. They identified material naming decisions that editorial could not silently make for the Project Owner. DR-EDITORIAL-003 records the explicit acceptance that resolves those bounded conditions without issuing a freeze or publication decision.

## 4. Source-object decision

Editorial source review passed for all five sidecars:

- `RC-006.sources.json`
- `RC-007.sources.json`
- `RC-008.sources.json`
- `RC-009.sources.json`
- `RC-010.sources.json`

The top-level status is `approved` because the source objects, domain mappings, authority assessments, limitations and locators are suitable for editorial use. This source approval does not:

- approve a cultivar record as frozen;
- set a freeze date;
- approve media rights or a media sidecar;
- authenticate an individual plant;
- add a record to the compiled public corpus;
- or authorize publication.

## 5. Nomenclature and identity decisions

### RC-006

‘Osakazuki’ remains the Atlas form; ‘Ōsakazuki’ is the RHS display form; ‘Taihai’ is a recorded synonym of unresolved historical scope; group formulations remain separately traceable; ‘Ōsakasuki’ is not an approved synonym.

### RC-007

‘Butterfly’ remains the Atlas form; ‘Kochō-no-mai’ is retained as RHS-recorded synonym evidence; ‘White Butterfly’ remains a separate cultivar; unverified commercial aliases and chronology are excluded.

### RC-008

‘Shishi-gashira’ remains the Atlas form; ‘Shishigashira’ is a search/institutional variant; ‘Ribesifolium’, ‘Crispifolium’ and ‘Mejishi’ remain recorded synonyms with unresolved history; “Shish geshira” is rejected as a typo.

### RC-009

‘Katsura’ remains the cultivar epithet; no synonym is approved; the record is explicitly separated from *Cercidiphyllum japonicum*.

### RC-010

‘Mikawa-yatsubusa’ remains the hyphenated Atlas form; spaced/title-case forms are search variants; no synonym is approved; commercial regional/discovery narratives remain excluded without primary evidence.

## 6. Descriptive confidence and authentication

Across all five records, descriptive confidence is based on convergent institutional profiles, specimen/accession records and source-qualified synthesis. Clonal authentication remains a separate and generally lower-confidence question.

The following do not independently authenticate a cultivar:

- appearance;
- one leaf, colour or architectural character;
- a nursery or institutional label;
- a photograph-record name assertion;
- a propagation method;
- or a seedling from labelled material.

## 7. Comparison and relationship review

The relationship proposals remain editorial candidates only. Principal comparisons are:

- RC-006 versus RC-001 and RC-009 for summer foliage and seasonal timing;
- RC-007 versus RC-005 and RC-009 for yellow foliage, variegation and seasonal margins;
- RC-008 versus RC-010 for crinkled/tufted taller texture versus dwarf layered overlap;
- RC-009 versus RC-005, RC-006 and RC-007 for spring-led seasonality;
- RC-010 versus RC-004, RC-005 and RC-008 for compact use, taxonomic contrast and dense-foliage mechanism.

No graph object or relationship vocabulary change is approved by this Decision Record.

## 8. Contract and vocabulary result

The governed string-locator contract is sufficient. No engineering change request is required. The repository path named `source-sidecar.template.json` in the work request was not present at the inspected baseline, but the approved RC contract, source schema and integration contract provide sufficient requirements for this correction.

No schema, compiler, validator or vocabulary change is proposed.

## 9. Approval boundary

Each RC remains deliberately outside the approved/frozen compiler status patterns:

- freeze date: **Pending**;
- final freeze/publication approval: **Pending**;
- publication status: **Not public**;
- G5–G9: **not claimed**.

DR-EDITORIAL-003 resolves only the three bounded G4 nomenclatural conditions. Neither Decision Record is a G8 freeze or publication decision.

## 10. Consequences and next receiver

The CTO / engineering and integration stream should:

1. treat G4 as PASS for RC-006 through RC-010, with the accepted uncertainty preserved;
2. confirm that all five remain outside the compiled public corpus;
3. confirm generated outputs remain unchanged;
4. await matching G5 media handoffs or explicitly approved governed gaps;
5. return any genuine contract issue as a structured request;
6. not create an integration/publication record until a coherent record reaches G5 and the later G6–G8 gates.

The editorial stream remains stopped before G5, G6, G7, G8, G9, freeze or publication.

## 11. Review history

- 2026-07-28 — G4 recommendations merged through PR #22.
- 2026-07-28 — Project Owner accepted the bounded RC-006, RC-007 and RC-008 nomenclatural conditions through DR-EDITORIAL-003; freeze and publication remain pending.
