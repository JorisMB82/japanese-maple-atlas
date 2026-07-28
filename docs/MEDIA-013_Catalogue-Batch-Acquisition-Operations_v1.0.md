# MEDIA-013 — Catalogue Batch Acquisition Operations v1.0

**Status:** PROPOSED OPERATING METHOD — ready for CTO and Project Owner review  
**Inspected `main`:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Branch:** `media/visual-coverage-001-025-planning`  
**Applies to:** owner-assigned Catalogue Profiles, beginning with programme slots 011–025

## 1. Purpose

This method is the smallest repeatable media workflow that satisfies the Catalogue Profile visual minimum without recreating the complete multi-season Reference Standard burden.

A normal Catalogue Profile requires:

- one approved, rights-compliant primary visual; or
- an explicit approved governed visual gap.

Additional views are backlog enhancements unless risk review makes them necessary.

## 2. Batch size and roles

Default batch: five assigned identities, aligned to V-003, V-004 or V-005.

Roles:

- **Media researcher:** candidate discovery, rights and item metadata;
- **Media reviewer:** rights, identity, privacy and visual-role decision;
- **Processor operator:** original preservation, checksum and derivatives;
- **Project Owner or delegated approver:** governed-gap approval and exceptional rights/identity decisions;
- **CTO / engineering:** contract compatibility and any schema or processor request.

One person may perform more than one role, but approval history must preserve the actual actor and date.

## 3. Ten-step operating flow

### 1. Candidate discovery

For each assigned identity, locate two to four item-level candidates where practical. Preferred source order:

1. accessioned institutional living collection;
2. contributor-owned original with documented plant history;
3. item-level open-licence source;
4. commercial or institutional source requiring direct permission;
5. no candidate — prepare gap review.

Discovery records the exact item, not merely a collection home page.

### 2. Item-level rights assessment

Record:

- creator;
- contributor/uploader;
- rights holder;
- exact licence or required written permission;
- attribution form;
- derivative/crop permission;
- commercial/non-commercial limitation;
- territory, duration, fee and takedown terms where applicable.

Availability on a website is not permission. A collection-wide statement does not override a conflicting item page.

### 3. Identity-basis assessment

Classify the depicted specimen as:

- documented;
- asserted;
- uncertain;
- not applicable.

Record the basis: accession, determination, contributor history, labelled garden specimen, nursery label, filename or other evidence. Reject any candidate whose caption would necessarily overstate cultivar identity.

### 4. Original-byte acquisition

Acquire the best available original through:

- institution/contributor delivery;
- platform original-file endpoint;
- direct download expressly permitted by the licence or permission.

Do not use a screenshot, page thumbnail or re-compressed social copy when an original is available.

### 5. Source checksum and preservation

Preserve the received bytes beneath `atlas-repository/media-sources/` using the approved stable media ID. Record:

- original filename;
- repository path;
- MIME type;
- width and height;
- byte size;
- SHA-256;
- acquisition method and date;
- source-page locator;
- preservation statement.

### 6. Privacy review

Inspect private EXIF and other embedded metadata. Decide:

- whether the private retained original may keep metadata;
- public location granularity;
- whether exact GPS, private addresses or personal data must be restricted;
- whether sensitive collection location should be generalized.

Public derivatives must record `exifRetained:false` and `gpsRetained:false`.

### 7. Caption and alt text

Write after visual inspection of the preserved source.

Caption must identify:

- depicted taxon/cultivar with the correct confidence wording;
- subject and season;
- identity basis where material;
- creator and required attribution;
- any change/crop statement required by the licence.

Alt text describes the visible image, not the entire cultivar profile, and must not imply clonal authentication from appearance.

### 8. Derivative processing

Process the governed JPEG or PNG through the merged media pipeline. Verify all four outputs:

- thumb;
- card;
- display;
- archive.

Record actual dimensions, MIME types, SHA-256 values and lineage. The processor does not upscale; sidecar metadata must use produced dimensions rather than profile maxima.

### 9. Approval or governed-gap decision

Approve the primary asset only when rights, source, identity, privacy, metadata and derivatives are complete.

When no candidate passes, prepare the governed-gap record defined in MEDIA-014. A candidate under review is not a gap approval and does not pass C2.

### 10. Batch handoff

Return one batch packet containing:

- assigned identities;
- selected and rejected candidates;
- approved assets;
- governed gaps;
- unresolved issues;
- measured effort;
- conversion metrics;
- validation result;
- engineering requests;
- owner decisions required.

## 4. Decision matrix

| Rights | Identity | Original | Result |
| --- | --- | --- | --- |
| approved | documented or transparently asserted | preserved | proceed to derivatives and approval |
| approved | uncertain but usable only as context | preserved | do not use as cultivar primary unless reviewer explicitly accepts qualified use |
| unclear or restricted | any | any | candidate blocked; seek permission or reject |
| approved | any | unavailable | blocked; do not create false checksum/provenance |
| no candidate passes | n/a | n/a | submit governed-gap package |

## 5. Catalogue versus Reference Standard workload

Catalogue processing normally stops after one approved primary visual. It does not routinely require:

- same-accession multi-season coverage;
- leaf upper/lower surfaces and scale;
- flowers, samaras, bark and winter structure;
- cross-record diagnostic comparison;
- multiple institutional specimen chains.

Any of those may be required when the assigned cultivar’s risk or visual ambiguity makes a single ordinary image misleading.

## 6. Batch controls

- Do not begin item acquisition before the cultivar assignment and duplicate check are stable enough to identify the intended entity.
- Do not create sidecars for unassigned programme slots.
- Use stable media IDs that can remain valid if a Catalogue cultivar is later promoted.
- Preserve rejected-candidate reasons to avoid repeating failed rights or identity work.
- Escalate recurring schema or pipeline constraints through a structured engineering handoff rather than local contract edits.

## 7. Throughput target

Initial planning assumption for an ordinary assigned Catalogue identity:

- 1–2 hours candidate discovery and rights screening;
- 1–2 hours identity and source review;
- 1–2 hours acquisition, metadata, caption and privacy work;
- 1–2 hours processing, visual inspection and handoff.

Target: 4–8 working hours per approved ordinary primary visual, excluding external response latency. A governed gap should normally require 1–3 hours after documented candidate attempts.

These are planning estimates until measured batches replace them.