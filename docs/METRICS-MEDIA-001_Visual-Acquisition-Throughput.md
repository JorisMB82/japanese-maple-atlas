# METRICS-MEDIA-001 — Visual Acquisition Throughput

**Status:** BASELINE ESTIMATE — replace with measured batch data  
**Inspected `main`:** `f8aeff982c5d155ae4880a618453dc38c40f008e`  
**Branch:** `media/visual-coverage-001-025-planning`  
**Measurement date:** 2026-07-28

## 1. Measurement boundary

The current programme has detailed candidate research for RC-006 through RC-010 and approved non-evidentiary identity plates for RC-001 through RC-005, but no newly completed rights-cleared photographic asset in this execution package.

Accordingly:

- historical candidate work informs estimates;
- conversion percentages are a planning baseline, not a statistically mature production rate;
- external permission waiting time is reported separately from media working effort;
- unassigned Catalogue slots are not counted as failed acquisitions.

## 2. Current cohort counts

| Measure | Count | Interpretation |
| --- | ---: | --- |
| identities in programme | 25 | 10 known Reference Standards plus 15 unassigned Catalogue slots |
| known cultivar identities | 10 | RC-001 through RC-010 |
| approved existing primary visuals | 5 | RC-001 through RC-005 identity plates |
| approved existing photographic primaries | 0 | none in current governed corpus |
| records with active photographic candidate research | 5 | RC-006 through RC-010 |
| new approved photographic assets in this package | 0 | no rights/source package completed |
| explicit C2-approved Catalogue gaps | 0 | Catalogue assignments and gap schema not yet active |
| unassigned programme slots | 15 | excluded from conversion denominator |

## 3. Baseline coverage percentages

For the ten known identities:

- approved primary visual of any governed type: **50%** (5/10);
- approved photographic primary: **0%** (0/10);
- photographic candidate under review: **50%** (5/10);
- no approved visual or approved gap among RC-006–RC-010: **50%** (5/10);
- governed-gap percentage: **0% approved**; planning gaps are not C2/G5 approvals.

For all twenty-five programme positions, no percentage should imply visual completion because slots 011–025 are unassigned.

## 4. Effort estimates

| Work type | Media working effort | External latency | Notes |
| --- | --- | --- | --- |
| ordinary Catalogue primary from clear open licence | 4–6 h | none to low | assumes original endpoint, clear creator and usable asserted/documented identity |
| ordinary Catalogue primary requiring permission | 5–8 h | days to weeks | effort excludes waiting and follow-up delay |
| Catalogue governed gap | 1–3 h | none to moderate | after documented candidate attempts and approver review |
| Reference Standard single primary package | 8–16 h | days to weeks | stronger identity and subject review; may need multiple candidates |
| Reference Standard multi-subject package | 16–30 h | weeks to seasonal | same-accession or multiple diagnostic roles materially increase work |
| foundation uplift asset | 4–8 h | source-dependent | current approved plate remains in place during acquisition |

## 5. Candidate-to-approved conversion planning rate

Current measured new conversion is **0%** because no candidate has yet completed the full rights, original, identity, sidecar and derivative sequence.

For capacity planning only:

- clear item-level open licence with recoverable original: expected 50–75% candidate-to-approved conversion after identity/quality review;
- institutional candidate requiring permission: expected 25–60%, highly dependent on response and permitted use;
- nursery or garden image with weak specimen history: expected 15–40% for primary use; may remain context-only;
- ambiguous identity or unavailable original: expected below 20%.

These ranges must be replaced after the first two Catalogue batches and first completed Wave 1 G5 asset.

## 6. Common rights blockers

Observed or expected:

1. public visibility without an explicit reuse licence;
2. collection-level terms that require direct permission;
3. unclear creator versus uploader versus rights holder;
4. non-commercial licence incompatible with intended Atlas use posture;
5. no derivative/crop permission;
6. unavailable full-resolution original;
7. unclear attribution or share-alike obligations;
8. institutional fee or contract latency.

## 7. Common identity blockers

1. filename or label is the only cultivar basis;
2. institutional photo is not mapped to a living accession;
3. visual resemblance or autumn colour is treated as authentication;
4. generic species image is proposed for cultivar use;
5. cultivar names are easily confused with related cultivars or other taxa;
6. nursery material lacks propagation or determination history;
7. a diagnostic trait is shown without whole-plant or branch context;
8. cultivar spelling or synonym treatment is unresolved.

## 8. Original-byte acquisition success

Current new-package result: **0 retained originals from 5 active Wave 1 records**.

This is not a download failure rate; originals were deliberately not retained before final candidate selection and rights approval.

Target after assigned Catalogue batches:

- at least 80% original-byte acquisition for candidates selected for final review;
- 100% for approved assets;
- 0 approved assets based on screenshots or derivative thumbnails when an original is expected.

## 9. Time-to-completion metrics

Measure separately:

- `workingHours` — active media effort;
- `elapsedDays` — discovery to approval;
- `permissionWaitDays` — external waiting;
- `reworkHours` — replacement candidate, metadata correction or failed validation;
- `processingMinutes` — original preservation through four derivative generation;
- `reviewMinutes` — visual and metadata approval.

Initial target for a clear open-licence Catalogue asset is 1–3 elapsed working days. Institutional-permission assets have no reliable elapsed target until response data exists.

## 10. Backlog by tranche

| Tranche | Known identities | Approved primary | Candidate review | Planning/unassigned | Immediate backlog |
| --- | ---: | ---: | ---: | ---: | --- |
| V-001 | 5 | 5 | 0 formal selected candidates | 0 | five bounded photographic uplifts |
| V-002 | 5 | 0 | 5 | 0 | first RC-010 package, then RC-009, then RC-006–008 |
| V-003 | 0 assigned | 0 | 0 | 5 | assignment and feasibility review |
| V-004 | 0 assigned | 0 | 0 | 5 | assignment and feasibility review |
| V-005 | 0 assigned | 0 | 0 | 5 | assignment and feasibility review |

## 11. Reporting cadence

Update this file after:

- the first approved Wave 1 photographic asset;
- each five-profile Catalogue media batch;
- every ten approved assets;
- a material change in rights or identity conversion;
- adoption of the governed-gap contract.

Report both successful and failed candidates. Excluding rights and identity failures would overstate throughput and undermine planning.