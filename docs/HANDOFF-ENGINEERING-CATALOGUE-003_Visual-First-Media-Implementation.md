# HANDOFF-ENGINEERING-CATALOGUE-003 — Visual-First Media Implementation

**Status:** ACTIVE — READY FOR ENGINEERING EXECUTION  
**Authority:** DR-STRATEGY-003, ROADMAP-002B and CATALOGUE-002  
**Target baseline:** protected `main` after the governance amendment merges  
**Recommended branch:** `engineering/visual-first-catalogue-media`

## 1. Objective

Implement a generic, CUL-compatible, Visual-First media path for Catalogue Profiles without changing Reference Standard G5 semantics or forcing Catalogue assets into RC-scoped media records.

## 2. Required engineering deliverables

### Contract and validation

- add a governed Catalogue media-item schema using `MED-CUL-######-###`;
- support the visual roles defined in CATALOGUE-002;
- support rights-basis and identity-confidence controlled vocabularies;
- reject displayed items with unresolved rights;
- require item-level attribution, identity basis, qualification, privacy review and derivative lineage;
- enforce one primary item and normal three-role coverage;
- support explicit temporary role exceptions;
- preserve existing governed gaps until valid galleries replace them.

### Runtime and front end

- hydrate Catalogue media items into the class-aware runtime;
- use `habit-primary` as the card and hero image;
- show up to five gallery items;
- display attribution and licence/permission details;
- display identity-confidence badges;
- show conspicuous qualification for source-asserted and community-identified items;
- add governed entry points to report, confirm or submit imagery;
- keep unresolved-rights candidate URLs out of public runtime and static assets.

### Pipeline and release

- process Catalogue source assets and deterministic derivatives without changing the frozen Reference Standard media path;
- include Catalogue media contracts and approved source checksums in release evidence;
- update repository quality invariants and route regression tests;
- add unit, integration and static-export tests for rights rejection, identity qualification, role coverage, primary selection and public attribution;
- preserve additive rollback.

## 3. Compatibility rules

- RC media identifiers and Reference Standard sidecars remain unchanged.
- Existing C-001 governed gaps remain valid during implementation.
- No C-001 candidate becomes public merely because the schema exists.
- Media packages must be supplied and reviewed separately.
- Do not create cultivar-specific compiler branches.

## 4. Acceptance criteria

Engineering is complete when:

1. a synthetic three-item Catalogue gallery validates and renders;
2. a rights-unresolved item fails validation and cannot enter the build;
3. source-asserted and community-identified items display the required qualification;
4. the habit-primary item is used in cards and profile heroes;
5. up to five items render with attribution and confidence metadata;
6. controlled fewer-than-three exceptions validate and remain visible in quality reports;
7. existing Reference Standards and C-001 governed-gap profiles remain regression-clean;
8. all three protected Stage 2 jobs pass;
9. production artifacts are inspected before merge.

## 5. Stop boundary

This handoff implements the generic contract and interface. It does not itself approve, download or publish any real C-001 or C-002 photograph. Real media packages remain media-owned inputs and require their own protected integration path.
