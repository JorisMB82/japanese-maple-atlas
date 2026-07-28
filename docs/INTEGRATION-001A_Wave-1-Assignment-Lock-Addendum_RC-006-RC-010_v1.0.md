# INTEGRATION-001A — Wave 1 Assignment-Lock Addendum

**Version:** 1.0  
**Status:** Active engineering addendum  
**Scope:** Sprint 12 / Wave 1 — RC-006 through RC-010  
**Owner:** Engineering / integration stream  
**Inspected `main`:** `9c9ec5f239f915ffda3bb3115569d57afa3d663a`  
**Parent contract:** `INTEGRATION-001_Wave-1-Engineering-Integration-Contract_RC-006-RC-010_v1.0.md`  
**Editorial source:** merged PR `#13`

## 1. Purpose

This addendum updates the Wave 1 Engineering Integration Contract after repository merge of the project-owner-approved G0 assignment decision. It does not change the G6 or G7 entry criteria and does not authorise compilation, integration or publication of RC-006.

Where the parent contract states that RC-006 through RC-010 are unassigned, this addendum supersedes that current-state statement only. All ownership, handoff, validation, rollback and publication controls in the parent contract remain in force.

## 2. Verified merged editorial packet

PR `#13 — Editorial Wave 1: lock RC-006–RC-010 assignments and add RC-006 G1–G3 draft` was squash-merged to `main` as:

- final reviewed editorial head: `a6c02fcf95ef380083aaf113acfd7665b1889eee`;
- squash commit and inspected current `main`: `9c9ec5f239f915ffda3bb3115569d57afa3d663a`;
- changed files: five editorial-owned files;
- repository-quality workflow run: `30303617848` — PASS across all three jobs;
- unresolved PR review threads: none.

The earlier checkpoint head `86cb1e145c368a5819044744fc3e1df67fc605ea` was not the final merged head and must not be used as the authoritative packet SHA.

## 3. Stable Wave 1 assignments

| RC | Stable G0 assignment | Taxon | Engineering assessment |
| --- | --- | --- | --- |
| RC-006 | *Acer palmatum* ‘Osakazuki’ | `TAX-APAL` | PASS — assignment locked; editorial draft only |
| RC-007 | *Acer palmatum* ‘Butterfly’ | `TAX-APAL` | PASS — assignment locked |
| RC-008 | *Acer palmatum* ‘Shishi-gashira’ | `TAX-APAL` | PASS — assignment locked |
| RC-009 | *Acer palmatum* ‘Katsura’ | `TAX-APAL` | PASS — assignment locked |
| RC-010 | *Acer palmatum* ‘Mikawa-yatsubusa’ | `TAX-APAL` | PASS — assignment locked; RC-010 checkpoint preserved |

The assignments are repository-authoritative at G0. They do not establish approval of synonyms, provenance, morphology, horticulture, relationships, media, freeze status or publication.

## 4. Contract and taxon assessment

No contract, compiler, schema or taxon change is required for the selected Wave 1 cohort:

- every selected record is *Acer palmatum*;
- `contract/taxa.json` already contains the approved `TAX-APAL` entry for *Acer palmatum*;
- the canonical `canonical-rc-v1` profile already applies from RC-006;
- no cultivar-specific compiler branch is required or permitted.

**Assessment:** `PASS — NO SHARED CONTRACT CHANGE REQUIRED`.

A future proposal for *Acer japonicum* ‘Aconitifolium’ remains outside Wave 1. Before canonical ingestion, that proposal requires a separate evidence-backed taxon request, engineering review, approved governance record and merged `Acer japonicum` taxon-contract entry. It must not be added opportunistically through an editorial or integration branch.

## 5. RC-006 gate boundary

The merged `RC-006.md` is intentionally non-publishable:

- record status: `Draft — G4 botanical/editorial review required`;
- freeze date: pending;
- approval decision: pending;
- G1: PASS;
- G2: PASS for review;
- G3: PASS as an editorial draft;
- G4: `CONDITIONAL` and incomplete;
- G5 through G9: not claimed.

The source sidecar is likewise a draft editorial-review object, not an approved integration sidecar. No `RC-006.media.json` exists in the merged editorial packet.

Engineering must not:

- change the draft to an approved/frozen status;
- approve the source sidecar;
- create or approve media on editorial's behalf;
- run canonical materialisation with the intent of publishing RC-006;
- create `integration/rc-006-010` from this partial packet;
- update generated repository outputs to include RC-006.

The successful PR #13 compiler drift check confirms that the current draft remains outside the approved/frozen compilation cohort and that the five frozen public records and 235-object baseline remain canonical.

## 6. Revised Wave 1 readiness

**Assignment layer:** `PASS`  
**Editorial layer:** RC-006 at G3 draft / G4 CONDITIONAL; RC-007 through RC-010 at stable G0  
**Media layer:** no G5 handoff received  
**G6 integration:** `BLOCKED`  
**Publication:** `NOT PUBLIC`

The integration branch remains prohibited until coherent handoffs are available for the full five-record cohort:

1. G4-approved canonical RC Markdown and approved source sidecars for RC-006 through RC-010;
2. matching G5-approved media sidecars, approved primary visuals or explicit governed gaps;
3. exact branch and head SHAs plus structured handoff packets from both streams;
4. consistent identifiers, cultivar assignments and taxon references across every package.

## 7. Engineering next actions

Engineering will:

1. maintain the stable assignments in `docs/PROGRAMME-REGISTER_RC-001-RC-025.md`;
2. keep the parent integration contract and this addendum available to both producing streams;
3. review concrete G4 and G5 packets when received;
4. open a shared engineering change only if an actual handoff exposes a documented contract, validator or application defect;
5. create `integration/rc-006-010` only when the full coherent cohort is ready for G6;
6. preserve the RC-010 formative checkpoint and prohibit RC-011 integration beforehand.

## 8. Current handoff request

### Editorial

Return the complete Wave 1 G4 packet, including approved/frozen metadata only after botanical, nomenclatural and owner review is complete. RC-006 source-sidecar status must be deliberately changed through editorial approval, not engineering repair.

### Media

Return the matching Wave 1 G5 packet for the locked cultivar assignments, including approved media sidecars and either approved primary visuals or explicit governed-gap treatment.

### Engineering assessment

- stable G0 assignments: `PASS`;
- current RC-006 draft preservation: `PASS`;
- taxon compatibility: `PASS`;
- G6 readiness: `BLOCKED` pending complete G4 and G5 handoffs.
