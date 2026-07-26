# EXPLORER-001 — Interactive Atlas Explorer

**Version:** 1.1
**Status:** Sprint 10 implementation with post-release usability remediation
**Updated:** 2026-07-25

## Purpose

The Interactive Atlas Explorer provides one research workspace over the Japanese Maple Atlas repository. Its default experience helps gardeners, collectors and professionals find cultivars by form, foliage, colour, exposure and seasonal interest. Technical repository, evidence and graph detail remains available without becoming the first barrier to entry.

## Repository boundary

The repository remains authoritative. The Explorer reads compiled cultivar, assertion, evidence, media, taxonomy and relationship objects through the existing access layer. Browser state, saved views, comparison pairs and exports are derivative workspace artifacts. They never modify repository objects, editorial status, frozen Reference Standards or graph edges.

## Route boundary

The Explorer is available at `/explorer`. The home page offers a concise introduction and clearly distinguishes browsing the five pilot cultivars from opening the full Explorer. Profiles, Compare and Graph remain independent derived interfaces and receive explicit handoffs from the workspace.

## Progressive-disclosure model

The initial task flow exposes:

- free-text search;
- species and sorting;
- growth habit, leaf form and foliage colour;
- four compact result views;
- the cultivar results.

Exposure, mature scale and growing considerations are under **More filters**. Guided starting points, release metrics and repository explanations are secondary disclosures. Trait-table columns are shown only when the trait-table view is active. This hierarchy reduces first-entry density without removing expert capability.

## Deterministic state model

`lib/atlas-explorer.mjs` defines:

- semantic query and seven controlled filters;
- deterministic sorting;
- gallery, trait-table, seasonal and relationship views;
- six stable table-column sets;
- focused record;
- research set of up to five cultivars;
- explicit comparison `A` and `B` selection.

State is normalized against the current cultivar slug inventory. Invalid views, column sets, sort modes, focus values, selection entries and comparison values are rejected. Duplicate selections are removed. When a pair becomes invalid, a deterministic valid pair is selected from the remaining research set.

## Shareable and saved state

URL query parameters retain query, filters, sort, view, column set, focused record, research set and explicit comparison pair. Defaults are omitted where possible.

Saved views use browser local storage. Naming occurs in an inline dialog with required, whitespace-normalized, length-limited input. Saved views are explicitly identified as local to the current browser.

## Views

### Gallery

Visual cards expose identity, summary, growth habit and leaf form. Records may be inspected or added to the research set.

### Trait table

The selected **Columns to show** option chooses stable fields for identity, form and foliage, seasonal expression, cultivation or evidence. This label explains that the option changes columns rather than underlying data.

### Seasons

Spring, summer, autumn and winter-interest descriptions remain separate.

### Relationships

Connections retain governed edge ID, label, related cultivar, category, strength, confidence and rationale. Plain-language starting prompts are provided on the Graph page. Connections remain qualified comparisons, not claims of genetic identity or specimen authenticity.

## Research sets and comparison

A research set is explained as a temporary group of up to five cultivars for comparison and export. When at least two cultivars are present, the tray exposes explicit `A` and `B` selectors. The selected pair is visible in the comparison action, serialized in Explorer URL state and handed to `/compare?a=…&b=…`.

This preserves the five-record research workflow while eliminating dependence on hidden selection order.

## Export

**Export research set** opens a format chooser:

- Print / save as PDF for a human-readable browser summary;
- CSV for spreadsheet use;
- JSON for machine-readable data with repository version, hash and canonicality.

JSON remains the authoritative data-oriented export. Human-readable formats do not claim repository-package or specimen-authentication status.

## Accessibility and responsive behaviour

The Explorer uses labeled native controls, keyboard-operable disclosures and dialogs, table headers, visible focus treatment, live result messaging and minimum mobile tap targets. On narrow screens:

- advanced controls remain collapsed by default;
- result views use a compact two-by-two control;
- the inspector provides **Back to results**;
- the research tray becomes a single-column block;
- comparison selectors and dialogs remain touch accessible.

## Validation

`npm run validate:explorer` and unit coverage verify:

- all five cultivar projections and provenance counts;
- deterministic URL round trips including comparison pair;
- valid selection and pair adjustment inside a five-record set;
- guided starting points and stable table fields;
- validated saved-view names;
- repository-aware JSON and human-readable CSV export;
- existence of required implementation and documentation files.

Source-invariant tests verify the mobile navigation disclosure, advanced-control disclosure, absence of browser `prompt()`, explicit comparison labels, responsive identifier wrapping, cultivar anchor navigation and Compare recovery content. Static-export regression verifies the rendered release-defining content after `next build`.

## Extension rule

This remediation is not Sprint 11. Future media or IIIF work must be separately authorized and must continue to read governed repository outputs, preserve uncertainty and avoid converting derivative user state into silent editorial changes.
