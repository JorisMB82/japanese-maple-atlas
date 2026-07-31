# HANDOFF-EDITORIAL-CATALOGUE-007 — C-002 Publication Tranche 01

**Status:** C3 IMPLEMENTATION COMPLETE — CTO REVIEW AND MERGE REQUIRED  
**Inspected `main`:** `82900b9e071d733cbdccd34771454f6154a83fc8`  
**Branch:** `content/catalogue-c002-publication-tranche-01`  
**Authority:** Project Owner instruction and `DR-CATALOGUE-003`  
**Scope:** `CUL-000016`, `CUL-000019` only

## 1. Final C3 disposition

| Cultivar ID | Accepted public identity | Editorial | Media | C3 disposition |
| --- | --- | --- | --- | --- |
| CUL-000016 | *Acer shirasawanum* ‘Autumn Moon’ | C0/C1 PASS; four sources; MEDIUM risk bounded | Approved lawful three-role gallery | PASS FOR PROTECTED PUBLICATION |
| CUL-000019 | *Acer palmatum* ‘Shin-deshōjō’ | C0/C1 PASS; four sources; MEDIUM risk bounded | Approved lawful three-role gallery with explicit separate-bonsai limitation | PASS FOR PROTECTED PUBLICATION |

Neither record has a material duplicate, taxon, naming, evidence, rights or identity-confidence issue severe enough to block the controlled release.

## 2. Canonical publication transition

For both profiles:

- `profileVersion`: `1.1.0` → `1.2.0`;
- `catalogueState`: `review-ready` → `published`;
- `review.approvalState`: `editorial-approved` → `batch-approved`;
- `review.reviewedBy`: Project Owner;
- `review.reviewedAt`: `2026-07-30T16:15:00Z`;
- `publishedAt`: `2026-07-30T16:15:00Z`;
- one controlled-tranche revision-history entry added;
- `referenceStandardId` remains `null`;
- `promotionStatus` remains `not-nominated`;
- approved media IDs and sidecars remain unchanged.

## 3. Identity and caption controls

### Autumn Moon

- Accepted taxon remains *Acer shirasawanum*.
- *Acer palmatum* and *Acer japonicum* forms remain qualified variants.
- Yellow or orange colour alone is not authentication.
- Approximately eleven lobes is the preferred cultivar-level visual guidance; broader species-level lobe variation remains contextual.

### Shin-deshōjō

- The public working form retains the hyphen and macrons.
- Romanisation variants resolve to one stable identity.
- ‘Deshōjō’ and ‘Deshōjō-nishiki’ remain separate.
- `MED-CUL-000019-003` remains a different, exhibition-labelled bonsai specimen used only for a greener summer expression. Its public wording states that it is not independently authenticated, is not ordinary cultivar habit and is not a same-plant sequence.

## 4. Public routes and discovery

The published-only runtime will add:

- `/cultivars/autumn-moon`;
- `/cultivars/shin-deshojo`.

The two records will enter the class-aware home, Explorer, search, comparison and Visual Library datasets. The remaining C-002 and all C-003 profiles remain excluded from public discovery.

## 5. Validation coverage

The publication package updates:

- the canonical Catalogue integration test for a mixed C-002 public/non-public cohort;
- static-export checks for both new routes, approved galleries and item-level identity qualifications;
- a specific regression assertion for the Shin-deshōjō separate bonsai limitation;
- public-route and Catalogue-profile release invariants;
- the programme register and release-file inventory.

The protected pull-request workflow remains the authority for final validation.

## 6. Exact changed files

- `atlas-repository/catalogue-profiles/CUL-000016.json`
- `atlas-repository/catalogue-profiles/CUL-000019.json`
- `docs/DR-CATALOGUE-003_Owner-Approval-of-C-002-Publication-Tranche-01.md`
- `docs/HANDOFF-EDITORIAL-CATALOGUE-007_C-002-Publication-Tranche-01.md`
- `docs/PROGRAMME-REGISTER_RC-001-RC-025.md`
- `quality/quality-gates.json`
- `tests/integration/catalogue-profile-pipeline.test.mjs`
- `tests/regression/static-export.test.mjs`

No media sidecar, image byte, derivative, checksum, licence, schema, compiler, application file, Reference Standard or other Catalogue Profile is changed.

## 7. Stop and merge boundary

Stop after the non-draft protected PR is green and ready for CTO review. Do not self-merge. After an authorised merge, production inspection must confirm both routes, galleries, attributions, identity qualifications, Explorer/search visibility and the absence of unintended C-002/C-003 routes.
