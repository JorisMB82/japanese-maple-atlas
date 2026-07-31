# DR-CATALOGUE-003 — Owner Approval of C-002 Publication Tranche 01

**Status:** APPROVED — C3 IMPLEMENTATION PENDING CTO REVIEW AND PROTECTED MERGE  
**Decision owner:** Project Owner  
**Decision date:** 2026-07-30  
**Catalogue batch:** `C-002`  
**Authorised tranche:** `C-002 Publication Tranche 01`  
**Stable identities:** `CUL-000016`, `CUL-000019`  
**Media evidence:** PR `#48`, `HANDOFF-MEDIA-CATALOGUE-006`  
**Publication-readiness evidence:** `CATALOGUE-VISUAL-SUPPORT-004`, `HANDOFF-EDITORIAL-CATALOGUE-006`

## 1. Decision

The Project Owner authorises a controlled C3 publication implementation for:

- `CUL-000016` — *Acer shirasawanum* ‘Autumn Moon’;
- `CUL-000019` — *Acer palmatum* ‘Shin-deshōjō’.

The two profiles may move to the current public Catalogue state through a protected pull request after final C3 review. Publication becomes effective only after CTO review, successful protected validation, merge to `main` and production inspection.

No other C-002 or C-003 profile is approved by this decision.

## 2. Confirmed C0/C1 basis

Both records retain:

- an owner-approved stable `CUL-######` identity and programme slot;
- C0 result `unique`;
- a supported accepted working name and taxon;
- four traceable sources;
- MEDIUM risk with bounded, disclosed residual issues;
- completed C1 editorial approval.

### CUL-000016 — ‘Autumn Moon’

The accepted public treatment remains *Acer shirasawanum* ‘Autumn Moon’ (`TAX-ASHI`). *Acer palmatum* and *Acer japonicum* usages remain qualified historical or commercial label variants and must not create separate identities. Orange or yellow foliage alone does not authenticate the cultivar. The preferred cultivar-level foliage guidance is approximately eleven lobes; broader species-level variation is contextual and not an authentication key.

### CUL-000019 — ‘Shin-deshōjō’

The accepted public form remains ‘Shin-deshōjō’, preserving the hyphen and macrons. `Shin-deshojo`, `Shindeshojo`, spaced forms and title-case label forms remain aliases for search and identity resolution, not separate cultivars. ‘Deshōjō’ and ‘Deshōjō-nishiki’ remain separate accepted identities.

## 3. Confirmed C2 media basis

Both profiles have an approved three-role gallery with:

- one `habit-primary` item;
- one `foliage-detail` item;
- one `seasonal-diagnostic` item;
- exact source-byte preservation and SHA-256;
- deterministic derivatives and lineage;
- lawful Creative Commons display bases;
- complete creator, rights-holder, licence and attribution records;
- privacy-treated public derivatives;
- item-level source-asserted identity qualifications;
- canonical primary-media linkage.

The media source bytes, derivative bytes, hashes, licences, sidecars and approval history are not changed by this decision.

## 4. Binding public identity controls

Every public image must continue to expose its item-level identity basis and qualification. No image is represented as independent clonal authentication.

For `MED-CUL-000019-003`, public presentation must retain all of the following:

- it is a different specimen from the Meise spring images;
- the exhibition label is the identification basis;
- the Atlas has not independently authenticated the clone;
- bonsai training is not representative of ordinary cultivar habit;
- the image does not establish a same-plant seasonal sequence.

## 5. C3 authorisation and conditions

The controlled implementation may:

- set both canonical profiles to `published`;
- set `review.approvalState` to `batch-approved`;
- record the publication decision timestamp and revision history;
- expose `/cultivars/autumn-moon` and `/cultivars/shin-deshojo`;
- include both profiles in published-only search, Explorer, comparison and Visual Library data;
- update release invariants, regression tests and programme status.

The implementation must:

1. preserve the approved media package unchanged;
2. preserve every public attribution, licence and identity-confidence qualification;
3. pass the complete protected repository workflow;
4. receive CTO review before merge;
5. remain limited to CUL-000016 and CUL-000019;
6. receive production inspection after merge.

## 6. Explicit exclusions

This decision does not:

- publish CUL-000017, CUL-000018 or CUL-000020;
- publish any C-003 profile;
- approve or modify any media source, derivative, checksum, licence or sidecar;
- approve a governed gap;
- alter Reference Standard G5;
- allocate a Reference Standard identifier;
- authorise C-004 or any new cultivar assignment;
- authorise self-merge.

## 7. Rollback

If protected validation, CTO review or production inspection fails, revert the tranche publication commit. Published-only runtime discovery will remove the two routes while retaining the approved media and editorial evidence for correction and later resubmission.
