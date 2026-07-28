# ARCH-002 — Stable Cultivar Identity and Publication-Class Model v0.1

**Status:** PROPOSED ARCHITECTURE — Stage A design  
**Related Decision Record:** DR-STRATEGY-001  
**Inspected `main`:** `8f950fd53902ea68bdce8997f7005584906bd562`

## 1. Problem

The current compiled cultivar object uses the Reference Standard identifier as the cultivar identifier. For example, the public Bloodgood object uses `id: RC-001` and its `referenceStandard.id` is also `RC-001`.

That model was coherent while every public cultivar was a Reference Standard. It would create identity ambiguity in a two-speed system because a cultivar could first be published as a Catalogue Profile and later receive an RC identifier.

The system must not create two competing cultivar entities or break routes, media, sources, graph relationships or saved links during promotion.

## 2. Decision

Introduce a stable cultivar identity independent of publication class.

### Stable entity ID

Use:

`CUL-######`

Properties:

- assigned once after duplicate checking;
- never reused;
- unchanged through revisions, publication-class changes or promotion;
- used by search, graph, media, source links, comparison and repository inventory;
- not dependent on whether the cultivar has a Catalogue Profile or Reference Standard.

### Publication class

Represent assurance separately:

- `catalogue-profile`
- `reference-standard`

### Reference Standard ID

Retain `RC-###` as a stable identifier for a Reference Standard publication object, not as the underlying cultivar identity.

A cultivar may have:

- `cultivarId: CUL-000011`;
- `publicationClass: catalogue-profile`;
- `referenceStandardId: null`.

After promotion it may have:

- the same `cultivarId: CUL-000011`;
- `publicationClass: reference-standard`;
- `referenceStandardId: RC-011`;
- retained Catalogue publication history.

No second cultivar is created.

## 3. Existing identity migration

The first ten Reference Standards should map deterministically:

| Existing Reference Standard | Stable cultivar ID |
| --- | --- |
| RC-001 | CUL-000001 |
| RC-002 | CUL-000002 |
| RC-003 | CUL-000003 |
| RC-004 | CUL-000004 |
| RC-005 | CUL-000005 |
| RC-006 | CUL-000006 |
| RC-007 | CUL-000007 |
| RC-008 | CUL-000008 |
| RC-009 | CUL-000009 |
| RC-010 | CUL-000010 |

This mapping is a migration proposal, not an instruction to rewrite frozen source records during Stage A.

The Stage C migration must preserve:

- existing `RC-001` through `RC-010` references;
- existing slugs and cultivar routes;
- existing media IDs and source links;
- graph and relationship references;
- hashes and frozen Reference Standard source files;
- legacy machine consumers where practical.

## 4. Programme slots 011–025

Programme numbers 011–025 are delivery slots until a cultivar assignment passes C0 duplicate review.

After assignment, the stable identities should be `CUL-000011` through `CUL-000025`, subject to confirmation that no existing cultivar entity already represents the same cultivar.

The slot number must not be assigned merely to preserve sequence when duplicate review shows that the cultivar already exists.

Catalogue Profiles do not automatically receive `RC-011` through `RC-025`. An RC identifier is created only if and when the Project Owner approves promotion to the Reference Standard programme.

## 5. Proposed cultivar entity

A generated cultivar entity should conceptually include:

```json
{
  "cultivarId": "CUL-000011",
  "slug": "example-cultivar",
  "acceptedWorkingName": "Example Cultivar",
  "taxonId": "TAX-APAL",
  "publicationClass": "catalogue-profile",
  "catalogueProfile": {
    "version": "1.0",
    "state": "published",
    "path": "atlas-repository/catalogue-profiles/CUL-000011.json"
  },
  "referenceStandard": null,
  "publicationHistory": [],
  "aliases": []
}
```

A promoted entity keeps the same root identity:

```json
{
  "cultivarId": "CUL-000011",
  "slug": "example-cultivar",
  "publicationClass": "reference-standard",
  "catalogueProfile": {
    "version": "1.3",
    "state": "superseded-by-reference-standard"
  },
  "referenceStandard": {
    "id": "RC-011",
    "version": "1.0",
    "state": "frozen"
  },
  "publicationHistory": []
}
```

The exact generated shape will be governed in Stage C.

## 6. Public routes

The canonical cultivar route remains slug-based:

`/cultivars/<slug>`

Promotion must not change this route.

Optional class-specific routes may exist for evidence views, but they must resolve to the same cultivar identity:

- `/catalogue/<slug>` — optional Catalogue evidence view;
- `/reference-standards/RC-011` — Reference Standard evidence view.

Old links must redirect or resolve through an alias registry.

## 7. Alias and redirect registry

Maintain a generated or governed alias mapping that can resolve:

- old RC identifiers;
- historic slugs;
- accepted spelling variants;
- former Catalogue routes;
- Reference Standard IDs;
- promotion redirects.

Aliases support navigation and search. They must not create independent entities or silently assert synonym equivalence.

## 8. Source model

Every source object should connect to `cultivarId`.

Catalogue sources may initially be embedded in the lean profile input and compiled into first-class source objects. Reference Standard source sidecars remain separate and comprehensive.

Promotion should:

- reuse valid Catalogue source objects;
- retain their original review and access history;
- add deeper Reference Standard evidence mappings;
- avoid copying the same source into disconnected identities.

## 9. Media model

Every media asset should connect to `cultivarId` and separately record:

- publication use;
- subject;
- specimen-identity basis;
- evidentiary status;
- rights and provenance;
- approval history.

A media asset may support both a Catalogue Profile and later Reference Standard when its rights and evidence permit. Promotion does not require renaming the asset solely because the publication class changed.

## 10. Search, graph and comparison

Search, graph and comparison operate on `cultivarId`.

Publication class becomes a facet and disclosure field, not a graph identity.

Relationships must not duplicate when a cultivar is promoted. Existing relationship IDs should continue to reference the same cultivar nodes.

## 11. Publication history

Each cultivar entity should retain an auditable history containing events such as:

- entity assigned;
- Catalogue Profile published;
- profile revised;
- risk level changed;
- Reference Standard nominated;
- promotion approved;
- G8 Reference Standard frozen;
- Catalogue view superseded or retained;
- correction issued.

History entries should record date, actor/authority, Decision Record or batch record, old state and new state.

## 12. Duplicate detection

C0 must compare:

- accepted working name;
- normalized spelling and romanisation;
- known synonyms and aliases;
- taxon;
- commercial names;
- existing Catalogue and Reference Standard entities.

A probable duplicate blocks assignment until resolved.

Duplicate detection may use normalization and similarity to flag records, but no automated match may merge identities without review.

## 13. Promotion state

Use a simple controlled state:

- `not-nominated`;
- `candidate`;
- `owner-approved`;
- `in-reference-standard-process`;
- `promoted`;
- `declined`.

Promotion is a programme decision, not an automatic consequence of high risk or source depth.

## 14. Backward compatibility

During migration, generated cultivar objects may temporarily expose:

- legacy `id: RC-001`;
- new `cultivarId: CUL-000001`;
- `referenceStandardId: RC-001`.

The retirement of the legacy `id` meaning must be governed by a compatibility Decision Record and versioned API/repository change. Stage C must include regression tests for old routes and identifiers.

## 15. Architectural safeguards

- no cultivar-specific compiler branches;
- no duplicate nodes for publication classes;
- no route break during promotion;
- no automatic synonym-to-identity merge;
- no mutation of frozen RC source files solely to introduce `CUL` IDs;
- no source or media duplication solely because assurance class changes;
- no deletion of Catalogue history after promotion.

## 16. Owner decisions

Before Stage C publication, the Project Owner must approve:

- `Catalogue Profile` and `Reference Standard` as public class names;
- the `CUL-######` identifier family;
- the actual cultivar assignments for programme slots 011–025;
- the rule that an RC identifier is created only on Reference Standard promotion.
