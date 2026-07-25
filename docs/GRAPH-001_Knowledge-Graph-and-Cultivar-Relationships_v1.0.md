# GRAPH-001 — Knowledge Graph and Cultivar Relationships

**Version:** 1.0  
**Status:** Sprint 9 implementation  
**Release date:** 2026-07-25

## Purpose

The Japanese Maple Atlas knowledge graph makes taxonomic, morphological, architectural, seasonal, cultivation and diagnostic relationships explicit, machine-readable and reviewable. It connects existing governed repository entities without replacing their canonical records or converting comparison into authentication.

## Architectural boundary

The five frozen Reference Standards remain the canonical source for cultivar descriptions and approved assertions. Graph inputs live in `atlas-repository/relationship-standards/`; generated relationship objects, relationship types and indexes live in the compiled repository. The public application reads generated outputs and never becomes a second source of truth.

A graph edge means that the Atlas has approved a stated relationship for the declared scope. It does not, by itself, establish synonymy, clonal identity, genetic affinity, parentage or specimen authentication.

## Node model

Sprint 9 introduces seven graph nodes:

- five cultivar nodes: RC-001 through RC-005;
- two accepted taxon nodes: TAX-APAL and TAX-ASHI.

Cultivar nodes retain the stable identifiers, slugs, scientific names, status and governed traits already produced by the compiler. Taxon nodes retain accepted scientific names, rank, status and common-name context.

## Relationship vocabulary

Ten controlled relationship types are first-class repository objects:

1. belongs to taxon;
2. same-taxon peer;
3. cross-taxon reference;
4. shared leaf morphology;
5. contrasting leaf morphology;
6. shared growth habit;
7. contrasting growth habit;
8. shared colour character;
9. shared cultivation preference;
10. diagnostic comparison.

Each type defines its code, category, directionality, inverse label, allowed node pairs, evidence requirement, description, status and version.

## Edge model

Each generated relationship contains:

- stable `REL-######` identifier;
- controlled relationship type;
- source and target identifiers and node types;
- directionality and inverse label;
- strength from one to five;
- confidence level;
- editorial rationale;
- assertion identifiers supporting the relationship;
- source identifiers inherited from those assertions;
- structured relationship properties;
- status, version and generated-from provenance.

Symmetric edges are stored once and traversed from both endpoints. Directed taxonomic edges retain the cultivar-to-taxon direction and expose an inverse label for taxon-to-cultivar presentation.

## Evidence and inference controls

Every relationship type in Sprint 9 requires evidence. Relationship inputs select existing approved assertions by subject and predicate. The compiler resolves those selectors to stable assertion identifiers and derives source identifiers. A relationship cannot compile when a selector is missing.

Relationship rationales must preserve material qualification. Shared morphology does not imply shared architecture. Shared cultivation guidance remains climate- and site-dependent. Diagnostic comparisons support learning and comparison but do not authenticate a plant.

## Generated graph index

`atlas-repository/indexes/graph-index.json` contains:

- node inventory;
- edge inventory;
- bidirectional adjacency lists;
- category and type counts;
- cultivar-pair coverage;
- connected-component statistics;
- repository hash and independent graph hash.

The graph contains seven nodes, twenty-six edges, ten relationship types and one connected component. Every cultivar participates in at least one relationship.

## Repository services

`lib/knowledge-graph.mjs` provides deterministic services for:

- node and edge lookup;
- filtered neighborhood retrieval;
- shortest-path traversal;
- pairwise relationship retrieval;
- evidence-weighted related-cultivar ranking;
- graph category discovery.

`lib/repository.js` exposes those services through the repository access layer and hydrates cultivar profiles with relationship type, related node, rationale, evidence and relative labels.

## Public interface

The `/graph` route provides:

- category filtering;
- focus-node selection;
- interactive cultivar and taxon nodes;
- visible relationship strength and confidence;
- direct relationship inspection;
- shortest-path exploration;
- links back to canonical cultivar profiles.

Cultivar profiles expose their graph node and governed cultivar relationships while keeping algorithmic similarity results separate from explicit graph edges.

## Validation

Sprint 9 validation checks:

- object counts and stable identifiers;
- controlled node-pair rules;
- directionality and duplicate symmetric edges;
- endpoint existence;
- evidence and source links;
- cultivar and taxon relationship registries;
- graph-node and graph-edge coverage;
- bidirectional adjacency;
- graph and repository hashes;
- connected-component invariants;
- key diagnostic relationship cases;
- shortest-path and related-cultivar ranking behavior.

## Future extension rules

New node or relationship types require a governed vocabulary change, schema update, validation coverage and documentation. Genetic, provenance, synonymy, parentage or authentication relationships must not be added by analogy; they require explicit evidence standards and editorial approval appropriate to the claim.
