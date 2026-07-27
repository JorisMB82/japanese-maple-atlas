# DR-EDITORIAL-001 — Wave 1 RC-006–RC-010 Cultivar Assignments

**Status:** Approved by project owner; authorised for merge  
**Decision date:** 2026-07-27  
**Prepared against `main`:** `969b02db7ef27a1c80ddc02f893404945abb7f9c`  
**Editorial branch:** `content/rc-006-010`  
**Decision authority:** Project owner / Editor-in-Chief  
**Responsible stream:** Editorial and content production  
**Governing roadmap:** ROADMAP-002 Version 1.1 — Approved and governing  
**Supporting handoff:** `docs/HANDOFF-EDITORIAL-001_Wave-1-RC-006-RC-010-Cultivar-Assignments.md`

## Context

The repository-owned programme register currently records RC-006 through RC-010 as unassigned. Earlier cultivar proposals existed only in the editorial conversation and an unmerged local package, so they were not repository-authoritative.

The post-housekeeping baseline also establishes that:

- Sprint 11 and Sprint 11.5 are complete;
- the editorial stream owns cultivar selection and RC/source-sidecar production;
- the media stream owns assets and media sidecars;
- engineering/integration owns the programme register;
- branches must start from current `main`;
- the approved taxon registry currently includes *Acer palmatum* and *Acer shirasawanum*.

The earlier provisional proposal to assign RC-010 to *Acer japonicum* ‘Aconitifolium’ would introduce an engineering-owned taxon-contract dependency because *Acer japonicum* is not currently registered. That proposal is therefore deferred rather than silently creating a schema or contract change inside the editorial branch.

## Decision

Assign and lock the Wave 1 cohort at G0 as follows:

1. **RC-006 — *Acer palmatum* ‘Osakazuki’**
2. **RC-007 — *Acer palmatum* ‘Butterfly’**
3. **RC-008 — *Acer palmatum* ‘Shishi-gashira’**
4. **RC-009 — *Acer palmatum* ‘Katsura’**
5. **RC-010 — *Acer palmatum* ‘Mikawa-yatsubusa’**

The replacement of *Acer japonicum* ‘Aconitifolium’ with ‘Mikawa-yatsubusa’ is approved for Wave 1. ‘Aconitifolium’ is deferred for a future wave and may later require a governed *Acer japonicum* taxon-contract addition.

The assignment lock applies to record identifiers and the accepted proposed working names. It does not pre-approve synonyms, histories, descriptions, media, relationships, freeze decisions or publication.

## Rationale

The selected cohort expands the first five records across five complementary editorial and product roles:

- autumn-red expression on green growing-season foliage;
- variegation and reversion;
- dense lion’s-mane-type architecture and curled/crowded foliage;
- spring-emergence colour and seasonal trajectory;
- dwarf scale and layered/overlapping foliage.

All five are *Acer palmatum*, already supported by the governed taxon registry. Institutional source availability is sufficient to begin G1 research, and the media problems are material but manageable through the completed Sprint 11.5 workflow.

The cohort also creates useful comparison pairs without duplication:

- RC-006 versus RC-001 and RC-009;
- RC-007 versus RC-005 and RC-009;
- RC-008 versus RC-010 and RC-003;
- RC-009 versus RC-005 and RC-006;
- RC-010 versus RC-008 and RC-004.

## Alternatives considered

### Retain *Acer japonicum* ‘Aconitifolium’ as RC-010

**Not selected for Wave 1.** It remains a valid future corpus candidate, but current canonical ingestion lacks an approved *Acer japonicum* taxon entry. Adding it now would either block the record or require an engineering change before editorial production. The first wave can achieve strong morphological diversity without that dependency.

### Use ‘Koto-no-ito’ as RC-010

**Deferred.** It is a strong linearilobum candidate with institutional sources and may be promoted into a later wave. ‘Mikawa-yatsubusa’ provides a more important missing first-ten role: genuinely dwarf scale plus layered foliage.

### Use a second red dissectum cultivar

**Deferred.** RC-004 ‘Crimson Queen’ already represents this product space. Fine red-dissectum comparison remains valuable later, but it is less urgent than variegation, spring emergence and dwarf layered architecture.

### Select five cultivars only by market popularity

**Rejected.** The Wave 1 cohort must test the editorial contract and product comparison model, not simply reproduce a nursery sales list.

## Consequences

Following approval and merge:

1. Editorial may proceed through G1–G4 under stable Wave 1 identifiers.
2. Media may create acquisition and sidecar plans for the same five identifiers.
3. Engineering/integration may update the repository-owned programme register from the structured handoff.
4. RC-010 remains the formative checkpoint record.
5. *Acer japonicum* and ‘Aconitifolium’ remain deferred pending a future evidence-backed taxon-contract request.
6. Any reassignment requires a superseding Decision Record or an approved amendment before another stream relies on it.

## Approval boundary

This document is not a cultivar freeze decision. No RC-006–RC-010 record is approved, frozen, media-ready, integrated, technically validated or published by this assignment decision.

RC-006 remains:

- G1 PASS;
- G2 PASS for review;
- G3 PASS as an editorial draft;
- G4 CONDITIONAL;
- G5–G9 not claimed.

## Project-owner determination

- [x] **Approved as proposed**
- [ ] **Approved with amendments recorded below**
- [ ] **Deferred**
- [ ] **Rejected**

**Approver:** Joris Magenti — Project owner / Editor-in-Chief  
**Approval date:** 2026-07-27  
**Amendments / rationale:** No amendment to the five proposed assignments. The substitution of ‘Mikawa-yatsubusa’ for ‘Aconitifolium’ is expressly approved. ‘Aconitifolium’ is deferred and may later require a governed *Acer japonicum* taxon-contract addition. This decision locks G0 only and does not constitute G4 approval of RC-006.
