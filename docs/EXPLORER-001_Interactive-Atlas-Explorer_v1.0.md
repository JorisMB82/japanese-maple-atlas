# EXPLORER-001 — Interactive Atlas Explorer

**Version:** 1.0  
**Status:** Sprint 10 implementation  
**Release date:** 2026-07-25

## Purpose

The Interactive Atlas Explorer provides a single research workspace over the governed Japanese Maple Atlas repository. It combines semantic discovery, contextual facets, trait matrices, seasonal views, graph relationships, record inspection, research-set assembly and derivative export without creating a second knowledge source.

## Repository boundary

The repository remains authoritative. The explorer reads compiled cultivar, assertion, evidence, media, taxonomy and relationship objects through the existing repository access layer. Browser state, saved views and exported research sets are derivative user-workspace artifacts. They never modify repository objects, editorial status, frozen Reference Standards or graph edges.

## Route and application boundary

The explorer is available at `/explorer`. The home page retains a lighter quick-search interface, while the dedicated explorer supplies the integrated research workflow. Existing profile, comparison and graph routes remain independent canonical interfaces and are linked from the workspace.

## Explorer state model

`lib/atlas-explorer.mjs` defines the governed client-state contract:

- free-text semantic query;
- species and six semantic facets;
- relevance or deterministic repository sorting;
- gallery, matrix, seasonal and relationship views;
- overview, identity, morphology, seasonal, cultivation and evidence lenses;
- focused record;
- research set of up to five cultivars.

State is normalized against the current cultivar slug inventory. Invalid views, lenses, sort modes, focus values and selection entries are rejected. Duplicate selections are removed and research-set capacity is deterministic.

## Shareable state

The current workspace is serialized into URL query parameters. Query, facets, sort order, view, lens, focused record and selected research set can therefore be shared or bookmarked. Default values are omitted to keep URLs stable and readable.

Saved views use browser local storage and are explicitly identified as local to the current browser. They do not enter the repository or cross devices automatically.

## Guided investigations

Five maintained presets demonstrate high-value workflows:

1. dissected architecture;
2. upright structure;
3. red seasonal expression;
4. golden foliage for protected sites;
5. relationship teaching set.

A preset changes query, view and analysis lens while preserving the current focused record and research set.

## View modes

### Gallery

Visual record cards expose identity media, canonical status, summary, growth habit and leaf form. Records may be focused or added to the research set.

### Trait matrix

The matrix uses the selected analysis lens to choose stable columns. It supports direct cross-record inspection across identity, morphology, seasonal expression, cultivation or repository evidence metrics.

### Seasonal view

Seasonal bands keep spring, summer, autumn and winter-interest descriptions separate. The interface does not collapse seasonal expression into one color label.

### Relationship view

Relationship cards display the governed edge identifier, relative label, related cultivar, category, strength, confidence and rationale. The view links to the graph route rather than recreating graph authority.

## Record inspector

The inspector exposes the focused cultivar’s canonical identity, summary, habit, leaf form, exposure, scale, assertion count, evidence count and direct cultivar-relationship count. It provides direct links to the full profile and graph node.

## Research sets

Users may assemble up to five cultivars. The workspace summarizes selected species, assertions, evidence records and graph links. The first two records may be opened in the established comparison route.

A research set can be exported as JSON. The export contains:

- export type and schema version;
- generation timestamp;
- repository version, hash and canonicality;
- current explorer query, facets, sort, view and lens;
- selected cultivar identifiers and governed display fields;
- links to canonical profiles and graph nodes.

The JSON export is a portable research aid, not a repository package or authentication certificate.

## Accessibility and interaction

The explorer uses labeled controls, native inputs and selects, keyboard-operable buttons, table headers, live result counts and status messaging. The interface remains usable at narrow viewport widths, where complex layouts collapse to a single column.

## Validation

Sprint 10 adds `npm run validate:explorer` and dedicated unit coverage. Validation checks:

- projection of all five frozen cultivar records;
- assertion, evidence, source, media and relationship retention;
- deterministic URL round trips;
- valid selection and capacity behavior;
- guided investigation state;
- analysis-lens field stability;
- research-set aggregation;
- repository provenance in exports;
- existence of required explorer implementation and documentation files.

The permanent CI workflow runs explorer validation before tests and production build. The static-export regression suite verifies the `/explorer` route and release-defining content.

## Future extension rules

Sprint 11 may add richer media and IIIF-compatible viewers to the explorer. Any future workspace capability must continue to read governed repository outputs, preserve uncertainty and avoid converting derivative user state into silent editorial changes.
