# HANDOFF-MEDIA-CATALOGUE-001 — Visual Coverage Planning

**Handoff status:** READY FOR CTO AND PROJECT OWNER REVIEW  
**Inspected `main`:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Branch:** `media/visual-coverage-001-025-planning`  
**Scope:** two-speed visual coverage planning for identities and programme slots 001–025  
**Asset result:** no new approved source asset, derivative, media sidecar or governed gap

## 1. Executive assessment

The media programme is aligned to the two-speed publication model:

- identities 001–010 remain governed as Reference Standards;
- programme slots 011–025 are prepared as Catalogue delivery tranches but remain unassigned;
- ordinary Catalogue release requires one approved primary visual or an approved governed visual gap;
- Reference Standard G5 remains the deeper record-specific process;
- legal rights, attribution, provenance, source preservation, privacy and honest specimen-identity treatment remain common to both classes.

The first execution priority is RC-010 ‘Mikawa-yatsubusa’, followed by RC-009 ‘Katsura’. All five Wave 1 records remain G5 BLOCKED because no complete rights/source/identity/sidecar/derivative package exists.

## 2. Changed files

### New planning and operations files

- `docs/MEDIA-010_Visual-Coverage-Programme_001-025_v1.0.md`
- `docs/MEDIA-011_Reference-Standard-G5-Priority_RC-006-RC-010_v1.0.md`
- `docs/MEDIA-012_Foundation-Visual-Uplift_RC-001-RC-005_v1.0.md`
- `docs/MEDIA-013_Catalogue-Batch-Acquisition-Operations_v1.0.md`
- `docs/MEDIA-014_Governed-Visual-Gap-Policy_v1.0.md`
- `docs/METRICS-MEDIA-001_Visual-Acquisition-Throughput.md`
- `docs/HANDOFF-MEDIA-ENGINEERING-002_Catalogue-Governed-Visual-Gap-Contract.md`
- this handoff

### Updated status files

- `docs/HANDOFF-MEDIA-001_RC-006-Osakazuki-G5-Status.md`
- `docs/HANDOFF-MEDIA-002_RC-007-Butterfly-G5-Status.md`
- `docs/HANDOFF-MEDIA-003_RC-008-Shishi-gashira-G5-Status.md`
- `docs/HANDOFF-MEDIA-004_RC-009-Katsura-G5-Status.md`
- `docs/HANDOFF-MEDIA-005_RC-010-Mikawa-yatsubusa-G5-Status.md`

The five status files were changed only because the repository now records G4 PASS for all five records and because the execution priority changed. No G5 status was upgraded.

## 3. Reference Standard records

| Record | G4 | G5 assessment | Candidate assets | Approved assets | Governed gap | Rights status | Identity status | Principal unresolved issues |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RC-010 ‘Mikawa-yatsubusa’ | PASS | BLOCKED | JCRA accession 030154 sets, including 2026/2025 spring and 2024 autumn; ambiguous Commons fallback | none | false | institutional permission and originals pending | documented route possible after image/accession mapping; otherwise uncertain/asserted | permission, originals, SHA-256, final role, comparison, provenance, sidecar, derivatives |
| RC-009 ‘Katsura’ | PASS | BLOCKED | JCRA 683044–683047; item-level Commons fallback | none | false | permission or final item licence packet pending | documented route possible after accession mapping; Commons asserted | early-spring primary, originals, rights, mapping, colour review, provenance, sidecar, derivatives |
| RC-006 ‘Osakazuki’ | PASS — owner condition accepted | BLOCKED | JCRA, Jean-Pol GRANDMONT Commons, NC State | none | false | no final approved item | asserted to documented depending route | selected source, original, rights, scaled foliage, provenance, sidecar, derivatives |
| RC-007 ‘Butterfly’ | PASS — owner condition accepted | BLOCKED | JCRA and David J. Stang Commons leads | none | false | no final approved item | asserted to documented depending route | representative variegation distribution, originals, rights, provenance, sidecar, derivatives |
| RC-008 ‘Shishi-gashira’ | PASS — owner condition accepted | BLOCKED | JCRA accession xx0090 and David J. Stang Commons leads | none | false | no final approved item | asserted to documented depending route | final role, originals, rights, RC-010 comparison, provenance, sidecar, derivatives |

## 4. Foundation uplift

Existing approved non-evidentiary identity plates remain unchanged.

| Record | Highest-value uplift | Current disposition |
| --- | --- | --- |
| RC-001 | mature whole-plant habit | planned; no candidate approved |
| RC-002 | upright whole-plant habit with dissected foliage | planned; no candidate approved |
| RC-003 | winter/young coral stem with habit context | first foundation priority; no candidate approved |
| RC-004 | cascading whole-plant habit | planned; no candidate approved |
| RC-005 | whole-plant spring or summer view | planned; no candidate approved |

## 5. Visual tranches

### V-001 — identities 001–005

- publication class: frozen Reference Standards;
- approved current state: five non-evidentiary identity plates;
- objective: one bounded photographic uplift each;
- release risk: none from uplift delay because current governed visuals remain valid.

### V-002 — identities 006–010

- publication class: non-public Reference Standard freeze candidates;
- visual state: candidate under review for all five;
- approved primary assets: none;
- sequence: RC-010, RC-009, then RC-006–RC-008;
- G5 status: BLOCKED for all five.

### V-003 — slots 011–015

- assignment: none;
- media state: planning shell only;
- action: receive proposed editorial assignments and perform pre-owner feasibility review;
- no sidecar or public gap may be created before assignment.

### V-004 — slots 016–020

Same state and process as V-003.

### V-005 — slots 021–025

Same state and process as V-003.

## 6. Catalogue operating model

The batch process contains ten steps:

1. candidate discovery;
2. item-level rights assessment;
3. identity-basis assessment;
4. original-byte acquisition;
5. source checksum and preservation;
6. privacy review;
7. caption and alt text;
8. derivative processing;
9. approval or governed-gap decision;
10. batch handoff.

Ordinary Catalogue processing stops after one approved primary visual. Additional views remain enhancements unless risk review makes them necessary.

## 7. Governed-gap contract request

Engineering request:

`docs/HANDOFF-MEDIA-ENGINEERING-002_Catalogue-Governed-Visual-Gap-Contract.md`

Reason: the current media asset schema requires a real source and four derivatives. A governed gap must not be represented by fake paths, checksums or derivative metadata.

Requested outcome: a first-class gap state with reason, reviewer, date, candidate disposition, backfill priority, public wording, `visualComplete:false`, no generic substitute, approval/revision history and validation rules.

No schema, compiler, validator or application file was changed.

## 8. Throughput baseline

- known identities: 10;
- existing approved governed primary visuals: 5 identity plates;
- existing approved photographic primaries: 0;
- active Wave 1 photographic candidate records: 5;
- new approved assets in this package: 0;
- approved governed gaps: 0;
- unassigned Catalogue slots: 15.

Planning estimates:

- ordinary open-licence Catalogue primary: 4–6 working hours;
- permissioned Catalogue primary: 5–8 hours plus external latency;
- Catalogue governed gap: 1–3 hours after documented attempts;
- Reference Standard single-primary G5 package: 8–16 hours plus external latency;
- foundation uplift: 4–8 hours.

## 9. Ownership confirmation

This package does not edit:

- botanical RC prose;
- editorial source sidecars;
- cultivar assignments;
- Catalogue schema or compiler;
- application/UI;
- programme register;
- CI;
- generated non-media outputs.

No source asset, provenance record, media sidecar or public derivative was created because no candidate completed the required rights and identity review.

## 10. Structured handoff

```json
{
  "inspectedMainSha": "f8aeff982c5d155ae4880a618453dc38c40f008e",
  "branch": "media/visual-coverage-001-025-planning",
  "headCommit": "RECORDED_IN_FINAL_PR_METADATA",
  "referenceStandardRecords": [
    {
      "recordId": "RC-010",
      "assessment": "BLOCKED",
      "candidateAssets": ["JCRA 767118-767121", "JCRA 752515-752517", "JCRA 745298-745300", "Commons Yatsubusa item under identity clarification"],
      "approvedAssets": [],
      "governedGap": false,
      "rightsStatus": "JCRA permission and originals pending; no final Commons item approved",
      "identityStatus": "documented route possible through accession 030154 after image mapping",
      "unresolvedIssues": ["permission", "original bytes", "SHA-256", "provenance", "sidecar", "derivatives", "RC-008 comparison"]
    },
    {
      "recordId": "RC-009",
      "assessment": "BLOCKED",
      "candidateAssets": ["JCRA 683044-683047", "item-level Commons fallback leads"],
      "approvedAssets": [],
      "governedGap": false,
      "rightsStatus": "permission or final item-level licence packet pending",
      "identityStatus": "documented route possible after JCRA accession mapping; Commons asserted",
      "unresolvedIssues": ["early-spring primary", "permission", "original bytes", "provenance", "sidecar", "derivatives"]
    },
    {
      "recordId": "RC-006",
      "assessment": "BLOCKED",
      "candidateAssets": ["JCRA", "Jean-Pol GRANDMONT Commons", "NC State-listed items"],
      "approvedAssets": [],
      "governedGap": false,
      "rightsStatus": "no final approved item",
      "identityStatus": "asserted to documented depending selected route",
      "unresolvedIssues": ["selection", "rights", "original", "scaled foliage", "sidecar", "derivatives"]
    },
    {
      "recordId": "RC-007",
      "assessment": "BLOCKED",
      "candidateAssets": ["JCRA", "David J. Stang Commons"],
      "approvedAssets": [],
      "governedGap": false,
      "rightsStatus": "no final approved item",
      "identityStatus": "asserted to documented depending selected route",
      "unresolvedIssues": ["representative variegation", "rights", "original", "sidecar", "derivatives"]
    },
    {
      "recordId": "RC-008",
      "assessment": "BLOCKED",
      "candidateAssets": ["JCRA accession xx0090", "David J. Stang Commons"],
      "approvedAssets": [],
      "governedGap": false,
      "rightsStatus": "no final approved item",
      "identityStatus": "asserted to documented depending selected route",
      "unresolvedIssues": ["selection", "rights", "original", "RC-010 comparison", "sidecar", "derivatives"]
    }
  ],
  "foundationUplift": [
    {"recordId": "RC-001", "target": "mature whole-plant habit", "status": "planned"},
    {"recordId": "RC-002", "target": "upright habit with dissected foliage", "status": "planned"},
    {"recordId": "RC-003", "target": "winter or young coral stem with habit", "status": "planned-first"},
    {"recordId": "RC-004", "target": "cascading whole-plant habit", "status": "planned"},
    {"recordId": "RC-005", "target": "whole-plant spring or summer view", "status": "planned"}
  ],
  "visualTranches": {
    "V-001": {"identities": "001-005", "state": "approved identity plates; photographic uplift planned"},
    "V-002": {"identities": "006-010", "state": "five candidates under review; all G5 BLOCKED"},
    "V-003": {"slots": "011-015", "state": "unassigned; feasibility shell only"},
    "V-004": {"slots": "016-020", "state": "unassigned; feasibility shell only"},
    "V-005": {"slots": "021-025", "state": "unassigned; feasibility shell only"}
  },
  "throughputMetrics": {
    "knownIdentities": 10,
    "approvedGovernedPrimaryVisuals": 5,
    "approvedPhotographicPrimaries": 0,
    "activeCandidateRecords": 5,
    "newApprovedAssets": 0,
    "approvedGovernedGaps": 0,
    "unassignedSlots": 15
  },
  "engineeringRequests": ["HANDOFF-MEDIA-ENGINEERING-002 — Catalogue Governed Visual Gap Contract"],
  "changedFiles": [
    "docs/MEDIA-010_Visual-Coverage-Programme_001-025_v1.0.md",
    "docs/MEDIA-011_Reference-Standard-G5-Priority_RC-006-RC-010_v1.0.md",
    "docs/MEDIA-012_Foundation-Visual-Uplift_RC-001-RC-005_v1.0.md",
    "docs/MEDIA-013_Catalogue-Batch-Acquisition-Operations_v1.0.md",
    "docs/MEDIA-014_Governed-Visual-Gap-Policy_v1.0.md",
    "docs/METRICS-MEDIA-001_Visual-Acquisition-Throughput.md",
    "docs/HANDOFF-MEDIA-ENGINEERING-002_Catalogue-Governed-Visual-Gap-Contract.md",
    "docs/HANDOFF-MEDIA-CATALOGUE-001_Visual-Coverage-Planning.md",
    "docs/HANDOFF-MEDIA-001_RC-006-Osakazuki-G5-Status.md",
    "docs/HANDOFF-MEDIA-002_RC-007-Butterfly-G5-Status.md",
    "docs/HANDOFF-MEDIA-003_RC-008-Shishi-gashira-G5-Status.md",
    "docs/HANDOFF-MEDIA-004_RC-009-Katsura-G5-Status.md",
    "docs/HANDOFF-MEDIA-005_RC-010-Mikawa-yatsubusa-G5-Status.md"
  ],
  "validationPerformed": ["PENDING_FINAL_PR_CI"],
  "nextReceiver": "CTO / engineering and Project Owner"
}
```

## 11. Requested review

### CTO / engineering

- review the governed-gap contract request;
- confirm the planning files remain within media ownership;
- confirm no change is required to the existing Reference Standard photograph pipeline;
- return any contract modification through the engineering stream.

### Project Owner

- confirm the two-speed media priorities;
- retain RC-010 then RC-009 as the first G5 completion sequence;
- approve or modify the governed-gap authority and public wording;
- supply or authorize external permission outreach where institutional images are preferred.

## 12. Stop point

Stop before assigning slots 011–025, creating Catalogue sidecars, approving a governed gap, claiming G5 PASS, entering G6, changing engineering-owned contracts or publishing any additional cultivar.