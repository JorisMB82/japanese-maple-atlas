# COMPILER-002 — Scalable Reference Standard Ingestion

**Version:** 1.0
**Status:** Implemented in Sprint 11
**Compiler:** Atlas Compiler 2.0.0

## Operating contract

The compiler discovers `RC-###.md` files, compiles only records whose status is approved and frozen, validates each record against either the canonical profile, an approved legacy adapter or a governed exception, loads per-record source and media sidecars, constructs all outputs in memory and publishes only after the complete cohort succeeds.

## Governed inputs

- `reference-standards/contract/rc-contract.json` — canonical profile and required evidence domains.
- `reference-standards/contract/compatibility-registry.json` — legacy adapters and governed exceptions.
- `reference-standards/contract/taxa.json` — supported species and stable taxon identifiers.
- `reference-standards/sources/RC-###.sources.json` — underlying evidence sources and evidence-domain mappings.
- `reference-standards/media/RC-###.media.json` — governed visual assets.

All governed inputs are included in the compiler input hash.

## Commands

```bash
npm run validate:reference-standards
npm run compile:atlas:dry-run
npm run compile:atlas
npm run compile:atlas:check
npm run validate:scale
```

`preflight` and `dry-run` never replace canonical generated outputs. A normal compile stages all outputs and replaces generated directories and files transactionally. A failed record or failed replacement preserves the previous approved repository.

## Source provenance

The canonical frozen Reference Standard remains the primary editorial source object. RC-006 onward must also provide approved, record-scoped underlying source objects and map each required evidence domain to one or more source identifiers. Every underlying source declares its evidence domains and at least one source locator. Compiled evidence retains the canonical source, all supporting source identifiers and their locators.

## Compatibility and exceptions

RC-001 through RC-005 use approved legacy adapters. Any future exception must be entered in the compatibility registry with a reason, approved mapping, Decision Record, compiler version and retirement condition where relevant. Compiler code must not contain cultivar-specific branches.

## Scale proof

The permanent scale suite constructs synthetic cohorts of 20, 25 and 150 records and verifies unique identifiers, dynamic counts, manifest generation, search coverage, graph inventory, repository consistency, output size and compiler runtime.

## Canonical RC-006+ document profile

The approved template requires explicit treatment of identity and nomenclature, naming variants and synonyms, botanical description, whole-plant architecture, leaf morphology, seasonal characteristics, horticultural information, historical provenance, propagation and cultivar continuity, diagnostic limits, confidence, relationships, source/evidence registration, media registration, unresolved research, rejected claims and the freeze decision.

Canonical records use ISO `YYYY-MM-DD` freeze dates, the governed `canonical-rc-v1` profile and an exact approved/frozen status. Negative or ambiguous status phrases cannot pass by substring matching. Synonyms are compiled into structured cultivar data and become searchable.

## Publication rollback guarantee

Generated outputs are first written to a complete staging tree. Existing targets are moved to a backup tree before replacement. If any target installation fails, every previously replaced target and the target currently between backup and installation are restored before staging and backup directories are removed.
