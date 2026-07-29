# DR-ENGINEERING-003 — Non-Public Catalogue Discovery Boundary

**Status:** ACTIVE  
**Decision owner:** CTO / engineering  
**Decision date:** 2026-07-29  
**Repository:** `JorisMB82/japanese-maple-atlas`  
**Applies to:** Catalogue Profile canonical inputs, runtime discovery, static routes and aggregate quality validation  
**Related records:** DR-STRATEGY-001, DR-STRATEGY-002, DR-CATALOGUE-001 and DR-ENGINEERING-002

## 1. Context

Catalogue Batch C-001 introduced the first real canonical Catalogue Profile inputs at `review-ready` / `editorial-approved` state. The generic MVP correctly validated and compiled those records, but its initial runtime and aggregate-quality assumptions were designed while the canonical Catalogue directory was empty.

Two incorrect consequences appeared once non-public inputs existed:

1. the public runtime loaded every valid compiled Catalogue record, including records that were not published; and
2. aggregate quality required every canonical input to be `published` and `batch-approved`, while also comparing the total canonical-file count with the governed public Catalogue count.

The production build therefore generated static routes for editorial candidates even though the profiles remained non-public, and aggregate quality failed because the candidates correctly retained `review-ready`, `editorial-approved` and `publishedAt: null` states.

## 2. Decision

Canonical Catalogue inputs and public Catalogue records are separate inventories.

- **Canonical candidate inventory:** every valid `CUL-######.json` input under `atlas-repository/catalogue-profiles/`, regardless of lifecycle state. Validators, compiler checks, release checksums and engineering review inspect this inventory.
- **Public Catalogue inventory:** only compiled records whose `catalogueProfile.state` is exactly `published`. The public runtime, directory, Explorer, comparison data and static route generation use this inventory.

A canonical input may exist at `draft`, `review-ready`, `approved`, `published` or `superseded` state. Its presence in the repository does not make it public.

## 3. Quality contract

Aggregate quality shall:

- compare the governed `catalogueProfiles` invariant with the number of **published** Catalogue inputs;
- validate publication-class disclosure for every canonical input;
- require `batch-approved` review and a non-null publication timestamp only for published profiles;
- require `publishedAt: null` for every non-published profile;
- require public static routes for published profiles;
- require that non-public profiles have no exported static route.

Schema and semantic validation continue to inspect every canonical input. This correction does not weaken C0–C3.

## 4. Runtime contract

The Catalogue runtime exposes:

- `catalogueCandidates` — every valid compiled canonical input for controlled engineering use; and
- `catalogueCultivars` — published records only, for the public application data layer.

The application must not import `catalogueCandidates` into public discovery, search, comparison or route generation.

## 5. Publication transition

A profile becomes publicly discoverable only when the canonical input is deliberately changed to:

- `catalogueState: published`;
- `review.approvalState: batch-approved`;
- a non-null `publishedAt` timestamp;
- a C2-resolved media state;
- all C3 validation, protected CI, production inspection and rollback requirements complete.

The publication transition must occur through an engineering/integration PR. Editorial or media branches may not make this transition independently.

## 6. Rollback

If a Catalogue publication must be withdrawn, changing the canonical lifecycle state away from `published` and completing the governed corrective workflow removes it from public runtime discovery and static-route generation while preserving the canonical record and revision history.

## 7. Validation evidence

The correction is validated through:

- a pure predicate test distinguishing published and review-ready compiled records;
- aggregate-quality checks for public counts and non-public route absence;
- the complete protected workflow on the engineering correction PR;
- a second complete protected workflow on the real C-001 editorial PR after the corrected baseline is incorporated.

## 8. Assessment

- **Canonical C0/C1 candidates in repository:** permitted.
- **Non-public candidates in public runtime:** prohibited.
- **Static routes for non-public candidates:** prohibited.
- **Published profiles without batch approval, publication timestamp or C2/C3:** prohibited.
- **Overall decision:** APPROVED AND ACTIVE.
