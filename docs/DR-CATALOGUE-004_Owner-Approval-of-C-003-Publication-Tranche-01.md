# DR-CATALOGUE-004 — Owner Approval of C-003 Publication Tranche 01

**Status:** APPROVED — C3 IMPLEMENTATION PENDING CTO REVIEW AND PROTECTED MERGE  
**Decision owner:** Project Owner  
**Decision date:** 2026-07-30  
**Catalogue batch:** `C-003`  
**Authorised tranche:** `C-003 Publication Tranche 01`  
**Stable identity:** `CUL-000021`  
**Media evidence:** PR `#53`, `HANDOFF-MEDIA-CATALOGUE-008`  
**Publication-readiness evidence:** `CATALOGUE-VISUAL-SUPPORT-004`, `HANDOFF-EDITORIAL-CATALOGUE-006`

## 1. Decision

The Project Owner authorises a controlled C3 publication implementation for:

- `CUL-000021` — *Acer palmatum* ‘Tamukeyama’.

The profile may move to the current public Catalogue state through a protected pull request after final C3 review. Publication becomes effective only after CTO review, successful protected validation, merge to `main` and production inspection.

No other C-003 profile is approved by this decision.

## 2. Confirmed C0/C1 basis

The record retains:

- an owner-approved stable `CUL-######` identity and C-003 programme slot;
- C0 result `unique`;
- accepted working name ‘Tamukeyama’ under *Acer palmatum*;
- three traceable institutional sources;
- MEDIUM risk with bounded synonym and red-dissectum confusion issues;
- completed C1 editorial approval.

The spacing variants `Tamuke yama` and `Tamuke-yama` resolve to the same identity. RHS-recorded ‘Beni-hagoromo’ remains a qualified probable synonym whose historical scope and priority are not claimed as resolved. ‘Hagoromo’ remains a separate cultivar.

## 3. Confirmed C2 media basis

The profile has an approved lawful three-role gallery with:

- `MED-CUL-000021-001` — `habit-primary`, CC0 1.0;
- `MED-CUL-000021-002` — `foliage-detail`, CC BY-SA 4.0;
- `MED-CUL-000021-003` — `seasonal-diagnostic`, CC BY 4.0;
- exact source-byte preservation and source SHA-256;
- deterministic derivatives and lineage;
- creator, rights-holder, licence and attribution records;
- privacy-treated public derivatives;
- item-level `source-asserted` identity qualifications;
- canonical primary-media linkage.

The media source bytes, derivative bytes, hashes, licences, sidecar and approval history are not changed by this decision.

## 4. Binding public identity controls

Every public image must continue to expose its item-level identification basis and qualification. No image is represented as independent clonal authentication.

Public presentation must make clear that:

- the source identifies each item as ‘Tamukeyama’;
- the Atlas has not independently authenticated the clone;
- red colour, dissected foliage and cascading habit alone do not distinguish it from ‘Crimson Queen’, ‘Inaba-shidare’, ‘Red Dragon’ or ‘Orangeola’;
- the three images are not represented as a same-plant seasonal sequence.

## 5. C3 authorisation and conditions

The controlled implementation may:

- set the canonical profile to `published`;
- set `review.approvalState` to `batch-approved`;
- record the publication timestamp and revision history;
- expose `/cultivars/tamukeyama`;
- include the profile in published-only home, search, Explorer, comparison and Visual Library data;
- update release invariants, regression tests and programme status.

The implementation must:

1. preserve the approved media package unchanged;
2. preserve every public attribution, licence and identity-confidence qualification;
3. pass the complete protected repository workflow;
4. receive CTO review before merge;
5. remain limited to `CUL-000021`;
6. receive production inspection after merge.

## 6. Explicit exclusions

This decision does not:

- publish `CUL-000022`, `CUL-000023`, `CUL-000024` or `CUL-000025`;
- publish any remaining C-002 profile;
- approve or modify any media source, derivative, checksum, licence or sidecar;
- approve a governed gap or role exception;
- alter Reference Standard G5;
- allocate a Reference Standard identifier;
- authorise C-004 or any new cultivar assignment;
- authorise self-merge.

## 7. Rollback

If protected validation, CTO review or production inspection fails, revert the tranche publication commit. Published-only runtime discovery will remove the route while retaining the approved media and editorial evidence for correction and later resubmission.
