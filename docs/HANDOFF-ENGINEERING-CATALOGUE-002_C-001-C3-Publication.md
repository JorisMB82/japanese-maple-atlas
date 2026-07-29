# HANDOFF-ENGINEERING-CATALOGUE-002 — C-001 C3 Publication

**Status:** ACTIVE — C3 PUBLICATION IMPLEMENTATION  
**Authoritative base:** `6fb12135d27804196466b33e74d3084e74ce37e9`  
**Branch:** `engineering/catalogue-c-001-publication`  
**Batch:** `C-001`  
**Authority:** `DR-CATALOGUE-002`  
**Publication boundary:** protected PR, successful workflow and production inspection

## 1. Batch inputs

- CUL-000011 — *Acer palmatum* ‘Orange Dream’
- CUL-000012 — *Acer palmatum* ‘Koto-no-ito’
- CUL-000013 — *Acer palmatum* ‘Inaba-shidare’
- CUL-000014 — *Acer palmatum* ‘Beni-kawa’
- CUL-000015 — *Acer palmatum* ‘Trompenburg’

All five are LOW risk, C0 complete and C1 editorial-approved. DR-CATALOGUE-002 resolves C2 through temporary governed gaps.

## 2. Canonical transition

For every profile:

- `profileVersion`: `1.1.0`;
- `catalogueState`: `published`;
- `review.approvalState`: `batch-approved`;
- `media.state`: `governed-gap`;
- `media.primaryMediaId`: `null`;
- `media.visualComplete`: `false`;
- `media.governedGap.backfillPriority`: `high`;
- public warning from the approved gap;
- publication and revision history recorded;
- no RC identifier or promotion state.

## 3. Public contract

The front end must:

- expose five new static cultivar routes;
- display the Catalogue Profile badge and published status;
- include the profiles in home, Explorer, search and comparison data;
- state that no approved cultivar-specific image is available;
- state that no generic or substitute image is displayed;
- keep candidate images and unapproved metadata out of the public runtime.

## 4. Release invariants

The quality contract must require:

- five public Reference Standards;
- five public Catalogue Profiles;
- 25 stable cultivar identities;
- all ten public cultivar routes;
- successful Catalogue validation and deterministic compilation;
- published-only runtime discovery;
- batch approval and publication timestamps;
- governed-gap state for all five C-001 profiles;
- release-manifest checksums for every canonical Catalogue input.

## 5. Required validation

Run through protected CI:

- media processing, validation and drift check;
- contribution and Reference Standard validation;
- Catalogue validation;
- Reference Standard and Catalogue compiler checks;
- scale, schema, repository, search, graph and Explorer validation;
- unit and integration tests;
- native Node coverage thresholds;
- production build;
- static-export regression;
- aggregate quality validation;
- release-manifest generation.

## 6. Visual inspection

Inspect the built routes for:

- correct cultivar name and scientific name;
- stable CUL identifier;
- Catalogue Profile disclosure;
- horticultural content and source counts;
- governed-gap warning;
- absence of generic photographs;
- Explorer/search visibility;
- cross-class comparison behaviour;
- responsive layout and no broken internal links.

## 7. Rollback

Rollback is additive and record-scoped:

1. revert the C-001 publication merge;
2. the five profiles return to non-public discovery because runtime loading is published-only;
3. frozen Reference Standards and their generated repository remain unchanged;
4. retain the media evidence and owner Decision Record for traceability;
5. republish only after the defect is corrected through a protected PR.

## 8. Stop condition

Stop after:

- all three required checks pass on the final head;
- review conversations are resolved;
- the protected squash merge completes;
- the five production routes are inspected;
- the programme register records C-001 as published and C-002 as the next delivery batch.
