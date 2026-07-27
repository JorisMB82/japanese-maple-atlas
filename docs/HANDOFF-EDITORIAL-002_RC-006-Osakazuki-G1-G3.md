# HANDOFF-EDITORIAL-002 — RC-006 ‘Osakazuki’ G1–G3 Package

**Handoff status:** READY FOR G4 BOTANICAL/EDITORIAL REVIEW  
**Inspected `main`:** `969b02db7ef27a1c80ddc02f893404945abb7f9c`  
**Editorial branch:** `content/rc-006-010`  
**Current branch commit after package creation:** recorded in the pull request head  
**RC identifier:** RC-006  
**Accepted proposed name:** *Acer palmatum* ‘Osakazuki’  
**Compiler profile:** `canonical-rc-v1`  
**Record status:** editorial draft; not approved or frozen  
**Prepared:** 2026-07-27

## 1. Baseline reconciliation

The earlier RC-006 research was audited against the post-housekeeping baseline. The following corrections were applied:

- baseline advanced from `2d3b5f03d0aac0cb0d323b96a73b4ce0442f9d78` to `969b02db7ef27a1c80ddc02f893404945abb7f9c`;
- Sprint 11.5 is treated as complete rather than pending;
- the editorial draft no longer proposes or owns a media sidecar;
- media requirements are expressed inside the RC media register for the media stream;
- the engineering-owned programme register was not edited;
- draft approval and freeze metadata remain explicitly pending;
- the source sidecar remains an editorial source object and does not imply media-use rights;
- the selected species is already present in the governed taxon registry.

No RC-001 through RC-005 file was changed.

## 2. Editorial files

- Canonical RC draft: `atlas-repository/reference-standards/RC-006.md`
- Source sidecar: `atlas-repository/reference-standards/sources/RC-006.sources.json`
- Wave 1 assignment handoff: `docs/HANDOFF-EDITORIAL-001_Wave-1-RC-006-RC-010-Cultivar-Assignments.md`
- Assignment Decision Record: `docs/DR-EDITORIAL-001_Wave-1-RC-006-RC-010-Cultivar-Assignments.md`

## 3. Gate evidence

### G1 — Research ready

**Assessment: PASS**

Research questions and source strategy cover:

- accepted name, institutional spellings, synonyms and group formulations;
- selector, origin, earliest use and original Japanese naming evidence;
- architecture, leaf morphology, seasonal expression and dimensions;
- culture, hardiness, propagation and cultivar continuity;
- diagnostic limits and comparison needs;
- specimen and accession evidence;
- media subjects and identity constraints.

### G2 — Evidence assembled

**Assessment: PASS for G4 review**

Six RC-scoped underlying source objects are present:

| Source ID | Authority | Primary editorial role |
| --- | --- | --- |
| SRC-RC-006-001 | Royal Horticultural Society | accepted display form, synonyms, morphology, dimensions, cultivation, hardiness and propagation |
| SRC-RC-006-002 | Missouri Botanical Garden | North American horticultural synthesis, leaf description, size, culture and source-reported name interpretation |
| SRC-RC-006-003 | NC State Extension | structured habit, dimensions, leaves, fruit, bark and cultural conditions |
| SRC-RC-006-004 | Royal Botanic Gardens, Kew | accepted species-level taxonomy and range context only |
| SRC-RC-006-005 | RHS Herbarium | dated institutional specimen records under the cultivar name |
| SRC-RC-006-006 | JC Raulston Arboretum | living-accession records, measured dimensions and spelling discrepancy |

All required evidence domains are mapped:

- identity;
- morphology;
- seasonal;
- dimensions;
- cultivation;
- history;
- diagnosis.

Each source contains an authority assessment, exact section/specimen/accession locators and material limitations.

### G3 — Editorial draft complete

**Assessment: PASS as a review draft**

The RC includes all canonical sections required from RC-006 onward:

1. At-a-glance summary
2. Cultivar identity and nomenclature
3. Naming variants and synonyms
4. Botanical description
5. Whole-plant architecture
6. Leaf morphology
7. Seasonal characteristics
8. Horticultural information
9. Historical provenance
10. Propagation and cultivar continuity
11. Diagnostic framework
12. Confidence profile
13. Relationship register
14. Source and evidence register
15. Media register
16. Unresolved Research Register
17. Rejected claims
18. Freeze Decision

The draft intentionally uses a non-approved status and pending freeze metadata. It must not be forced through the approved/frozen compiler path before G4 review and project-owner action.

## 4. Evidence and locator summary

### Identity and naming

- Institutional consensus supports *Acer palmatum* ‘Osakazuki’ as the working name.
- RHS uses ‘Ōsakazuki’ and records ‘Taihai’ plus Heptalobum and Elegans group formulations.
- RHS and Missouri Botanical Garden use Amoenum-related group language in descriptive/classification contexts.
- JC Raulston displays ‘Ōsakasuki’; the discrepancy remains unresolved.
- Kew supports *Acer palmatum* at species rank but does not establish cultivar origin.

### Morphology and architecture

- Compatible institutional descriptions support rounded to upright development with a rounded or broad-rounded crown.
- Reviewed cultivar profiles generally describe relatively large green palmate leaves with seven serrate, moderately cut lobes.
- Missouri Botanical Garden reports a cupped leaf base; comparative frequency and diagnostic strength remain unproven.

### Seasonal expression

- Green spring/summer foliage is consistently supported.
- Autumn descriptions converge on brilliant orange-scarlet, red or crimson, with environmental qualification.
- Small red to reddish-purple flowers and red samaras are secondary characters.

### Dimensions

- RHS: 2.5–4 m high and wide, with 10–20-year context.
- Missouri Botanical Garden: 15–25 ft high and 10–15 ft wide, with additional ten-year context.
- NC State: 15–24 ft high and 10–15 ft wide.
- JC Raulston provides accession-specific measured heights.

The draft does not convert these into a universal mature maximum or annual increment.

### Cultivation

- Moist, well-drained soil and climate-qualified sun to partial shade are supported.
- RHS/MBG scorch cautions conflict with stronger NC State resistance wording; the draft rejects an absolute scorch-resistance claim.
- RHS H6, MBG USDA 5–9 and NC State 5a–8b remain separate source frameworks.
- RHS publishes grafting and softwood cuttings.

### History and continuity

- RHS herbarium records and JC Raulston accessions document modern institutional use.
- Original selector, date, location, naming author, early catalogue and exact ‘Taihai’ history remain unresolved.
- Institutional or nursery labels are not treated as automatic clonal authentication.

## 5. Naming and synonym decisions for review

| Name or formulation | Draft treatment | G4 review need |
| --- | --- | --- |
| ‘Osakazuki’ | accepted Atlas working form | confirm |
| ‘Ōsakazuki’ | RHS display/romanization form | confirm |
| ‘Taihai’ | RHS-recorded synonym with unresolved historical scope | nomenclatural review |
| Amoenum / Elegans / Heptalobum | source-specific group formulations, not identity proof | controlled-vocabulary review |
| ‘Ōsakasuki’ | unresolved JC Raulston spelling discrepancy | institutional confirmation desirable |
| “wine cup” interpretation | source-reported interpretation, not verified etymology | retain qualification or remove |

No schema or vocabulary change is being pushed. A structured engineering request should be raised only if G4 review determines that the existing synonym or relationship representation is insufficient.

## 6. Principal unresolved claims

- original selector, place and date;
- original Japanese characters and naming intention;
- earliest catalogue or publication;
- exact historical relationship of ‘Taihai’;
- reconciliation of the three group formulations;
- meaning of JC Raulston's ‘Ōsakasuki’ spelling;
- determination histories of RHS specimens;
- stability of the cupped leaf base across authenticated accessions;
- diagnostic separation from close green-leaved autumn-red cultivars;
- current commercial clonal uniformity;
- rootstock and graft-height effects.

## 7. Principal rejected claims

The draft rejects claims that:

- red autumn colour, seven lobes or basal cupping independently identify the cultivar;
- every ‘Taihai’ and every ‘Osakazuki’ label is proven clonally equivalent;
- group formulations are automatically interchangeable;
- the cultivar has a fixed mature maximum or universal annual growth rate;
- full sun cannot cause scorch;
- one institutional or nursery label conclusively authenticates a specimen;
- ‘Ōsakasuki’ is already an approved synonym;
- seedlings inherit the named cultivar identity;
- the Sprint 11 compiler proof was a botanical RC-006.

## 8. Relationship proposals

Editorial candidates, not repository graph objects:

- RC-001 ‘Bloodgood’ — architecture comparison and summer-foliage contrast;
- RC-002 ‘Seiryu’ — broad palmate versus deeply dissected foliage;
- RC-003 ‘Sango-kaku’ — similar broad habit but bark-led versus autumn-foliage-led ornamental identity;
- RC-004 ‘Crimson Queen’ — rounded/upright green palmate versus cascading red dissectum;
- RC-005 ‘Aureum’ — seasonal and cross-species contrast;
- proposed RC-009 ‘Katsura’ — spring-emergence-led versus autumn-led seasonal expression;
- ‘Taihai’ — unresolved synonym/identity relationship requiring nomenclatural decision.

## 9. Required media subjects and diagnostic details

Requested from the media stream:

1. autumn whole-plant habit showing crown architecture and broad palmate foliage;
2. summer whole-plant habit;
3. leaf detail with scale, upper/lower surfaces, petiole and basal form;
4. red samaras;
5. preferably one accession documented in spring, summer and autumn.

Constraints:

- red autumn colour alone is not identity evidence;
- a label must be recorded as asserted identity unless stronger provenance supports authentication;
- institutional images remain candidates until rights and provenance are approved;
- RHS specimen copyright is not treated as publication permission;
- no editorial file authorizes an illustration or media derivative.

## 10. G4 assessment

**Current G4 recommendation: CONDITIONAL.**

The package is ready for botanical/editorial review. G4 completion requires:

1. project-owner approval of the RC-006 assignment;
2. botanical review of habit, morphology, seasonal and horticultural synthesis;
3. nomenclatural review of ‘Taihai’, group terms and ‘Ōsakasuki’;
4. acceptance or correction of unresolved provenance limits;
5. source-sidecar approval;
6. cross-record terminology review;
7. preparation of a freeze recommendation without entering G5–G9.

## 11. Exact next actions requested

### Project owner / Editor-in-Chief

- approve or amend DR-EDITORIAL-001 and the RC-006 assignment;
- designate or perform G4 botanical/editorial review;
- decide whether the unresolved synonym/classification history may remain explicitly unresolved in the freeze candidate.

### Media stream

- use the Wave 1 assignment handoff and RC-006 media-register requirements;
- return candidate assets, rights/provenance status, specimen-identity status and coverage gaps;
- create and own `RC-006.media.json` only after its governance requirements are satisfied.

### Engineering/integration stream

- update the programme register only after the assignment decision is merged;
- do not ingest the RC as approved/frozen while draft metadata remains;
- report any canonical-contract issue as a structured change request rather than altering botanical prose;
- no contract or vocabulary change is currently requested.

## 12. Readiness statement

- **Assignment G0:** PASS pending owner approval/merge.
- **G1:** PASS.
- **G2:** PASS for review.
- **G3:** PASS as a canonical editorial draft.
- **G4:** CONDITIONAL.
- **G5–G9:** not claimed and outside this handoff.
