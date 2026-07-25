# SEARCH-001 — Advanced Search and Semantic Filtering

**Version:** 1.0  
**Status:** Sprint 8 implementation  
**Release:** Application v0.8.0

## Purpose

Sprint 8 introduces explainable semantic discovery over the canonical Atlas repository. The search layer helps users express horticultural intent in ordinary language while preserving the repository's controlled meaning, qualifications and evidence boundaries.

Search interpretation is a discovery aid. It does not create botanical assertions, alter frozen Reference Standards or convert a related term into an editorial synonym.

## Governed vocabulary

`lib/search-vocabulary.mjs` defines the controlled search concepts, aliases, applicable fields and match terms. Concepts are grouped into:

- growth habit;
- leaf form;
- colour character;
- light tolerance;
- plant scale;
- cultivation risk.

Examples include `weeping` mapping to the governed concept **Cascading or weeping**, and `laceleaf` mapping to **Dissected or laceleaf**. These mappings improve retrieval but do not assert that every alias is botanically interchangeable in every context.

## Query language

The search engine supports:

- ordinary terms joined with AND logic: `laceleaf upright`;
- alternatives with OR: `red OR yellow`;
- quoted phrases: `"partial shade"`;
- field queries: `species:"Acer shirasawanum"`;
- semantic field queries: `leaf:laceleaf`;
- exclusions: `-habit:cascading`;
- combined expressions: `leaf:laceleaf -habit:cascading`.

Supported field aliases include cultivar name, scientific name, species, habit, leaf form, light, size, seasonal colour, bark, risk, diagnostic trait and record status.

## Relevance and explainability

Each cultivar is converted into a search document with weighted fields. Exact cultivar names and reference IDs carry the greatest weight, followed by scientific name, species, diagnostic traits, morphology, seasonal expression and descriptive text.

Semantic matches receive a controlled expansion score. Every result carries non-canonical search metadata describing:

- the matching query term;
- the repository field that matched;
- whether the match was literal or semantic;
- the governed concept used for interpretation.

The interface renders these as concise match-reason labels. Search scores and explanations never become repository assertions.

## Contextual facets

Facet counts are recalculated against the current query and all other active filters. This prevents the interface from offering combinations that cannot return a record. The selected facet remains visible even when its contextual count is zero so the user can remove it.

## URL state and comparison

Query text, species, semantic filters and sort order are encoded in the page URL. A discovery state can therefore be bookmarked or shared. The existing two-record comparison tray remains independent and continues to use browser storage.

## No-result recovery

When a query returns no records, the interface offers governed concepts and spelling-adjacent suggestions. Suggestions are generated only from the controlled vocabulary and do not invent cultivar facts.

## Validation

`npm run validate:search` verifies:

- semantic alias resolution;
- AND, OR and exclusion behaviour;
- quoted and fielded queries;
- cultivation-risk discovery;
- explainable query interpretation;
- semantic facet counts;
- contextual facet recalculation;
- controlled spelling suggestions.

The permanent repository workflow runs search validation before the production build.

## Architectural boundary

Sprint 8 operates on the existing compiled cultivar records. It does not modify the 203 first-class repository objects produced in Sprint 7. Sprint 9 may reuse these concepts as presentation aids, but formal cultivar relationships must remain separately governed graph objects.
