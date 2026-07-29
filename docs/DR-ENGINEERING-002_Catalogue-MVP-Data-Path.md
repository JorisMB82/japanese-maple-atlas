# DR-ENGINEERING-002 — Catalogue MVP Data Path and Class-Aware Front End

**Status:** ACCEPTED AND IMPLEMENTED  
**Decision date:** 2026-07-28  
**Implementation review:** 2026-07-29  
**Authority:** CTO / engineering under DR-STRATEGY-002  
**Related roadmap:** ROADMAP-002A Version 1.0

## 1. Context

The two-speed model requires a generic Catalogue path before real profiles can be produced. The implementation must establish stable identity, validation, compilation, release integrity and public class disclosure without publishing an unapproved cultivar or destabilising the Reference Standard pipeline.

## 2. Decision

Implement Catalogue Profiles as a separate canonical input class that shares public cultivar routes, search, comparison and Explorer infrastructure with Reference Standards.

The implementation uses:

- one canonical JSON input per Catalogue cultivar;
- stable `CUL-######` identity;
- an approved identity registry;
- JSON Schema plus semantic validation;
- explicit C0–C3, risk and duplicate controls;
- one approved primary visual or a governed visual gap at C2;
- deterministic build-time compilation;
- class-aware search, filtering, profile pages, comparison and exports;
- release checksums for the identity registry, schemas and every canonical Catalogue input;
- synthetic fixtures only until cultivar assignments are approved.

The existing Reference Standard compiler and frozen source files remain unchanged. Reference Standards receive stable CUL mappings at the application layer without mutating their canonical records or retiring RC identifiers.

## 3. Canonical boundaries

Catalogue inputs are discovered only as direct files matching:

`atlas-repository/catalogue-profiles/CUL-######.json`

The identity registry and contract files remain under:

`atlas-repository/catalogue-profiles/contract/`

Synthetic fixtures remain under `tests/fixtures/` and are never discovered as canonical inputs.

## 4. Validation and publication rules

A Catalogue input cannot pass routine publication unless:

- its stable identity is explicitly assigned in the registry;
- programme slot and CUL identity agree;
- the accepted working name matches the approved assignment;
- duplicate review resolves as unique;
- the taxon is supported by the governed registry;
- source IDs are scoped to the cultivar identity;
- high-risk status is absent from routine batch approval;
- review state, publication timestamp and batch approval are coherent;
- C2 resolves through an approved primary visual or a governed visual gap;
- all protected repository checks pass.

Reserved identities 011–025 cannot compile as real profiles until the Project Owner approves the assignments and the registry records the assignment decision.

## 5. Front-end contract

Both publication classes resolve through the stable cultivar route:

`/cultivars/<slug>`

The public application discloses:

- publication class;
- stable cultivar ID;
- Reference Standard ID where applicable;
- evidence depth;
- review date;
- media state;
- class-aware explanation of sources and evidence.

The home directory and full Explorer can filter by publication class. Saved views, URLs, CSV and JSON exports retain that class. Comparison works across classes and states the different assurance levels.

Catalogue records do not receive invented graph relationships or full assertion matrices. Empty relationship and structured-assertion states are rendered honestly.

## 6. Release integrity

The protected `Repository, schemas and tests` job runs Catalogue validation and compiler checking explicitly.

Release evidence includes:

- approved identity registry checksum;
- canonical and mirrored Catalogue schema checksums;
- one checksum for every canonical Catalogue input;
- deterministic Catalogue profile inventory and hash;
- Catalogue compiler version;
- static route count including published Catalogue profiles.

## 7. Safeguards

- no cultivar-specific compiler branches;
- no publication from a reserved identity;
- no automatic duplicate or synonym merge;
- no routine high-risk batch publication;
- no unresolved media candidate presented as approved;
- governed gaps remain visibly incomplete;
- no generic image substitutes;
- no mutation of frozen RC source files solely to add CUL IDs;
- no second cultivar entity during later Reference Standard promotion;
- no synthetic fixture in production discovery;
- no lowering of coverage, build or regression thresholds.

## 8. Rollback

The Catalogue runtime is additive. With no canonical Catalogue inputs, the application renders the existing Reference Standard corpus only.

Emergency rollback consists of reverting the Catalogue MVP merge. Frozen Reference Standard inputs and compiled repository outputs are unchanged, so existing RC routes and data remain recoverable without a data migration.

A failed future Catalogue batch can be rolled back by reverting that batch input and media changes while retaining the generic platform capability.

## 9. Limitations

- the canonical Catalogue corpus is empty until owner-approved assignments are recorded;
- Reference Standard CUL mappings are currently application-layer compatibility metadata rather than mutations of generated repository objects;
- Catalogue graph relationships remain empty until governed relationships are created;
- governed visual gaps are represented inside the Catalogue Profile contract, not as fake media assets;
- the existing Reference Standard repository manifest remains its own deep-assurance inventory, while the release manifest records the mixed publication model.

## 10. Review history

- 2026-07-28 — Project Owner ratified the two-speed model and authorised generic MVP implementation.
- 2026-07-28 — Initial schema, identity, validator and compiler slice passed the protected workflow.
- 2026-07-29 — Class-aware runtime, Explorer, comparison, static regression, quality and release controls completed.
- 2026-07-29 — No real Catalogue profile, cultivar assignment or media asset was published by this decision.

## 11. Evidence that could change this decision

Reconsider the implementation if:

- profile correction or identity-error rates are unacceptable;
- users cannot distinguish the publication classes;
- release checksums cannot reproduce the published Catalogue corpus;
- stable identity cannot survive promotion;
- the lean path recreates Reference Standard cycle time;
- governed gaps are misunderstood as visual completeness.
